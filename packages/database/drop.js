import { neon } from "@neondatabase/serverless";
const sql = neon("postgresql://neondb_owner:npg_cg1CJ6NnyLFS@ep-wandering-fire-atuyok3e-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
async function run() {
  await sql`DROP TABLE IF EXISTS waitlist_entries CASCADE;`;
  console.log("Dropped!");
}
run();
