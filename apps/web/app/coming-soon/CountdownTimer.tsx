"use client";

import { useEffect, useRef, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: Date): TimeLeft {
  const now = Date.now();
  const diff = Math.max(0, target.getTime() - now);
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

interface FlipDigitProps {
  value: string;
  label: string;
}

function FlipDigit({ value, label }: FlipDigitProps) {
  const prevRef = useRef(value);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (prevRef.current !== value) {
      setAnimate(true);
      const t = setTimeout(() => setAnimate(false), 180);
      prevRef.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      <div
        className="flip-card-inner"
        style={{
          transform: animate ? "scale(0.96)" : "scale(1)",
          transition: "transform 0.18s cubic-bezier(0.34,1.56,0.64,1)",
          borderColor: animate ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.09)",
        }}
      >
        {value}
      </div>
      <span
        style={{
          fontSize: "0.625rem",
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase" as const,
          color: "rgba(255,255,255,0.32)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

const LAUNCH_DATE = new Date(
  process.env.NEXT_PUBLIC_LAUNCH_DATE ?? "2026-07-22T00:00:00.000Z"
);

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft(LAUNCH_DATE));
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(LAUNCH_DATE));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.12 }
    );
    if (innerRef.current) observer.observe(innerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: "6rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="section-divider" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />

      {/* Background accent */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "400px",
          background: "radial-gradient(ellipse at center, rgba(59,130,246,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        ref={innerRef}
        className="reveal"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "3rem",
          maxWidth: "700px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Header */}
        <div>
          {/* Eyebrow */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 14px",
              borderRadius: "100px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              fontSize: "0.6875rem",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              color: "rgba(255,255,255,0.45)",
              marginBottom: "1.5rem",
            }}
          >
            Launch Countdown
          </div>

          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(2rem, 3.5vw, 3.25rem)",
              fontWeight: 500,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "#FFFFFF",
              marginBottom: "0.75rem",
            }}
          >
            The wait is{" "}
            <span
              style={{
                background: "linear-gradient(130deg, #93C5FD 0%, #3B82F6 60%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              almost over.
            </span>
          </h2>

          <p
            style={{
              color: "#8B96A5",
              fontSize: "1rem",
              letterSpacing: "-0.01em",
              lineHeight: 1.6,
            }}
          >
            Launching globally on the Google Play Store. Founding members get in first.
          </p>
        </div>

        {/* Timer display */}
        <div
          style={{
            display: "flex",
            gap: "clamp(0.75rem, 3vw, 1.75rem)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!mounted || !timeLeft ? (
            <>
              {(["Days", "Hours", "Mins", "Secs"] as const).map((label, i) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "clamp(0.75rem, 3vw, 1.75rem)" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                    <div className="flip-card-inner" style={{ opacity: 0.25 }}>--</div>
                    <span style={{ fontSize: "0.625rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.25)" }}>{label}</span>
                  </div>
                  {i < 3 && (
                    <span style={{ fontSize: "2rem", fontWeight: 400, color: "rgba(255,255,255,0.12)", marginBottom: "1.5rem" }}>:</span>
                  )}
                </div>
              ))}
            </>
          ) : (
            <>
              <FlipDigit value={pad(timeLeft.days)} label="Days" />
              <span style={{ fontSize: "2rem", fontWeight: 400, color: "rgba(255,255,255,0.12)", marginBottom: "1.5rem" }}>:</span>
              <FlipDigit value={pad(timeLeft.hours)} label="Hours" />
              <span style={{ fontSize: "2rem", fontWeight: 400, color: "rgba(255,255,255,0.12)", marginBottom: "1.5rem" }}>:</span>
              <FlipDigit value={pad(timeLeft.minutes)} label="Mins" />
              <span style={{ fontSize: "2rem", fontWeight: 400, color: "rgba(255,255,255,0.12)", marginBottom: "1.5rem" }}>:</span>
              <FlipDigit value={pad(timeLeft.seconds)} label="Secs" />
            </>
          )}
        </div>

        {/* CTA nudge */}
        <a
          href="#waitlist"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            const el = document.getElementById("waitlist");
            if (el) {
              el.classList.remove("pulse-trigger");
              void el.offsetWidth;
              el.classList.add("pulse-trigger");
            }
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: "100px",
            padding: "10px 22px",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "rgba(255,255,255,0.65)",
            textDecoration: "none",
            transition: "background 0.2s ease, color 0.2s ease, border-color 0.2s ease",
            letterSpacing: "-0.005em",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = "rgba(255,255,255,0.09)";
            el.style.color = "#FFFFFF";
            el.style.borderColor = "rgba(255,255,255,0.18)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = "rgba(255,255,255,0.05)";
            el.style.color = "rgba(255,255,255,0.65)";
            el.style.borderColor = "rgba(255,255,255,0.10)";
          }}
        >
          Secure your spot now
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 12H19M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </section>
  );
}
