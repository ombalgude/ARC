import Link from "next/link";
import LandingFooter from "../coming-soon/Footer";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#000", color: "#fff" }}>
      
      {/* Impeccable Legal Nav */}
      <nav style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "1rem 2rem", 
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(24px)",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
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
                color: "#FFFFFF"
              }}
            >
              ARC
            </span>
          </div>
        </Link>
        <div>
          <style>{`
            .back-btn {
              display: inline-flex;
              align-items: center;
              background: rgba(0, 0, 0, 0.35);
              backdrop-filter: blur(3.75px);
              border: 1px solid rgba(255, 255, 255, 0.2);
              box-shadow: 0 0 0 1.25px rgba(230, 234, 240, 0.12);
              border-radius: 7.5rem;
              color: #FFFFFF;
              height: 2.5rem;
              padding: 0 1.5rem;
              font-size: 0.875rem;
              font-weight: 500;
              text-decoration: none;
              transition: background 0.2s ease;
            }
            .back-btn:hover {
              background: rgba(255, 255, 255, 0.25);
            }
          `}</style>
          <Link href="/" className="back-btn">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <main style={{ flex: 1, padding: "4rem 1.5rem", maxWidth: "900px", margin: "0 auto", width: "100%" }}>
        {children}
      </main>

      <LandingFooter />
    </div>
  );
}
