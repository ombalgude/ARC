"use client";
import React from "react";

import { motion, useMotionValue, useMotionTemplate } from "framer-motion";

const perks = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accentColor: "#F59E0B",
    accentDim: "rgba(245,158,11,0.1)",
    title: "3 Months Pro. Zero Cost.",
    desc: "Full access to ARC's intelligent training engine. Reserved for the first 100 users.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accentColor: "#10B981",
    accentDim: "rgba(16,185,129,0.1)",
    title: "Priority Waitlist Access",
    desc: "Every friend you invite moves you 5 spots up the waitlist. Get early access before the general public.",
  },
];

interface PerksProps {
  spotsRemaining: number;
}

export default function PerksSection({ spotsRemaining }: PerksProps): React.JSX.Element | Promise<React.JSX.Element> {
  const passesLeft = Math.min(100, Math.max(0, spotsRemaining));
  const pctUsed = Math.min(100, Math.max(0, Math.round(((100 - passesLeft) / 100) * 100)));
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <section
      id="perks"
      className="perks-section"
      style={{
        padding: "1rem 1.5rem 5rem 1.5rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        background: "#000000",
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .perks-section {
            padding: 4rem 1rem !important;
          }
        }
      `}</style>
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: "1000px",
          height: "600px",
          background: "radial-gradient(ellipse at center, rgba(59,130,246,0.06) 0%, transparent 60%)",
          filter: "blur(80px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        onMouseMove={handleMouseMove}
        className="group"
        style={{
          width: "100%",
          maxWidth: "1100px",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          background: "#030303",
          borderRadius: "32px",
          border: "1px solid rgba(255,255,255,0.12)",
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                800px circle at ${mouseX}px ${mouseY}px,
                rgba(255,255,255,0.04),
                transparent 80%
              )
            `,
            zIndex: 1,
          }}
        />

        {/* Left Side: The Hook & Scarcity */}
        <div 
          style={{ 
            flex: "1 1 450px", 
            padding: "clamp(3rem, 5vw, 5rem)", 
            position: "relative", 
            zIndex: 2, 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "space-between",
            gap: "4rem",
          }}
        >
          <div>
            <div
              className="glass-blue"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 20px",
                borderRadius: "100px",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color: "var(--arc-blue)",
                marginBottom: "2rem",
              }}
            >
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--arc-blue)", display: "inline-block" }} />
              Early Access
            </div>

            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                fontWeight: 500,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                color: "#FFFFFF",
                marginBottom: "1.5rem",
              }}
            >
              The First 100{" "}
              <span
                style={{
                  background: "linear-gradient(130deg, #FDE68A 0%, #F59E0B 60%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Get It All.
              </span>
            </h2>
            <p
              style={{
                color: "#8B96A5",
                fontSize: "1.125rem",
                lineHeight: 1.6,
                letterSpacing: "-0.01em",
              }}
            >
              We are giving 3 months of Pro access for free to our first 100 users. Secure your spot on the waitlist now.
            </p>
          </div>

          <div
            style={{
              padding: "2rem",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(245,158,11,0.15)",
              borderRadius: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "1rem" }}>
              <span style={{
                fontSize: "3.5rem", fontWeight: 500,
                color: "#F59E0B",
                letterSpacing: "-0.05em",
                fontFamily: "'Space Grotesk', monospace",
                lineHeight: 0.9,
              }}>
                {passesLeft}
              </span>
              <span style={{ fontSize: "1rem", color: "rgba(255,255,255,0.4)", fontWeight: 500, letterSpacing: "-0.01em" }}>
                spots left
              </span>
            </div>

            <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "100px", overflow: "hidden", marginBottom: "0.75rem" }}>
              <div
                style={{
                  height: "100%",
                  width: `${pctUsed}%`,
                  background: "#F59E0B",
                  borderRadius: "100px",
                  boxShadow: "0 0 10px rgba(245,158,11,0.5)",
                }}
              />
            </div>

            <p style={{ fontSize: "0.75rem", color: "rgba(245,158,11,0.8)", letterSpacing: "0.1em", textTransform: "uppercase" as const, fontWeight: 600 }}>
              {pctUsed}% claimed · Closes permanently at 100 spots
            </p>
          </div>
        </div>

        {/* The Perforation (Desktop: Vertical, Mobile: Horizontal) */}
        {/* Desktop Vertical Perforation */}
        <div 
          className="hidden md:block" 
          style={{ 
            width: "2px", 
            background: "linear-gradient(to bottom, transparent 50%, rgba(255,255,255,0.1) 50%)",
            backgroundSize: "2px 16px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ position: "absolute", top: "-16px", left: "-15px", width: "32px", height: "32px", borderRadius: "50%", background: "#000000", borderBottom: "1px solid rgba(255,255,255,0.12)" }} />
          <div style={{ position: "absolute", bottom: "-16px", left: "-15px", width: "32px", height: "32px", borderRadius: "50%", background: "#000000", borderTop: "1px solid rgba(255,255,255,0.12)" }} />
        </div>

        {/* Mobile Horizontal Perforation */}
        <div 
          className="block md:hidden" 
          style={{ 
            height: "2px",
            width: "100%", 
            background: "linear-gradient(to right, transparent 50%, rgba(255,255,255,0.1) 50%)",
            backgroundSize: "16px 2px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ position: "absolute", left: "-16px", top: "-15px", width: "32px", height: "32px", borderRadius: "50%", background: "#000000", borderRight: "1px solid rgba(255,255,255,0.12)" }} />
          <div style={{ position: "absolute", right: "-16px", top: "-15px", width: "32px", height: "32px", borderRadius: "50%", background: "#000000", borderLeft: "1px solid rgba(255,255,255,0.12)" }} />
        </div>

        {/* Right Side: The Perks List */}
        <div 
          style={{ 
            flex: "1 1 450px", 
            padding: "clamp(1.5rem, 5vw, 5rem)", 
            position: "relative", 
            zIndex: 2, 
            background: "rgba(255,255,255,0.02)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h3 
            style={{ 
              textTransform: "uppercase", 
              letterSpacing: "0.15em", 
              color: "rgba(255,255,255,0.3)", 
              marginBottom: "3rem", 
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            What early members keep forever
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {perks.map((perk, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem" }}>
                <div
                  style={{
                    width: "48px", height: "48px", borderRadius: "12px",
                    background: perk.accentDim,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: perk.accentColor,
                    flexShrink: 0,
                  }}
                >
                  {perk.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: "1.125rem", fontWeight: 500, color: "#FFFFFF", marginBottom: "0.25rem", letterSpacing: "-0.01em" }}>
                    {perk.title}
                  </h4>
                  <p style={{ fontSize: "0.875rem", color: "#8B96A5", lineHeight: 1.5 }}>
                    {perk.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
