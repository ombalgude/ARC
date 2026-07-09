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
    title: "Early Access Badge",
    desc: "A permanent badge on your profile showing you were here first.",
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
    desc: "Strictly limited to the first 500 people who join.",
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
    title: "Priority Access",
    desc: "Skip the line and get the app on day one.",
    detail: "Day 1 · No queue",
  },
];

interface PerksProps {
  spotsRemaining: number;
}

export default function PerksSection({ spotsRemaining }: PerksProps) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);

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

      <div ref={headerRef} className="reveal" style={{ textAlign: "center", marginBottom: "4rem" }}>

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
          Early Access Perks
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
          The First 500{" "}
          <span
            style={{
              background: "linear-gradient(130deg, #93C5FD 0%, #3B82F6 60%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Get Pro Free.
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

        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            padding: "24px 40px",
            background: "linear-gradient(160deg, rgba(245,158,11,0.15) 0%, rgba(4,5,15,0.9) 100%)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(245,158,11,0.25)",
            boxShadow: "0 24px 48px -12px rgba(0,0,0,0.8), 0 0 30px rgba(245,158,11,0.1), inset 0 1px 1px rgba(255,255,255,0.1)",
            borderRadius: "24px",
            minWidth: "320px",
            position: "relative",
            overflow: "hidden"
          }}
        >
          
          <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent)" }} />
          
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
            <span style={{
              fontSize: "3.5rem", fontWeight: 700,
              background: "linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.04em",
              fontFamily: "'Space Grotesk', monospace",
              filter: "drop-shadow(0 4px 16px rgba(245,158,11,0.4))"
            }}>
              {spotsRemaining}
            </span>
            <span style={{ fontSize: "1rem", color: "rgba(255,255,255,0.5)", fontWeight: 500, letterSpacing: "-0.01em" }}>
              / 500 Pro spots left
            </span>
          </div>

          <div style={{ width: "100%", height: "4px", background: "rgba(0,0,0,0.6)", borderRadius: "100px", overflow: "hidden", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.8)" }}>
            <div
              style={{
                height: "100%",
                width: `${pctUsed}%`,
                background: "linear-gradient(90deg, #F59E0B, #FDE68A)",
                boxShadow: "0 0 12px rgba(245,158,11,0.8)",
                borderRadius: "100px",
                transition: "width 1.5s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </div>

          <p style={{ fontSize: "0.75rem", color: "#FCD34D", letterSpacing: "0.1em", textTransform: "uppercase" as const, fontWeight: 600 }}>
            {pctUsed}% claimed · closes at 500
          </p>
        </div>
      </div>

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
