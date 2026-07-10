const { Client } = require('pg');
require('dotenv').config();

async function clear() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query('DELETE FROM waitlist_entries;');
  console.log("Database cleared!");
  await client.end();
}
clear();
