import { boolean, index, integer, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { exercises } from "./exercises.js";
import { users } from "./users.js";

export const workoutPlans = pgTable(
  "workout_plans",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name"),
    splitType: text("split_type"),
    generatedBy: text("generated_by").default("system").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("workout_plans_user_id_idx").on(table.userId)],
);

export const workoutDays = pgTable(
  "workout_days",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workoutPlanId: uuid("workout_plan_id")
      .notNull()
      .references(() => workoutPlans.id, { onDelete: "cascade" }),
    dayOfWeek: integer("day_of_week"),
    name: text("name"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("workout_days_workout_plan_id_idx").on(table.workoutPlanId)],
);

export const workoutExercises = pgTable(
  "workout_exercises",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workoutDayId: uuid("workout_day_id")
      .notNull()
      .references(() => workoutDays.id, { onDelete: "cascade" }),
    exerciseId: uuid("exercise_id")
      .notNull()
      .references(() => exercises.id, { onDelete: "cascade" }),
    sets: integer("sets"),
    reps: text("reps"),
    restSeconds: integer("rest_seconds"),
    orderIndex: integer("order_index"),
    notes: text("notes"),
  },
  (table) => [
    index("workout_exercises_workout_day_id_idx").on(table.workoutDayId),
    index("workout_exercises_exercise_id_idx").on(table.exerciseId),
  ],
);

export const workoutSessions = pgTable(
  "workout_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    workoutPlanId: uuid("workout_plan_id")
      .notNull()
      .references(() => workoutPlans.id, { onDelete: "cascade" }),
    workoutDayId: uuid("workout_day_id")
      .notNull()
      .references(() => workoutDays.id, { onDelete: "cascade" }),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    durationMinutes: integer("duration_minutes"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("workout_sessions_user_id_idx").on(table.userId),
    index("workout_sessions_workout_plan_id_idx").on(table.workoutPlanId),
    index("workout_sessions_workout_day_id_idx").on(table.workoutDayId),
  ],
);

export const exerciseLogs = pgTable(
  "exercise_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => workoutSessions.id, { onDelete: "cascade" }),
    exerciseId: uuid("exercise_id")
      .notNull()
      .references(() => exercises.id, { onDelete: "cascade" }),
    setNumber: integer("set_number"),
    repsCompleted: integer("reps_completed"),
    weightKg: numeric("weight_kg", { precision: 6, scale: 2 }),
    rpe: integer("rpe"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("exercise_logs_session_id_idx").on(table.sessionId),
    index("exercise_logs_exercise_id_idx").on(table.exerciseId),
  ],
);
