import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASEURL;

if (!databaseUrl) {
  throw new Error("DATABASEURL environment variable is required");
}

export const pool = new Pool({
  connectionString: databaseUrl,
});

export const db = drizzle(pool);
