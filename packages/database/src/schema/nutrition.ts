import { integer, pgTable, timestamp, uniqueIndex, uuid, index, text } from "drizzle-orm/pg-core";

import { goalEnum } from "./enums.js";
import { users } from "./users.js";

export const nutritionProfiles = pgTable(
  "nutrition_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    caloriesTarget: integer("calories_target"),
    proteinG: integer("protein_g"),
    carbsG: integer("carbs_g"),
    fatG: integer("fat_g"),
    goal: goalEnum("goal"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("nutrition_profiles_user_id_idx").on(table.userId)],
);

export const nutritionLogs = pgTable(
  "nutrition_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    loggedDate: timestamp("logged_date", { withTimezone: true }).notNull(),
    calories: integer("calories").notNull().default(0),
    proteinG: integer("protein_g").notNull().default(0),
    carbsG: integer("carbs_g").notNull().default(0),
    fatG: integer("fat_g").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("nutrition_logs_user_id_idx").on(table.userId),
    index("nutrition_logs_date_idx").on(table.loggedDate),
  ],
);

export const mealSuggestions = pgTable(
  "meal_suggestions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    dietaryPreference: text("dietary_preference").notNull(), // e.g. vegan, vegetarian, etc.
    mealTime: text("meal_time").notNull(), // e.g. Breakfast, Lunch, Pre-Workout, Post-Workout
    internalId: text("internal_id").notNull(), // e.g. meal_breakfast
    whenToEat: text("when_to_eat").notNull(),
    focus: text("focus").notNull(),
    example: text("example").notNull(),
    pctOfDaily: integer("pct_of_daily").notNull(), // e.g. 25 for 25%
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
);
