ALTER TABLE "exercise_logs" DROP CONSTRAINT "exercise_logs_exercise_id_exercises_id_fk";
--> statement-breakpoint
ALTER TABLE "exercise_logs" ALTER COLUMN "exercise_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "habits" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "push_token" text;--> statement-breakpoint
ALTER TABLE "habits" ADD COLUMN "icon_name" text;--> statement-breakpoint
ALTER TABLE "habits" ADD COLUMN "color_hex" text;--> statement-breakpoint
DROP TYPE "public"."habit_type";