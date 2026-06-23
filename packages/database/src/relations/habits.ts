import { relations } from "drizzle-orm";

import { habitLogs, habits } from "../schema/habits.js";
import { users } from "../schema/users.js";

export const habitsRelations = relations(habits, ({ many, one }) => ({
  user: one(users, {
    fields: [habits.userId],
    references: [users.id],
  }),
  logs: many(habitLogs),
}));

export const habitLogsRelations = relations(habitLogs, ({ one }) => ({
  habit: one(habits, {
    fields: [habitLogs.habitId],
    references: [habits.id],
  }),
  user: one(users, {
    fields: [habitLogs.userId],
    references: [users.id],
  }),
}));
