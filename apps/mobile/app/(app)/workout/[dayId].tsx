import { useAuth } from "@clerk/clerk-expo";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  createApiClient,
  type DashboardWorkoutExercise,
  type WorkoutDayDetail,
} from "../../../lib/api";

type SetCompletionState = Record<string, boolean[]>;

export default function WorkoutScreen(): React.JSX.Element {
  const { dayId } = useLocalSearchParams<{ dayId: string }>();
  const { getToken } = useAuth();
  const api = useMemo(() => createApiClient(getToken), [getToken]);
  const [workoutDay, setWorkoutDay] = useState<WorkoutDayDetail | null>(null);
  const [setCompletion, setSetCompletion] = useState<SetCompletionState>({});
  const [startedAt] = useState(() => new Date().toISOString());
  const [isLoading, setIsLoading] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadWorkoutDay(): Promise<void> {
      if (!dayId) {
        return;
      }

      try {
        const result = await api.getWorkoutDay(dayId);

        if (isMounted) {
          setWorkoutDay(result);
          setSetCompletion(buildInitialSetState(result.exercises));
          setErrorMessage(null);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to load this workout.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadWorkoutDay();

    return () => {
      isMounted = false;
    };
  }, [api, dayId]);

  function toggleSet(exerciseId: string, setIndex: number): void {
    setSetCompletion((current) => {
      const currentSets = current[exerciseId] ?? [];
      const nextSets = [...currentSets];
      nextSets[setIndex] = !nextSets[setIndex];

      return {
        ...current,
        [exerciseId]: nextSets,
      };
    });
  }

  async function finishWorkout(): Promise<void> {
    if (!workoutDay || isFinishing) {
      return;
    }

    setIsFinishing(true);

    try {
      await api.logSession({
        workoutDayId: workoutDay.id,
        startedAt,
        completedAt: new Date().toISOString(),
        exercises: workoutDay.exercises.map((exercise) => ({
          exerciseId: exercise.exerciseId,
          completedSets: countCompletedSets(setCompletion[exercise.exerciseId]),
        })),
      });

      Alert.alert("Workout logged", "Your session has been saved.", [
        {
          text: "Back to dashboard",
          onPress: () => router.replace("/(app)/dashboard"),
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Unable to finish workout",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsFinishing(false);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#f2c46d" size="large" />
        <Text style={styles.loadingText}>Loading workout</Text>
      </View>
    );
  }

  if (errorMessage || !workoutDay) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.kicker}>Workout</Text>
        <Text style={styles.emptyTitle}>Session unavailable</Text>
        <Text style={styles.emptyText}>
          {errorMessage ?? "Unable to load this workout."}
        </Text>
        <Pressable
          onPress={() => router.replace("/(app)/dashboard")}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Back to Dashboard</Text>
        </Pressable>
      </View>
    );
  }

  const completedSets = workoutDay.exercises.reduce(
    (total, exercise) =>
      total + countCompletedSets(setCompletion[exercise.exerciseId]),
    0,
  );
  const totalSets = workoutDay.exercises.reduce(
    (total, exercise) => total + (exercise.sets ?? 0),
    0,
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.kicker}>Workout session</Text>
          <Text style={styles.title}>{workoutDay.name ?? "Workout"}</Text>
          <Text style={styles.subtitle}>
            {completedSets}/{totalSets} sets complete
          </Text>
        </View>

        <View style={styles.exerciseList}>
          {workoutDay.exercises.map((exercise) => (
            <View key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
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

              <View style={styles.setRow}>
                {Array.from({ length: exercise.sets ?? 0 }).map((_, index) => {
                  const isChecked =
                    setCompletion[exercise.exerciseId]?.[index] ?? false;

                  return (
                    <Pressable
                      key={`${exercise.id}-${index}`}
                      onPress={() => toggleSet(exercise.exerciseId, index)}
                      style={({ pressed }) => [
                        styles.setBox,
                        isChecked && styles.setBoxChecked,
                        pressed && styles.setBoxPressed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.setBoxText,
                          isChecked && styles.setBoxTextChecked,
                        ]}
                      >
                        {isChecked ? "✓" : index + 1}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          disabled={isFinishing || completedSets === 0}
          onPress={() => void finishWorkout()}
          style={({ pressed }) => [
            styles.finishButton,
            pressed && styles.finishButtonPressed,
            (isFinishing || completedSets === 0) && styles.finishButtonDisabled,
          ]}
        >
          <Text style={styles.finishButtonText}>
            {isFinishing ? "Saving..." : "Finish Workout"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function buildInitialSetState(exercises: DashboardWorkoutExercise[]): SetCompletionState {
  return exercises.reduce<SetCompletionState>((state, exercise) => {
    state[exercise.exerciseId] = Array.from(
      { length: exercise.sets ?? 0 },
      () => false,
    );
    return state;
  }, {});
}

function countCompletedSets(sets: boolean[] | undefined): number {
  return sets?.filter(Boolean).length ?? 0;
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
    paddingBottom: 120,
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
    fontWeight: "900",
    lineHeight: 38,
  },
  subtitle: {
    color: "#aeb4bf",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
    marginTop: 8,
  },
  exerciseList: {
    gap: 14,
  },
  exerciseCard: {
    backgroundColor: "#1a1f28",
    borderColor: "#303642",
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  exerciseHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  exerciseIndex: {
    alignItems: "center",
    backgroundColor: "#222833",
    borderRadius: 8,
    height: 38,
    justifyContent: "center",
    width: 38,
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
    fontSize: 16,
    fontWeight: "900",
  },
  exerciseMeta: {
    color: "#8f98a7",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
    marginTop: 3,
  },
  setRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  },
  setBox: {
    alignItems: "center",
    backgroundColor: "#111318",
    borderColor: "#3a4250",
    borderRadius: 8,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  setBoxChecked: {
    backgroundColor: "#153524",
    borderColor: "#34d399",
  },
  setBoxPressed: {
    transform: [{ scale: 0.95 }],
  },
  setBoxText: {
    color: "#aeb4bf",
    fontSize: 16,
    fontWeight: "900",
  },
  setBoxTextChecked: {
    color: "#6ee7b7",
    fontSize: 20,
  },
  footer: {
    backgroundColor: "#111318",
    borderColor: "#252b35",
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    padding: 20,
    position: "absolute",
    right: 0,
  },
  finishButton: {
    alignItems: "center",
    backgroundColor: "#f2c46d",
    borderRadius: 8,
    justifyContent: "center",
    minHeight: 54,
  },
  finishButtonPressed: {
    transform: [{ scale: 0.99 }],
  },
  finishButtonDisabled: {
    opacity: 0.45,
  },
  finishButtonText: {
    color: "#171717",
    fontSize: 16,
    fontWeight: "900",
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
