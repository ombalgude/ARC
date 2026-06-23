import { relations } from "drizzle-orm";

import { aiConversations } from "../schema/ai.js";
import { habitLogs, habits } from "../schema/habits.js";
import { nutritionProfiles } from "../schema/nutrition.js";
import { userPreferences, userProfiles, users } from "../schema/users.js";
import { workoutPlans, workoutSessions } from "../schema/workouts.js";

export const usersRelations = relations(users, ({ many, one }) => ({
  profile: one(userProfiles),
  preferences: one(userPreferences),
  nutritionProfile: one(nutritionProfiles),
  workoutPlans: many(workoutPlans),
  workoutSessions: many(workoutSessions),
  habits: many(habits),
  habitLogs: many(habitLogs),
  aiConversations: many(aiConversations),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
}));
