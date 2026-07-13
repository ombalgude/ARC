import { neon } from "@neondatabase/serverless";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const sql = neon(process.env.DATABASE_URL!);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, referralCode: referredByCode } = await request.json() as {
      email: string;
      referralCode?: string;
    };

    // ── Input Validation ────────────────────────────────────────────────────
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // ── Duplicate check ─────────────────────────────────────────────────────
    const existing = await sql`
      SELECT id, position, referral_code FROM waitlist_entries WHERE email = ${email}
    `;
    if (existing.length > 0) {
      const entry = existing[0];
      if (!entry) throw new Error("Entry missing");
      const totalCount = await sql`SELECT COUNT(*) as count FROM waitlist_entries`;
      return NextResponse.json({
        alreadyRegistered: true,
        position: entry.position,
        referralCode: entry.referral_code,
        totalCount: Number((totalCount[0] as { count: string }).count),
      });
    }

    // ── FIX: Atomic position via DB-computed MAX + 1 ────────────────────────
    // Previous pattern: read COUNT(*) then add 1 client-side — vulnerable to
    // race condition under concurrent traffic (two users could both read the
    // same count and receive duplicate positions). Using MAX(position) + 1
    // inside the INSERT with a COALESCE guard is still not fully atomic, but
    // we now compute position server-side in one round-trip. For full
    // protection, a Postgres SEQUENCE on the position column is recommended.
    const myReferralCode = nanoid(8).toUpperCase();

    const inserted = await sql`
      INSERT INTO waitlist_entries (email, referral_code, referred_by, position)
      SELECT
        ${email},
        ${myReferralCode},
        ${referredByCode ?? null},
        COALESCE((SELECT MAX(position) FROM waitlist_entries), 0) + 1
      RETURNING position
    `;
    const position = Number((inserted[0] as { position: number }).position);

    // ── Referral boost ──────────────────────────────────────────────────────
    if (referredByCode) {
      await sql`
        UPDATE waitlist_entries
        SET
          referral_count = referral_count + 1,
          position = GREATEST(1, position - 5)
        WHERE referral_code = ${referredByCode}
      `;
    }

    // ── Confirmation email ──────────────────────────────────────────────────
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://arcfitness.app";
    const referralLink = `${appUrl}?ref=${myReferralCode}`;

    try {
      if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("placeholder")) {
        // FIX: Removed console.log("[Resend Success]:", data) — this logged
        // the recipient email address to Vercel Function Logs (visible to all
        // project members). Errors are silently swallowed to avoid leaking
        // internal DB/email details. Use a structured logger (e.g. Axiom,
        // Datadog) if you need observability in production.
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL ?? "hello@arcfitness.app",
          to: email,
          subject: `You are #${position} in line for ARC Fitness.`,
          html: `
            <!DOCTYPE html>
            <html>
            <body style="background-color:#0A0A0F;color:#F1F1F3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;padding:40px 24px;">
              <h1 style="font-size:28px;font-weight:900;margin-bottom:8px;letter-spacing:-0.03em;color:#FFFFFF;">
                You are <span style="color:#3B82F6;">#${position}</span> in line.
              </h1>
              <p style="color:#9CA3AF;margin-bottom:24px;line-height:1.6;font-size:16px;">
                Welcome to ARC Fitness. You just locked in your spot for the only fitness system that actually adapts to your progress daily. No more guesswork.
              </p>
              
              <div style="background-color:#12182B;border:1px solid #1E3A8A;border-radius:12px;padding:24px;margin-bottom:24px;">
                <p style="font-weight:700;margin-top:0;margin-bottom:8px;text-transform:uppercase;font-size:12px;letter-spacing:0.05em;color:#60A5FA;">Skip the Line</p>
                <p style="font-size:14px;color:#D1D5DB;margin-top:0;margin-bottom:20px;line-height:1.5;">Every friend you invite skips you <strong>5 spots forward</strong>. Invite 3 friends, skip 15 spots.</p>
                <a href="${referralLink}" style="display:inline-block;background-color:#3B82F6;color:#FFFFFF;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Copy your referral link</a>
                <p style="font-size:12px;color:#6B7280;margin-top:16px;margin-bottom:0;">Or forward this link: <a href="${referralLink}" style="color:#3B82F6;text-decoration:none;">${referralLink}</a></p>
              </div>

              <div style="margin-bottom:24px;background-color:#111116;border:1px solid #1F1F2E;border-radius:12px;padding:24px;">
                <p style="font-weight:700;margin-top:0;margin-bottom:16px;text-transform:uppercase;font-size:12px;letter-spacing:0.05em;color:#9CA3AF;">Your early access perks</p>
                <ul style="color:#9CA3AF;padding-left:20px;line-height:1.8;font-size:14px;margin:0;">
                  <li style="margin-bottom:8px;"><strong style="color:#F1F1F3;">3 Months Pro Free</strong> — Reserved for the first 100 users. Secure your spot on the waitlist.</li>
                  <li><strong style="color:#F1F1F3;">Priority Waitlist Access</strong> — Skip the queue. Every friend you refer moves you 5 spots up.</li>
                </ul>
              </div>

              <p style="color:#6B7280;font-size:13px;margin-top:32px;">— The ARC Fitness Team</p>
            </body>
            </html>
          `,
        });
      }
    } catch {
      // FIX: Removed console.error("[Resend Network Error]:", _emailError)
      // Email failure is non-fatal — the user is already in the DB.
      // Do not block the success response. Use structured logging in production
      // if email deliverability monitoring is needed.
    }

    const totalCount = await sql`SELECT COUNT(*) as count FROM waitlist_entries`;

    return NextResponse.json({
      success: true,
      position,
      referralCode: myReferralCode,
      totalCount: Number((totalCount[0] as { count: string }).count),
    });
  } catch {
    // FIX: Removed console.error("[waitlist/join]", error) — the raw DB error
    // object can leak table names, column names, and constraint names. Use a
    // structured logger with scrubbing if you need error observability.
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
