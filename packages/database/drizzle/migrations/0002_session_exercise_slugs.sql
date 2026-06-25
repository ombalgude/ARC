ALTER TABLE "exercise_logs" DROP CONSTRAINT IF EXISTS "exercise_logs_exercise_id_exercises_id_fk";
--> statement-breakpoint
ALTER TABLE "exercise_logs" ALTER COLUMN "exercise_id" SET DATA TYPE text;
