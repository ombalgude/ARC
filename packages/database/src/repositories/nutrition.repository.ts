import { eq } from "drizzle-orm";

import { db } from "../client.js";
import { nutritionProfiles } from "../schema/index.js";

type NewNutritionProfile = typeof nutritionProfiles.$inferInsert;

export type UpsertNutritionProfileInput = Omit<NewNutritionProfile, "id" | "createdAt" | "updatedAt"> &
  Partial<Pick<NewNutritionProfile, "createdAt" | "updatedAt">>;

export async function upsertProfile(input: UpsertNutritionProfileInput) {
  const [profile] = await db
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
