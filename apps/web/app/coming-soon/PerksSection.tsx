"use client";

import { useEffect, useRef } from "react";

const perks = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accentColor: "#3B82F6",
    accentDim: "rgba(59,130,246,0.08)",
    accentBorder: "rgba(59,130,246,0.18)",
    badge: "All members",
    title: "Founding Member Badge",
    desc: "A badge locked to your profile forever — only the first wave gets this. It marks you as an original.",
    detail: "Permanent · Never offered again",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accentColor: "rgba(255,255,255,0.70)",
    accentDim: "rgba(255,255,255,0.03)",
    accentBorder: "rgba(255,255,255,0.08)",
    badge: "First 500 only",
    title: "3 Months Pro Free",
    desc: "The full premium experience — AI coaching, advanced analytics, unlimited plans — for 3 months, on us.",
    detail: "Valued at $89.97",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accentColor: "rgba(255,255,255,0.70)",
    accentDim: "rgba(255,255,255,0.03)",
    accentBorder: "rgba(255,255,255,0.08)",
    badge: "All members",
    title: "Priority Day-1 Access",
    desc: "Skip the launch queue entirely. You get in on Day 1, before anyone else. No waiting, no delays.",
    detail: "Day 1 · No queue",
  },
];

interface PerksProps {
  spotsRemaining: number;
}

export default function PerksSection({ spotsRemaining }: PerksProps) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.10 }
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  // Spotlight mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll<HTMLElement>(".perk-spotlight");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
      });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const pctUsed = Math.round(((500 - spotsRemaining) / 500) * 100);

  return (
    <section
      id="perks"
      style={{
        padding: "6rem 1.5rem",
        maxWidth: "1160px",
        margin: "0 auto",
        width: "100%",
        position: "relative",
      }}
    >
      <div className="section-divider" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />

      {/* Section header */}
      <div ref={headerRef} className="reveal" style={{ textAlign: "center", marginBottom: "4rem" }}>

        {/* Eyebrow */}
        <div
          className="glass-blue"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 16px",
            borderRadius: "100px",
            fontSize: "0.6875rem",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
            color: "var(--arc-blue)",
            marginBottom: "1.5rem",
          }}
        >
          <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--arc-blue)", display: "inline-block" }} />
          Founding Member Perks
        </div>

        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(2.25rem, 4vw, 4rem)",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            lineHeight: 1.02,
            color: "#FFFFFF",
            marginBottom: "1.25rem",
          }}
        >
          Join early.{" "}
          <span
            style={{
              background: "linear-gradient(130deg, #93C5FD 0%, #3B82F6 60%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Get rewarded forever.
          </span>
        </h2>

        <p
          style={{
            color: "#8B96A5",
            fontSize: "1.0625rem",
            maxWidth: "480px",
            margin: "0 auto 2.5rem",
            lineHeight: 1.65,
            letterSpacing: "-0.01em",
          }}
        >
          These perks lock in the moment you join — and disappear the moment we hit capacity.
        </p>

        {/* Scarcity counter */}
        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            padding: "20px 32px",
            background: "rgba(245,158,11,0.05)",
            border: "1px solid rgba(245,158,11,0.18)",
            borderRadius: "20px",
            minWidth: "280px",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span style={{
              fontSize: "2.5rem", fontWeight: 500,
              color: "#F59E0B", letterSpacing: "-0.035em",
              fontFamily: "'Space Grotesk', monospace",
            }}>
              {spotsRemaining}
            </span>
            <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", fontWeight: 400 }}>
              / 500 Pro spots left
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ width: "100%", height: "3px", background: "rgba(255,255,255,0.07)", borderRadius: "100px", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${pctUsed}%`,
                background: "linear-gradient(90deg, #F59E0B, #FCD34D)",
                borderRadius: "100px",
                transition: "width 1s ease",
              }}
            />
          </div>

          <p style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.32)", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
            {pctUsed}% claimed · closes at 500
          </p>
        </div>
      </div>

      {/* Surgical Ambient Bleed behind the cards */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "60%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: "1000px",
          height: "600px",
          background: "radial-gradient(ellipse at center, rgba(37,99,235,0.05) 0%, transparent 60%)",
          filter: "blur(80px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Perk cards */}
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
            className={`reveal reveal-delay-${i + 1} perks-spotlight perk-spotlight`}
            style={{
              padding: "2.25rem 2rem",
              display: "flex",
              flexDirection: "column",
              gap: "0",
              backdropFilter: "blur(48px)",
              WebkitBackdropFilter: "blur(48px)",
              minHeight: "260px",
              justifyContent: "space-between",
            }}
          >
            <div style={{ position: "relative", zIndex: 2 }}>
              {/* Icon */}
              <div
                style={{
                  width: "48px", height: "48px", borderRadius: "14px",
                  background: perk.accentDim,
                  border: `1px solid ${perk.accentBorder}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: perk.accentColor,
                  marginBottom: "1.25rem",
                }}
              >
                {perk.icon}
              </div>

              {/* Badge */}
              <div
                style={{
                  display: "inline-flex",
                  padding: "3px 10px",
                  borderRadius: "100px",
                  background: perk.accentDim,
                  border: `1px solid ${perk.accentBorder}`,
                  fontSize: "0.625rem",
                  fontWeight: 600,
                  letterSpacing: "0.09em",
                  textTransform: "uppercase" as const,
                  color: perk.accentColor,
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
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                {perk.title}
              </h3>

              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#8B96A5",
                  lineHeight: 1.6,
                  letterSpacing: "-0.005em",
                }}
              >
                {perk.desc}
              </p>
            </div>

            {/* Bottom detail line */}
            <div
              style={{
                position: "relative", zIndex: 2,
                marginTop: "1.75rem",
                paddingTop: "1rem",
                borderTop: `1px solid ${perk.accentBorder}`,
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.32)",
                letterSpacing: "0.03em",
              }}
            >
              {perk.detail}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
