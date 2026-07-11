import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — ARC Fitness",
  description: "Understand how ARC Fitness collects, uses, stores, and protects your personal and health data.",
};

const s = {
  page: { maxWidth: "860px", margin: "0 auto", padding: "72px 24px 100px" } as React.CSSProperties,
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
  warningCard: {
    background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
    borderRadius: "var(--radius)", padding: "20px 24px", marginBottom: "48px",
    display: "flex", gap: "14px", alignItems: "flex-start",
  } as React.CSSProperties,
  warningIcon: { fontSize: "22px", flexShrink: 0, marginTop: "2px" },
  warningText: { fontSize: "14px", lineHeight: 1.65, color: "#fca5a5" },
  sectionCard: {
    background: "var(--bg-card)", border: "1px solid var(--border)",
    borderRadius: "var(--radius)", padding: "32px 36px", marginBottom: "24px",
  } as React.CSSProperties,
  h2: { fontSize: "22px", fontWeight: 800, color: "var(--text)", marginBottom: "18px" },
  h3: { fontSize: "15px", fontWeight: 700, color: "var(--text)", marginBottom: "8px", marginTop: "20px" },
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

export default function PrivacyPolicyPage(): React.JSX.Element {
  return (
    <div style={s.page}>
      <div style={s.heroSection}>
        <span style={s.badge}>Legal · Privacy</span>
        <h1 style={s.h1}>Privacy Policy</h1>
        <p style={s.subtext}>
          We are committed to protecting your privacy. This policy outlines our data processing practices.
        </p>
        <p style={s.effectiveDate}>Effective Date: <strong>[Effective Date]</strong></p>
      </div>

      <div style={s.warningCard}>
        <span style={s.warningIcon}>🔒</span>
        <p style={s.warningText}>
          <strong style={{ color: "#f87171" }}>Health Data Notice:</strong> ARC collects health-related data (such as body weight, dietary preferences, and workout metrics) to personalise your experience. By using ARC, you explicitly consent to this processing.
        </p>
      </div>

      <SectionCard title="1. Information We Collect">
        <h3 style={s.h3}>Account Information</h3>
        <p style={s.p}>When you create an account, we collect basic details such as your name, email address, and authentication tokens provided by our identity services.</p>

        <h3 style={s.h3}>Health and Fitness Data</h3>
        <p style={s.p}>To provide personalized fitness plans, we collect metrics including your age, gender, height, weight, fitness goals, dietary preferences, and workout activity logs.</p>

        <h3 style={s.h3}>Device and Usage Data</h3>
        <p style={s.p}>We automatically collect technical data, including IP address, device type, app performance metrics, and usage events to ensure stability and improve the service.</p>
      </SectionCard>

      <SectionCard title="2. How We Use Your Data">
        <p style={s.p}>We use your data for the following purposes:</p>
        <ul style={s.ul}>
          <Bullet>To generate personalized workout and nutrition plans.</Bullet>
          <Bullet>To manage your account, subscription, and authentication.</Bullet>
          <Bullet>To provide context-aware responses via our AI assistant feature.</Bullet>
          <Bullet>To monitor app performance, fix bugs, and improve the user experience.</Bullet>
          <Bullet>To communicate important service updates or billing information.</Bullet>
        </ul>
        <p style={s.p}><strong>We do not sell your personal or health data.</strong></p>
      </SectionCard>

      <SectionCard title="3. Data Sharing and Third-Party Services">
        <p style={s.p}>We share your data with trusted third-party service providers only to the extent necessary to operate the service. These include:</p>
        <ul style={s.ul}>
          <Bullet><strong>Cloud Hosting and Database Providers:</strong> To securely store and process your data.</Bullet>
          <Bullet><strong>Authentication Providers:</strong> To securely manage your account credentials.</Bullet>
          <Bullet><strong>Analytics and Monitoring Tools:</strong> To track app stability and usage trends (data is typically anonymized).</Bullet>
          <Bullet><strong>AI Model Providers:</strong> To process your queries to the AI assistant (only the conversation context is shared, not your full profile).</Bullet>
          <Bullet><strong>Payment Processors:</strong> To handle subscription billing securely.</Bullet>
        </ul>
      </SectionCard>

      <SectionCard title="4. Data Storage, Security, and Retention">
        <p style={s.p}>
          Your data is stored securely using industry-standard encryption (both in transit and at rest). We retain your personal and health data for the duration of your active account. If you choose to delete your account, your personal data will be erased within 30 days, except where retention is legally required (e.g., financial records).
        </p>
      </SectionCard>

      <SectionCard title="5. Your Privacy Rights">
        <p style={s.p}>Depending on your location (such as under the GDPR or CCPA), you have the right to:</p>
        <ul style={s.ul}>
          <Bullet><strong>Access</strong> the personal data we hold about you.</Bullet>
          <Bullet><strong>Correct</strong> inaccuracies in your data.</Bullet>
          <Bullet><strong>Delete</strong> your personal data ("Right to be Forgotten").</Bullet>
          <Bullet><strong>Withdraw Consent</strong> for the processing of sensitive health data at any time.</Bullet>
        </ul>
        <p style={s.p}>To exercise these rights, navigate to your account settings or contact us directly.</p>
      </SectionCard>

      <SectionCard title="6. Children's Privacy">
        <p style={s.p}>Our service is not intended for individuals under the age of 16. We do not knowingly collect personal data from minors.</p>
      </SectionCard>

      <div style={s.contactCard}>
        <h2 style={{ ...s.h2, marginBottom: "10px", textAlign: "center" }}>Questions?</h2>
        <p style={{ ...s.p, textAlign: "center" }}>Contact our privacy team at:</p>
        <p style={{ textAlign: "center", fontWeight: 700, fontSize: "16px", color: "var(--accent2)" }}>[Privacy Contact Email]</p>
      </div>
    </div>
  );
}
