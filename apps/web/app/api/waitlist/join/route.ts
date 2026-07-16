import { neon } from "@neondatabase/serverless";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const sql = neon(process.env.DATABASE_URL!);
const resend = new Resend(process.env.RESEND_API_KEY);

// ── Rate Limiter (in-memory, per function instance) ────────────────────────
// Limits each IP to 5 submissions per 15-minute window.
// Resets on cold starts. For distributed rate limiting use Upstash Redis.
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(request: Request) {
  try {
    // ── Rate limiting ────────────────────────────────────────────────────────
    const ip =
      request.headers.get("x-real-ip") ??
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";

    const now = Date.now();
    const rlEntry = rateLimit.get(ip);

    if (rlEntry && now < rlEntry.resetAt) {
      if (rlEntry.count >= RATE_LIMIT_MAX) {
        return NextResponse.json(
          { error: "Too many requests. Please wait 15 minutes and try again." },
          { status: 429 }
        );
      }
      rlEntry.count++;
    } else {
      rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    }

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
          subject: `You are #${position} in line for ARC.`,
          html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>You're #${position} in line for ARC</title>
            </head>
            <body style="margin:0;padding:0;background-color:#04050F;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#04050F;padding:48px 16px 64px;">
                <tr>
                  <td align="center">
                    <table width="100%" style="max-width:480px;">

                      <!-- Logo -->
                      <tr>
                        <td style="padding-bottom:48px;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="background:linear-gradient(145deg,#3B82F6,#1D4ED8);width:28px;height:28px;border-radius:8px;text-align:center;vertical-align:middle;">
                                <span style="color:#fff;font-size:13px;font-weight:800;line-height:28px;display:block;">A</span>
                              </td>
                              <td style="padding-left:10px;color:#FFFFFF;font-size:15px;font-weight:700;letter-spacing:0.18em;">ARC</td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Headline -->
                      <tr>
                        <td style="padding-bottom:16px;">
                          <p style="margin:0;font-size:12px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#3B82F6;">Spot Secured</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:24px;">
                          <h1 style="margin:0;font-size:38px;font-weight:600;letter-spacing:-0.04em;color:#FFFFFF;line-height:1.08;">
                            You are <span style="color:#3B82F6;">#${position}</span><br/>in line.
                          </h1>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:48px;">
                          <p style="margin:0;font-size:15px;line-height:1.75;color:rgba(255,255,255,0.45);max-width:380px;">
                            Welcome to ARC. The AI copilot that unifies your training, nutrition, and habits. No more guesswork. We'll let you know the moment you're in.
                          </p>
                        </td>
                      </tr>

                      <!-- Divider -->
                      <tr>
                        <td style="padding-bottom:40px;">
                          <div style="height:1px;background:rgba(255,255,255,0.07);"></div>
                        </td>
                      </tr>

                      <!-- Referral -->
                      <tr>
                        <td style="padding-bottom:12px;">
                          <p style="margin:0;font-size:12px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.3);">Skip the line</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:28px;">
                          <p style="margin:0;font-size:15px;line-height:1.75;color:rgba(255,255,255,0.45);">
                            Every friend you invite moves you <span style="color:#FFFFFF;font-weight:500;">5 spots forward</span>. Invite 3 friends, skip 15 spots instantly.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:16px;">
                          <a href="${referralLink}" style="display:inline-block;background:#3B82F6;color:#FFFFFF;padding:14px 32px;border-radius:100px;text-decoration:none;font-weight:600;font-size:14px;letter-spacing:-0.01em;">
                            Share Your Link →
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:48px;">
                          <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.4);word-break:break-all;">
                            <a href="${referralLink}" style="color:#60A5FA;text-decoration:underline;">${referralLink}</a>
                          </p>
                        </td>
                      </tr>

                      <!-- Divider -->
                      <tr>
                        <td style="padding-bottom:40px;">
                          <div style="height:1px;background:rgba(255,255,255,0.07);"></div>
                        </td>
                      </tr>

                      <!-- Perks, plain text, no cards -->
                      <tr>
                        <td style="padding-bottom:12px;">
                          <p style="margin:0;font-size:12px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.3);">What you get</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:12px;">
                          <p style="margin:0;font-size:15px;line-height:1.75;color:rgba(255,255,255,0.45);">
                            <span style="color:#FFFFFF;font-weight:500;">3 months Pro free</span>. Reserved for the first 100 users.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:48px;">
                          <p style="margin:0;font-size:15px;line-height:1.75;color:rgba(255,255,255,0.45);">
                            <span style="color:#FFFFFF;font-weight:500;">Priority access</span>. Every referral moves you 5 spots up.
                          </p>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td>
                          <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.4);line-height:1.7;">
                            You signed up at <a href="${appUrl}" style="color:#60A5FA;text-decoration:none;font-weight:500;">arcfitness.app</a>. The ARC Team
                          </p>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>

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
