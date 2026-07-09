"use client";

import { useEffect, useRef } from "react";

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accentColor: "#3B82F6",
    accentDim: "rgba(59,130,246,0.08)",
    accentBorder: "rgba(59,130,246,0.18)",
    tag: "AI-Powered",
    title: "Workouts built just for you",
    desc: "Leave the guesswork at the door. ARC builds your weekly training plan based on your exact goals and experience. It tells you exactly what to do to build muscle or lose fat. You just show up and put in the work.",
    stat: { value: "40%", label: "faster progression" },
    isHero: true,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accentColor: "rgba(255,255,255,0.70)",
    accentDim: "rgba(255,255,255,0.03)",
    accentBorder: "rgba(255,255,255,0.08)",
    tag: "Science",
    title: "Build unstoppable momentum",
    desc: "Great results come from daily habits. Log your sleep, water, and steps in seconds. Our smart streak system keeps you hooked, motivated, and moving forward every single day.",
    stat: { value: "3×", label: "habit retention" },
    isHero: false,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accentColor: "rgba(255,255,255,0.70)",
    accentDim: "rgba(255,255,255,0.03)",
    accentBorder: "rgba(255,255,255,0.08)",
    tag: "Nutrition",
    title: "Perfect your nutrition",
    desc: "Fuel your body the right way. ARC calculates exactly how many calories, protein, and fats you need to hit your goals. No more guessing—just clear daily targets that actually work.",
    stat: { value: "100%", label: "macro precision" },
    isHero: false,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accentColor: "rgba(255,255,255,0.70)",
    accentDim: "rgba(255,255,255,0.03)",
    accentBorder: "rgba(255,255,255,0.08)",
    tag: "AI Chat",
    title: "Your 24/7 fitness coach",
    desc: "Get instant answers to your training and nutrition questions. Our AI companion provides real-time exercise tips and guidance exactly when you need it.",
    stat: { value: "24/7", label: "instant guidance" },
    isHero: true,
  },
];

export default function FeaturesSection() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

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
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll<HTMLElement>(".feature-spotlight");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
      });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      style={{
        padding: "6rem 1.5rem 8rem",
        maxWidth: "1160px",
        margin: "0 auto",
        width: "100%",
        position: "relative",
      }}
    >
      <div className="section-divider" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />

      <div style={{ textAlign: "center", marginBottom: "5rem" }}>

        <div
          className="reveal glass-blue"
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
          <span style={{
            width: "4px", height: "4px", borderRadius: "50%",
            background: "var(--arc-blue)", display: "inline-block",
          }} />
          Core Intelligence
        </div>

        <h2
          className="reveal"
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
          Train smarter.{" "}
          <span
            style={{
              background: "linear-gradient(130deg, #93C5FD 0%, #3B82F6 60%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Not harder.
          </span>
        </h2>

        <p
          className="reveal"
          style={{
            color: "#8B96A5",
            fontSize: "1.0625rem",
            maxWidth: "480px",
            margin: "0 auto",
            lineHeight: 1.65,
            letterSpacing: "-0.01em",
          }}
        >
          Four pillars of elite performance, unified in one beautifully engineered system.
        </p>
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

      <div className="bento-grid cards-dim-siblings">
        {features.map((feature, i) => (
          <div
            key={feature.title}
            ref={(el) => { cardRefs.current[i] = el; }}
            className={`reveal reveal-delay-${i + 1} card-spotlight-wrapper feature-spotlight ${feature.isHero ? "bento-hero" : ""}`}
            style={{
              padding: "clamp(2rem, 3vw, 2.75rem)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: feature.isHero ? "300px" : "270px",
              backdropFilter: "blur(48px)",
              WebkitBackdropFilter: "blur(48px)",
              
            }}
          >
            
            <div style={{ position: "relative", zIndex: 2 }}>
              
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "1.75rem",
              }}>
                
                <div style={{
                  width: "48px", height: "48px",
                  borderRadius: "14px",
                  background: feature.accentDim,
                  border: `1px solid ${feature.accentBorder}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: feature.accentColor,
                }}>
                  {feature.icon}
                </div>

                <div
                  style={{
                    padding: "5px 12px",
                    borderRadius: "100px",
                    background: feature.accentDim,
                    border: `1px solid ${feature.accentBorder}`,
                    fontSize: "0.625rem",
                    fontWeight: 600,
                    letterSpacing: "0.09em",
                    textTransform: "uppercase" as const,
                    color: feature.accentColor,
                  }}
                >
                  {feature.tag}
                </div>
              </div>

              <h3
                style={{
                  fontSize: "1.3125rem",
                  fontWeight: 500,
                  color: "#FFFFFF",
                  marginBottom: "0.625rem",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                {feature.title}
              </h3>

              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#8B96A5",
                  lineHeight: 1.6,
                  letterSpacing: "-0.01em",
                }}
              >
                {feature.desc}
              </p>
            </div>

            <div
              style={{
                position: "relative",
                zIndex: 2,
                marginTop: "2rem",
                paddingTop: "1.25rem",
                borderTop: `1px solid ${feature.accentBorder}`,
                display: "flex",
                alignItems: "baseline",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 500,
                  color: feature.accentColor,
                  letterSpacing: "-0.03em",
                }}
              >
                {feature.stat.value}
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.02em",
                }}
              >
                {feature.stat.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
