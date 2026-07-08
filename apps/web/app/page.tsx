import { Suspense } from "react";
import CountdownTimer from "./coming-soon/CountdownTimer";
import FeaturesSection from "./coming-soon/FeaturesSection";
import Footer from "./coming-soon/Footer";
import HeroSection from "./coming-soon/HeroSection";
import LandingNav from "./coming-soon/LandingNav";
import PerksSection from "./coming-soon/PerksSection";
import MarqueeStrip from "./coming-soon/MarqueeStrip";
import ScrollRevealInit from "./coming-soon/ScrollRevealInit";

// Fetch live stats server-side
async function getWaitlistStats(): Promise<{ totalCount: number; spotsRemaining: number }> {
  try {
    // Use absolute URL when called from server
    const base =
      process.env.NEXT_PUBLIC_APP_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    const res = await fetch(`${base}/api/waitlist/stats`, {
      next: { revalidate: 60 },
    });
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
  const [stats, params] = await Promise.all([
    getWaitlistStats(),
    searchParams,
  ]);

  const referralCode = params.ref;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--arc-bg)",
        color: "var(--arc-text)",
        position: "relative",
        isolation: "isolate",
      }}
    >
      {/* ── Ultra-Premium Subtle Background ── */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Deep, organic aurora shadows */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/10 blur-[150px] animate-float opacity-60" style={{ animationDuration: '18s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900/10 blur-[150px] animate-float opacity-50" style={{ animationDuration: '24s', animationDelay: '-8s' }} />
        
        {/* Luxury Dot-Matrix Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_30%,#000_20%,transparent_100%)] opacity-80" />
      </div>

      {/* Navigation */}
      <LandingNav />

      {/* Scroll reveal initializer */}
      <ScrollRevealInit />

      {/* Hero */}
      <HeroSection
        initialCount={stats.totalCount}
        referralCode={referralCode}
      />

      {/* Social Proof Marquee */}
      <MarqueeStrip />

      {/* Countdown */}
      <Suspense fallback={null}>
        <CountdownTimer />
      </Suspense>

      {/* Perks */}
      <PerksSection spotsRemaining={stats.spotsRemaining} />

      {/* Features - Bento Grid */}
      <FeaturesSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
