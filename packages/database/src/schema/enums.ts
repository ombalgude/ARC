import { pgEnum } from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["male", "female", "other"]);

export const goalEnum = pgEnum("goal", ["losefat", "maintain", "buildmuscle"]);

export const experienceLevelEnum = pgEnum("experience_level", [
  "beginner",
  "intermediate",
  "advanced",
]);

export const activityLevelEnum = pgEnum("activity_level", [
  "sedentary",
  "light",
  "moderate",
  "active",
  "veryactive",
]);

export const preferredEnvironmentEnum = pgEnum("preferred_environment", ["home", "gym"]);

export const muscleRoleEnum = pgEnum("muscle_role", ["primary", "secondary", "stabilizer"]);

export const habitTypeEnum = pgEnum("habit_type", ["workout", "water", "sleep", "steps", "macros"]);

export const aiMessageRoleEnum = pgEnum("ai_message_role", ["user", "assistant"]);
