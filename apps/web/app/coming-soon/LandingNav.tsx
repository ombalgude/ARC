"use client";

import { useEffect, useState } from "react";

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetAccess = (e: React.MouseEvent) => {
    e.preventDefault(); // Stop any scrolling
    const el = document.getElementById('waitlist');
    if (el) {
      el.classList.remove('pulse-trigger');
      void el.offsetWidth; // force reflow
      el.classList.add('pulse-trigger');
    }
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        height: "4.5rem",
        background: scrolled ? "rgba(0, 0, 0, 0.7)" : "transparent",
        backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
        borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.08)" : "transparent"}`,
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        
        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "20px", height: "20px", borderRadius: "6px",
            background: "linear-gradient(135deg, #3B82F6 0%, #1E3A8A 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 12px rgba(59,130,246,0.3)"
          }}>
            <div style={{ width: "6px", height: "6px", background: "#FFF", borderRadius: "50%" }} />
          </div>
          <div style={{
            fontSize: "1rem", fontWeight: 700, letterSpacing: "0.2em",
            color: "#FFFFFF", textTransform: "uppercase", fontFamily: "'Space Grotesk', sans-serif",
          }}>
            ARC
          </div>
        </div>

        {/* Nav links — desktop only */}
        <div className="arc-nav-links" style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
          <style>{`
            @media (max-width: 768px) { .arc-nav-links { display: none !important; } }
            .nav-link-edge {
              font-size: 0.875rem; font-weight: 500; color: rgba(255,255,255,0.5);
              transition: color 0.2s; cursor: pointer; text-decoration: none;
            }
            .nav-link-edge:hover { color: #FFFFFF; }
          `}</style>
          {["Features", "Philosophy", "Specs"].map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="nav-link-edge">
              {link}
            </a>
          ))}
          
          {/* CTA */}
          <a 
            href="#waitlist" 
            onClick={handleGetAccess}
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "#FFF",
              fontSize: "0.8125rem",
              fontWeight: 500,
              padding: "0.5rem 1.25rem",
              borderRadius: "100px",
              border: "1px solid rgba(255,255,255,0.12)",
              textDecoration: "none",
              transition: "all 0.2s",
              marginLeft: "1rem"
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.15)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.25)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.12)";
            }}
          >
            Get Access
          </a>
        </div>
        
        {/* Mobile CTA (Shows when links are hidden) */}
        <div className="arc-nav-mobile" style={{ display: "none" }}>
          <style>{`
            @media (max-width: 768px) { .arc-nav-mobile { display: block !important; } }
          `}</style>
          <a 
            href="#waitlist" 
            onClick={handleGetAccess}
            style={{
              background: "var(--arc-blue)",
              color: "#FFF",
              fontSize: "0.8125rem",
              fontWeight: 600,
              padding: "0.5rem 1.25rem",
              borderRadius: "100px",
              textDecoration: "none",
            }}
          >
            Get Access
          </a>
        </div>

      </div>
    </nav>
  );
}
