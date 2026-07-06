import type { ApiResponse } from "@arc/types";
import { nutritionRepository, workoutRepository, habitRepository, userRepository } from "@arc/database";
import type { Request, Response } from "express";

type DashboardWorkoutPlan = NonNullable<
  Awaited<ReturnType<typeof workoutRepository.findActivePlanWithDaysByUser>>
>;

interface DashboardResult {
  nutrition: (Awaited<ReturnType<typeof nutritionRepository.findByUser>> & {
    currentCalories?: number;
    currentProtein?: number;
    currentCarbs?: number;
    currentFats?: number;
  }) | null;
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
  isWorkoutDoneToday?: boolean;
  mealSuggestions: Array<{ id: string, time: string, pct: number, when: string, focus: string, example: string }>;
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
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const [nutritionGoal, workoutPlan, habitLogs, workoutSessions, profile, todayNutritionSum, historicalMacros, dbMealSuggestions] = await Promise.all([
      nutritionRepository.findByUser(req.dbUser.id),
      workoutRepository.findActivePlanWithDaysByUser(req.dbUser.id),
      habitRepository.findHistoricalLogsByUser(req.dbUser.id),
      workoutRepository.findSessionsByUser(req.dbUser.id),
      userRepository.findProfileByUserId(req.dbUser.id),
      nutritionRepository.getDailyNutritionSum(req.dbUser.id, todayStr),
      nutritionRepository.findHistoricalLogsByUser(req.dbUser.id),
      nutritionRepository.getMealSuggestions((await userRepository.findProfileByUserId(req.dbUser.id))?.dietaryPreference?.toLowerCase() || 'non-veg')
    ]);
    
    // Process Nutrition 
    const nutrition = nutritionGoal ? {
      ...nutritionGoal,
      currentCalories: todayNutritionSum.calories,
      currentProtein: todayNutritionSum.proteinG,
      currentCarbs: todayNutritionSum.carbsG,
      currentFats: todayNutritionSum.fatG,
    } : null;

    // Process Meal Suggestions
    const remainingCalories = Math.max(0, (nutrition?.caloriesTarget || 0) - (todayNutritionSum.calories || 0));
    const remainingProtein = Math.max(0, (nutrition?.proteinG || 0) - (todayNutritionSum.proteinG || 0));
    const remainingCarbs = Math.max(0, (nutrition?.carbsG || 0) - (todayNutritionSum.carbsG || 0));

    let mealSuggestions = [];
    if (dbMealSuggestions && dbMealSuggestions.length > 0) {
      mealSuggestions = dbMealSuggestions.map(m => {
        const factor = m.pctOfDaily / 100;
        const cal = Math.round(remainingCalories * factor);
        const pro = Math.round(remainingProtein * factor);
        const dynamicFocus = cal > 0 ? `${m.focus} (~${cal} kcal, ${pro}g P)` : m.focus;
        return {
          id: m.internalId,
          time: m.mealTime,
          pct: factor,
          when: m.whenToEat,
          focus: dynamicFocus,
          example: m.example,
        };
      });
    } else {
      // Fallback
      mealSuggestions = [
        { id: 'meal_breakfast', time: "Breakfast", when: "Morning", focus: `Carbs + Protein (~${Math.round(remainingCalories * 0.25)} kcal)`, example: "Eggs & toast or yogurt bowl", pct: 0.25 },
        { id: 'meal_lunch', time: "Lunch", when: "Mid-day", focus: `Balanced Meal (~${Math.round(remainingCalories * 0.25)} kcal)`, example: "Chicken salad or lean beef wrap", pct: 0.25 },
        { id: 'meal_preworkout', time: "Pre-workout", when: "30–60 min before", focus: `Quick Carbs (~${Math.round(remainingCalories * 0.20)} kcal)`, example: "Oats + whey protein", pct: 0.20 },
        { id: 'meal_postworkout', time: "Post-workout", when: "Within 60 min", focus: `Protein + Carbs (~${Math.round(remainingCalories * 0.30)} kcal)`, example: "Rice + chicken breast", pct: 0.30 },
      ];
    }

    // Calculate activityHistory for the last 84 days (12 weeks)
    const activityHistory: number[] = [];
    
    // Create a map for fast lookup: date string (yyyy-MM-dd) -> stats
    const activityMap = new Map<string, { workouts: number, habits: number, macrosLogged: number }>();
    
    // Add habit completions
    for (const log of habitLogs) {
      if (log.completed) {
        const stats = activityMap.get(log.loggedDate) || { workouts: 0, habits: 0, macrosLogged: 0 };
        stats.habits += 1;
        activityMap.set(log.loggedDate, stats);
      }
    }
    
    // Add workout sessions (using startedAt or createdAt)
    for (const session of workoutSessions) {
      const d = session.startedAt ? new Date(session.startedAt) : new Date(session.createdAt);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const stats = activityMap.get(dateStr) || { workouts: 0, habits: 0, macrosLogged: 0 };
      stats.workouts += 1;
      activityMap.set(dateStr, stats);
    }

    // Add historical macros
    for (const macroLog of historicalMacros) {
      const d = new Date(macroLog.loggedDate);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const stats = activityMap.get(dateStr) || { workouts: 0, habits: 0, macrosLogged: 0 };
      stats.macrosLogged += macroLog.calories || 0;
      activityMap.set(dateStr, stats);
    }

    const targetCalories = nutritionGoal?.caloriesTarget || 2000;

    // Generate array from 84 days ago to today
    for (let i = 83; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const stats = activityMap.get(dateStr) || { workouts: 0, habits: 0, macrosLogged: 0 };
      
      const isActive = stats.workouts >= 1 || stats.habits >= 3 || (stats.macrosLogged >= targetCalories * 0.5);
      let score = 0;
      if (isActive) {
        score = stats.workouts > 0 ? 4 : (stats.habits >= 3 ? 2 : 1);
      }
      activityHistory.push(score);
    }

    // Calculate streak
    let currentStreak = 0;
    const checkDate = new Date(today);
    
    // Check if today is active
    const tStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
    const tStats = activityMap.get(tStr) || { workouts: 0, habits: 0, macrosLogged: 0 };
    const isTodayActive = tStats.workouts >= 1 || tStats.habits >= 3 || (tStats.macrosLogged >= targetCalories * 0.5);
    
    if (isTodayActive) {
      currentStreak++;
    }
    
    // Check backwards from yesterday
    checkDate.setDate(checkDate.getDate() - 1);
    while (true) {
      const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
      const stats = activityMap.get(dateStr) || { workouts: 0, habits: 0, macrosLogged: 0 };
      if (stats.workouts >= 1 || stats.habits >= 3 || (stats.macrosLogged >= targetCalories * 0.5)) {
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
        if (dateStr === tStr) {
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
        mealSuggestions,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
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
