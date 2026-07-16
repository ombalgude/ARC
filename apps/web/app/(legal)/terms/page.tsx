import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — ARC Fitness",
  description: "Read the Terms and Conditions governing your use of ARC Fitness.",
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
  criticalCard: {
    background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: "var(--radius)", padding: "24px 28px", marginBottom: "48px",
  } as React.CSSProperties,
  criticalTitle: {
    fontSize: "14px", fontWeight: 800, color: "#f87171", marginBottom: "10px",
    letterSpacing: "0.5px", textTransform: "uppercase" as const,
  },
  criticalText: { fontSize: "14px", lineHeight: 1.7, color: "#fca5a5" },
  sectionCard: {
    background: "var(--bg-card)", border: "1px solid var(--border)",
    borderRadius: "var(--radius)", padding: "clamp(24px, 5vw, 32px) clamp(20px, 5vw, 36px)", marginBottom: "24px",
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

export default function TermsAndConditionsPage(): React.JSX.Element {
  return (
    <div style={s.page}>
      <div style={s.heroSection}>
        <span style={s.badge}>Legal · Terms</span>
        <h1 style={s.h1}>Terms &amp; Conditions</h1>
        <p style={s.subtext}>
          These terms govern your access to and use of ARC Fitness. Please read them carefully.
        </p>
        <p style={s.effectiveDate}>Effective Date: <strong>July 15, 2026</strong></p>
      </div>

      <div style={s.criticalCard}>
        <p style={s.criticalTitle}>⚠ Medical &amp; Fitness Disclaimer</p>
        <p style={s.criticalText}>
          ARC Fitness provides information for educational purposes only and is <strong>not a substitute for professional medical advice, diagnosis, or treatment.</strong> Always consult a physician before beginning any exercise or diet program. By using ARC, you acknowledge that physical exercise carries inherent risks of injury, and you voluntarily assume all such risks. Om Balgude shall not be liable for any physical injury or health issue arising from your use of the Service.
        </p>
      </div>

      <SectionCard title="1. Acceptance of Terms">
        <p style={s.p}>
          By creating an account or accessing the Service, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, you must discontinue use of the Service immediately.
        </p>
      </SectionCard>

      <SectionCard title="2. Account Registration & Eligibility">
        <p style={s.p}>
          You must be at least 16 years old to use the Service. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. We reserve the right to suspend or terminate accounts that violate these Terms.
        </p>
      </SectionCard>

      <SectionCard title="3. AI Assistant & Platform Limitations">
        <p style={s.p}>
          Our platform includes a workout generation engine and a conversational AI assistant. You acknowledge that:
        </p>
        <ul style={s.ul}>
          <Bullet>Workout plans and nutritional targets are estimates based on generalized data and algorithms, not tailored medical prescriptions.</Bullet>
          <Bullet>The AI assistant provides general fitness and nutritional concepts and is expressly prohibited from diagnosing injuries or recommending medical treatments.</Bullet>
          <Bullet>AI language models may occasionally produce inaccurate information. You should not rely on them as definitive factual guidance.</Bullet>
        </ul>
      </SectionCard>

      <SectionCard title="4. Acceptable Use">
        <p style={s.p}>You agree not to use the Service to:</p>
        <ul style={s.ul}>
          <Bullet>Violate any laws or regulations.</Bullet>
          <Bullet>Reverse engineer, decompile, or extract proprietary code from the app or backend engines.</Bullet>
          <Bullet>Use automated bots to scrape or access data.</Bullet>
          <Bullet>Submit false, misleading, or harmful information.</Bullet>
        </ul>
      </SectionCard>

      <SectionCard title="5. Subscriptions, Billing, and Refunds">
        <p style={s.p}>
          Certain features of ARC require a paid subscription. Subscriptions are billed automatically on a recurring basis. You may cancel your subscription at any time through your account settings or app store provider, and the cancellation will take effect at the end of the current billing cycle. All purchases are final and non-refundable unless required by applicable law.
        </p>
      </SectionCard>

      <SectionCard title="6. Intellectual Property">
        <p style={s.p}>
          All rights to the Service, including the app design, proprietary algorithms, and content, are owned by Om Balgude. We grant you a limited, non-transferable license to use the app for personal, non-commercial purposes.
        </p>
      </SectionCard>

      <SectionCard title="7. Limitation of Liability">
        <p style={s.p}>
          THE SERVICE IS PROVIDED "AS IS". TO THE MAXIMUM EXTENT PERMITTED BY LAW, OM BALGUDE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES (INCLUDING PHYSICAL INJURY, LOSS OF DATA, OR SERVICE DOWNTIME). OUR TOTAL AGGREGATE LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE 12 MONTHS PRECEDING THE CLAIM.
        </p>
      </SectionCard>

      <SectionCard title="8. Governing Law">
        <p style={s.p}>
          These Terms are governed by the laws of the State of Maharashtra, India, without regard to conflict of law principles. Any disputes shall be subject to the exclusive jurisdiction of the courts located in Maharashtra, India.
        </p>
      </SectionCard>

      <div style={s.contactCard}>
        <h2 style={{ ...s.h2, marginBottom: "10px", textAlign: "center" }}>Contact Us</h2>
        <p style={{ ...s.p, textAlign: "center" }}>For any legal inquiries, please reach out to:</p>
        <p style={{ textAlign: "center", fontWeight: 700, fontSize: "16px", color: "var(--accent2)" }}>Contact email coming soon</p>
      </div>
    </div>
  );
}
