import type { ApiResponse } from "@arc/types";
import { db, sql, users, workoutPlans, workoutSessions } from "@arc/database";
import type { Request, Response } from "express";

interface AdminHealthResult {
  status: "online";
  totalUsers: number;
  totalActiveWorkoutPlans: number;
  workoutSessionsLoggedToday: number;
}

export async function handleGetAdminHealth(
  _req: Request,
  res: Response<ApiResponse<AdminHealthResult>>,
): Promise<void> {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  try {
    const [[userCount], [activePlanCount], [sessionsTodayCount]] = await Promise.all([
      db
        .select({ value: sql<string>`count(*)` })
        .from(users)
        .where(sql`${users.deletedAt} is null`),
      db
        .select({ value: sql<string>`count(*)` })
        .from(workoutPlans)
        .where(sql`${workoutPlans.isActive} = true`),
      db
        .select({ value: sql<string>`count(*)` })
        .from(workoutSessions)
        .where(
          sql`${workoutSessions.createdAt} >= ${startOfToday} and ${workoutSessions.createdAt} < ${startOfTomorrow}`,
        ),
    ]);

    res.status(200).json({
      success: true,
      data: {
        status: "online",
        totalUsers: Number(userCount?.value ?? 0),
        totalActiveWorkoutPlans: Number(activePlanCount?.value ?? 0),
        workoutSessionsLoggedToday: Number(sessionsTodayCount?.value ?? 0),
      },
    });
  } catch (error) {
    console.error("Admin health check failed", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Unable to fetch admin health",
      },
    });
  }
}
