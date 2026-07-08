"use client";

import { useEffect, useRef } from "react";

const perks = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    badge: "All members",
    badgeColor: "rgba(59,130,246,0.12)",
    badgeBorder: "rgba(59,130,246,0.25)",
    badgeText: "#3B82F6",
    title: "Founding Member Badge",
    desc: "A badge locked to your profile forever — only the first wave gets this. It marks you as an original.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    badge: "First 500 only",
    badgeColor: "rgba(34,197,94,0.10)",
    badgeBorder: "rgba(34,197,94,0.25)",
    badgeText: "#22C55E",
    title: "3 Months Pro Free",
    desc: "The full premium experience — AI coaching, advanced analytics, unlimited plans — for 3 months, on us.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    badge: "All members",
    badgeColor: "rgba(245,158,11,0.10)",
    badgeBorder: "rgba(245,158,11,0.25)",
    badgeText: "#F59E0B",
    title: "Priority Day-1 Access",
    desc: "Skip the launch queue entirely. You get in on Day 1, before anyone else. No waiting, no delays.",
  },
];

interface PerksProps {
  spotsRemaining: number;
}

export default function PerksSection({ spotsRemaining }: PerksProps) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.12 }
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Spotlight mouse tracking effect for cards
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll(".perks-spotlight");
      cards.forEach((card) => {
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (card as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
        (card as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      id="perks"
      style={{
        padding: "4rem 1.5rem",
        maxWidth: "1100px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
        <div
          className="reveal glass-blue"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 18px",
            borderRadius: "100px",
            fontSize: "0.75rem",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
            color: "var(--arc-blue)",
            marginBottom: "1.25rem",
          }}
        >
          Founding Member Perks
        </div>

        <h2
          className="reveal"
          style={{
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            color: "#FFFFFF",
            marginBottom: "1.25rem",
          }}
        >
          Join the waitlist.{" "}
          <span className="text-gradient-blue">Get rewarded forever.</span>
        </h2>

        <p
          className="reveal"
          style={{ color: "var(--arc-text-secondary)", fontSize: "1.125rem", maxWidth: "540px", margin: "0 auto 2rem", lineHeight: 1.6 }}
        >
          These perks lock in the moment you join — and disappear the moment we hit capacity.
        </p>

        {/* Spots remaining counter */}
        <div
          className="reveal"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 24px",
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.22)",
            borderRadius: "100px",
          }}
        >
          <span style={{ color: "#F59E0B", fontSize: "1.25rem", fontWeight: 600 }}>
            {spotsRemaining}
          </span>
          <span style={{ color: "var(--arc-text-secondary)", fontSize: "0.875rem", fontWeight: 500 }}>
            Pro spots remaining out of 500
          </span>
        </div>
      </div>

      {/* Perk cards — Google Flow hover dimming + Spotlight */}
      <div
        className="cards-dim-siblings"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {perks.map((perk, i) => (
          <div
            key={perk.title}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="reveal card-spotlight-wrapper perks-spotlight"
            style={{
              padding: "2.5rem 2rem",
              animationDelay: `${i * 0.15}s`,
              display: "flex",
              flexDirection: "column",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)"
            }}
          >
            {/* Icon */}
            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ marginBottom: "1.5rem" }}>{perk.icon}</div>

            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                padding: "3px 12px",
                borderRadius: "100px",
                background: perk.badgeColor,
                border: `1px solid ${perk.badgeBorder}`,
                fontSize: "0.6875rem",
                fontWeight: 500,
                letterSpacing: "0.05em",
                textTransform: "uppercase" as const,
                color: perk.badgeText,
                marginBottom: "1rem",
              }}
            >
              {perk.badge}
            </div>

            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: 500,
                color: "#FFFFFF",
                marginBottom: "0.625rem",
                letterSpacing: "-0.01em",
              }}
            >
              {perk.title}
            </h3>
            <p style={{ fontSize: "0.875rem", color: "var(--arc-text-secondary)", lineHeight: 1.6 }}>
              {perk.desc}
            </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
