"use client";

import { useEffect, useState } from "react";

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <nav
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(1.25rem, 3vw, 2.5rem)",
        height: "4.5rem",
        background: scrolled
          ? "rgba(0,0,0,0.78)"
          : "rgba(0,0,0,0.0)",
        backdropFilter: scrolled ? "blur(28px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(28px) saturate(180%)" : "none",
        borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.07)" : "transparent"}`,
        transition: "background 0.45s cubic-bezier(0.16,1,0.3,1), border-color 0.45s ease, backdrop-filter 0.45s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1240px",
          width: "100%",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* ── Wordmark ── */}
        <a
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}
        >
          {/* Logo mark — geometric arc shape */}
          <div
            style={{
              width: "22px", height: "22px",
              borderRadius: "7px",
              background: "linear-gradient(145deg, #3B82F6 0%, #1D4ED8 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {/* Small arc icon inside */}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 9 Q6 2 10 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            </svg>
          </div>

          <span
            style={{
              fontSize: "0.9375rem",
              fontWeight: 600,
              letterSpacing: "0.22em",
              color: "#FFFFFF",
              textTransform: "uppercase" as const,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            ARC
          </span>
        </a>

        {/* ── Nav Links — Desktop ── */}
        <div
          className="arc-nav-links"
          style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}
        >
          <style>{`
            @media (max-width: 768px) { .arc-nav-links { display: none !important; } }
            @media (max-width: 768px) { .arc-nav-mobile { display: block !important; } }
          `}</style>

          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onMouseEnter={() => setActiveLink(link)}
              onMouseLeave={() => setActiveLink(null)}
              style={{
                fontSize: "0.875rem",
                fontWeight: 400,
                color: activeLink === link ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.42)",
                transition: "color 0.2s ease",
                cursor: "pointer",
                letterSpacing: "-0.005em",
                textDecoration: "none",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {link}
            </a>
          ))}

          {/* ── CTA button ── */}
          <a
            href="#waitlist"
            onClick={handleGetAccess}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "var(--arc-blue)",
              color: "#FFF",
              fontSize: "0.8125rem",
              fontWeight: 500,
              padding: "0.5rem 1.25rem",
              borderRadius: "100px",
              border: "none",
              textDecoration: "none",
              transition: "background 0.2s ease, opacity 0.2s ease",
              letterSpacing: "-0.01em",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "var(--arc-blue-hover)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "var(--arc-blue)";
            }}
          >
            Get Early Access
          </a>
        </div>

        {/* ── Mobile CTA ── */}
        <div className="arc-nav-mobile" style={{ display: "none" }}>
          <a
            href="#waitlist"
            onClick={handleGetAccess}
            style={{
              background: "var(--arc-blue)",
              color: "#FFF",
              fontSize: "0.8125rem",
              fontWeight: 500,
              padding: "0.5rem 1.125rem",
              borderRadius: "100px",
              textDecoration: "none",
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: "-0.01em",
            }}
          >
            Get Access
          </a>
        </div>
      </div>
    </nav>
  );
}
