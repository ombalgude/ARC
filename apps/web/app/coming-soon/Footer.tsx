"use client";

export default function LandingFooter() {
  return (
    <footer
      style={{
        position: "relative",
        width: "100%",
        background: "transparent",
        padding: "4rem 0 2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Space Grotesk', 'Inter', sans-serif"
      }}
    >
      <div style={{ width: "100%", maxWidth: "1100px", padding: "0 2rem" }}>
        
        {/* ── Main Footer Top Area ── */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "4rem",
          marginBottom: "6rem",
        }}>
          
          {/* ── Brand Section (Left Side) ── */}
          <div style={{ maxWidth: "380px" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              fontSize: "1.125rem", fontWeight: 700, letterSpacing: "0.2em", color: "#FFFFFF",
              marginBottom: "1.5rem"
            }}>
              {/* Logo Mark */}
              <div style={{
                width: "20px", height: "20px", borderRadius: "4px",
                background: "#3B82F6",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ width: "6px", height: "6px", background: "#FFFFFF", borderRadius: "50%" }} />
              </div>
              ARC
            </div>
            
            <p style={{ 
              color: "rgba(255,255,255,0.45)", 
              fontSize: "0.9375rem", 
              lineHeight: 1.7, 
            }}>
              The standard is impeccable. AI-powered
              training, intelligent habit loops, and dynamic
              macro clarity—built for those who refuse to
              settle.
            </p>
          </div>

          {/* ── Links Section (Right Side) ── */}
          <div style={{
            display: "flex",
            gap: "5rem",
            flexWrap: "wrap"
          }}>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <h4 style={{ color: "#FFFFFF", fontSize: "0.8125rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Platform</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <a href="#features" className="nav-link-edge" style={{ fontWeight: 600 }}>Core Intelligence</a>
                <a href="#perks" className="nav-link-edge" style={{ fontWeight: 600 }}>Founding Perks</a>
                <a href="#waitlist" className="nav-link-edge" style={{ fontWeight: 600 }}>Waitlist Access</a>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <h4 style={{ color: "#FFFFFF", fontSize: "0.8125rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Social</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <a href="https://twitter.com/arcfitnessapp" target="_blank" rel="noopener noreferrer" className="nav-link-edge" style={{ fontWeight: 600 }}>Twitter / X</a>
                <a href="https://instagram.com/arcfitnessapp" target="_blank" rel="noopener noreferrer" className="nav-link-edge" style={{ fontWeight: 600 }}>Instagram</a>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <h4 style={{ color: "#FFFFFF", fontSize: "0.8125rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Legal</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <a href="/legal/privacy" className="nav-link-edge" style={{ fontWeight: 600 }}>Privacy Policy</a>
                <a href="/legal/terms" className="nav-link-edge" style={{ fontWeight: 600 }}>Terms of Service</a>
              </div>
            </div>

          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "2rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.875rem", fontWeight: 500 }}>
            © 2026 ARC Fitness. All rights reserved.
          </p>
          
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.875rem", fontWeight: 500 }}>
            Built by{" "}
            <a 
              href="https://www.ombalgude.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: "#FFFFFF", 
                textDecoration: "none",
                transition: "color 0.2s",
                paddingLeft: "5px",
                
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#FFFFFF"; }}
            >
             Om Balgude
            </a>
          </p>
        </div>
        
      </div>
    </footer>
  );
}
