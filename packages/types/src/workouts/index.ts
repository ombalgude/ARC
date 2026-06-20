export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  exercises: WorkoutExercise[];
  scheduledDays: number[]; // 0-6 days of week
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  restSeconds: number;
}
