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

export const onboardingSchema = z.object({
  age: z.number().int().min(13).max(100),
  gender: z.enum(["male", "female", "other"]),
  weightKg: z.number().positive().max(300),
  heightCm: z.number().positive().max(300),
  goal: z.enum(["lose_fat", "maintain", "build_muscle"]),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very_active"]),
  dietaryPreference: z.string().max(100),
  workoutDaysPerWeek: z.number().int().min(1).max(7),
  environment: z.enum(["home", "gym"]),
  equipment: z.array(z.string()).min(0),
});

export const logSessionSchema = z.object({
  workoutDayId: z.string().uuid(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime(),
  exercises: z.array(
    z.object({
      exerciseId: z.string().min(1),
      completedSets: z.number().int().min(0),
      notes: z.string().max(500).optional(),
    }),
  ),
});

export const logHabitSchema = z
  .object({
    habitId: z.string().uuid(),
    value: z.number().positive().optional(),
    completed: z.boolean().optional(),
  })
  .refine((input) => input.value !== undefined || input.completed !== undefined, {
    message: "Provide either a value or completed status",
  });

export type WorkoutInput = z.infer<typeof workoutInputSchema>;
export type NutritionInput = z.infer<typeof nutritionInputSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type LogSessionInput = z.infer<typeof logSessionSchema>;
export type LogHabitInput = z.infer<typeof logHabitSchema>;
