"use client";

export default function LandingFooter() {
  return (
    <footer
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "transparent", // let the glowing body background bleed through
        padding: "6rem 2rem 2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* ── Massive Typography Centerpiece ── */}
      <div
        className="reveal"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "5rem",
          width: "100%",
        }}
      >
        <div style={{
          fontSize: "clamp(4rem, 15vw, 12rem)",
          fontWeight: 700,
          letterSpacing: "-0.04em",
          lineHeight: 0.85,
          background: "linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.0) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontFamily: "'Space Grotesk', sans-serif",
          userSelect: "none",
        }}>
          ARC
        </div>
        <p style={{
          marginTop: "1rem",
          fontSize: "clamp(1rem, 2vw, 1.25rem)",
          color: "rgba(255,255,255,0.4)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontWeight: 500
        }}>
          The standard is impeccable.
        </p>
      </div>

      {/* ── Glass Footer Bar ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          padding: "1.5rem 2rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "2rem",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
        }}
      >
        {/* Left: Copyright & Credit */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          fontSize: "0.8125rem",
        }}>
          <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>
            © 2026 ARC Fitness.
          </span>
          <span style={{ color: "rgba(255,255,255,0.4)" }}>
            Built by{" "}
            <a
              href="https://www.ombalgude.app/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "rgba(255,255,255,0.7)",
                textDecoration: "none",
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#FFF")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
            >
              Om Balgude
            </a>
          </span>
        </div>

        {/* Center: Socials */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <a
            href="https://twitter.com/arcfitnessapp"
            target="_blank" rel="noopener noreferrer"
            style={{
              width: "40px", height: "40px", borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "rgba(255,255,255,0.6)", transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "#FFF";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.color = "rgba(255,255,255,0.6)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="https://instagram.com/arcfitnessapp"
            target="_blank" rel="noopener noreferrer"
            style={{
              width: "40px", height: "40px", borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "rgba(255,255,255,0.6)", transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "#FFF";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.color = "rgba(255,255,255,0.6)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
        </div>

        {/* Right: Legal */}
        <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.8125rem" }}>
          <a
            href="/legal/privacy"
            style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#FFF")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
          >
            Privacy
          </a>
          <a
            href="/legal/terms"
            style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#FFF")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
