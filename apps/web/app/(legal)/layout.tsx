import LandingNav from "../coming-soon/LandingNav";
import LandingFooter from "../coming-soon/Footer";
import SmoothScroll from "../coming-soon/SmoothScroll";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="arc-landing" style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#000000",
        color: "#FFFFFF",
        position: "relative",
      }}>
      
      <SmoothScroll />
      <LandingNav />

      {/* ── Content ── */}
      <main style={{ flex: 1, position: "relative", zIndex: 1, paddingTop: "100px", paddingBottom: "60px" }}>
        {children}
      </main>

      {/* ── Footer ── */}
      <LandingFooter />
    </div>
  );
}
