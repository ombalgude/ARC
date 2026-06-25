import { and, eq, isNull } from "drizzle-orm";

import { db } from "../client.js";
import { userPreferences, userProfiles, users } from "../schema/index.js";

type NewUser = typeof users.$inferInsert;
type NewUserProfile = typeof userProfiles.$inferInsert;
type TransactionCallback = Parameters<typeof db.transaction>[0];
type DatabaseTransaction = TransactionCallback extends (tx: infer T) => unknown ? T : never;
type DatabaseExecutor = typeof db | DatabaseTransaction;

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

export async function findProfileByUserId(userId: string) {
  const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);

  return profile ?? null;
}

export async function findPreferencesByUserId(userId: string) {
  const [preferences] = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);

  return preferences ?? null;
}

export async function findMeById(id: string) {
  const [result] = await db
    .select({
      user: users,
      profile: userProfiles,
      preferences: userPreferences,
    })
    .from(users)
    .leftJoin(userProfiles, eq(userProfiles.userId, users.id))
    .leftJoin(userPreferences, eq(userPreferences.userId, users.id))
    .where(and(eq(users.id, id), isNull(users.deletedAt)))
    .limit(1);

  return result ?? null;
}

export async function create(input: CreateUserInput) {
  const [user] = await db.insert(users).values(input).returning();
  if (!user) {
    throw new Error("User repository did not return a created user");
  }
  return user;
}

export async function updateProfile(
  userId: string,
  input: UpsertUserProfileInput,
  executor: DatabaseExecutor = db,
) {
  const [profile] = await executor
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

  if (!profile) {
    throw new Error("User repository did not return a profile");
  }

  return profile;
}

export async function upsertPreferences(
  userId: string,
  input: { preferredEnvironment: "home" | "gym"; equipment: string[] },
  executor: DatabaseExecutor = db,
) {
  const [prefs] = await executor
    .insert(userPreferences)
    .values({ userId, ...input })
    .onConflictDoUpdate({
      target: userPreferences.userId,
      set: { ...input, updatedAt: new Date() },
    })
    .returning();

  if (!prefs) {
    throw new Error("User repository did not return preferences");
  }

  return prefs;
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
