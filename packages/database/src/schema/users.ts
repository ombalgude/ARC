import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import {
  activityLevelEnum,
  experienceLevelEnum,
  genderEnum,
  goalEnum,
  preferredEnvironmentEnum,
} from "./enums.js";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull().unique(),
  pushToken: text("push_token"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const userProfiles = pgTable(
  "user_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name"),
    age: integer("age"),
    gender: genderEnum("gender"),
    weightKg: numeric("weight_kg", { precision: 5, scale: 2 }),
    heightCm: numeric("height_cm", { precision: 5, scale: 2 }),
    goal: goalEnum("goal"),
    experienceLevel: experienceLevelEnum("experience_level"),
    activityLevel: activityLevelEnum("activity_level"),
    dietaryPreference: text("dietary_preference"),
    workoutDaysPerWeek: integer("workout_days_per_week"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("user_profiles_user_id_idx").on(table.userId)],
);

export const userPreferences = pgTable(
  "user_preferences",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    preferredEnvironment: preferredEnvironmentEnum("preferred_environment"),
    equipment: jsonb("equipment"),
    notificationsEnabled: boolean("notifications_enabled").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("user_preferences_user_id_idx").on(table.userId)],
);
