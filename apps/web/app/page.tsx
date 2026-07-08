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
        background: "transparent",
        color: "var(--arc-text)",
        position: "relative",
        isolation: "isolate",
      }}
    >
      {/* ── Impeccable High-Fidelity Studio Background ── */}
      <div 
        className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
        style={{ backgroundColor: "#02040A" }}
      >
        {/* 1. Cinematic Film Grain */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          opacity: 0.035, mixBlendMode: "overlay",
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")"
        }} />

        {/* 2. Luxury Dot-Matrix Grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black 10%, transparent 80%)",
        }} />

        {/* 3. Deep Left-Side Oceanic Wash (Ambient) */}
        <div style={{
          position: "absolute", top: "-10%", left: "-20%", width: "80vw", height: "120vh",
          background: "radial-gradient(ellipse at center, rgba(16, 42, 82, 0.45) 0%, transparent 70%)",
          filter: "blur(90px)",
        }} />

        {/* 4. Sharp Accent Core Behind Phone (Creates 3D Rim Lighting) */}
        <div style={{
          position: "absolute", top: "20%", right: "10%", width: "40vw", height: "60vh",
          background: "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.15) 0%, transparent 60%)",
          filter: "blur(60px)",
        }} />

        {/* 5. Right-Side Deep Indigo/Navy Bloom (Base Environment) */}
        <div style={{
          position: "absolute", top: "5%", right: "-20%", width: "90vw", height: "130vh",
          background: "radial-gradient(ellipse at center, rgba(17, 28, 78, 0.55) 0%, transparent 70%)",
          filter: "blur(100px)",
        }} />

        {/* 6. Base Foundation Light (Ensures the bottom half of the screen is never dead black) */}
        <div style={{
          position: "absolute", bottom: "-20%", left: "10%", width: "80vw", height: "60vh",
          background: "radial-gradient(ellipse at center, rgba(16, 32, 64, 0.5) 0%, transparent 70%)",
          filter: "blur(80px)",
        }} />
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
      {/* <MarqueeStrip /> */}

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
