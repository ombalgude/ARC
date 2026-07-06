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

export const startSessionSchema = z.object({
  workoutDayId: z.string().uuid(),
  startedAt: z.string().datetime(),
});

export const logSetSchema = z.object({
  sessionId: z.string().uuid(),
  exerciseId: z.string().min(1),
  setNumber: z.number().int().positive(),
  repsCompleted: z.number().int().nonnegative().optional(),
  weightKg: z.number().nonnegative().optional(),
});

export const completeSessionSchema = z.object({
  sessionId: z.string().uuid(),
  completedAt: z.string().datetime(),
  notes: z.string().max(500).optional(),
});

export const logHabitSchema = z
  .object({
    habitId: z.string().uuid(),
    localDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    value: z.number().positive().optional(),
    completed: z.boolean().optional(),
  })
  .refine((input) => input.value !== undefined || input.completed !== undefined, {
    message: "Provide either a value or completed status",
  });

export const createHabitSchema = z.object({
  name: z.string().min(1).max(50),
  targetValue: z.number().positive().optional(),
  unit: z.string().max(20).optional(),
  iconName: z.string().max(50).optional(),
  colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color").optional(),
});

export const updateHabitSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  targetValue: z.number().positive().optional(),
  unit: z.string().max(20).optional(),
  iconName: z.string().max(50).optional(),
  colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color").optional(),
});

export type WorkoutInput = z.infer<typeof workoutInputSchema>;
export type NutritionInput = z.infer<typeof nutritionInputSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type LogSessionInput = z.infer<typeof logSessionSchema>;
export type StartSessionInput = z.infer<typeof startSessionSchema>;
export type LogSetInput = z.infer<typeof logSetSchema>;
export type CompleteSessionInput = z.infer<typeof completeSessionSchema>;
export type LogHabitInput = z.infer<typeof logHabitSchema>;
export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;
