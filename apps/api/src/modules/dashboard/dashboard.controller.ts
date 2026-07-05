import type { ApiResponse } from "@arc/types";
import { nutritionRepository, workoutRepository, habitRepository } from "@arc/database";
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
  globalStreak: number;
  activityHistory: number[];
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
    const [nutrition, workoutPlan, habitLogs, workoutSessions] = await Promise.all([
      nutritionRepository.findByUser(req.dbUser.id),
      workoutRepository.findActivePlanWithDaysByUser(req.dbUser.id),
      habitRepository.findHistoricalLogsByUser(req.dbUser.id),
      workoutRepository.findSessionsByUser(req.dbUser.id),
    ]);

    // Calculate activityHistory for the last 84 days (12 weeks)
    const today = new Date();
    const activityHistory: number[] = [];
    
    // Create a map for fast lookup: date string (yyyy-MM-dd) -> count
    const activityMap = new Map<string, number>();
    
    // Add habit completions
    for (const log of habitLogs) {
      if (log.completed) {
        const current = activityMap.get(log.loggedDate) || 0;
        activityMap.set(log.loggedDate, current + 1);
      }
    }
    
    // Add workout sessions (using startedAt or createdAt)
    for (const session of workoutSessions) {
      const d = session.startedAt ? new Date(session.startedAt) : new Date(session.createdAt);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const current = activityMap.get(dateStr) || 0;
      activityMap.set(dateStr, current + 1); // Workouts carry strong weight
    }

    // Generate array from 84 days ago to today
    for (let i = 83; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      let score = activityMap.get(dateStr) || 0;
      // Normalize score to 0-4 range for heatmap
      if (score > 4) score = 4;
      activityHistory.push(score);
    }

    // Calculate streak
    let currentStreak = 0;
    const checkDate = new Date(today);
    
    // Check if today is active
    const todayStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
    const isTodayActive = (activityMap.get(todayStr) || 0) > 0;
    
    if (isTodayActive) {
      currentStreak++;
    }
    
    // Check backwards from yesterday
    checkDate.setDate(checkDate.getDate() - 1);
    while (true) {
      const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
      if ((activityMap.get(dateStr) || 0) > 0) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break; // Streak broken
      }
    }

    // Check if workout is done today
    let isWorkoutDoneToday = false;
    for (const session of workoutSessions) {
      if (session.completedAt) {
        const d = new Date(session.completedAt);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        if (dateStr === todayStr) {
          isWorkoutDoneToday = true;
          break;
        }
      }
    }

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
        globalStreak: currentStreak,
        activityHistory,
        isWorkoutDoneToday,
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
