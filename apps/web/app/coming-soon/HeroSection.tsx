"use client";

import { useEffect, useRef, useState } from "react";
import ConfirmationScreen from "./ConfirmationScreen";
import WaitlistForm from "./WaitlistForm";

interface HeroProps {
  initialCount: number;
  referralCode?: string;
}

interface SignupResult {
  position: number;
  referralCode: string;
  totalCount: number;
  alreadyRegistered?: boolean;
}

export default function HeroSection({ initialCount, referralCode }: HeroProps) {
  const [count, setCount] = useState(initialCount);
  const [confirmed, setConfirmed] = useState<SignupResult | null>(null);
  const countRef = useRef(initialCount);

  // Slowly auto-increment counter for live social proof feel
  useEffect(() => {
    const tick = () => {
      const delay = Math.random() * 18000 + 9000;
      const t = setTimeout(() => {
        countRef.current += 1;
        setCount(countRef.current);
        tick();
      }, delay);
      return t;
    };
    const timer = tick();
    return () => clearTimeout(timer);
  }, []);

  function handleSuccess(data: SignupResult) {
    setCount(data.totalCount);
    setConfirmed(data);
  }

  return (
    <section
      id="waitlist"
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        padding: "2.5rem 1.5rem 3rem",
        overflow: "hidden",
        background: "#000000",
      }}
    >
      {/* ── Impeccable Static Background Glows ── */}
      {/* Top-center — Electric Blue ambient (very subtle) */}
      <div style={{
        position: "absolute", top: "-15%", left: "50%", transform: "translateX(-50%)",
        width: "800px", height: "800px",
        background: "radial-gradient(ellipse at center, rgba(59,130,246,0.10) 0%, transparent 65%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Bottom-left — deep accent */}
      <div style={{
        position: "absolute", bottom: 0, left: "5%",
        width: "400px", height: "400px",
        background: "radial-gradient(ellipse at center, rgba(59,130,246,0.04) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* ── Two-Column Grid Layout ── */}
      <div style={{
        position: "relative", zIndex: 1,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", /* Fixed mobile overflow */
        gap: "clamp(3rem, 6vw, 5rem)",
        alignItems: "center",
        maxWidth: "1200px",
        width: "100%",
        margin: "0 auto",
      }}>

        {/* ── Left Column: Copy & Waitlist ── */}
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "flex-start",
          textAlign: "left",
          width: "100%"
        }}>
          {/* Launch badge */}
          <div
            className="glass-blue animate-fade-up opacity-0-init"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "6px 18px", borderRadius: "100px",
              fontSize: "0.6875rem", fontWeight: 500,
              letterSpacing: "0.08em", textTransform: "uppercase" as const,
              color: "var(--arc-blue)", marginBottom: "1rem",
            }}
          >
            <span className="animate-pulse-dot" style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "var(--arc-blue)", display: "inline-block", flexShrink: 0,
            }} />
            Coming soon on Play Store
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(3rem, 5vw, 5rem)",
              fontWeight: 500,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "#FFFFFF",
              marginBottom: "1rem",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            <span className="text-reveal-wrapper">
              <span className="text-reveal-inner delay-100">The fitness app that</span>
            </span>
            <br />
            <span className="text-reveal-wrapper">
              <span className="text-reveal-inner delay-300" style={{
                background: "linear-gradient(135deg, #ffffff 0%, #BFDBFE 40%, #3B82F6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                paddingBottom: "0.2em",
              }}>
                thinks like a coach.
              </span>
            </span>
          </h1>

          {/* Subtext */}
          <p
            className="animate-fade-in opacity-0-init delay-600"
            style={{
              fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.65)",
              maxWidth: "520px",
              marginBottom: "1.5rem",
              letterSpacing: "-0.01em",
            }}
          >
            ARC adapts your workouts, builds lasting habits, and tracks your nutrition — all powered by AI that learns from you, not at you.
          </p>

          {/* Waitlist form or confirmation */}
          <div
            className="animate-fade-up opacity-0-init delay-800"
            style={{ width: "100%", maxWidth: "480px", marginBottom: "1.25rem" }}
          >
            {confirmed ? (
              <ConfirmationScreen
                position={confirmed.position}
                referralCode={confirmed.referralCode}
                totalCount={confirmed.totalCount}
                alreadyRegistered={confirmed.alreadyRegistered}
              />
            ) : (
              <WaitlistForm
                onSuccess={handleSuccess}
                initialCount={initialCount}
                referralCode={referralCode}
              />
            )}
          </div>

          {/* Social proof counter */}
          {!confirmed && (
            <div
              className="animate-fade-in opacity-0-init delay-1000"
              style={{
                display: "flex", alignItems: "center", gap: "0.875rem",
                fontSize: "0.8125rem", color: "rgba(255,255,255,0.38)",
              }}
            >
              {/* Stacked avatars */}
              <div style={{ display: "flex" }}>
                {["#3B82F6","#22C55E","#F59E0B","#8B5CF6","#EF4444"].map((bg, i) => (
                  <div key={i} style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: bg, border: "2px solid #000000",
                    marginLeft: i > 0 ? "-9px" : "0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "10px", fontWeight: 600, color: "#fff",
                  }}>
                    {["A","J","S","M","K"][i]}
                  </div>
                ))}
              </div>
              <span>
                <strong style={{ color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
                  {count.toLocaleString()}+
                </strong>{" "}
                ambitious people already waiting
              </span>
            </div>
          )}
        </div>

        {/* ── Right Column: Floating Phone Mockup ── */}
        {!confirmed && (
          <div
            className="animate-fade-in opacity-0-init delay-1000"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              width: "100%",
              paddingLeft: "clamp(1rem, 4vw, 4rem)", /* Nudges it slightly right to fix visual alignment */
              perspective: "1200px", /* Prepares it for a 3D tilt if you meant perspective */
            }}
          >
            {/* Diffused glow behind phone */}
            <div style={{
              position: "absolute",
              width: "80%", height: "80%",
              background: "radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.25) 0%, transparent 70%)",
              filter: "blur(32px)", borderRadius: "50%", pointerEvents: "none",
            }} />

            {/* ── 3D Rotation Wrapper ── */}
            <div style={{
              transform: "rotateY(-15deg) rotateX(5deg)",
              transformStyle: "preserve-3d",
              transition: "transform 0.5s ease-out"
            }}>
              {/* Phone shell with floating animation */}
              <div className="animate-float" style={{
                position: "relative",
                width: "240px", height: "498px", /* Scaled down further to prevent vertical overflow */
                borderRadius: "40px", overflow: "hidden",
                background: "linear-gradient(160deg, #08091A 0%, #020310 100%)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 60px 120px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.05), inset 0 2px 4px rgba(255,255,255,0.15)",
              }}>
              {/* Dynamic island */}
              <div style={{
                position: "absolute", top: "14px", left: "50%", transform: "translateX(-50%)",
                width: "90px", height: "28px", background: "#000",
                borderRadius: "100px", zIndex: 10,
                boxShadow: "inset 0 -1px 2px rgba(255,255,255,0.1)"
              }} />

              {/* Screen UI */}
              <div style={{ padding: "52px 16px 18px", display: "flex", flexDirection: "column", gap: "12px", height: "100%" }}>
                
                {/* Status line */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", letterSpacing: "-0.01em", fontWeight: 500 }}>9:41</p>
                  <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                    {[4,3,4].map((h, i) => (
                      <div key={i} style={{ width: "3px", height: `${h}px`, background: "rgba(255,255,255,0.5)", borderRadius: "2px" }} />
                    ))}
                  </div>
                </div>

                {/* Greeting */}
                <div style={{ marginBottom: "2px" }}>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginBottom: "2px" }}>Good morning, Alex</p>
                  <h2 style={{ fontSize: "1.375rem", fontWeight: 500, color: "#fff", letterSpacing: "-0.02em" }}>Today&apos;s Plan</h2>
                </div>

                {/* AI Insight pill */}
                <div style={{
                  background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)",
                  borderRadius: "14px", padding: "14px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                    <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#3B82F6", boxShadow: "0 0 8px #3B82F6" }} />
                    <p style={{ fontSize: "9px", color: "#3B82F6", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>AI Insight</p>
                  </div>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)", lineHeight: 1.45, letterSpacing: "-0.01em" }}>
                    Recovery score 87 — push strength today, your body is primed.
                  </p>
                </div>

                {/* Metric grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {[
                    { label: "Streak", value: "14d", color: "#F59E0B" },
                    { label: "Calories", value: "1,840", color: "#22C55E" },
                    { label: "Workouts", value: "3/4", color: "#3B82F6" },
                    { label: "Sleep", value: "7.5h", color: "#8B5CF6" },
                  ].map((m) => (
                    <div key={m.label} style={{
                      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px", padding: "10px",
                    }}>
                      <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", marginBottom: "4px", letterSpacing: "0.04em", textTransform: "uppercase" }}>{m.label}</p>
                      <p style={{ fontSize: "1.125rem", fontWeight: 500, color: m.color, letterSpacing: "-0.02em" }}>{m.value}</p>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>Weekly goal</span>
                    <span style={{ fontSize: "10px", color: "#3B82F6", fontWeight: 600 }}>75%</span>
                  </div>
                  <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "100px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: "75%", background: "linear-gradient(90deg, #3B82F6, #93C5FD)", borderRadius: "100px" }} />
                  </div>
                </div>

                {/* Mini workout card */}
                <div style={{
                  marginTop: "auto",
                  background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.18)",
                  borderRadius: "12px", padding: "12px 14px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: 500, color: "#fff", letterSpacing: "-0.01em" }}>Push Day A</p>
                    <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.45)", marginTop: "4px" }}>52 min · 6 exercises</p>
                  </div>
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: "#3B82F6",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(59,130,246,0.4)"
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                      <path d="M5 3l14 9-14 9V3z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
