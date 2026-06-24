import { db, nutritionRepository, userRepository, workoutRepository } from "@arc/database";
import { calculateMacros, generateWorkoutPlan } from "@arc/fitness-core";
import type { OnboardingInput } from "@arc/validations";

// MVP decision: persist generated workout exercises by storing deterministic exercise slugs
// in workout_exercises.exerciseId as text so onboarding works end-to-end before exercises are seeded.

type GoalInput = OnboardingInput["goal"];
type ActivityLevelInput = OnboardingInput["activityLevel"];

export interface OnboardingResult {
  profile: Awaited<ReturnType<typeof userRepository.updateProfile>>;
  preferences: Awaited<ReturnType<typeof userRepository.upsertPreferences>>;
  workoutPlan: Awaited<ReturnType<typeof workoutRepository.createPlan>> & {
    days: ReturnType<typeof generateWorkoutPlan>["days"];
    splitName: ReturnType<typeof generateWorkoutPlan>["splitName"];
  };
  nutritionTargets: {
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
  };
}

export async function processOnboarding(dbUserId: string, input: OnboardingInput): Promise<OnboardingResult> {
  try {
    return await db.transaction(async (tx) => {
      const updatedProfile = await userRepository.updateProfile(
        dbUserId,
        {
          age: input.age,
          gender: input.gender,
          weightKg: input.weightKg.toString(),
          heightCm: input.heightCm.toString(),
          goal: mapGoalToDbEnum(input.goal),
          experienceLevel: input.experienceLevel,
          activityLevel: mapActivityToDbEnum(input.activityLevel),
          dietaryPreference: input.dietaryPreference,
          workoutDaysPerWeek: input.workoutDaysPerWeek,
        },
        tx,
      );

      const updatedPreferences = await userRepository.upsertPreferences(
        dbUserId,
        {
          preferredEnvironment: input.environment,
          equipment: input.equipment,
        },
        tx,
      );

      const macros = calculateMacros({
        weightKg: input.weightKg,
        heightCm: input.heightCm,
        age: input.age,
        gender: input.gender,
        activityLevel: input.activityLevel,
        goal: input.goal,
      });

      await nutritionRepository.upsertProfile(
        {
          userId: dbUserId,
          caloriesTarget: macros.calories,
          proteinG: macros.proteinGrams,
          carbsG: macros.carbsGrams,
          fatG: macros.fatGrams,
          goal: mapGoalToDbEnum(input.goal),
        },
        tx,
      );

      const generatedPlan = generateWorkoutPlan({
        goals: [input.goal],
        experienceLevel: input.experienceLevel,
        workoutFrequency: input.workoutDaysPerWeek,
        environment: input.environment,
        equipment: input.equipment,
      });

      const plan = await workoutRepository.createPlan(
        {
          userId: dbUserId,
          name: `${generatedPlan.splitName} Plan`,
          splitType: generatedPlan.splitName,
          generatedBy: "system",
          isActive: true,
        },
        tx,
      );

      for (const day of generatedPlan.days) {
        const createdDay = await workoutRepository.createDay(
          {
            workoutPlanId: plan.id,
            dayOfWeek: day.dayOfWeek,
            name: day.name,
          },
          tx,
        );

        for (const exercise of day.exercises) {
          await workoutRepository.createWorkoutExercise(
            {
              workoutDayId: createdDay.id,
              exerciseId: exercise.exerciseId,
              sets: exercise.sets,
              reps: exercise.reps,
              restSeconds: exercise.restSeconds,
              orderIndex: exercise.orderIndex,
            },
            tx,
          );
        }
      }

      return {
        profile: updatedProfile,
        preferences: updatedPreferences,
        workoutPlan: {
          ...plan,
          splitName: generatedPlan.splitName,
          days: generatedPlan.days,
        },
        nutritionTargets: {
          calories: macros.calories,
          proteinGrams: macros.proteinGrams,
          carbsGrams: macros.carbsGrams,
          fatGrams: macros.fatGrams,
        },
      };
    });
  } catch (error) {
    console.error("Onboarding processing failed", error);
    throw error;
  }
}

function mapGoalToDbEnum(goal: GoalInput): "losefat" | "maintain" | "buildmuscle" {
  const map = {
    lose_fat: "losefat",
    maintain: "maintain",
    build_muscle: "buildmuscle",
  } as const;

  const mappedGoal = map[goal];

  if (!mappedGoal) {
    throw new Error(`Invalid enum value: ${goal}`);
  }

  return mappedGoal;
}

function mapActivityToDbEnum(level: ActivityLevelInput): "sedentary" | "light" | "moderate" | "active" | "veryactive" {
  const map = {
    sedentary: "sedentary",
    light: "light",
    moderate: "moderate",
    active: "active",
    very_active: "veryactive",
  } as const;

  const mappedLevel = map[level];

  if (!mappedLevel) {
    throw new Error(`Invalid enum value: ${level}`);
  }

  return mappedLevel;
}
