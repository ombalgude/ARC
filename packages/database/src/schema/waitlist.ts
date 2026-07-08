import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const waitlistEntries = pgTable("waitlist_entries", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  referralCode: text("referral_code").unique().notNull(),
  referredBy: text("referred_by"),
  position: integer("position").notNull(),
  referralCount: integer("referral_count").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(
    sql`NOW()`
  ),
});

export type WaitlistEntry = typeof waitlistEntries.$inferSelect;
export type NewWaitlistEntry = typeof waitlistEntries.$inferInsert;
