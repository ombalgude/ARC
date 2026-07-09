import Link from "next/link";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="arc-landing">
      
      <nav className="arc-nav">
        <Link href="/" className="arc-wordmark">
          ARC
        </Link>
        <div className="arc-nav-links">
          <Link href="/legal/privacy" className="arc-btn-ghost">
            Privacy
          </Link>
          <Link href="/legal/terms" className="arc-btn-ghost">
            Terms
          </Link>
          <Link href="/" className="arc-btn-primary">
            Back to Home
          </Link>
        </div>
      </nav>

      <main style={{ flex: 1 }}>{children}</main>

      <footer className="arc-footer">
        <span className="arc-footer-copy">
          © {new Date().getFullYear()} [Company Name]. All rights reserved.
        </span>
        <div style={{ display: "flex", gap: "20px" }}>
          <Link href="/legal/privacy" className="arc-btn-ghost" style={{ fontSize: "13px", padding: "6px 12px" }}>
            Privacy Policy
          </Link>
          <Link href="/legal/terms" className="arc-btn-ghost" style={{ fontSize: "13px", padding: "6px 12px" }}>
            Terms &amp; Conditions
          </Link>
        </div>
      </footer>
    </div>
  );
}
