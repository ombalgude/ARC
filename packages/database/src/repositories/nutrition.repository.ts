import { eq, and, sql } from "drizzle-orm";

import { db } from "../client.js";
import { nutritionProfiles, nutritionLogs, mealSuggestions } from "../schema/index.js";

type NewNutritionProfile = typeof nutritionProfiles.$inferInsert;
type TransactionCallback = Parameters<typeof db.transaction>[0];
type DatabaseTransaction = TransactionCallback extends (tx: infer T) => unknown ? T : never;
type DatabaseExecutor = typeof db | DatabaseTransaction;

export type UpsertNutritionProfileInput = Omit<NewNutritionProfile, "id" | "createdAt" | "updatedAt"> &
  Partial<Pick<NewNutritionProfile, "createdAt" | "updatedAt">>;

export async function upsertProfile(input: UpsertNutritionProfileInput, executor: DatabaseExecutor = db) {
  const [profile] = await executor
    .insert(nutritionProfiles)
    .values(input)
    .onConflictDoUpdate({
      target: nutritionProfiles.userId,
      set: {
        ...input,
        updatedAt: input.updatedAt ?? new Date(),
      },
    })
    .returning();

  if (!profile) {
    throw new Error("Nutrition repository did not return a profile");
  }

  return profile;
}

export async function findByUser(userId: string) {
  const [profile] = await db
    .select()
    .from(nutritionProfiles)
    .where(eq(nutritionProfiles.userId, userId))
    .limit(1);

  return profile ?? null;
}

export async function getDailyNutritionSum(userId: string, dateStr: string) {
  const [sum] = await db
    .select({
      calories: sql<number>`sum(${nutritionLogs.calories})`,
      proteinG: sql<number>`sum(${nutritionLogs.proteinG})`,
      carbsG: sql<number>`sum(${nutritionLogs.carbsG})`,
      fatG: sql<number>`sum(${nutritionLogs.fatG})`,
    })
    .from(nutritionLogs)
    .where(
      and(
        eq(nutritionLogs.userId, userId),
        sql`date(${nutritionLogs.loggedDate}) = ${dateStr}::date`
      )
    );

  return {
    calories: Number(sum?.calories ?? 0),
    proteinG: Number(sum?.proteinG ?? 0),
    carbsG: Number(sum?.carbsG ?? 0),
    fatG: Number(sum?.fatG ?? 0),
  };
}

export async function getMealSuggestions(dietaryPreference: string) {
  const suggestions = await db
    .select()
    .from(mealSuggestions)
    .where(eq(mealSuggestions.dietaryPreference, dietaryPreference));

  return suggestions;
}

export async function findHistoricalLogsByUser(userId: string) {
  return db
    .select()
    .from(nutritionLogs)
    .where(eq(nutritionLogs.userId, userId));
}
