"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={value}
            initial={{ y: "40%", opacity: 0, rotateX: -45 }}
            animate={{ y: "0%", opacity: 1, rotateX: 0 }}
            exit={{ y: "-40%", opacity: 0, rotateX: 45 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="countdown-flip-digit"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontVariantNumeric: "tabular-nums",
              fontSize: "clamp(3.5rem, 10vw, 12rem)",
              fontWeight: 500,
              lineHeight: 0.85,
              letterSpacing: "-0.05em",
              background: "linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.4) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              transformOrigin: "center center",
            }}
          >
            {value}
          </motion.div>
        </AnimatePresence>
      </div>
      <span
        style={{
          marginTop: "1.5rem",
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.2em",
          textTransform: "uppercase" as const,
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

export default function CountdownTimer(): React.JSX.Element {
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
        padding: "5rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <style>{`
        .countdown-header {
          display: flex !important;
          justify-content: space-between !important;
          align-items: flex-end !important;
          width: 100% !important;
        }
        .countdown-digits-wrapper {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          gap: clamp(1.5rem, 5vw, 6rem) !important;
          width: 100% !important;
        }
        @media (max-width: 640px) {
          .countdown-header {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            gap: 1.5rem !important;
            margin-bottom: 2rem !important;
          }
        }
        @media (max-width: 480px) {
          .countdown-digits-wrapper {
            gap: clamp(0.5rem, 3vw, 6rem) !important;
          }
          .countdown-flip-digit {
            font-size: clamp(2rem, 8vw, 12rem) !important;
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
          width: "120vw",
          height: "120vh",
          background: "radial-gradient(ellipse at center, rgba(59,130,246,0.03) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-20%" }}
        variants={{
          visible: { transition: { staggerChildren: 0.15 } },
          hidden: {}
        }}
        style={{
          width: "100%",
          maxWidth: "1400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        <motion.div 
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}
          className="countdown-header"
          style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4rem", paddingBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                fontWeight: 500,
                letterSpacing: "-0.03em",
                color: "#FFFFFF",
                margin: 0,
              }}
            >
              System Initialization
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem", marginTop: "0.5rem" }}>
              Global deployment sequence
            </p>
          </div>
          
          <div className="glass-blue" style={{ padding: "8px 20px", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--arc-blue)" }}>
            T-Minus
          </div>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } } }}
          className="countdown-digits-wrapper"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "clamp(1.5rem, 5vw, 6rem)",
            alignItems: "center",
            width: "100%",
            padding: "0 1rem",
          }}
        >
          {!mounted || !timeLeft ? (
            <>
              {(["Days", "Hours", "Mins", "Secs"] as const).map((label, i) => (
                <div key={label} style={{ display: "flex", alignItems: "center", width: "25%", justifyContent: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ fontSize: "clamp(4rem, 12vw, 12rem)", fontWeight: 500, opacity: 0.1 }}>--</div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginTop: "1.5rem" }}>{label}</span>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <FlipDigit value={pad(timeLeft.days)} label="Days" />
              <FlipDigit value={pad(timeLeft.hours)} label="Hours" />
              <FlipDigit value={pad(timeLeft.minutes)} label="Mins" />
              <FlipDigit value={pad(timeLeft.seconds)} label="Secs" />
            </>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
