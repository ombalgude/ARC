import { and, desc, eq } from "drizzle-orm";

import { db } from "../client.js";
import { exerciseLogs, workoutPlans, workoutSessions } from "../schema/index.js";

type NewWorkoutPlan = typeof workoutPlans.$inferInsert;
type NewWorkoutSession = typeof workoutSessions.$inferInsert;
type NewExerciseLog = typeof exerciseLogs.$inferInsert;

export type CreateWorkoutPlanInput = Omit<NewWorkoutPlan, "id" | "createdAt" | "updatedAt"> &
  Partial<Pick<NewWorkoutPlan, "createdAt" | "updatedAt">>;

export type CreateWorkoutSessionInput = Omit<NewWorkoutSession, "id" | "createdAt"> &
  Partial<Pick<NewWorkoutSession, "createdAt">>;

export type CreateExerciseLogInput = Omit<NewExerciseLog, "id" | "createdAt"> &
  Partial<Pick<NewExerciseLog, "createdAt">>;

export async function createPlan(input: CreateWorkoutPlanInput) {
  const [plan] = await db.insert(workoutPlans).values(input).returning();
  return plan;
}

export async function findActivePlanByUser(userId: string) {
  const [plan] = await db
    .select()
    .from(workoutPlans)
    .where(and(eq(workoutPlans.userId, userId), eq(workoutPlans.isActive, true)))
    .orderBy(desc(workoutPlans.createdAt))
    .limit(1);

  return plan ?? null;
}

export async function createSession(input: CreateWorkoutSessionInput) {
  const [session] = await db.insert(workoutSessions).values(input).returning();
  return session;
}

export async function logExercise(input: CreateExerciseLogInput) {
  const [log] = await db.insert(exerciseLogs).values(input).returning();
  return log;
}

export async function findSessionsByUser(userId: string) {
  return db
    .select()
    .from(workoutSessions)
    .where(eq(workoutSessions.userId, userId))
    .orderBy(desc(workoutSessions.startedAt), desc(workoutSessions.createdAt));
}
