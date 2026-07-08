"use client";

import { useEffect, useRef } from "react";

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accentColor: "#3B82F6",
    tag: "AI-Powered",
    title: "AI Workout Engine",
    desc: "Adaptive workout splits built by your personal AI coach. Adjusts every single week based on your actual performance.",
    isHero: true,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#22C55E" strokeWidth="1.5"/>
        <path d="M12 6v6l4 2" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accentColor: "#22C55E",
    tag: "Science",
    title: "Habit Intelligence",
    desc: "Visual streaks, smart nudges, and 2-day rule protection to build unbreakable consistency.",
    isHero: false,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M18 20V10M12 20V4M6 20v-6" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accentColor: "#F59E0B",
    tag: "Nutrition",
    title: "Macro Clarity",
    desc: "Dynamic macro targets that shift with your training intensity and body feedback.",
    isHero: false,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accentColor: "#8B5CF6",
    tag: "Recovery",
    title: "Readiness Score",
    desc: "Know exactly when to push your limits and when to take a rest day, powered by biometric analysis.",
    isHero: true,
  }
];

export default function FeaturesSection() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for scroll reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Spotlight mouse tracking effect on the grid
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll(".card-spotlight-wrapper");
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
      id="features"
      style={{
        padding: "4rem 1.5rem",
        maxWidth: "1100px",
        margin: "0 auto",
        width: "100%",
        position: "relative"
      }}
    >
      <div className="section-divider" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />

      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: "5rem" }}>
        <div
          className="reveal glass-blue"
          style={{
            display: "inline-flex",
            padding: "8px 20px",
            borderRadius: "100px",
            fontSize: "0.75rem",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
            color: "var(--arc-blue)",
            marginBottom: "1.5rem",
          }}
        >
          Core Intelligence
        </div>

        <h2
          className="reveal text-section"
          style={{
            color: "#FFFFFF",
            marginBottom: "1.25rem",
          }}
        >
          Train smarter.{" "}
          <span className="text-gradient-blue">Not harder.</span>
        </h2>

        <p
          className="reveal"
          style={{ color: "var(--arc-text-secondary)", fontSize: "1.125rem", maxWidth: "500px", margin: "0 auto", lineHeight: 1.6 }}
        >
          Four pillars of elite performance, unified in one beautifully engineered system.
        </p>
      </div>

      {/* Bento Grid with Spotlight Effect */}
      <div className="bento-grid cards-dim-siblings" ref={gridRef}>
        {features.map((feature, i) => (
          <div
            key={feature.title}
            ref={(el) => { cardRefs.current[i] = el; }}
            className={`reveal card-spotlight-wrapper ${feature.isHero ? 'bento-hero' : ''}`}
            style={{
              padding: "3rem 2.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0",
              animationDelay: `${i * 0.15}s`,
              minHeight: "260px",
              justifyContent: "space-between",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)"
            }}
          >
            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
                <div style={{
                  width: "56px", height: "56px", borderRadius: "16px",
                  background: `${feature.accentColor}12`,
                  border: `1px solid ${feature.accentColor}25`,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {feature.icon}
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    padding: "6px 14px",
                    borderRadius: "100px",
                    background: `${feature.accentColor}10`,
                    border: `1px solid ${feature.accentColor}25`,
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase" as const,
                    color: feature.accentColor,
                  }}
                >
                  {feature.tag}
                </div>
              </div>

              <h3 className="text-card-title" style={{ color: "#FFFFFF", marginBottom: "0.75rem", fontSize: "1.375rem" }}>
                {feature.title}
              </h3>
            </div>
            
            <p style={{ position: "relative", zIndex: 2, fontSize: "1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}>
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
