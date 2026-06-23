import { relations } from "drizzle-orm";

import { exerciseLogs, workoutExercises } from "../schema/workouts.js";
import {
  equipmentTypes,
  exerciseAlternatives,
  exerciseEquipment,
  exerciseMuscles,
  exercises,
  muscleGroups,
} from "../schema/exercises.js";

export const muscleGroupsRelations = relations(muscleGroups, ({ many }) => ({
  primaryExercises: many(exercises),
  exerciseMuscles: many(exerciseMuscles),
}));

export const exercisesRelations = relations(exercises, ({ many, one }) => ({
  primaryMuscleGroup: one(muscleGroups, {
    fields: [exercises.primaryMuscleGroupId],
    references: [muscleGroups.id],
  }),
  workoutExercises: many(workoutExercises),
  exerciseLogs: many(exerciseLogs),
  exerciseMuscles: many(exerciseMuscles),
  exerciseEquipment: many(exerciseEquipment),
  alternativeLinks: many(exerciseAlternatives, { relationName: "exercise_alternatives_source" }),
  alternativeToLinks: many(exerciseAlternatives, { relationName: "exercise_alternatives_target" }),
}));

export const exerciseMusclesRelations = relations(exerciseMuscles, ({ one }) => ({
  exercise: one(exercises, {
    fields: [exerciseMuscles.exerciseId],
    references: [exercises.id],
  }),
  muscleGroup: one(muscleGroups, {
    fields: [exerciseMuscles.muscleGroupId],
    references: [muscleGroups.id],
  }),
}));

export const exerciseAlternativesRelations = relations(exerciseAlternatives, ({ one }) => ({
  exercise: one(exercises, {
    fields: [exerciseAlternatives.exerciseId],
    references: [exercises.id],
    relationName: "exercise_alternatives_source",
  }),
  alternativeExercise: one(exercises, {
    fields: [exerciseAlternatives.alternativeExerciseId],
    references: [exercises.id],
    relationName: "exercise_alternatives_target",
  }),
}));

export const equipmentTypesRelations = relations(equipmentTypes, ({ many }) => ({
  exerciseEquipment: many(exerciseEquipment),
}));

export const exerciseEquipmentRelations = relations(exerciseEquipment, ({ one }) => ({
  exercise: one(exercises, {
    fields: [exerciseEquipment.exerciseId],
    references: [exercises.id],
  }),
  equipmentType: one(equipmentTypes, {
    fields: [exerciseEquipment.equipmentTypeId],
    references: [equipmentTypes.id],
  }),
}));
