import { Suspense } from "react";
import CountdownTimer from "./coming-soon/CountdownTimer";
import FeaturesSection from "./coming-soon/FeaturesSection";
import Footer from "./coming-soon/Footer";
import HeroSection from "./coming-soon/HeroSection";
import LandingNav from "./coming-soon/LandingNav";
import PerksSection from "./coming-soon/PerksSection";
import ScrollRevealInit from "./coming-soon/ScrollRevealInit";

async function getWaitlistStats(): Promise<{ totalCount: number; spotsRemaining: number }> {
  try {
    const base =
      process.env.NEXT_PUBLIC_APP_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const res = await fetch(`${base}/api/waitlist/stats`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("stats fetch failed");
    return (await res.json()) as { totalCount: number; spotsRemaining: number };
  } catch {
    return { totalCount: 2847, spotsRemaining: 347 };
  }
}

interface HomeProps {
  searchParams: Promise<{ ref?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const [stats, params] = await Promise.all([getWaitlistStats(), searchParams]);
  const referralCode = params.ref;

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          PAGE SHELL — pure black base, always.
          The raah.dev gradient is applied to the HERO WRAPPER only,
          not as a fixed full-page background.
          This is exactly how raah.dev does it.
      ───────────────────────────────────────────────────────────── */}
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#000000",
        color: "#FFFFFF",
        position: "relative",
        isolation: "isolate",
      }}>

        {/* ── Film grain overlay (fixed, full page) ── */}
        <div
          aria-hidden
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 9999,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
            backgroundSize: "160px 160px",
            opacity: 0.022,
            mixBlendMode: "overlay",
          }}
        />

        {/* Navigation */}
        <LandingNav />
        <ScrollRevealInit />

        {/* ════════════════════════════════════════════════════════════
            HERO WRAPPER — THIS is where raah.dev puts the gradient.
            It wraps only the hero section, not the whole page.

            Their exact CSS class (decoded from Tailwind arbitrary):
            background: radial-gradient(
              125% 125% at 50% 0%,
              transparent 40%,
              var(--color-blue-600),   ← #2563EB
              var(--landing-page-bg) 100%   ← their dark bg (#000 equivalent)
            )

            How it renders:
            - Center point: top-center (50% 0%)
            - 0–40% from center: TRANSPARENT (shows black base)
            - ~40–70%: transitions through blue-600
            - 70–100%: fades to their page bg (dark)

            On a 1440px wide, 100vh tall hero:
            - The gradient ellipse is 125% × 125% = 1800px × 1125px
            - Center is at top-center
            - 40% stop = 720px from center horizontally, 450px vertically
            - So the blue ring appears at ~450px down from the top
            - Which is roughly halfway down the hero viewport
        ════════════════════════════════════════════════════════════ */}
        <div style={{
          position: "relative",
          overflow: "hidden",
          background: `radial-gradient(
            120% 130% at 50% 0%,
            transparent        40%,
            rgba(37,99,235,0.85) 58%,
            rgba(17,24,39,1)   100%
          )`,
        }}>
          {/* Bottom fade overlay inside this wrapper to prevent hard edges on widescreen */}
          <div
            aria-hidden
            style={{
              pointerEvents: "none",
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 0,
              height: "10rem",
              background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.9) 65%, rgba(0,0,0,1) 100%)",
            }}
          />
          {/* Raah also has a bottom blur pill to soften the edge */}
          <div
            aria-hidden
            style={{
              pointerEvents: "none",
              position: "absolute",
              bottom: "-2.5rem",
              left: "2rem",
              right: "2rem",
              zIndex: 0,
              height: "5rem",
              borderRadius: "9999px",
              background: "rgba(0,0,0,0.80)",
              filter: "blur(48px)",
            }}
          />

          {/* Dot grid — only inside the hero, masked to the blue zone */}
          <div
            aria-hidden
            style={{
              pointerEvents: "none",
              position: "absolute",
              inset: 0,
              zIndex: 0,
              backgroundImage: "radial-gradient(rgba(255,255,255,0.040) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
              /* Mask matches the gradient shape — invisible in transparent top,
                 visible in the blue band, fades out toward edges */
              WebkitMaskImage: `radial-gradient(
                125% 125% at 50% 0%,
                transparent 35%,
                black       52%,
                transparent 72%
              )`,
              maskImage: `radial-gradient(
                125% 125% at 50% 0%,
                transparent 35%,
                black       52%,
                transparent 72%
              )`,
            }}
          />

          <HeroSection initialCount={stats.totalCount} referralCode={referralCode} />
        </div>

        {/* Remaining page sections on plain black */}
        <Suspense fallback={null}>
          <CountdownTimer />
        </Suspense>
        <PerksSection spotsRemaining={stats.spotsRemaining} />
        <FeaturesSection />
        <Footer />
      </div>
    </>
  );
}
