import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy — ARC Fitness",
  description: "Learn how ARC Fitness uses cookies and similar local storage technologies.",
};

const s = {
  page: { maxWidth: "860px", margin: "0 auto", padding: "clamp(60px, 10vw, 72px) clamp(16px, 5vw, 24px) 100px" } as React.CSSProperties,
  heroSection: { textAlign: "center" as const, marginBottom: "64px" },
  badge: {
    display: "inline-block", padding: "5px 14px", fontSize: "12px", fontWeight: 600,
    letterSpacing: "1px", textTransform: "uppercase" as const, color: "var(--accent2)",
    border: "1px solid var(--border-glow)", borderRadius: "100px", background: "rgba(99,102,241,0.08)",
    marginBottom: "24px",
  },
  h1: {
    fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 900, lineHeight: 1.08,
    letterSpacing: "-1.5px", marginBottom: "16px",
    background: "linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #a78bfa 100%)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
  } as React.CSSProperties,
  subtext: { fontSize: "16px", lineHeight: 1.7, color: "var(--text-muted)", maxWidth: "520px", margin: "0 auto" },
  effectiveDate: { marginTop: "12px", fontSize: "13px", color: "var(--text-muted)", fontStyle: "italic" },
  sectionCard: {
    background: "var(--bg-card)", border: "1px solid var(--border)",
    borderRadius: "var(--radius)", padding: "clamp(24px, 5vw, 32px) clamp(20px, 5vw, 36px)", marginBottom: "24px",
  } as React.CSSProperties,
  h2: { fontSize: "22px", fontWeight: 800, color: "var(--text)", marginBottom: "18px" },
  p: { fontSize: "15px", lineHeight: 1.75, color: "var(--text-dim)", marginBottom: "14px" },
  ul: { listStyle: "none", padding: 0, margin: "0 0 14px 0" },
  li: { fontSize: "15px", lineHeight: 1.7, color: "var(--text-dim)", paddingLeft: "20px", position: "relative" as const, marginBottom: "8px" },
  liDot: { position: "absolute" as const, left: 0, top: "7px", width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)" },
  contactCard: {
    background: "var(--bg-card2)", border: "1px solid var(--border-glow)",
    borderRadius: "var(--radius)", padding: "32px 36px", textAlign: "center" as const,
  },
};

function Bullet({ children }: { children: React.ReactNode }) {
  return <li style={s.li}><span style={s.liDot} />{children}</li>;
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={s.sectionCard}>
      <h2 style={s.h2}>{title}</h2>
      {children}
    </div>
  );
}

export default function CookiePolicyPage(): React.JSX.Element {
  return (
    <div style={s.page}>
      <div style={s.heroSection}>
        <span style={s.badge}>Legal · Cookies</span>
        <h1 style={s.h1}>Cookie Policy</h1>
        <p style={s.subtext}>
          How we use cookies and local storage to provide and improve the ARC Fitness experience.
        </p>
        <p style={s.effectiveDate}>Effective Date: <strong>July 15, 2026</strong></p>
      </div>

      <SectionCard title="1. What Are Cookies and Local Storage?">
        <p style={s.p}>
          Cookies are small text files stored on your browser when you visit a website. Local storage (including secure on-device storage for mobile apps) serves a similar purpose, allowing applications to remember your preferences, authentication status, and offline data.
        </p>
      </SectionCard>

      <SectionCard title="2. How We Use These Technologies">
        <p style={s.p}>We use these technologies strictly for the following purposes:</p>
        <ul style={s.ul}>
          <Bullet><strong>Authentication (Essential):</strong> To securely keep you logged in to the application and manage your session tokens.</Bullet>
          <Bullet><strong>Offline Functionality (Essential):</strong> To cache workout and habit data locally on your mobile device so you can access the app without an internet connection.</Bullet>
          <Bullet><strong>Analytics (Optional):</strong> To understand how users interact with our website and app, helping us improve the product experience.</Bullet>
        </ul>
      </SectionCard>

      <SectionCard title="3. Mobile vs. Web">
        <p style={s.p}>
          <strong>Mobile App:</strong> The ARC mobile app does not use traditional web cookies. Instead, we use secure, encrypted local storage to hold your authentication session and temporary offline data.
        </p>
        <p style={s.p}>
          <strong>Web Platform:</strong> Our website uses cookies primarily for analytics and necessary session management. Where required by law, we will ask for your consent before placing non-essential analytics cookies on your device.
        </p>
      </SectionCard>

      <SectionCard title="4. Managing Your Preferences">
        <p style={s.p}>
          You have the right to accept or reject non-essential cookies. You can manage your preferences through your browser settings, which allow you to block or delete cookies. Please note that blocking essential cookies or clearing app storage may sign you out and clear your cached offline data.
        </p>
      </SectionCard>

      <div style={s.contactCard}>
        <h2 style={{ ...s.h2, marginBottom: "10px", textAlign: "center" }}>Questions?</h2>
        <p style={{ ...s.p, textAlign: "center" }}>If you have any questions about this policy, contact us at:</p>
        <p style={{ textAlign: "center", fontWeight: 700, fontSize: "16px", color: "var(--accent2)" }}>Contact email coming soon</p>
      </div>
    </div>
  );
}
