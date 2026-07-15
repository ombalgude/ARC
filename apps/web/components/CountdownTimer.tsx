"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CountdownTimer({ targetDate }: { targetDate: string }): React.JSX.Element {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // FIX: Replaced `return null` with a dimensionally-identical skeleton.
  // Returning null caused a layout shift (CLS) in the navbar and
  // ConfirmationScreen — the pill went from zero-size to full-size after
  // hydration. The skeleton occupies the same space so the layout is stable.
  if (!isMounted) {
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "0.5rem 1.25rem",
          background: "rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "100px",
          boxShadow: "inset 0 1px 4px rgba(255,255,255,0.05), 0 10px 30px -10px rgba(0,0,0,0.8)",
          backdropFilter: "blur(12px)",
          margin: "0 auto",
          // Match the exact height & approx width so there is no layout shift
          minWidth: "180px",
          height: "36px",
          opacity: 0.4,
        }}
        aria-hidden
      />
    );
  }

  const format = (num: number) => num.toString().padStart(2, "0");

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.5rem 1.25rem",
        background: "rgba(0,0,0,0.5)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "100px",
        boxShadow: "inset 0 1px 4px rgba(255,255,255,0.05), 0 10px 30px -10px rgba(0,0,0,0.8)",
        backdropFilter: "blur(12px)",
        margin: "0 auto",
      }}
    >
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.25rem",
        color: "#FFFFFF",
        fontFamily: "monospace",
        fontSize: "0.875rem",
        fontWeight: 600,
        letterSpacing: "0.1em"
      }}>
        <span style={{ color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginRight: "0.75rem", fontSize: "0.65rem", letterSpacing: "0.15em", fontWeight: 700 }}>
          Launch In
        </span>
        <span style={{ minWidth: "1.2rem", textAlign: "center" }}>{format(timeLeft.days)}</span>
        <motion.span
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{ color: "#3B82F6", textShadow: "0 0 10px rgba(59,130,246,0.5)" }}
        >:</motion.span>
        <span style={{ minWidth: "1.2rem", textAlign: "center" }}>{format(timeLeft.hours)}</span>
        <motion.span
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{ color: "#3B82F6", textShadow: "0 0 10px rgba(59,130,246,0.5)" }}
        >:</motion.span>
        <span style={{ minWidth: "1.2rem", textAlign: "center" }}>{format(timeLeft.minutes)}</span>
        <motion.span
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{ color: "#3B82F6", textShadow: "0 0 10px rgba(59,130,246,0.5)" }}
        >:</motion.span>
        <span style={{ minWidth: "1.2rem", textAlign: "center", color: "#60A5FA" }}>{format(timeLeft.seconds)}</span>
      </div>
    </div>
  );
}
