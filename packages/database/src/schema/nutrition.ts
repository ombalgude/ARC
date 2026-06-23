import { integer, pgTable, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

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
