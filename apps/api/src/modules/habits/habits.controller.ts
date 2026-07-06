import type { ApiResponse } from "@arc/types";
import { db, habitRepository } from "@arc/database";
import { logHabitSchema, createHabitSchema, updateHabitSchema } from "@arc/validations";
import type { Request, Response } from "express";
import { format, subDays, parseISO } from "date-fns";

type HabitRecord = Awaited<ReturnType<typeof habitRepository.findActiveByUser>>[number];
type HabitLogRecord = Awaited<ReturnType<typeof habitRepository.logHabit>>;

interface HabitSummary extends HabitRecord {
  todayValue: number;
  completedToday: boolean;
  streak: number;
  bestStreak: number;
  completionRate: number;
}

interface HabitLogResult {
  log: HabitLogRecord;
}

export async function handleGetHabits(
  req: Request,
  res: Response<ApiResponse<{ habits: HabitSummary[], logs: HabitLogRecord[] }>>,
): Promise<void> {
  if (!req.dbUser?.id) {
    res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Authentication required" },
    });
    return;
  }

  try {
    let rawHabits = await habitRepository.findActiveByUser(req.dbUser.id);
    const existingTypes = new Set(rawHabits.map(h => h.type));
    const defaultTypes = ["water", "steps", "sleep", "meal_breakfast", "meal_lunch", "meal_preworkout", "meal_postworkout"] as const;
    
    let needsSeeding = false;
    const habitsToCreate: Array<{ userId: string, type: any, targetValue: string | null, unit: string | null, isActive: boolean }> = [];
    for (const type of defaultTypes) {
      if (!existingTypes.has(type)) {
        needsSeeding = true;
        let targetValue = null;
        let unit = null;
        if (type === "water") { targetValue = "8"; unit = "glasses"; }
        if (type === "steps") { targetValue = "10000"; unit = "steps"; }
        if (type === "sleep") { targetValue = "8"; unit = "hours"; }
        habitsToCreate.push({ userId: req.dbUser.id, type, targetValue, unit, isActive: true });
      }
    }

    if (needsSeeding && habitsToCreate.length > 0) {
      await db.transaction(async (tx) => {
        for (const habit of habitsToCreate) {
          await habitRepository.createHabit(habit, tx);
        }
      });
      // Refetch
      rawHabits = await habitRepository.findActiveByUser(req.dbUser.id);
    }

    const uniqueHabitsMap = new Map<string, HabitRecord>();
    for (const h of rawHabits) {
      if (!uniqueHabitsMap.has(h.type)) {
        uniqueHabitsMap.set(h.type, h);
      }
    }
    const habits = Array.from(uniqueHabitsMap.values());

    const today = (req.query.date as string) || getLocalDayString(new Date());
    
    // Get all historical logs
    const allLogs = await habitRepository.findHistoricalLogsByUser(req.dbUser.id);
    
    // Group logs by habit
    const logsByHabit = new Map<string, typeof allLogs>();
    for (const log of allLogs) {
      const habitLogs = logsByHabit.get(log.habitId) ?? [];
      habitLogs.push(log);
      logsByHabit.set(log.habitId, habitLogs);
    }

    res.status(200).json({
      success: true,
      data: {
        habits: habits.map((habit) => {
          const logs = logsByHabit.get(habit.id) ?? [];
          
          // Today's logs
          const todayLogs = logs.filter(l => l.loggedDate === today);
          const todayValue = todayLogs.reduce(
            (total, log) => total + Number(log.value ?? 0),
            0,
          );

          const completedToday = (todayLogs.length > 0 ? (todayLogs[0]?.completed ?? false) : false) ||
              (habit.targetValue !== null && todayValue >= Number(habit.targetValue));

          // Calculate streak
          let streak = 0;
          let currentDateObj = parseISO(today);
          
          // First check if completed today, if not, check if completed yesterday to keep streak alive
          if (completedToday) {
            streak = 1;
            currentDateObj = subDays(currentDateObj, 1);
          } else {
            // Check if yesterday was completed
            const yesterday = format(subDays(currentDateObj, 1), "yyyy-MM-dd");
            const yesterdayLogs = logs.filter(l => l.loggedDate === yesterday);
            const yValue = yesterdayLogs.reduce((t, l) => t + Number(l.value ?? 0), 0);
            const completedYesterday = (yesterdayLogs.length > 0 ? (yesterdayLogs[0]?.completed ?? false) : false) || 
               (habit.targetValue !== null && yValue >= Number(habit.targetValue));
               
            if (!completedYesterday) {
              // Streak is 0
              streak = 0;
            } else {
              streak = 1;
              currentDateObj = subDays(currentDateObj, 2); // look at day before yesterday
            }
          }
          
          // If we have a streak started, count backwards
          if (streak > 0) {
            while (true) {
              const checkDate = format(currentDateObj, "yyyy-MM-dd");
              const checkLogs = logs.filter(l => l.loggedDate === checkDate);
              
              if (checkLogs.length === 0) break; // no logs on this day, streak breaks
              
              const checkVal = checkLogs.reduce((t, l) => t + Number(l.value ?? 0), 0);
              const isCompleted = (checkLogs.length > 0 ? (checkLogs[0]?.completed ?? false) : false) || 
                 (habit.targetValue !== null && checkVal >= Number(habit.targetValue));
                 
              if (isCompleted) {
                streak++;
                currentDateObj = subDays(currentDateObj, 1);
              } else {
                break;
              }
            }
          }

          // Calculate robust stats
          const completedDates = new Set<string>();
          const logsByDate = new Map<string, typeof logs>();
          for (const l of logs) {
            if (!logsByDate.has(l.loggedDate)) logsByDate.set(l.loggedDate, []);
            logsByDate.get(l.loggedDate)!.push(l);
          }

          for (const [dateStr, dayLogs] of logsByDate.entries()) {
            const dayValue = dayLogs.reduce((acc, l) => acc + Number(l.value ?? 0), 0);
            const isCompleted = (dayLogs.length > 0 ? (dayLogs[0]?.completed ?? false) : false) || 
                (habit.targetValue !== null && dayValue >= Number(habit.targetValue));
            if (isCompleted) {
              completedDates.add(dateStr);
            }
          }

          const completedDatesArray = Array.from(completedDates).sort();
          
          let bestStreak = 0;
          let tempStreak = 0;
          let prevDateObj: Date | null = null;
          
          for (const dStr of completedDatesArray) {
            const dObj = parseISO(dStr);
            if (!prevDateObj) {
              tempStreak = 1;
            } else {
              const diffTime = Math.abs(dObj.getTime() - prevDateObj.getTime());
              const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
              if (diffDays === 1) {
                tempStreak++;
              } else {
                tempStreak = 1;
              }
            }
            bestStreak = Math.max(bestStreak, tempStreak);
            prevDateObj = dObj;
          }

          const createdAtObj = new Date(habit.createdAt);
          const diffTimeCreated = Math.max(0, parseISO(today).getTime() - createdAtObj.getTime());
          const daysSinceCreated = Math.max(1, Math.floor(diffTimeCreated / (1000 * 60 * 60 * 24)) + 1);
          const completionRate = Math.min(100, Math.round((completedDates.size / daysSinceCreated) * 100));

          return {
            ...habit,
            todayValue,
            completedToday,
            streak,
            bestStreak,
            completionRate,
          };
        }),
        logs: allLogs,
      },
    });
  } catch (error) {
    console.error("Habit fetch failed", error);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Unable to fetch habits" },
    });
  }
}

