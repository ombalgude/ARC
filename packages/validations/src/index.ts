import { z } from "zod";

// Workout input validation schema
export const workoutInputSchema = z.object({
  goals: z.array(z.string()),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
  workoutFrequency: z.number().min(1).max(7),
  environment: z.enum(["home", "gym"]),
  equipment: z.array(z.string()),
  hybridPreferences: z.array(z.string()).optional(),
  recoveryConstraints: z.array(z.string()).optional(),
});

// Nutrition input validation schema
export const nutritionInputSchema = z.object({
  weightKg: z.number().positive(),
  heightCm: z.number().positive(),
  age: z.number().positive().int(),
  gender: z.enum(["male", "female", "other"]),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very_active"]),
  goal: z.enum(["lose_fat", "maintain", "build_muscle"]),
});

export type WorkoutInput = z.infer<typeof workoutInputSchema>;
export type NutritionInput = z.infer<typeof nutritionInputSchema>;
