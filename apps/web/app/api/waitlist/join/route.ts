import { neon } from "@neondatabase/serverless";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const sql = neon(process.env.DATABASE_URL!);
const resend = new Resend(process.env.RESEND_API_KEY);

// Ensure table exists
async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS waitlist_entries (
      id            SERIAL PRIMARY KEY,
      email         TEXT UNIQUE NOT NULL,
      referral_code TEXT UNIQUE NOT NULL,
      referred_by   TEXT,
      position      INT NOT NULL,
      referral_count INT DEFAULT 0,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

export async function POST(request: Request) {
  try {
    const { email, referralCode: referredByCode } = await request.json() as {
      email: string;
      referralCode?: string;
    };

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    await ensureTable();

    // Check if already signed up
    const existing = await sql`
      SELECT id, position, referral_code FROM waitlist_entries WHERE email = ${email}
    `;
    if (existing.length > 0) {
      const entry = existing[0];
      const totalCount = await sql`SELECT COUNT(*) as count FROM waitlist_entries`;
      return NextResponse.json({
        alreadyRegistered: true,
        position: entry.position,
        referralCode: entry.referral_code,
        totalCount: Number((totalCount[0] as { count: string }).count),
      });
    }

    // Get current count for position
    const countResult = await sql`SELECT COUNT(*) as count FROM waitlist_entries`;
    const position = Number((countResult[0] as { count: string }).count) + 1;

    // Generate unique referral code
    const myReferralCode = nanoid(8).toUpperCase();

    // Insert new entry
    await sql`
      INSERT INTO waitlist_entries (email, referral_code, referred_by, position)
      VALUES (${email}, ${myReferralCode}, ${referredByCode ?? null}, ${position})
    `;

    // If referred by someone, bump them up 5 positions (lower number = higher rank)
    if (referredByCode) {
      await sql`
        UPDATE waitlist_entries
        SET
          referral_count = referral_count + 1,
          position = GREATEST(1, position - 5)
        WHERE referral_code = ${referredByCode}
      `;
    }

    // Send welcome email (fire-and-forget if Resend key is placeholder)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://arcfitness.app";
    const referralLink = `${appUrl}?ref=${myReferralCode}`;

    try {
      if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("placeholder")) {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL ?? "hello@arcfitness.app",
          to: email,
          subject: `🎉 You're #${position} on the ARC Fitness waitlist!`,
          html: `
            <!DOCTYPE html>
            <html>
            <body style="background:#0A0A0F;color:#F1F1F3;font-family:Inter,sans-serif;max-width:520px;margin:0 auto;padding:40px 24px;">
              <h1 style="font-size:28px;font-weight:900;margin-bottom:8px;">
                You're <span style="color:#3B82F6">#${position}</span> on the waitlist! 🚀
              </h1>
              <p style="color:#9CA3AF;margin-bottom:24px;">
                Welcome to ARC Fitness. You're one of the founding members getting early access to the most intelligent fitness app ever built.
              </p>
              <div style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.3);border-radius:12px;padding:20px;margin-bottom:24px;">
                <p style="font-weight:700;margin-bottom:8px;">🔗 Your referral link</p>
                <p style="font-size:13px;color:#9CA3AF;margin-bottom:12px;">Share this link to move up the waitlist. Each referral = +5 positions.</p>
                <a href="${referralLink}" style="color:#3B82F6;word-break:break-all;">${referralLink}</a>
              </div>
              <div style="margin-bottom:24px;">
                <p style="font-weight:700;margin-bottom:12px;">🎁 Your founding member perks:</p>
                <ul style="color:#9CA3AF;padding-left:20px;line-height:2;">
                  <li>🏅 Founding Member Badge — locked forever</li>
                  <li>⚡ 3 Months Pro Free (first 500 members)</li>
                  <li>🚀 Priority Access on launch day</li>
                </ul>
              </div>
              <p style="color:#6B7280;font-size:13px;">— The ARC Fitness Team</p>
            </body>
            </html>
          `,
        });
      }
    } catch (_emailError) {
      // Email failure is non-fatal
    }

    const totalCount = await sql`SELECT COUNT(*) as count FROM waitlist_entries`;

    return NextResponse.json({
      success: true,
      position,
      referralCode: myReferralCode,
      totalCount: Number((totalCount[0] as { count: string }).count),
    });
  } catch (error) {
    console.error("[waitlist/join]", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