export async function handleLogHabit(
  req: Request,
  res: Response<ApiResponse<HabitLogResult>>,
): Promise<void> {
  const parsedBody = logHabitSchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: parsedBody.error.issues.map((issue) => issue.message).join("; "),
      },
    });
    return;
  }

  if (!req.dbUser?.id) {
    res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Authentication required" },
    });
    return;
  }

  try {
    const habit = await habitRepository.findByIdForUser(
      parsedBody.data.habitId,
      req.dbUser.id,
    );

    if (!habit) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Habit not found" },
      });
      return;
    }

    const log = await habitRepository.logHabit({
      habitId: habit.id,
      userId: req.dbUser.id,
      loggedDate: parsedBody.data.localDate,
      value:
        parsedBody.data.value !== undefined
          ? parsedBody.data.value.toString()
          : null,
      completed: parsedBody.data.completed ?? false,
    });

    res.status(201).json({ success: true, data: { log } });
  } catch (error) {
    console.error("Habit logging failed", error);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Unable to log habit" },
    });
  }
}

function getLocalDayString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export async function handleCreateHabit(
  req: Request,
  res: Response<ApiResponse<{ habit: HabitRecord }>>,
): Promise<void> {
  const parsedBody = createHabitSchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: parsedBody.error.issues.map((issue) => issue.message).join("; "),
      },
    });
    return;
  }

  if (!req.dbUser?.id) {
    res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Authentication required" },
    });
    return;
  }

  try {
    const newHabit = await habitRepository.createHabit({
      userId: req.dbUser.id,
      type: parsedBody.data.name, // Using 'type' as the name in the database
      targetValue: parsedBody.data.targetValue ? parsedBody.data.targetValue.toString() : null,
      unit: parsedBody.data.unit ?? null,
      iconName: parsedBody.data.iconName ?? null,
      colorHex: parsedBody.data.colorHex ?? null,
      isActive: true,
    });

    res.status(201).json({ success: true, data: { habit: newHabit } });
  } catch (error) {
    console.error("Habit creation failed", error);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Unable to create habit" },
    });
  }
}

