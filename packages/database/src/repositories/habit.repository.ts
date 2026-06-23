import { and, eq } from "drizzle-orm";

import { db } from "../client.js";
import { habitLogs, habits } from "../schema/index.js";

type NewHabitLog = typeof habitLogs.$inferInsert;

export type CreateHabitLogInput = Omit<NewHabitLog, "id" | "createdAt"> &
  Partial<Pick<NewHabitLog, "createdAt">>;

export async function findByUser(userId: string) {
  return db.select().from(habits).where(eq(habits.userId, userId));
}

export async function logHabit(input: CreateHabitLogInput) {
  const [log] = await db.insert(habitLogs).values(input).returning();
  return log;
}

export async function findLogsForDate(userId: string, loggedDate: string) {
  return db
    .select()
    .from(habitLogs)
    .where(and(eq(habitLogs.userId, userId), eq(habitLogs.loggedDate, loggedDate)));
}
