"use client";

export default function LandingFooter() {
  return (
    <footer
      style={{
        position: "relative",
        width: "100%",
        padding: "5rem 0 2.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
        overflow: "hidden", // Prevent 120vw glow from causing scrollbars
      }}
    >
      {/* ── Subterranean Glow ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "120vw",
          height: "600px", // Reduced height so it doesn't bleed too far up
          background: "radial-gradient(ellipse at 50% 100%, rgba(37,99,235, 0.12) 0%, rgba(29,78,216, 0.05) 40%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Top divider */}
      <div
        style={{
          position: "absolute",
          top: 0, left: "2rem", right: "2rem",
          height: "1px",
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 30%, rgba(59,130,246,0.12) 50%, rgba(255,255,255,0.07) 70%, transparent 100%)",
          zIndex: 1,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "1160px", padding: "0 2rem" }}>

        {/* ── Top section: Brand + Links ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "3rem",
            marginBottom: "5rem",
          }}
        >
          {/* ── Brand Side ── */}
          <div style={{ maxWidth: "340px" }}>
            {/* Logo */}
            <div
              style={{
                display: "flex", alignItems: "center", gap: "0.6rem",
                marginBottom: "1.25rem",
              }}
            >
              <div
                style={{
                  width: "22px", height: "22px",
                  borderRadius: "7px",
                  background: "linear-gradient(145deg, #3B82F6 0%, #1D4ED8 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
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
                }}
              >
                ARC
              </span>
            </div>

            <p
              style={{
                color: "rgba(255,255,255,0.38)",
                fontSize: "0.875rem",
                lineHeight: 1.75,
                maxWidth: "300px",
              }}
            >
              AI-powered training, intelligent habit loops, and macro clarity — built for people who refuse to settle.
            </p>

            {/* Social icons */}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
              {[
                {
                  label: "X / Twitter",
                  href: "https://twitter.com/arcfitnessapp",
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  ),
                },
                {
                  label: "Instagram",
                  href: "https://instagram.com/arcfitnessapp",
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                    </svg>
                  ),
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.label}
                  style={{
                    width: "34px", height: "34px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "rgba(255,255,255,0.40)",
                    transition: "color 0.2s, background 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.color = "#FFFFFF";
                    el.style.background = "rgba(255,255,255,0.08)";
                    el.style.borderColor = "rgba(255,255,255,0.14)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.color = "rgba(255,255,255,0.40)";
                    el.style.background = "rgba(255,255,255,0.04)";
                    el.style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Link Columns ── */}
          <div style={{ display: "flex", gap: "4rem", flexWrap: "wrap" }}>
            {[
              {
                heading: "Platform",
                links: [
                  { label: "Core Intelligence", href: "#features" },
                  { label: "Founding Perks", href: "#perks" },
                  { label: "Waitlist Access", href: "#waitlist" },
                ],
              },
              {
                heading: "Legal",
                links: [
                  { label: "Privacy Policy", href: "/legal/privacy" },
                  { label: "Terms of Service", href: "/legal/terms" },
                ],
              },
            ].map((col) => (
              <div key={col.heading} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <h4
                  style={{
                    color: "#8B96A5",
                    fontSize: "0.6875rem",
                    fontWeight: 500,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.10em",
                  }}
                >
                  {col.heading}
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {col.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => {
                        if (link.href === "#waitlist") {
                          e.preventDefault();
                          window.scrollTo({ top: 0, behavior: "smooth" });
                          const el = document.getElementById("waitlist");
                          if (el) {
                            el.classList.remove("pulse-trigger");
                            void el.offsetWidth;
                            el.classList.add("pulse-trigger");
                          }
                        }
                      }}
                      style={{
                        fontSize: "0.875rem",
                        color: "rgba(255,255,255,0.38)",
                        transition: "color 0.2s ease",
                        textDecoration: "none",
                        letterSpacing: "-0.005em",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.88)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.38)"; }}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "2rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.8125rem" }}>
            © 2026 ARC Fitness. All rights reserved.
          </p>

          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.8125rem" }}>
            Built by{" "}
            <a
              href="https://www.ombalgude.app/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#8B96A5",
                textDecoration: "none",
                transition: "color 0.2s ease",
                paddingLeft: "3px",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#FFFFFF"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#8B96A5"; }}
            >
              Om Balgude
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
