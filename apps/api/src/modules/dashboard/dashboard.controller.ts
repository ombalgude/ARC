import type { ApiResponse } from "@arc/types";
import { nutritionRepository, workoutRepository } from "@arc/database";
import type { Request, Response } from "express";

type DashboardWorkoutPlan = NonNullable<
  Awaited<ReturnType<typeof workoutRepository.findActivePlanWithDaysByUser>>
>;

interface DashboardResult {
  nutrition: Awaited<ReturnType<typeof nutritionRepository.findByUser>>;
  workoutPlan:
    | (Omit<DashboardWorkoutPlan, "days"> & {
        days: Array<
          Omit<DashboardWorkoutPlan["days"][number], "exercises"> & {
            exercises: Array<
              DashboardWorkoutPlan["days"][number]["exercises"][number] & {
                exerciseName: string;
              }
            >;
          }
        >;
      })
    | null;
}

export async function handleGetDashboardMe(
  req: Request,
  res: Response<ApiResponse<DashboardResult>>,
): Promise<void> {
  if (!req.dbUser?.id) {
    res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required",
      },
    });
    return;
  }

  try {
    const [nutrition, workoutPlan] = await Promise.all([
      nutritionRepository.findByUser(req.dbUser.id),
      workoutRepository.findActivePlanWithDaysByUser(req.dbUser.id),
    ]);

    res.status(200).json({
      success: true,
      data: {
        nutrition,
        workoutPlan: workoutPlan
          ? {
              ...workoutPlan,
              days: workoutPlan.days.map((day) => ({
                ...day,
                exercises: day.exercises.map((exercise) => ({
                  ...exercise,
                  exerciseName: formatExerciseName(exercise.exerciseId),
                })),
              })),
            }
          : null,
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Unable to fetch dashboard",
      },
    });
  }
}

function formatExerciseName(exerciseId: string): string {
  return exerciseId
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
