import "dotenv/config";
import { createClerkClient } from "@clerk/express";
import { db, sql } from "@arc/database";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function run() {
  console.log("Fetching users from Clerk...");
  try {
    const response = await clerk.users.getUserList();
    const users = response.data;
    console.log(`Found ${users.length} users in Clerk.`);
    
    for (const user of users) {
      console.log(`Deleting Clerk user: ${user.id}`);
      await clerk.users.deleteUser(user.id);
    }
    console.log("All Clerk users deleted.");

    console.log("Truncating database users table...");
    await db.execute(sql`TRUNCATE TABLE users CASCADE`);
    console.log("Database users truncated.");
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
}
run();
