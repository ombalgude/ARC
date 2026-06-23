import { and, eq, isNull } from "drizzle-orm";

import { db } from "../client.js";
import { userProfiles, users } from "../schema/index.js";

type NewUser = typeof users.$inferInsert;
type NewUserProfile = typeof userProfiles.$inferInsert;

export type CreateUserInput = Pick<NewUser, "clerkId" | "email"> &
  Partial<Pick<NewUser, "createdAt" | "updatedAt" | "deletedAt">>;

export type UpsertUserProfileInput = Omit<NewUserProfile, "id" | "userId" | "createdAt" | "updatedAt"> &
  Partial<Pick<NewUserProfile, "createdAt" | "updatedAt">>;

export async function findByClerkId(clerkId: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.clerkId, clerkId), isNull(users.deletedAt)))
    .limit(1);

  return user ?? null;
}

export async function findById(id: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.id, id), isNull(users.deletedAt)))
    .limit(1);

  return user ?? null;
}

export async function create(input: CreateUserInput) {
  const [user] = await db.insert(users).values(input).returning();
  return user;
}

export async function updateProfile(userId: string, input: UpsertUserProfileInput) {
  const [profile] = await db
    .insert(userProfiles)
    .values({
      userId,
      ...input,
    })
    .onConflictDoUpdate({
      target: userProfiles.userId,
      set: {
        ...input,
        updatedAt: input.updatedAt ?? new Date(),
      },
    })
    .returning();

  return profile;
}

export async function softDelete(id: string) {
  const [user] = await db
    .update(users)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();

  return user ?? null;
}
