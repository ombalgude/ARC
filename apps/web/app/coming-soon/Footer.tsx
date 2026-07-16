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
        background: "radial-gradient(100% 100% at 50% 100%, rgba(37,99,235,0.08) 0%, #000000 100%)",
        backgroundColor: "#000000",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        color: "#FFFFFF",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{`
        .footer-link {
          color: #8B96A5;
          font-size: 0.875rem;
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
        .footer-cta-btn:hover {
          background: #2563EB !important;
        }
        .footer-links-container {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 4rem !important;
          justify-content: space-between !important;
        }
        @media (max-width: 768px) {
          .footer-links-container {
            gap: 2rem 1rem !important;
          }
          .footer-col-product {
            width: calc(50% - 0.5rem) !important;
            min-width: 0 !important;
            order: 1 !important;
          }
          .footer-col-legal {
            width: calc(50% - 0.5rem) !important;
            min-width: 0 !important;
            order: 2 !important;
          }
          .footer-col-connect {
            width: 100% !important;
            min-width: 0 !important;
            order: 3 !important;
            margin-top: 1rem !important;
          }
          .footer-bottom-container {
            flex-direction: column !important;
            text-align: center !important;
            gap: 0.75rem !important;
            padding: 0 1.5rem !important;
          }
          .footer-bottom-container p {
            margin: 0 !important;
          }
          .footer-bottom-container a {
            margin-right: 0 !important;
          }
          .footer-cta-banner {
            padding: 2.5rem 2rem !important;
          }
          .footer-main-grid {
            padding: 2.5rem 2rem !important;
            gap: 2rem !important;
          }
        }
      `}</style>
      
      {/* Top CTA Banner */}
      <div
        className="footer-cta-banner"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "4rem 1.5rem",
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
            maxWidth: "800px",
            height: "400px",
            background: "radial-gradient(ellipse at center, rgba(37,99,235,0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <h2
          style={{
            fontSize: "clamp(2rem, 3.5vw, 3.25rem)",
            fontWeight: 500,
            letterSpacing: "-0.04em",
            marginBottom: "2rem",
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
          className="group footer-cta-btn"
          onClick={(e) => handleLinkClick(e, "/#waitlist")}
          style={{
            position: "relative",
            zIndex: 1,
            height: "3rem",
            padding: "0 2.5rem",
            background: "#3B82F6",
            color: "#FFFFFF",
            borderRadius: "100px",
            fontWeight: 600,
            fontSize: "1rem",
            textDecoration: "none",
            letterSpacing: "-0.01em",
            border: "none",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "background 0.2s ease, opacity 0.2s ease"
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

      {/* Main Grid */}
      <div
        className="footer-main-grid"
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "4rem 2rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "4rem",
          justifyContent: "space-between",
        }}
      >
        {/* Col 1: Brand */}
        <div style={{ flex: "2 1 300px", display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: "28px", height: "28px",
                borderRadius: "8px",
                background: "linear-gradient(145deg, #3B82F6 0%, #1D4ED8 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 8px rgba(59,130,246,0.4), inset 0 1px 1px rgba(255,255,255,0.3)"
              }}
            >
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                <path d="M2 9 Q6 2 10 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                letterSpacing: "0.15em",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              ARC
            </span>
          </div>
          
          <p style={{ color: "#8B96A5", fontSize: "0.9375rem", lineHeight: 1.6, maxWidth: "300px" }}>
            Your all in one fitness copilot. Training, nutrition, and habits unified into one intelligent engine.
          </p>  
        </div>

        {/* Links Columns */}
        <div className="footer-links-container" style={{ flex: "1 1 600px", display: "flex", flexWrap: "wrap", gap: "4rem", justifyContent: "space-between" }}>
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
                { label: "Cookie Policy", href: "/cookies" },
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
            <div 
              key={column.title} 
              className={`footer-col-${column.title.toLowerCase()}`}
              style={{ display: "flex", flexDirection: "column", gap: "1.5rem", minWidth: "140px" }}
            >
              <h4 style={{ color: "#FFFFFF", fontSize: "0.875rem", fontWeight: 500 }}>
                {column.title}
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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

      {/* Bottom Bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "2rem 0rem" }}>
        <div
          className="footer-bottom-container"
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p style={{ color: "#8B96A5", fontSize: "0.875rem" }}>
            © 2026 ARC Fitness. All rights reserved.
          </p>

          <p style={{ color: "#8B96A5", fontSize: "0.875rem" }}>
            Engineered by{" "}
            <a
              href="https://www.ombalgude.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="creator-link"
              style={{ marginRight: "3.5rem" }}  
            >
              Om Balgude
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
