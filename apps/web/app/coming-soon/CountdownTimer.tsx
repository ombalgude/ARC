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
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flip-card-inner">
        {value}
      </div>
      <span
        style={{
          fontSize: "0.6875rem",
          fontWeight: 500,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
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

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft(LAUNCH_DATE));
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(LAUNCH_DATE));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      style={{
        padding: "5rem 1.5rem 4rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
        position: "relative",
      }}
    >
      <div className="section-divider" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />

      {/* Header */}
      <div className="reveal" style={{ textAlign: "center" }}>
        <h2 className="text-section text-gradient-hero" style={{ marginBottom: "0.75rem", fontSize: "clamp(2rem, 4vw, 3rem)" }}>
          The Wait is Almost Over
        </h2>
        <p style={{ color: "var(--arc-text-secondary)", fontSize: "1.125rem", letterSpacing: "-0.01em" }}>
          Launching globally on the Google Play Store.
        </p>
      </div>

      {/* Timer Display */}
      <div
        className="reveal"
        style={{
          display: "flex",
          gap: "clamp(0.75rem, 3vw, 1.5rem)",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {!mounted || !timeLeft ? (
          // Skeleton
          <>
            {(["Days", "Hours", "Mins", "Secs"] as const).map((label, i) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "clamp(0.75rem, 3vw, 1.5rem)" }}>
                <div className="flex flex-col items-center gap-3">
                  <div className="flip-card-inner" style={{ opacity: 0.3 }}>--</div>
                  <span style={{ fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.4)" }}>{label}</span>
                </div>
                {i < 3 && (
                  <span style={{ fontSize: "2rem", fontWeight: 500, color: "var(--arc-blue-dim)", marginBottom: "1.5rem" }}>:</span>
                )}
              </div>
            ))}
          </>
        ) : (
          <>
            <FlipDigit value={pad(timeLeft.days)} label="Days" />
            <span style={{ fontSize: "2rem", fontWeight: 500, color: "var(--arc-blue-dim)", marginBottom: "1.5rem" }}>:</span>
            <FlipDigit value={pad(timeLeft.hours)} label="Hours" />
            <span style={{ fontSize: "2rem", fontWeight: 500, color: "var(--arc-blue-dim)", marginBottom: "1.5rem" }}>:</span>
            <FlipDigit value={pad(timeLeft.minutes)} label="Mins" />
            <span style={{ fontSize: "2rem", fontWeight: 500, color: "var(--arc-blue-dim)", marginBottom: "1.5rem" }}>:</span>
            <FlipDigit value={pad(timeLeft.seconds)} label="Secs" />
          </>
        )}
      </div>
    </section>
  );
}
