"use client";
import React from "react";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { CountdownTimer } from "../../components/CountdownTimer";

export default function LandingNav(): React.JSX.Element | Promise<React.JSX.Element> {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const handleGetAccess = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    const el = document.getElementById("waitlist");
    if (el) {
      el.classList.remove("pulse-trigger");
      void el.offsetWidth;
      el.classList.add("pulse-trigger");
    }
  };

  const navLinks = ["Features", "Perks"];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        padding: scrolled ? "1.25rem 1rem 0" : "0",
        transition: "padding 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <motion.nav
        initial={false}
        animate={{
          width: scrolled ? "680px" : "100%",
          borderRadius: scrolled ? "100px" : "0px",
          background: scrolled ? "rgba(4, 5, 12, 0.65)" : "rgba(0, 0, 0, 0)",
          borderColor: scrolled ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0)",
          boxShadow: scrolled ? "0 24px 48px rgba(0,0,0,0.8), 0 0 20px rgba(59,130,246,0.1), inset 0 1px 1px rgba(59,130,246,0.2)" : "none",
        }}
        transition={{ type: "spring", stiffness: 250, damping: 30 }}
        style={{
          position: "relative",
          maxWidth: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",  
          padding: "0 clamp(1.5rem, 5vw, 4rem)",
          height: scrolled ? "4rem" : "5rem",
          borderWidth: "1px",
          borderStyle: "solid",
          backdropFilter: scrolled ? "blur(32px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(32px) saturate(180%)" : "none",
          overflow: "hidden",
        }}
      >
        
        {/* Glow behind the island */}
        <motion.div
          animate={{ opacity: scrolled ? 1 : 0 }}
          style={{
            position: "absolute",
            top: 0, left: "15%", right: "15%", height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent)",
            zIndex: 0,
          }}
        />

        <div
          style={{
            maxWidth: "1240px",
            width: "100%",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 10,
          }}
        >
          
          <a
            href="/"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}
          >
            <div
              style={{
                width: "24px", height: "24px",
                borderRadius: "6px",
                background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(59,130,246,0.4), inset 0 1px 1px rgba(255,255,255,0.3)"
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 9 Q6 2 10 9" stroke="#FFFFFF" strokeWidth="1.75" strokeLinecap="round" fill="none"/>
              </svg>
            </div>

            <span
              style={{
                fontSize: "1.05rem",
                fontWeight: 700,
                letterSpacing: "0.22em",
                color: "#FFFFFF",
                textTransform: "uppercase" as const,
                fontFamily: "'Inter', sans-serif",
                transform: "translateY(1px)",
              }}
            >
              ARC
            </span>
          </a>

          <div 
            className="hidden md:flex" 
            style={{ 
              position: "absolute", 
              left: "50%", 
              top: "50%",
              transform: "translate(-50%, -50%)",
              transformOrigin: "center center",
              opacity: scrolled ? 0 : 1,
              pointerEvents: scrolled ? "none" : "auto",
              scale: scrolled ? "0.9" : "1",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
          >
            <CountdownTimer targetDate={process.env.NEXT_PUBLIC_LAUNCH_DATE ?? "2026-07-22T00:00:00.000Z"} />
          </div>

          <div
            className="arc-nav-links"
            style={{ display: "flex", gap: "1rem", alignItems: "center" }}
          >
            <style>{`
              @media (max-width: 768px) { .arc-nav-links { display: none !important; } }
              @media (max-width: 768px) { .arc-nav-mobile { display: block !important; } }
            `}</style>

            {navLinks.map((link) => (
              <a
                key={link}
                href={`/#${link.toLowerCase()}`}
                onClick={(e) => {
                  if (window.location.pathname === "/") {
                    e.preventDefault();
                    const el = document.getElementById(link.toLowerCase());
                    if (el) {
                      const y = el.getBoundingClientRect().top + window.scrollY - 100;
                      window.scrollTo({ top: y, behavior: "smooth" });
                    }
                  }
                }}
                onMouseEnter={() => setActiveLink(link)}
                onMouseLeave={() => setActiveLink(null)}
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: activeLink === link ? "#FFFFFF" : "rgba(255,255,255,0.6)",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                  letterSpacing: "0.02em",
                  textDecoration: "none",
                  padding: "0.4rem 1rem",
                  borderRadius: "100px",
                  background: activeLink === link ? "rgba(59,130,246,0.15)" : "transparent",
                }}
              >
                {link}
              </a>
            ))}

            <a
              href="#waitlist"
              onClick={handleGetAccess}
              className="group"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(59,130,246,0.1)",
                color: "#FFFFFF",
                fontSize: "0.8125rem",
                fontWeight: 600,
                padding: "0.5rem 1.25rem",
                borderRadius: "100px",
                border: "1px solid rgba(59,130,246,0.3)",
                textDecoration: "none",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                letterSpacing: "0.01em",
                marginLeft: "0.5rem",
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLAnchorElement;
                target.style.background = "#3B82F6";
                target.style.color = "#FFFFFF";
                target.style.borderColor = "#3B82F6";
                target.style.boxShadow = "0 4px 14px rgba(59,130,246,0.4)";
                target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLAnchorElement;
                target.style.background = "rgba(59,130,246,0.1)";
                target.style.color = "#FFFFFF";
                target.style.borderColor = "rgba(59,130,246,0.3)";
                target.style.boxShadow = "none";
                target.style.transform = "translateY(0px)";
              }}
            >
              Claim Your Spot
            </a>
          </div>

          <div className="arc-nav-mobile" style={{ display: "none" }}>
            <a
              href="#waitlist"
              onClick={handleGetAccess}
              style={{
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.3)",
                color: "#3B82F6",
                fontSize: "0.8125rem",
                fontWeight: 600,
                padding: "0.5rem 1.125rem",
                borderRadius: "100px",
                textDecoration: "none",
              }}
            >
              Claim Spot
            </a>
          </div>
        </div>
      </motion.nav>
    </div>
  );
}
