import { relations } from "drizzle-orm";

import { users } from "../schema/users.js";
import {
  exerciseLogs,
  workoutDays,
  workoutExercises,
  workoutPlans,
  workoutSessions,
} from "../schema/workouts.js";

export const workoutPlansRelations = relations(workoutPlans, ({ many, one }) => ({
  user: one(users, {
    fields: [workoutPlans.userId],
    references: [users.id],
  }),
  days: many(workoutDays),
  sessions: many(workoutSessions),
}));

export const workoutDaysRelations = relations(workoutDays, ({ many, one }) => ({
  workoutPlan: one(workoutPlans, {
    fields: [workoutDays.workoutPlanId],
    references: [workoutPlans.id],
  }),
  exercises: many(workoutExercises),
  sessions: many(workoutSessions),
}));

export const workoutExercisesRelations = relations(workoutExercises, ({ one }) => ({
  workoutDay: one(workoutDays, {
    fields: [workoutExercises.workoutDayId],
    references: [workoutDays.id],
  }),
}));

export const workoutSessionsRelations = relations(workoutSessions, ({ many, one }) => ({
  user: one(users, {
    fields: [workoutSessions.userId],
    references: [users.id],
  }),
  workoutPlan: one(workoutPlans, {
    fields: [workoutSessions.workoutPlanId],
    references: [workoutPlans.id],
  }),
  workoutDay: one(workoutDays, {
    fields: [workoutSessions.workoutDayId],
    references: [workoutDays.id],
  }),
  exerciseLogs: many(exerciseLogs),
}));

export const exerciseLogsRelations = relations(exerciseLogs, ({ one }) => ({
  workoutSession: one(workoutSessions, {
    fields: [exerciseLogs.sessionId],
    references: [workoutSessions.id],
  }),
}));
