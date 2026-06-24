ALTER TABLE "workout_exercises" DROP CONSTRAINT "workout_exercises_exercise_id_exercises_id_fk";
--> statement-breakpoint
ALTER TABLE "workout_exercises" ALTER COLUMN "exercise_id" SET DATA TYPE text;