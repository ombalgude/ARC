"use client";
import React from "react";

export default function LandingFooter(): React.JSX.Element {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#")) {
      e.preventDefault();
      
      if (window.location.pathname !== "/") {
        window.location.href = href;
        return;
      }
      
      const targetId = href.substring(2);
      const el = document.getElementById(targetId);
      if (el) {
        if ((window as any).lenis) {
          (window as any).lenis.scrollTo(el, { offset: targetId === "waitlist" ? -120 : -100 });
        } else {
          el.scrollIntoView({ behavior: "smooth" });
        }

        if (targetId === "waitlist") {
          const form = document.querySelector(".waitlist-pill-wrapper") as HTMLElement | null;
          if (form) {
            form.classList.remove("pulse-trigger");
            void form.offsetWidth;
            form.classList.add("pulse-trigger");
          }
        }
      }
    }
  };

  return (
    <footer
      style={{
        width: "100%",
        background: "radial-gradient(100% 100% at 50% 100%, rgba(37,99,235,0.06) 0%, #000000 100%)",
        backgroundColor: "#000000",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        color: "#FFFFFF",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{`
        .footer-link {
          color: #8B96A5;
          font-size: 0.8125rem;
          text-decoration: none;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-block;
        }
        .footer-link:hover {
          color: #FFFFFF;
          text-shadow: 0 0 10px rgba(255,255,255,0.3);
        }
        .creator-link {
          color: #FFFFFF;
          text-decoration: none;
          font-weight: 500;
          border-bottom: 1px solid rgba(255,255,255,0.2);
          padding-bottom: 2px;
          transition: all 0.2s ease;
        }
        .creator-link:hover {
          color: #3B82F6;
          border-bottom-color: #3B82F6;
        }
      `}</style>
      
      {/* Top CTA Banner - Tighter Spacing */}
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "2.5rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: "600px",
            height: "250px",
            background: "radial-gradient(ellipse at center, rgba(37,99,235,0.12) 0%, transparent 70%)",
            filter: "blur(50px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <h2
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            marginBottom: "1.25rem",
            fontFamily: "'Space Grotesk', sans-serif",
            color: "#FFFFFF",
            position: "relative",
            zIndex: 1,
          }}
        >
          Ready to lock in{" "}
          <span
            style={{
              background: "linear-gradient(130deg, #93C5FD 0%, #3B82F6 60%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            your access?
          </span>
        </h2>
        <a
          href="/"
          className="group animate-gradient-shift"
          onClick={(e) => handleLinkClick(e, "/#waitlist")}
          style={{
            position: "relative",
            zIndex: 1,
            padding: "0.75rem 2rem",
            background: "linear-gradient(135deg, rgba(37,99,235,0.9) 0%, rgba(37,99,235,0.9) 42%, rgba(96,165,250,0.8) 50%, rgba(37,99,235,0.9) 58%, rgba(37,99,235,0.9) 100%)",
            color: "#FFFFFF",
            borderRadius: "100px",
            fontWeight: 600,
            fontSize: "0.9375rem",
            textDecoration: "none",
            letterSpacing: "-0.01em",
            border: "1px solid rgba(255,255,255,0.15)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          Claim Your Spot Now
          <span 
            style={{ transition: "transform 0.2s ease" }}
            className="group-hover:translate-x-1"
          >
            →
          </span>
        </a>
      </div>

      {/* Main Grid - Tighter Spacing */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2.5rem 1.5rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "2.5rem",
          justifyContent: "space-between",
        }}
      >
        {/* Col 1: Brand */}
        <div style={{ flex: "1.5 1 260px", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "24px", height: "24px",
                borderRadius: "6px",
                background: "linear-gradient(145deg, #3B82F6 0%, #1D4ED8 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 6px rgba(59,130,246,0.3)"
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 9 Q6 2 10 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <span
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              ARC
            </span>
          </div>
          
          <p style={{ color: "#8B96A5", fontSize: "0.875rem", lineHeight: 1.5, maxWidth: "280px" }}>
            Your all-in-one fitness copilot. Training, nutrition, and habits unified into one intelligent engine.
          </p>
        </div>

        {/* Links Columns - Compact Gaps */}
        <div style={{ flex: "2 1 480px", display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "space-between" }}>
          {[
            {
              title: "Product",
              links: [
                { label: "Features", href: "/#features" },
                { label: "Perks", href: "/#perks" },
                { label: "Join Waitlist", href: "/#waitlist" },
              ]
            },
            {
              title: "Legal",
              links: [
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Cookie Policy", href: "/privacy" },
              ]
            },
            {
              title: "Connect",
              links: [
                { label: "Twitter / X", href: "https://twitter.com/arcfitnessapp" },
                { label: "Instagram", href: "https://instagram.com/arcfitnessapp" },
                { label: "Contact Us", href: "mailto:hello@arcfitness.app" },
              ]
            }
          ].map((column) => (
            <div key={column.title} style={{ display: "flex", flexDirection: "column", gap: "1rem", minWidth: "120px" }}>
              <h4 style={{ color: "#FFFFFF", fontSize: "0.8125rem", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                {column.title}
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {column.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="footer-link"
                    onClick={(e) => handleLinkClick(e, link.href)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar - Tighter Padding */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "1.25rem 0" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <p style={{ color: "#8B96A5", fontSize: "0.75rem" }}>
            © 2026 ARC Fitness. All rights reserved.
          </p>

          <p style={{ color: "#8B96A5", fontSize: "0.75rem" }}>
            Engineered by{" "}
            <a
              href="https://www.ombalgude.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="creator-link"
            >
              Om Balgude
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
