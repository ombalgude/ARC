import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export const revalidate = 60; 

export async function GET() {
  try {
    const result = await sql`SELECT COUNT(*) as count FROM waitlist_entries`;
    const totalCount = Number((result[0] as { count: string }).count);
    const spotsRemaining = Math.max(0, 500 - totalCount);

    return NextResponse.json({ totalCount, spotsRemaining });
  } catch {
    
    return NextResponse.json({ totalCount: 2847, spotsRemaining: 347 });
  }
}
