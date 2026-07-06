import { Webhook } from "svix";
import type { Request, Response } from "express";
import { db, users } from "@arc/database";
import { eq } from "drizzle-orm";

export async function handleClerkWebhook(req: Request, res: Response): Promise<void> {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    // If not configured, we still return 200 locally or in dev to avoid breaking things,
    // but we can't process the webhook securely.
    console.warn("CLERK_WEBHOOK_SECRET is not set. Webhook ignored.");
    res.status(200).json({ success: true, message: "Webhook secret missing, ignored." });
    return;
  }

  // Get the headers and body
  const headers = req.headers;
  const payload = req.body; // This should be a Buffer because of express.raw

  // Get the Svix headers for verification
  const svix_id = headers["svix-id"] as string;
  const svix_timestamp = headers["svix-timestamp"] as string;
  const svix_signature = headers["svix-signature"] as string;

  if (!svix_id || !svix_timestamp || !svix_signature) {
    res.status(400).json({ success: false, message: "Error occured -- no svix headers" });
    return;
  }

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  // Attempt to verify the incoming webhook
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err: any) {
    console.error("Error verifying webhook:", err.message);
    res.status(400).json({ success: false, message: "Error verifying webhook" });
    return;
  }

  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with an ID of ${id} and type of ${eventType}`);

  if (eventType === "user.deleted") {
    try {
      await db.transaction(async (tx) => {
        // The foreign keys have ON DELETE CASCADE so this will wipe all health data
        await tx.delete(users).where(eq(users.clerkId, id));
      });
      console.log(`Successfully deleted user with clerkId: ${id}`);
    } catch (err) {
      console.error("Failed to delete user data", err);
      res.status(500).json({ success: false, message: "Database error" });
      return;
    }
  }

  res.status(200).json({ success: true });
}
