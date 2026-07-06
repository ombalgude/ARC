import { and, asc, eq, desc } from "drizzle-orm";

import { db } from "../client.js";
import { habitLogs, habits } from "../schema/index.js";

type NewHabit = typeof habits.$inferInsert;
type NewHabitLog = typeof habitLogs.$inferInsert;
type TransactionCallback = Parameters<typeof db.transaction>[0];
type DatabaseTransaction = TransactionCallback extends (tx: infer T) => unknown
  ? T
  : never;
type DatabaseExecutor = typeof db | DatabaseTransaction;

export type CreateHabitInput = Omit<NewHabit, "id" | "createdAt" | "updatedAt"> &
  Partial<Pick<NewHabit, "createdAt" | "updatedAt">>;

export type CreateHabitLogInput = Omit<NewHabitLog, "id" | "createdAt"> &
  Partial<Pick<NewHabitLog, "createdAt">>;

export async function findByUser(userId: string) {
  return db
    .select()
    .from(habits)
    .where(eq(habits.userId, userId))
    .orderBy(asc(habits.createdAt));
}

export async function findActiveByUser(userId: string) {
  return db
    .select()
    .from(habits)
    .where(and(eq(habits.userId, userId), eq(habits.isActive, true)))
    .orderBy(asc(habits.createdAt));
}

export async function findByIdForUser(habitId: string, userId: string) {
  const [habit] = await db
    .select()
    .from(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)))
    .limit(1);

  return habit ?? null;
}

export async function createHabit(
  input: CreateHabitInput,
  executor: DatabaseExecutor = db,
) {
  const [habit] = await executor.insert(habits).values(input).returning();
  if (!habit) {
    throw new Error("Habit repository did not return a habit");
  }
  return habit;
}

export async function seedDefaultHabits(
  userId: string,
  executor: DatabaseExecutor = db,
) {
  const defaultHabits: CreateHabitInput[] = [
    { userId, type: "water", targetValue: "8", unit: "glasses", isActive: true },
    { userId, type: "steps", targetValue: "10000", unit: "steps", isActive: true },
    { userId, type: "sleep", targetValue: "8", unit: "hours", isActive: true },
    { userId, type: "macros", targetValue: null, unit: null, isActive: true },
  ];

  const seededHabits = [];
  for (const habit of defaultHabits) {
    seededHabits.push(await createHabit(habit, executor));
  }

  return seededHabits;
}

export async function logHabit(
  input: CreateHabitLogInput,
  executor: DatabaseExecutor = db,
) {
  const [log] = await executor.insert(habitLogs).values(input).returning();
  if (!log) {
    throw new Error("Habit repository did not return a habit log");
  }
  return log;
}

export async function findLogsForDate(userId: string, loggedDate: string) {
  return db
    .select()
    .from(habitLogs)
    .where(and(eq(habitLogs.userId, userId), eq(habitLogs.loggedDate, loggedDate)));
}
export async function findHistoricalLogsByUser(userId: string) {
  return db
    .select()
    .from(habitLogs)
    .where(eq(habitLogs.userId, userId))
    .orderBy(desc(habitLogs.loggedDate), desc(habitLogs.createdAt));
}

export async function deleteHabit(habitId: string, userId: string, executor: DatabaseExecutor = db) {
  const [deletedHabit] = await executor
    .delete(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)))
    .returning();
    
  return deletedHabit ?? null;
}

export async function updateHabit(
  habitId: string,
  userId: string,
  updates: Partial<Pick<NewHabit, "type" | "targetValue" | "unit" | "iconName" | "colorHex">>,
  executor: DatabaseExecutor = db
) {
  const [updatedHabit] = await executor
    .update(habits)
    .set({ ...updates, updatedAt: new Date() })
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)))
    .returning();

  return updatedHabit ?? null;
}
