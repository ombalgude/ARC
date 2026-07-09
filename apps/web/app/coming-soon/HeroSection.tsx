"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
  const [showModal, setShowModal] = useState(false);
  const countRef = useRef(initialCount);

  // Phone 3D parallax
  const phoneRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const lerpRef = useRef({ x: 0.5, y: 0.5 });

  // Slowly auto-increment counter
  useEffect(() => {
    const tick = () => {
      const delay = Math.random() * 16000 + 8000;
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

  // Cursor-tracking phone 3D tilt
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    window.addEventListener("mousemove", handleMove, { passive: true });

    // Lerp animation loop for phone
    const loop = () => {
      lerpRef.current.x += (mouseRef.current.x - lerpRef.current.x) * 0.06;
      lerpRef.current.y += (mouseRef.current.y - lerpRef.current.y) * 0.06;

      if (phoneRef.current) {
        const rx = (lerpRef.current.y - 0.5) * -18;  // vertical → rotateX
        const ry = (lerpRef.current.x - 0.5) *  22;  // horizontal → rotateY
        phoneRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function handleSuccess(data: SignupResult) {
    setCount(data.totalCount);
    setConfirmed(data);
    setShowModal(true);
  }

  return (
    <section
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100svh",
        padding: "0 1.5rem",
        overflow: "hidden",
        background: "transparent",
      }}
    >



      {/* ── Main Content Grid ── */}
      <div style={{
        position: "relative", zIndex: 1,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "clamp(3rem, 5vw, 6rem)",
        alignItems: "center",
        maxWidth: "1240px",
        width: "100%",
        margin: "0 auto",
        padding: "clamp(5rem, 10vh, 8rem) 0 clamp(4rem, 8vh, 6rem)",
      }}>
        {/* ── LEFT: Copy & Waitlist ── */}
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "flex-start", textAlign: "left",
        }}>

          {/* ── Launch Badge ── */}
          <div
            className="glass-blue animate-fade-up opacity-0-init"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "5px 14px 5px 10px", borderRadius: "100px",
              fontSize: "0.6875rem", fontWeight: 500,
              letterSpacing: "0.07em", textTransform: "uppercase" as const,
              color: "var(--arc-blue)", marginBottom: "2rem",
            }}
          >
            <span className="animate-pulse-dot" style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: "var(--arc-blue)", display: "inline-block", flexShrink: 0,
            }} />
            Now accepting founding members
          </div>

          {/* ── Headline ── */}
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 500,
              letterSpacing: "-0.035em",
              lineHeight: 0.97,
              color: "#FFFFFF",
              marginBottom: "1.75rem",
              fontSize: "clamp(3.25rem, 6.5vw, 7rem)",
            }}
          >
            <span className="text-reveal-wrapper" style={{ display: "block" }}>
              <span className="text-reveal-inner delay-100">The fitness</span>
            </span>
            <span className="text-reveal-wrapper" style={{ display: "block" }}>
              <span className="text-reveal-inner delay-250">app that</span>
            </span>
            <span className="text-reveal-wrapper" style={{ display: "block" }}>
              <span
                className="text-reveal-inner delay-400"
                style={{
                  background: "linear-gradient(130deg, #ffffff 0%, #BFDBFE 45%, #3B82F6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  paddingBottom: "0.15em",
                  display: "inline-block",
                }}
              >
                thinks.
              </span>
            </span>
          </h1>

          {/* ── Subtext ── */}
          <p
            className="animate-fade-in opacity-0-init delay-600"
            style={{
              fontSize: "clamp(1rem, 1.4vw, 1.175rem)",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.58)",
              maxWidth: "500px",
              marginBottom: "2.25rem",
              letterSpacing: "-0.01em",
            }}
          >
            ARC adapts your training weekly, builds compounding habits, and tracks nutrition — powered by AI that evolves with you, not against you.
          </p>

          {/* ── Waitlist Form or Confirmed State ── */}
          <div
            className="animate-fade-up opacity-0-init delay-800"
            style={{ width: "100%", maxWidth: "460px", marginBottom: "1.5rem" }}
          >
            {confirmed ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "rgba(34,197,94,0.04)",
                  border: "1px solid rgba(34,197,94,0.18)",
                  borderRadius: "100px",
                  padding: "0.375rem 0.375rem 0.375rem 1.25rem",
                  width: "100%",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22C55E" }} />
                  <span style={{ fontSize: "0.9375rem", fontWeight: 500, color: "#fff" }}>
                    Spot secured
                  </span>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  style={{
                    background: "var(--arc-blue)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "100px",
                    padding: "0.625rem 1.25rem",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  View Ticket
                </button>
              </div>
            ) : (
              <WaitlistForm
                onSuccess={handleSuccess}
                initialCount={initialCount}
                referralCode={referralCode}
              />
            )}
          </div>

          {/* ── Social Proof Counter ── */}
          {!confirmed && (
            <div
              className="animate-fade-in opacity-0-init delay-1000"
              style={{
                display: "flex", alignItems: "center", gap: "1rem",
                fontSize: "0.8rem", color: "rgba(255,255,255,0.35)",
              }}
            >
              {/* Avatar stack */}
              <div style={{ display: "flex", alignItems: "center" }}>
                {[
                  { bg: "#3B82F6", label: "A" },
                  { bg: "#22C55E", label: "J" },
                  { bg: "#F59E0B", label: "S" },
                  { bg: "#8B5CF6", label: "M" },
                  { bg: "#EF4444", label: "K" },
                ].map((av, i) => (
                  <div
                    key={i}
                    style={{
                      width: "26px", height: "26px", borderRadius: "50%",
                      background: av.bg,
                      border: "2px solid #000",
                      marginLeft: i > 0 ? "-8px" : "0",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "9px", fontWeight: 600, color: "#fff",
                      position: "relative", zIndex: 5 - i,
                    }}
                  >
                    {av.label}
                  </div>
                ))}
              </div>

              <span>
                <strong style={{ color: "rgba(255,255,255,0.80)", fontWeight: 500 }}>
                  {count.toLocaleString()}+
                </strong>
                {" "}founding members waiting
              </span>
            </div>
          )}

          {/* ── Trust signals ── */}
          <div
            className="animate-fade-in opacity-0-init delay-1200"
            style={{
              display: "flex", alignItems: "center", gap: "1.5rem",
              marginTop: "2.5rem",
              paddingTop: "2rem",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              width: "100%", maxWidth: "460px",
            }}
          >
            {[
              { value: "AI", label: "Adaptive Coach" },
              { value: "3×", label: "Faster Results" },
              { value: "0", label: "Generic Plans" },
            ].map((stat, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{
                  fontSize: "1.25rem", fontWeight: 500,
                  color: i === 2 ? "var(--arc-blue)" : "#FFFFFF",
                  letterSpacing: "-0.03em",
                }}>{stat.value}</span>
                <span style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.38)", letterSpacing: "0.04em", textTransform: "uppercase" as const }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Phone Mockup with 3D Parallax ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Soft ambient glow — no visible shape, pure light bleed */}
          <div style={{
            position: "absolute",
            inset: "-30%",
            background: "radial-gradient(ellipse at 50% 55%, rgba(37,99,235,0.30) 0%, rgba(29,78,216,0.10) 45%, transparent 72%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }} />

          {/* 3D Perspective Container */}
          <div className="phone-parallax-container animate-scale-up opacity-0-init delay-500">
            <div
              ref={phoneRef}
              className="phone-parallax-inner"
              style={{
                transform: "rotateX(4deg) rotateY(-14deg)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Phone shell */}
              <div
                style={{
                  position: "relative",
                  width: "260px",
                  height: "540px",
                  borderRadius: "44px",
                  overflow: "hidden",
                  background: "linear-gradient(165deg, #0c0d1e 0%, #04050f 100%)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  boxShadow: [
                    "0 40px 80px rgba(0,0,0,0.60)",
                    "0 0 0 1px rgba(255,255,255,0.06)",
                    "inset 0 1px 0 rgba(255,255,255,0.12)",
                    "inset 0 0 40px rgba(59,130,246,0.05)",
                  ].join(", "),
                }}
              >
                {/* Frosted glass inner layer */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(165deg, rgba(59,130,246,0.04) 0%, transparent 50%)",
                  pointerEvents: "none", zIndex: 10,
                }} />

                {/* Dynamic island */}
                <div style={{
                  position: "absolute", top: "16px", left: "50%", transform: "translateX(-50%)",
                  width: "96px", height: "30px",
                  background: "#000", borderRadius: "100px", zIndex: 20,
                  boxShadow: "inset 0 -1px 2px rgba(255,255,255,0.08), 0 2px 8px rgba(0,0,0,0.6)",
                }} />

                {/* Screen Content */}
                <div style={{ padding: "58px 16px 20px", display: "flex", flexDirection: "column", gap: "10px", height: "100%" }}>

                  {/* Status bar */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", fontWeight: 600, letterSpacing: "0.01em" }}>9:41</p>
                    <div style={{ display: "flex", gap: "4px", alignItems: "flex-end" }}>
                      {[3, 4, 5, 3].map((h, i) => (
                        <div key={i} style={{ width: "3px", height: `${h}px`, background: i < 3 ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.2)", borderRadius: "2px" }} />
                      ))}
                      <div style={{ width: "14px", height: "7px", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "2px", marginLeft: "2px", position: "relative" }}>
                        <div style={{ position: "absolute", left: "2px", top: "1px", bottom: "1px", width: "60%", background: "rgba(34,197,94,0.8)", borderRadius: "1px" }} />
                      </div>
                    </div>
                  </div>

                  {/* Greeting */}
                  <div style={{ marginBottom: "4px" }}>
                    <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", marginBottom: "3px", letterSpacing: "0.02em" }}>Good morning, Alex</p>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 500, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1 }}>Today&apos;s Plan</h2>
                  </div>

                  {/* AI Insight card */}
                  <div style={{
                    background: "rgba(59,130,246,0.09)",
                    border: "1px solid rgba(59,130,246,0.22)",
                    borderRadius: "16px", padding: "12px 14px",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                      <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#3B82F6" }} />
                      <p style={{ fontSize: "8px", color: "#3B82F6", letterSpacing: "0.10em", textTransform: "uppercase" as const, fontWeight: 600 }}>AI Insight</p>
                    </div>
                    <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.82)", lineHeight: 1.5, letterSpacing: "-0.01em" }}>
                      Recovery score 87 — push strength today, your body is primed.
                    </p>
                  </div>

                  {/* Metrics grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {[
                      { label: "Streak", value: "14d", color: "#F59E0B" },
                      { label: "Calories", value: "1,840", color: "#22C55E" },
                      { label: "Workouts", value: "3 / 4", color: "#3B82F6" },
                      { label: "Sleep", value: "7.5h", color: "#8B5CF6" },
                    ].map((m) => (
                      <div
                        key={m.label}
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.07)",
                          borderRadius: "12px", padding: "10px 12px",
                        }}
                      >
                        <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.35)", marginBottom: "5px", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>{m.label}</p>
                        <p style={{ fontSize: "1.125rem", fontWeight: 500, color: m.color, letterSpacing: "-0.025em" }}>{m.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>Weekly goal</span>
                      <span style={{ fontSize: "9px", color: "var(--arc-blue)", fontWeight: 600 }}>75%</span>
                    </div>
                    <div style={{ height: "3px", background: "rgba(255,255,255,0.05)", borderRadius: "100px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: "75%", background: "linear-gradient(90deg, #2563EB, #93C5FD)", borderRadius: "100px" }} />
                    </div>
                  </div>

                  {/* Workout card */}
                  <div style={{
                    marginTop: "auto",
                    background: "rgba(59,130,246,0.07)",
                    border: "1px solid rgba(59,130,246,0.16)",
                    borderRadius: "14px", padding: "12px 14px",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <div>
                      <p style={{ fontSize: "12px", fontWeight: 500, color: "#fff", letterSpacing: "-0.01em" }}>Push Day A</p>
                      <p style={{ fontSize: "9.5px", color: "rgba(255,255,255,0.4)", marginTop: "3px" }}>52 min · 6 exercises</p>
                    </div>
                    <div style={{
                      width: "30px", height: "30px", borderRadius: "50%",
                      background: "var(--arc-blue)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
                        <path d="M5 3l14 9-14 9V3z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3D depth layer — subtle left edge */}
              <div style={{
                position: "absolute",
                top: "10%", left: "-3px",
                width: "3px", height: "80%",
                background: "linear-gradient(180deg, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0.0) 100%)",
                borderRadius: "2px 0 0 2px",
              }} />
            </div>
          </div>

          {/* Floating stat badge — top right of phone */}
          <div
            className="animate-fade-up opacity-0-init delay-1000"
            style={{
              position: "absolute",
              top: "8%",
              right: "-2%",
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: "14px",
              padding: "10px 14px",
              display: "flex", alignItems: "center", gap: "8px",
            }}
          >
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22C55E" }} />
            <span style={{ fontSize: "11px", fontWeight: 500, color: "#fff", whiteSpace: "nowrap" as const }}>
              14-day streak
            </span>
          </div>

          {/* Floating stat badge — bottom left of phone */}
          <div
            className="animate-fade-up opacity-0-init delay-1200"
            style={{
              position: "absolute",
              bottom: "10%",
              left: "-4%",
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(59,130,246,0.18)",
              borderRadius: "14px",
              padding: "10px 14px",
            }}
          >
            <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.38)", letterSpacing: "0.06em", textTransform: "uppercase" as const, marginBottom: "3px" }}>Recovery</p>
            <p style={{ fontSize: "1.125rem", fontWeight: 500, color: "var(--arc-blue)", letterSpacing: "-0.025em" }}>87%</p>
          </div>
        </div>
      </div>

      {/* ── Responsive mobile override ── */}
      <style>{`
        @media (max-width: 820px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-phone-col { display: none !important; }
        }
      `}</style>

      {/* ── Celebration Modal ── */}
      {showModal && confirmed && (
        <ConfirmationScreen
          position={confirmed.position}
          referralCode={confirmed.referralCode}
          totalCount={confirmed.totalCount}
          alreadyRegistered={confirmed.alreadyRegistered}
          onClose={() => setShowModal(false)}
        />
      )}
    </section>
  );
}
