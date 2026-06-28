import { useAuth } from "@clerk/clerk-expo";
import * as Haptics from "expo-haptics";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { createApiClient, type HabitSummary } from "../../lib/api";

export function HabitTracker(): React.JSX.Element {
  const { getToken } = useAuth();
  const api = useMemo(() => createApiClient(getToken), [getToken]);
  const [habits, setHabits] = useState<HabitSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingHabitId, setPendingHabitId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadHabits(): Promise<void> {
    try {
      const result = await api.getHabits();
      setHabits(result.habits);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to load habits.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function load(): Promise<void> {
      try {
        const result = await api.getHabits();

        if (isMounted) {
          setHabits(result.habits);
          setErrorMessage(null);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error ? error.message : "Unable to load habits.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, [api]);

  async function handleLogHabit(habit: HabitSummary): Promise<void> {
    if (!habit.completedToday) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setPendingHabitId(habit.id);

    try {
      await api.logHabit(getHabitLogPayload(habit));
      await loadHabits();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to update habit.",
      );
    } finally {
      setPendingHabitId(null);
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardLabel}>Daily habits</Text>
          <Text style={styles.cardTitle}>Recovery basics</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color="#f2c46d" />
          <Text style={styles.loadingText}>Loading habits</Text>
        </View>
      ) : (
        <View style={styles.habitList}>
          {habits.map((habit) => {
            const progress = getHabitProgress(habit);
            const isPending = pendingHabitId === habit.id;

            return (
              <View key={habit.id} style={styles.habitRow}>
                <View style={styles.habitMain}>
                  <Text style={styles.habitName}>{getHabitName(habit)}</Text>
                  <Text style={styles.habitMeta}>{progress}</Text>
                </View>
                <Pressable
                  disabled={isPending}
                  onPress={() => void handleLogHabit(habit)}
                  style={({ pressed }) => [
                    styles.habitButton,
                    habit.completedToday && styles.habitButtonComplete,
                    pressed && styles.habitButtonPressed,
                    isPending && styles.habitButtonPending,
                  ]}
                >
                  <Text
                    style={[
                      styles.habitButtonText,
                      habit.completedToday && styles.habitButtonTextComplete,
                    ]}
                  >
                    {habit.completedToday ? "✓" : getHabitButtonLabel(habit)}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      )}

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );
}

function getHabitLogPayload(habit: HabitSummary) {
  if (habit.type === "water") {
    return { habitId: habit.id, value: 1 };
  }

  if (habit.type === "steps") {
    return { habitId: habit.id, value: 1000 };
  }

  if (habit.type === "sleep") {
    return { habitId: habit.id, value: 8, completed: true };
  }

  return { habitId: habit.id, completed: true };
}

function getHabitName(habit: HabitSummary): string {
  const names = {
    workout: "Workout",
    water: "Water intake",
    sleep: "Sleep",
    steps: "Step goal",
    macros: "Macros",
  };

  return names[habit.type];
}

function getHabitButtonLabel(habit: HabitSummary): string {
  if (habit.type === "sleep") {
    return "Done";
  }

  return "+";
}

function getHabitProgress(habit: HabitSummary): string {
  const target = Number(habit.targetValue ?? 0);
  const unit = habit.unit ?? "units";

  if (target > 0) {
    return `${habit.todayValue}/${target} ${unit}`;
  }

  return habit.completedToday ? "Complete" : "Not logged";
}

const styles = StyleSheet.create({
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
    marginBottom: 16,
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
    fontSize: 22,
    fontWeight: "800",
  },
  loadingRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    minHeight: 76,
  },
  loadingText: {
    color: "#aeb4bf",
    fontSize: 14,
    fontWeight: "700",
  },
  habitList: {
    gap: 10,
  },
  habitRow: {
    alignItems: "center",
    backgroundColor: "#111318",
    borderColor: "#2a303b",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 76,
    padding: 12,
  },
  habitMain: {
    flex: 1,
  },
  habitName: {
    color: "#f4f6f8",
    fontSize: 15,
    fontWeight: "800",
  },
  habitMeta: {
    color: "#8f98a7",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
  habitButton: {
    alignItems: "center",
    backgroundColor: "#222833",
    borderColor: "#3a4250",
    borderRadius: 8,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 52,
  },
  habitButtonComplete: {
    backgroundColor: "#143225",
    borderColor: "#2f8a61",
  },
  habitButtonPressed: {
    transform: [{ scale: 0.97 }],
  },
  habitButtonPending: {
    opacity: 0.6,
  },
  habitButtonText: {
    color: "#f2c46d",
    fontSize: 20,
    fontWeight: "900",
  },
  habitButtonTextComplete: {
    color: "#6ee7b7",
  },
  errorText: {
    color: "#fca5a5",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
    marginTop: 12,
  },
});
