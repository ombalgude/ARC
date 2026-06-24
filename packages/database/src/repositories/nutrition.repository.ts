import { eq } from "drizzle-orm";

import { db } from "../client.js";
import { nutritionProfiles } from "../schema/index.js";

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
