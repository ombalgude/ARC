import React from "react";
import { Suspense } from "react";
import FeaturesSection from "./coming-soon/FeaturesSection";
import Footer from "./coming-soon/Footer";
import HeroSection from "./coming-soon/HeroSection";
import LandingNav from "./coming-soon/LandingNav";
import PerksSection from "./coming-soon/PerksSection";
import ScrollRevealInit from "./coming-soon/ScrollRevealInit";
import SmoothScroll from "./coming-soon/SmoothScroll";
import CustomCursor from "./coming-soon/CustomCursor";

async function getWaitlistStats(): Promise<{ totalCount: number; spotsRemaining: number }> {
  try {
    const base =
      process.env.NEXT_PUBLIC_APP_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const res = await fetch(`${base}/api/waitlist/stats`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("stats fetch failed");
    return (await res.json()) as { totalCount: number; spotsRemaining: number };
  } catch {
    return { totalCount: 2847, spotsRemaining: 28 };
  }
}

interface HomeProps {
  searchParams: Promise<{ ref?: string }>;
}

export default async function Home({ searchParams }: HomeProps): Promise<React.JSX.Element> {
  const [stats, params] = await Promise.all([getWaitlistStats(), searchParams]);
  const referralCode = params.ref;

  // ── JSON-LD Structured Data ─────────────────────────────────────────────
  // Tells Google this is a SoftwareApplication (health/fitness, iOS + Android).
  // Enables rich search cards and improves indexing accuracy.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ARC Fitness",
    applicationCategory: "HealthApplication",
    operatingSystem: "iOS, Android",
    description:
      "The AI fitness coach that tracks workouts, habits, and nutrition in one beautiful app. Personalized training plans, macro tracking, habit science, and 24/7 AI coaching.",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://arcfitness.app",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/PreOrder",
    },
    publisher: {
      "@type": "Organization",
      name: "ARC Fitness",
      url: process.env.NEXT_PUBLIC_APP_URL ?? "https://arcfitness.app",
    },
  };

  return (
    <>
      {/* JSON-LD structured data for Google rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SmoothScroll />
      {/* <CustomCursor /> */}

      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#000000",
        color: "#FFFFFF",
        position: "relative",
        isolation: "isolate",
      }}>

        <div
          aria-hidden
          className="fixed inset-0 pointer-events-none hidden md:block"
          style={{
            zIndex: 9999,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
            backgroundSize: "160px 160px",
            opacity: 0.022,
            mixBlendMode: "overlay",
          }}
        />

        <LandingNav />
        <ScrollRevealInit />

        <style>{`
          .hero-wrapper {
            position: relative;
            overflow: hidden;
            background: radial-gradient(
              120% 130% at 50% 0%,
              transparent        40%,
              rgba(37,99,235,0.85) 58%,
              rgba(17,24,39,1)   100%
            );
          }
          @media (max-width: 950px) {
            .hero-wrapper {
              background: linear-gradient(90deg,
                rgba(37,99,235,0.25) 0%,
                rgba(37,99,235,0) 25%,
                rgba(37,99,235,0) 75%,
                rgba(37,99,235,0.25) 100%
              );
            }
          }
        `}</style>
        <div className="hero-wrapper">
          
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
          
          <div
            aria-hidden
            className="hidden md:block"
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

          <div
            aria-hidden
            style={{
              pointerEvents: "none",
              position: "absolute",
              inset: 0,
              zIndex: 0,
              backgroundImage: "radial-gradient(rgba(255,255,255,0.040) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
              
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

        <PerksSection spotsRemaining={stats.spotsRemaining} />
        <FeaturesSection />
        <Footer />
      </div>
    </>
  );
}
