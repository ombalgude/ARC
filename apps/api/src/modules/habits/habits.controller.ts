import type { ApiResponse } from "@arc/types";
import { db, habitRepository } from "@arc/database";
import { logHabitSchema } from "@arc/validations";
import type { Request, Response } from "express";

type HabitRecord = Awaited<ReturnType<typeof habitRepository.findActiveByUser>>[number];
type HabitLogRecord = Awaited<ReturnType<typeof habitRepository.logHabit>>;

interface HabitSummary extends HabitRecord {
  todayValue: number;
  completedToday: boolean;
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
    let habits = await habitRepository.findActiveByUser(req.dbUser.id);

    if (habits.length === 0) {
      habits = await db.transaction((tx) =>
        habitRepository.seedDefaultHabits(req.dbUser!.id, tx),
      );
    }

    const today = getUtcDateString(new Date());
    const todayLogs = await habitRepository.findLogsForDate(req.dbUser.id, today);
    const logsByHabit = new Map<string, typeof todayLogs>();

    for (const log of todayLogs) {
      const habitLogs = logsByHabit.get(log.habitId) ?? [];
      habitLogs.push(log);
      logsByHabit.set(log.habitId, habitLogs);
    }

    res.status(200).json({
      success: true,
      data: {
        habits: habits.map((habit) => {
          const logs = logsByHabit.get(habit.id) ?? [];
          const todayValue = logs.reduce(
            (total, log) => total + Number(log.value ?? 0),
            0,
          );

          return {
            ...habit,
            todayValue,
            completedToday:
              logs.some((log) => log.completed) ||
              (habit.targetValue !== null && todayValue >= Number(habit.targetValue)),
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
      loggedDate: getUtcDateString(new Date()),
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

function getUtcDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}
