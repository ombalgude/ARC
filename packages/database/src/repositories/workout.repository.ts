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

export async function findDayWithExercisesByUser(userId: string, workoutDayId: string) {
  const [day] = await db
    .select({
      id: workoutDays.id,
      workoutPlanId: workoutDays.workoutPlanId,
      dayOfWeek: workoutDays.dayOfWeek,
      name: workoutDays.name,
      createdAt: workoutDays.createdAt,
    })
    .from(workoutDays)
    .innerJoin(workoutPlans, eq(workoutDays.workoutPlanId, workoutPlans.id))
    .where(
      and(
        eq(workoutDays.id, workoutDayId),
        eq(workoutPlans.userId, userId),
        eq(workoutPlans.isActive, true),
      ),
    )
    .limit(1);

  if (!day) {
    return null;
  }

  const exercises = await db
    .select()
    .from(workoutExercises)
    .where(eq(workoutExercises.workoutDayId, day.id))
    .orderBy(asc(workoutExercises.orderIndex));

  return {
    ...day,
    exercises,
  };
}

export async function createSession(
  input: CreateWorkoutSessionInput,
  executor: DatabaseExecutor = db,
) {
  const [session] = await executor.insert(workoutSessions).values(input).returning();
  if (!session) {
    throw new Error("Workout repository did not return a session");
  }
  return session;
}

export async function logExercise(
  input: CreateExerciseLogInput,
  executor: DatabaseExecutor = db,
) {
  const [log] = await executor.insert(exerciseLogs).values(input).returning();
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

export async function findSessionsWithDetailsByUser(userId: string) {
  const sessions = await db
    .select({
      session: workoutSessions,
      day: workoutDays,
      log: exerciseLogs,
    })
    .from(workoutSessions)
    .leftJoin(workoutDays, eq(workoutSessions.workoutDayId, workoutDays.id))
    .leftJoin(exerciseLogs, eq(workoutSessions.id, exerciseLogs.sessionId))
    .where(eq(workoutSessions.userId, userId))
    .orderBy(desc(workoutSessions.startedAt));

  const sessionMap = new Map<string, any>();
  
  for (const row of sessions) {
    if (!sessionMap.has(row.session.id)) {
      sessionMap.set(row.session.id, {
        ...row.session,
        workoutDay: row.day,
        exerciseLogs: [],
      });
    }
    
    if (row.log) {
      sessionMap.get(row.session.id).exerciseLogs.push(row.log);
    }
  }
  
  return Array.from(sessionMap.values());
}

export async function findSessionById(sessionId: string) {
  const [session] = await db
    .select()
    .from(workoutSessions)
    .where(eq(workoutSessions.id, sessionId))
    .limit(1);
  return session ?? null;
}

export async function updateSession(
  sessionId: string,
  input: Partial<CreateWorkoutSessionInput>,
  executor: DatabaseExecutor = db,
) {
  const [session] = await executor
    .update(workoutSessions)
    .set(input)
    .where(eq(workoutSessions.id, sessionId))
    .returning();
    
  if (!session) {
    throw new Error("Workout repository did not return a session on update");
  }
  return session;
}

export async function findLogsBySessionId(sessionId: string) {
  return db
    .select()
    .from(exerciseLogs)
    .where(eq(exerciseLogs.sessionId, sessionId));
}

export async function invalidatePlans(userId: string, executor: DatabaseExecutor = db) {
  await executor
    .update(workoutPlans)
    .set({ isActive: false, updatedAt: new Date() })
    .where(and(eq(workoutPlans.userId, userId), eq(workoutPlans.isActive, true)));
}

