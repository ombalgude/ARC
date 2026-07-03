import type { ApiResponse } from "@arc/types";
import { db, habitRepository } from "@arc/database";
import { logHabitSchema } from "@arc/validations";
import type { Request, Response } from "express";
import { format, subDays, parseISO } from "date-fns";

type HabitRecord = Awaited<ReturnType<typeof habitRepository.findActiveByUser>>[number];
type HabitLogRecord = Awaited<ReturnType<typeof habitRepository.logHabit>>;

interface HabitSummary extends HabitRecord {
  todayValue: number;
  completedToday: boolean;
  streak: number;
}

interface HabitLogResult {
  log: HabitLogRecord;
}

export async function handleGetHabits(
  req: Request,
  res: Response<ApiResponse<{ habits: HabitSummary[] }>>,
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

    if (rawHabits.length === 0) {
      rawHabits = await db.transaction((tx) =>
        habitRepository.seedDefaultHabits(req.dbUser!.id, tx),
      );
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

          const completedToday = todayLogs.some((log) => log.completed) ||
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
            const completedYesterday = yesterdayLogs.some(l => l.completed) || 
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
              const isCompleted = checkLogs.some(l => l.completed) || 
                 (habit.targetValue !== null && checkVal >= Number(habit.targetValue));
                 
              if (isCompleted) {
                streak++;
                currentDateObj = subDays(currentDateObj, 1);
              } else {
                break;
              }
            }
          }

          return {
            ...habit,
            todayValue,
            completedToday,
            streak,
          };
        }),
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
