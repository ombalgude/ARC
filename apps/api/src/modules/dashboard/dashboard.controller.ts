import type { ApiResponse } from "@arc/types";
import { nutritionRepository, workoutRepository, habitRepository, userRepository } from "@arc/database";
import type { Request, Response } from "express";

const MEAL_SUGGESTIONS = {
  vegan: [
    { id: 'meal_breakfast', time: 'Breakfast', pct: 0.25, when: 'Within 1 hour of waking', focus: 'Complex Carbs + Plant Protein', example: 'Oatmeal with soy milk & berries' },
    { id: 'meal_lunch', time: 'Lunch', pct: 0.25, when: 'Mid-day', focus: 'Balanced Meal', example: 'Quinoa salad with chickpeas & avocado' },
    { id: 'meal_preworkout', time: 'Pre-Workout', pct: 0.20, when: '30–60 min before', focus: 'Quick Carbs + Light Protein', example: 'Banana & vegan protein shake' },
    { id: 'meal_postworkout', time: 'Post-Workout', pct: 0.30, when: 'Within 60 min', focus: 'Protein + Carbs', example: 'Lentil pasta or tofu scramble' }
  ],
  vegetarian: [
    { id: 'meal_breakfast', time: "Breakfast", when: "Morning", focus: "Carbs + Protein", example: "Oatmeal with whey or Greek yogurt", pct: 0.25 },
    { id: 'meal_lunch', time: "Lunch", when: "Mid-day", focus: "Balanced Meal", example: "Paneer wrap with whole wheat roti", pct: 0.25 },
    { id: 'meal_preworkout', time: "Pre-workout", when: "30–60 min before", focus: "Quick Carbs", example: "Apple and a handful of almonds", pct: 0.20 },
    { id: 'meal_postworkout', time: "Post-workout", when: "Within 60 min", focus: "Protein + Carbs", example: "Cheese pasta or whey protein shake", pct: 0.30 },
  ],
  eggetarian: [
    { id: 'meal_breakfast', time: "Breakfast", when: "Morning", focus: "Carbs + Protein", example: "Boiled eggs and whole wheat toast", pct: 0.25 },
    { id: 'meal_lunch', time: "Lunch", when: "Mid-day", focus: "Balanced Meal", example: "Egg curry with brown rice", pct: 0.25 },
    { id: 'meal_preworkout', time: "Pre-workout", when: "30–60 min before", focus: "Quick Carbs", example: "Banana and black coffee", pct: 0.20 },
    { id: 'meal_postworkout', time: "Post-workout", when: "Within 60 min", focus: "Protein + Carbs", example: "Egg whites and sweet potato", pct: 0.30 },
  ],
  'non-veg': [
    { id: 'meal_breakfast', time: "Breakfast", when: "Morning", focus: "Carbs + Protein", example: "Eggs & toast or yogurt bowl", pct: 0.25 },
    { id: 'meal_lunch', time: "Lunch", when: "Mid-day", focus: "Balanced Meal", example: "Chicken salad or lean beef wrap", pct: 0.25 },
    { id: 'meal_preworkout', time: "Pre-workout", when: "30–60 min before", focus: "Quick Carbs", example: "Oats + whey protein", pct: 0.20 },
    { id: 'meal_postworkout', time: "Post-workout", when: "Within 60 min", focus: "Protein + Carbs", example: "Rice + chicken breast", pct: 0.30 },
  ],
};

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
    const [nutrition, workoutPlan, habitLogs, workoutSessions, profile] = await Promise.all([
      nutritionRepository.findByUser(req.dbUser.id),
      workoutRepository.findActivePlanWithDaysByUser(req.dbUser.id),
      habitRepository.findHistoricalLogsByUser(req.dbUser.id),
      workoutRepository.findSessionsByUser(req.dbUser.id),
      userRepository.findProfileByUserId(req.dbUser.id),
    ]);
    
    const pref = (profile?.dietaryPreference?.toLowerCase() as keyof typeof MEAL_SUGGESTIONS) || 'non-veg';
    const mealSuggestions = MEAL_SUGGESTIONS[pref] || MEAL_SUGGESTIONS['non-veg'];

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
        mealSuggestions,
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