export async function handleDeleteHabit(
  req: Request,
  res: Response<ApiResponse<{ success: boolean }>>,
): Promise<void> {
  if (!req.dbUser?.id) {
    res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Authentication required" },
    });
    return;
  }

  const habitId = req.params.habitId as string;

  try {
    const deleted = await habitRepository.deleteHabit(habitId, req.dbUser.id);
    if (!deleted) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Habit not found" },
      });
      return;
    }

    res.status(200).json({ success: true, data: { success: true } });
  } catch (error) {
    console.error("Habit deletion failed", error);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Unable to delete habit" },
    });
  }
}

export async function handleUpdateHabit(
  req: Request,
  res: Response<ApiResponse<{ habit: HabitRecord }>>,
): Promise<void> {
  const parsedBody = updateHabitSchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: parsedBody.error.issues.map((issue) => issue.message).join("; "),
      },
    });
    return;
  }

  if (!req.dbUser?.id) {
    res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Authentication required" },
    });
    return;
  }

  const habitId = req.params.habitId as string;

  try {
    const updates: any = {};
    if (parsedBody.data.name !== undefined) updates.type = parsedBody.data.name;
    if (parsedBody.data.targetValue !== undefined) updates.targetValue = parsedBody.data.targetValue ? parsedBody.data.targetValue.toString() : null;
    if (parsedBody.data.unit !== undefined) updates.unit = parsedBody.data.unit || null;
    if (parsedBody.data.colorHex !== undefined) updates.colorHex = parsedBody.data.colorHex || null;

    if (Object.keys(updates).length === 0) {
      res.status(400).json({
        success: false,
        error: { code: "BAD_REQUEST", message: "No fields to update provided" },
      });
      return;
    }

    const updatedHabit = await habitRepository.updateHabit(habitId, req.dbUser.id, updates);
    if (!updatedHabit) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Habit not found" },
      });
      return;
    }

    res.status(200).json({ success: true, data: { habit: updatedHabit } });
  } catch (error) {
    console.error("Habit update failed", error);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Unable to update habit" },
    });
  }
}
