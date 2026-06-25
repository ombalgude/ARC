import { and, asc, desc, eq, inArray } from "drizzle-orm";

import { db } from "../client.js";
import {
  exerciseLogs,
  workoutDays,
  workoutExercises,
  workoutPlans,
  workoutSessions,
} from "../schema/index.js";

type NewWorkoutPlan = typeof workoutPlans.$inferInsert;
type NewWorkoutDay = typeof workoutDays.$inferInsert;
type NewWorkoutExercise = typeof workoutExercises.$inferInsert;
type NewWorkoutSession = typeof workoutSessions.$inferInsert;
type NewExerciseLog = typeof exerciseLogs.$inferInsert;
type TransactionCallback = Parameters<typeof db.transaction>[0];
type DatabaseTransaction = TransactionCallback extends (tx: infer T) => unknown
  ? T
  : never;
type DatabaseExecutor = typeof db | DatabaseTransaction;

export type CreateWorkoutPlanInput = Omit<
  NewWorkoutPlan,
  "id" | "createdAt" | "updatedAt"
> &
  Partial<Pick<NewWorkoutPlan, "createdAt" | "updatedAt">>;

export type CreateWorkoutDayInput = Omit<NewWorkoutDay, "id" | "createdAt"> &
  Partial<Pick<NewWorkoutDay, "createdAt">>;

export type CreateWorkoutExerciseInput = Omit<
  NewWorkoutExercise,
  "id" | "notes"
> &
  Partial<Pick<NewWorkoutExercise, "notes">>;

export type CreateWorkoutSessionInput = Omit<
  NewWorkoutSession,
  "id" | "createdAt"
> &
  Partial<Pick<NewWorkoutSession, "createdAt">>;

export type CreateExerciseLogInput = Omit<NewExerciseLog, "id" | "createdAt"> &
  Partial<Pick<NewExerciseLog, "createdAt">>;

export async function createPlan(
  input: CreateWorkoutPlanInput,
  executor: DatabaseExecutor = db,
) {
  const [plan] = await executor.insert(workoutPlans).values(input).returning();
  if (!plan) {
    throw new Error("Workout repository did not return a plan");
  }
  return plan;
}

export async function createDay(
  input: CreateWorkoutDayInput,
  executor: DatabaseExecutor = db,
) {
  const [day] = await executor.insert(workoutDays).values(input).returning();
  if (!day) {
    throw new Error("Workout repository did not return a day");
  }
  return day;
}

export async function createWorkoutExercise(
  input: CreateWorkoutExerciseInput,
  executor: DatabaseExecutor = db,
) {
  const [exercise] = await executor
    .insert(workoutExercises)
    .values(input)
    .returning();
  if (!exercise) {
    throw new Error("Workout repository did not return a workout exercise");
  }
  return exercise;
}

export async function findActivePlanByUser(userId: string) {
  const [plan] = await db
    .select()
    .from(workoutPlans)
    .where(
      and(eq(workoutPlans.userId, userId), eq(workoutPlans.isActive, true)),
    )
    .orderBy(desc(workoutPlans.createdAt))
    .limit(1);

  return plan ?? null;
}

export async function findActivePlanWithDaysByUser(userId: string) {
  const plan = await findActivePlanByUser(userId);

  if (!plan) {
    return null;
  }

  const days = await db
    .select()
    .from(workoutDays)
    .where(eq(workoutDays.workoutPlanId, plan.id))
    .orderBy(asc(workoutDays.dayOfWeek), asc(workoutDays.createdAt));

  if (days.length === 0) {
    return {
      ...plan,
      days: [],
    };
  }

  const dayIds = days.map((day) => day.id);
  const exercises = await db
    .select()
    .from(workoutExercises)
    .where(inArray(workoutExercises.workoutDayId, dayIds))
    .orderBy(
      asc(workoutExercises.workoutDayId),
      asc(workoutExercises.orderIndex),
    );

  const exercisesByDay = new Map<string, typeof exercises>();

  for (const exercise of exercises) {
    const existingExercises = exercisesByDay.get(exercise.workoutDayId) ?? [];
    existingExercises.push(exercise);
    exercisesByDay.set(exercise.workoutDayId, existingExercises);
  }

  return {
    ...plan,
    days: days.map((day) => ({
      ...day,
      exercises: exercisesByDay.get(day.id) ?? [],
    })),
  };
}

export async function createSession(input: CreateWorkoutSessionInput) {
  const [session] = await db.insert(workoutSessions).values(input).returning();
  if (!session) {
    throw new Error("Workout repository did not return a session");
  }
  return session;
}

export async function logExercise(input: CreateExerciseLogInput) {
  const [log] = await db.insert(exerciseLogs).values(input).returning();
  if (!log) {
    throw new Error("Workout repository did not return an exercise log");
  }
  return log;
}

export async function findSessionsByUser(userId: string) {
  return db
    .select()
    .from(workoutSessions)
    .where(eq(workoutSessions.userId, userId))
    .orderBy(desc(workoutSessions.startedAt), desc(workoutSessions.createdAt));
}
