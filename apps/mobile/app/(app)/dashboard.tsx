import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  createApiClient,
  type DashboardData,
  type DashboardNutrition,
  type DashboardWorkoutPlan,
} from "../../lib/api";

export default function DashboardScreen(): React.JSX.Element {
  const { getToken } = useAuth();
  const { user } = useUser();
  const api = useMemo(() => createApiClient(getToken), [getToken]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard(): Promise<void> {
      try {
        const result = await api.getDashboard();

        if (isMounted) {
          setDashboard(result);
          setErrorMessage(null);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to load your dashboard.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [api]);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#f2c46d" size="large" />
        <Text style={styles.loadingText}>Loading your plan</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Dashboard unavailable</Text>
        <Text style={styles.emptyText}>{errorMessage}</Text>
      </View>
    );
  }

  const hasDashboardData = Boolean(
    dashboard?.nutrition && dashboard.workoutPlan,
  );

  if (!hasDashboardData) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.kicker}>ARC Fitness</Text>
        <Text style={styles.emptyTitle}>Complete Profile Setup</Text>
        <Text style={styles.emptyText}>
          Finish onboarding to generate your nutrition targets and first
          training plan.
        </Text>
        <Pressable
          onPress={() => router.replace("/onboarding")}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Complete Profile Setup</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.kicker}>Today</Text>
        <Text style={styles.title}>Welcome, {user?.firstName ?? "there"}</Text>
        <Text style={styles.subtitle}>
          Your calories and active training split are ready.
        </Text>
      </View>

      <NutritionCard nutrition={dashboard!.nutrition!} />
      <WorkoutPlanCard workoutPlan={dashboard!.workoutPlan!} />
    </ScrollView>
  );
}

function NutritionCard({
  nutrition,
}: {
  nutrition: DashboardNutrition;
}): React.JSX.Element {
  const calories = nutrition.caloriesTarget ?? 0;
  const macros = [
    { label: "Protein", value: nutrition.proteinG ?? 0, color: "#f87171" },
    { label: "Carbs", value: nutrition.carbsG ?? 0, color: "#60a5fa" },
    { label: "Fat", value: nutrition.fatG ?? 0, color: "#f2c46d" },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardLabel}>Nutrition target</Text>
          <Text style={styles.cardTitle}>Daily macros</Text>
        </View>
        <View style={styles.calorieBadge}>
          <Text style={styles.calorieNumber}>{calories}</Text>
          <Text style={styles.calorieLabel}>kcal</Text>
        </View>
      </View>

      <View style={styles.macroRow}>
        {macros.map((macro) => (
          <View key={macro.label} style={styles.macroTile}>
            <View style={[styles.macroDot, { backgroundColor: macro.color }]} />
            <Text style={styles.macroValue}>{macro.value}g</Text>
            <Text style={styles.macroLabel}>{macro.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function WorkoutPlanCard({
  workoutPlan,
}: {
  workoutPlan: DashboardWorkoutPlan;
}): React.JSX.Element {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardLabel}>Active workout</Text>
          <Text style={styles.cardTitle}>
            {workoutPlan.name ?? `${workoutPlan.splitType ?? "Training"} Plan`}
          </Text>
        </View>
        <Text style={styles.splitPill}>{workoutPlan.splitType ?? "Plan"}</Text>
      </View>

      <View style={styles.dayList}>
        {workoutPlan.days.map((day, index) => (
          <View key={day.id} style={styles.dayBlock}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayNumber}>Day {index + 1}</Text>
              <Text style={styles.dayName}>{day.name ?? "Workout"}</Text>
            </View>

            {day.exercises.map((exercise) => (
              <View key={exercise.id} style={styles.exerciseRow}>
                <View style={styles.exerciseIndex}>
                  <Text style={styles.exerciseIndexText}>
                    {exercise.orderIndex ?? "-"}
                  </Text>
                </View>
                <View style={styles.exerciseMain}>
                  <Text style={styles.exerciseName}>
                    {exercise.exerciseName}
                  </Text>
                  <Text style={styles.exerciseMeta}>
                    {exercise.sets ?? "-"} sets x {exercise.reps ?? "-"} reps
                    {exercise.restSeconds
                      ? ` - ${formatRest(exercise.restSeconds)} rest`
                      : ""}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

function formatRest(restSeconds: number): string {
  if (restSeconds < 60) {
    return `${restSeconds}s`;
  }

  const minutes = Math.floor(restSeconds / 60);
  const seconds = restSeconds % 60;

  return seconds ? `${minutes}m ${seconds}s` : `${minutes}m`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111318",
  },
  content: {
    paddingBottom: 36,
    paddingHorizontal: 20,
    paddingTop: 64,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111318",
    gap: 14,
  },
  loadingText: {
    color: "#aeb4bf",
    fontSize: 15,
    fontWeight: "700",
  },
  header: {
    marginBottom: 20,
  },
  kicker: {
    color: "#f2c46d",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  title: {
    color: "#ffffff",
    fontSize: 31,
    fontWeight: "800",
    lineHeight: 38,
  },
  subtitle: {
    color: "#aeb4bf",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  card: {
    backgroundColor: "#1a1f28",
    borderColor: "#303642",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    padding: 18,
  },
  cardHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
    marginBottom: 18,
  },
  cardLabel: {
    color: "#8f98a7",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  cardTitle: {
    color: "#ffffff",
    flexShrink: 1,
    fontSize: 22,
    fontWeight: "800",
  },
  calorieBadge: {
    alignItems: "flex-end",
    backgroundColor: "#24200f",
    borderColor: "#705f2b",
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 96,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  calorieNumber: {
    color: "#f2c46d",
    fontSize: 23,
    fontWeight: "900",
  },
  calorieLabel: {
    color: "#d5c28f",
    fontSize: 12,
    fontWeight: "800",
  },
  macroRow: {
    flexDirection: "row",
    gap: 10,
  },
  macroTile: {
    backgroundColor: "#111318",
    borderColor: "#2a303b",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 102,
    padding: 12,
  },
  macroDot: {
    borderRadius: 999,
    height: 8,
    marginBottom: 18,
    width: 28,
  },
  macroValue: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "900",
  },
  macroLabel: {
    color: "#8f98a7",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 4,
  },
  splitPill: {
    backgroundColor: "#13231f",
    borderColor: "#235347",
    borderRadius: 8,
    borderWidth: 1,
    color: "#6ee7b7",
    flexShrink: 0,
    fontSize: 12,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  dayList: {
    gap: 14,
  },
  dayBlock: {
    backgroundColor: "#111318",
    borderColor: "#2a303b",
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  dayHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  dayNumber: {
    color: "#f2c46d",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  dayName: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },
  exerciseRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    paddingVertical: 10,
  },
  exerciseIndex: {
    alignItems: "center",
    backgroundColor: "#222833",
    borderRadius: 8,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  exerciseIndexText: {
    color: "#d7dce4",
    fontSize: 13,
    fontWeight: "900",
  },
  exerciseMain: {
    flex: 1,
  },
  exerciseName: {
    color: "#f4f6f8",
    fontSize: 15,
    fontWeight: "800",
  },
  exerciseMeta: {
    color: "#8f98a7",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
    marginTop: 3,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#111318",
    padding: 24,
  },
  emptyTitle: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34,
  },
  emptyText: {
    color: "#aeb4bf",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#f2c46d",
    borderRadius: 8,
    justifyContent: "center",
    marginTop: 24,
    minHeight: 52,
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: "#171717",
    fontSize: 16,
    fontWeight: "900",
  },
});
