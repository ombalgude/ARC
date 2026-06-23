import { boolean, index, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { muscleRoleEnum } from "./enums.js";

export const muscleGroups = pgTable("muscle_groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  bodyRegion: text("body_region"),
});

export const exercises = pgTable(
  "exercises",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    description: text("description"),
    movementPattern: text("movement_pattern"),
    primaryMuscleGroupId: uuid("primary_muscle_group_id").references(() => muscleGroups.id, {
      onDelete: "cascade",
    }),
    difficultyLevel: text("difficulty_level"),
    isCompound: boolean("is_compound"),
    videoUrl: text("video_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("exercises_primary_muscle_group_id_idx").on(table.primaryMuscleGroupId)],
);

export const exerciseMuscles = pgTable(
  "exercise_muscles",
  {
    exerciseId: uuid("exercise_id")
      .notNull()
      .references(() => exercises.id, { onDelete: "cascade" }),
    muscleGroupId: uuid("muscle_group_id")
      .notNull()
      .references(() => muscleGroups.id, { onDelete: "cascade" }),
    muscleRole: muscleRoleEnum("muscle_role").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.exerciseId, table.muscleGroupId] }),
    index("exercise_muscles_exercise_id_idx").on(table.exerciseId),
    index("exercise_muscles_muscle_group_id_idx").on(table.muscleGroupId),
  ],
);

export const exerciseAlternatives = pgTable(
  "exercise_alternatives",
  {
    exerciseId: uuid("exercise_id")
      .notNull()
      .references(() => exercises.id, { onDelete: "cascade" }),
    alternativeExerciseId: uuid("alternative_exercise_id")
      .notNull()
      .references(() => exercises.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.exerciseId, table.alternativeExerciseId] }),
    index("exercise_alternatives_exercise_id_idx").on(table.exerciseId),
    index("exercise_alternatives_alternative_exercise_id_idx").on(table.alternativeExerciseId),
  ],
);

export const equipmentTypes = pgTable("equipment_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
});

export const exerciseEquipment = pgTable(
  "exercise_equipment",
  {
    exerciseId: uuid("exercise_id")
      .notNull()
      .references(() => exercises.id, { onDelete: "cascade" }),
    equipmentTypeId: uuid("equipment_type_id")
      .notNull()
      .references(() => equipmentTypes.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.exerciseId, table.equipmentTypeId] }),
    index("exercise_equipment_exercise_id_idx").on(table.exerciseId),
    index("exercise_equipment_equipment_type_id_idx").on(table.equipmentTypeId),
  ],
);
