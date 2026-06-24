export interface WorkoutPlan {
  splitName: string;
  days: WorkoutDay[];
}

export interface WorkoutDay {
  dayNumber: number;
  dayOfWeek: number;
  name: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: string;
  restSeconds: number;
}
