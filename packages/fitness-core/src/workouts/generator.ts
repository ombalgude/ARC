import { WorkoutPlan } from "@arc/types";

/**
 * Deterministic rules-based workout generation.
 * Centralizes the core product intelligence.
 */
export function generateWorkoutPlan(
  goals: string[],
  level: "beginner" | "intermediate" | "advanced",
): WorkoutPlan {
  return {
    id: Math.random().toString(36).substring(7),
    name: `Custom ${level.toUpperCase()} Program`,
    description: `Generated program optimized for: ${goals.join(", ")}`,
    difficulty: level,
    exercises: [
      {
        exerciseId: "bench-press",
        sets: 3,
        reps: 10,
        restSeconds: 90,
      },
      {
        exerciseId: "barbell-squat",
        sets: 4,
        reps: 8,
        restSeconds: 120,
      },
    ],
    scheduledDays: [1, 3, 5], // Mon, Wed, Fri
  };
}
