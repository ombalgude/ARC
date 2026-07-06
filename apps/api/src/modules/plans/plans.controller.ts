import type { ApiResponse } from "@arc/types";
import type { Request, Response } from "express";
import { db, workoutRepository, userRepository } from "@arc/database";
import { generateWorkoutPlan } from "@arc/fitness-core";

export async function handleRegeneratePlan(
  req: Request,
  res: Response<ApiResponse<any>>,
): Promise<void> {
  if (!req.dbUser?.id) {
    res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Authentication required" },
    });
    return;
  }

  const { goal, workoutDaysPerWeek, environment, dietaryPreference } = req.body;
  if (!goal || !workoutDaysPerWeek) {
    res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: "Missing fields" },
    });
    return;
  }

  try {
    const profile = await userRepository.findProfileByUserId(req.dbUser.id);
    const preferences = await userRepository.findPreferencesByUserId(req.dbUser.id);

    if (!profile || !preferences) {
      res.status(400).json({
        success: false,
        error: { code: "BAD_REQUEST", message: "Profile not found" },
      });
      return;
    }

    const generatedPlan = generateWorkoutPlan({
      goals: [goal],
      experienceLevel: profile.experienceLevel as any,
      workoutFrequency: workoutDaysPerWeek,
      environment: environment || preferences.preferredEnvironment || "gym",
      equipment: preferences.equipment as any || [],
    });

    await db.transaction(async (tx) => {
      await workoutRepository.invalidatePlans(req.dbUser!.id, tx);

      const plan = await workoutRepository.createPlan(
        {
          userId: req.dbUser!.id,
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
      
      // Update profile with new goals
      await userRepository.updateProfile(req.dbUser!.id, {
        goal: goal === 'lose_fat' ? 'losefat' : (goal === 'build_muscle' ? 'buildmuscle' : 'maintain'),
        workoutDaysPerWeek,
        ...(dietaryPreference && { dietaryPreference }),
      }, tx);
      
      if (environment) {
        await userRepository.upsertPreferences(req.dbUser!.id, {
          preferredEnvironment: environment,
          equipment: preferences.equipment as any,
        }, tx);
      }
    });

    res.status(200).json({
      success: true,
      data: { success: true },
    });
  } catch (error) {
    console.error("Plan regeneration failed", error);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to regenerate plan" },
    });
  }
}
