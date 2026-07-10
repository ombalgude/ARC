import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — ARC Fitness",
  description:
    "Understand how ARC Fitness collects, uses, stores, and protects your personal and health data. Compliant with GDPR and CCPA.",
};

const s = {
  page: {
    maxWidth: "860px",
    margin: "0 auto",
    padding: "72px 24px 100px",
    fontFamily: "'Inter', sans-serif",
  } as React.CSSProperties,

  heroSection: {
    textAlign: "center" as const,
    marginBottom: "64px",
  },

  badge: {
    display: "inline-block",
    padding: "6px 16px",
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "#3B82F6",
    border: "1px solid rgba(59,130,246,0.2)",
    borderRadius: "100px",
    background: "rgba(59,130,246,0.1)",
    marginBottom: "24px",
    fontFamily: "'Space Grotesk', sans-serif",
  },

  h1: {
    fontSize: "clamp(2.5rem, 5vw, 4rem)",
    fontWeight: 500,
    lineHeight: 1.1,
    letterSpacing: "-0.04em",
    marginBottom: "16px",
    color: "#FFFFFF",
    fontFamily: "'Space Grotesk', sans-serif",
  } as React.CSSProperties,

  subtext: {
    fontSize: "1.125rem",
    lineHeight: 1.6,
    color: "#8B96A5",
    maxWidth: "520px",
    margin: "0 auto",
  },

  effectiveDate: {
    marginTop: "12px",
    fontSize: "0.875rem",
    color: "rgba(255,255,255,0.4)",
    fontStyle: "italic",
  },

  warningCard: {
    background: "rgba(239,68,68,0.05)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: "24px",
    padding: "24px",
    marginBottom: "48px",
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
  } as React.CSSProperties,

  warningIcon: {
    fontSize: "24px",
    flexShrink: 0,
  },

  warningText: {
    fontSize: "0.9375rem",
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.7)",
  },

  sectionCard: {
    padding: "0",
    marginBottom: "56px",
  } as React.CSSProperties,

  sectionNum: {
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    color: "rgba(255,255,255,0.3)",
    marginBottom: "12px",
    fontFamily: "'Space Grotesk', sans-serif",
  },

  h2: {
    fontSize: "1.75rem",
    fontWeight: 500,
    color: "#FFFFFF",
    marginBottom: "24px",
    letterSpacing: "-0.03em",
    fontFamily: "'Space Grotesk', sans-serif",
  },

  h3: {
    fontSize: "1.125rem",
    fontWeight: 500,
    color: "#FFFFFF",
    marginBottom: "12px",
    marginTop: "32px",
    fontFamily: "'Space Grotesk', sans-serif",
  },

  p: {
    fontSize: "1rem",
    lineHeight: 1.7,
    color: "#8B96A5",
    marginBottom: "16px",
  },

  ul: {
    listStyle: "none",
    padding: 0,
    margin: "0 0 24px 0",
  },

  li: {
    fontSize: "1rem",
    lineHeight: 1.7,
    color: "#8B96A5",
    paddingLeft: "24px",
    position: "relative" as const,
    marginBottom: "12px",
  },

  liDot: {
    position: "absolute" as const,
    left: 0,
    top: "10px",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#3B82F6",
    boxShadow: "0 0 10px rgba(59,130,246,0.5)",
  },

  chipRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "8px",
    marginTop: "20px",
    marginBottom: "20px",
  },

  chip: {
    padding: "6px 16px",
    fontSize: "0.875rem",
    fontWeight: 500,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "100px",
    color: "#FFFFFF",
  },

  divider: {
    border: "none",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    margin: "64px 0",
  },

  contactCard: {
    background: "radial-gradient(ellipse at top, rgba(37,99,235,0.15), transparent 70%), rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "32px",
    padding: "48px 40px",
    textAlign: "center" as const,
  },
};

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li style={s.li}>
      <span style={s.liDot} />
      {children}
    </li>
  );
}

function SectionCard({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={s.sectionCard}>
      <p style={s.sectionNum}>{num}</p>
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
          We believe privacy is a right, not a feature. This document explains exactly what data
          ARC collects, why we collect it, and how we protect it.
        </p>
        <p style={s.effectiveDate}>
          Effective Date: <strong>[Effective Date]</strong> · Last Updated:{" "}
          <strong>[Last Updated Date]</strong>
        </p>
      </div>

      <div style={s.warningCard}>
        <span style={s.warningIcon}>🔒</span>
        <p style={s.warningText}>
          <strong style={{ color: "#f87171" }}>Health Data Notice:</strong> ARC collects sensitive
          health-related data including body weight, dietary preferences, macro intake, and workout
          performance metrics. This data is used solely to personalise your experience within the
          app and is never sold to third parties. By using ARC, you explicitly consent to this
          processing as described in this policy.
        </p>
      </div>

      <SectionCard num="Section 01" title="Who We Are">
        <p style={s.p}>
          ARC Fitness (&quot;ARC&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is a
          premium, personalised fitness and nutrition platform operated by{" "}
          <strong>[Company Name]</strong>, a company registered at{" "}
          <strong>[Registered Address]</strong>.
        </p>
        <p style={s.p}>
          This Privacy Policy governs the collection, use, storage, and sharing of your personal
          data when you access or use the ARC mobile application (iOS &amp; Android), our website
          at <strong>[Website URL]</strong>, and any related services (collectively, the
          &quot;Service&quot;).
        </p>
        <p style={s.p}>
          For privacy enquiries, please contact us at: <strong>[Privacy Contact Email]</strong>.
        </p>
      </SectionCard>

      <SectionCard num="Section 02" title="Data We Collect">
        <h3 style={s.h3}>2.1 Account &amp; Identity Data</h3>
        <p style={s.p}>
          When you register (via email, Google, or Apple through Clerk), we collect:
        </p>
        <ul style={s.ul}>
          <Bullet>Full name (if provided via OAuth provider)</Bullet>
          <Bullet>Email address</Bullet>
          <Bullet>Profile photo (if granted by OAuth provider)</Bullet>
          <Bullet>Authentication tokens and session identifiers (managed by Clerk)</Bullet>
          <Bullet>Account creation timestamp and login history</Bullet>
        </ul>

        <h3 style={s.h3}>2.2 Onboarding &amp; Health Metrics</h3>
        <p style={s.p}>
          During onboarding, you voluntarily provide sensitive health data. This constitutes{" "}
          <strong>health data</strong> under GDPR Article 9:
        </p>
        <div style={s.chipRow}>
          {[
            "Age",
            "Biological Gender",
            "Height",
            "Current Body Weight",
            "Target Weight Goal",
            "Fitness Experience Level",
            "Primary Fitness Goal",
            "Dietary Preference",
            "Weekly Workout Days",
            "Activity Level",
          ].map((item) => (
            <span key={item} style={s.chip}>
              {item}
            </span>
          ))}
        </div>

        <h3 style={s.h3}>2.3 Activity &amp; Tracking Data</h3>
        <ul style={s.ul}>
          <Bullet>Workout logs: exercises performed, sets, reps, weights lifted</Bullet>
          <Bullet>Daily macro intake (calories, protein, carbohydrates, fat)</Bullet>
          <Bullet>Habit check-offs: water intake, sleep duration, daily step counts</Bullet>
          <Bullet>Workout plan assignments and completion status</Bullet>
          <Bullet>AI assistant conversation history</Bullet>
        </ul>

        <h3 style={s.h3}>2.4 Technical &amp; Device Data</h3>
        <ul style={s.ul}>
          <Bullet>IP address and approximate geographic location (country/region level)</Bullet>
          <Bullet>Device type, operating system, and app version</Bullet>
          <Bullet>Unique device identifiers (for push notification delivery)</Bullet>
          <Bullet>App performance and crash reports (via Sentry)</Bullet>
          <Bullet>In-app navigation and feature usage events (via PostHog)</Bullet>
        </ul>

        <h3 style={s.h3}>2.5 Payment &amp; Subscription Data</h3>
        <p style={s.p}>
          Payment processing is handled by <strong>[Payment Processor]</strong>. ARC does{" "}
          <strong>not</strong> store raw card numbers or CVV codes — only a tokenised reference
          to your subscription status, tier, and billing cycle.
        </p>
      </SectionCard>

      <SectionCard num="Section 03" title="How We Use Your Data">
        <h3 style={s.h3}>3.1 Service Delivery (Contract Performance)</h3>
        <ul style={s.ul}>
          <Bullet>Generate personalised, deterministic workout plans based on your profile</Bullet>
          <Bullet>Calculate daily calorie and macronutrient targets (TDEE-based)</Bullet>
          <Bullet>Provide AI assistant with contextual fitness and nutrition guidance</Bullet>
          <Bullet>Track habit completion and display progress dashboards</Bullet>
          <Bullet>Manage your subscription, billing, and account access</Bullet>
          <Bullet>Deliver push notifications for workout reminders and streak alerts</Bullet>
        </ul>

        <h3 style={s.h3}>3.2 Legitimate Interests</h3>
        <ul style={s.ul}>
          <Bullet>Detect and prevent fraud, abuse, or security threats</Bullet>
          <Bullet>Monitor app stability and fix bugs via crash reporting (Sentry)</Bullet>
          <Bullet>Analyse aggregate product usage to improve features (PostHog)</Bullet>
        </ul>

        <h3 style={s.h3}>3.3 Explicit Consent (Health Data — GDPR Art. 9)</h3>
        <ul style={s.ul}>
          <Bullet>Processing body weight, biometric, and dietary data for plan personalisation</Bullet>
          <Bullet>Storing AI conversation history linked to your health context</Bullet>
        </ul>

        <p style={s.p}>
          <strong>We do not sell your data.</strong> We do not use your personal or health data
          for targeted advertising. We do not share your health metrics with insurance companies,
          employers, or data brokers.
        </p>
      </SectionCard>

      <SectionCard num="Section 04" title="Third-Party Services &amp; Data Sharing">
        <p style={s.p}>
          We use carefully selected service providers bound by Data Processing Agreements (DPAs):
        </p>
        <div style={{ overflowX: "auto" as const }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse" as const,
              fontSize: "14px",
              marginTop: "16px",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Provider", "Purpose", "Data Shared"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "10px 12px",
                      color: "var(--accent2)",
                      fontWeight: 700,
                      fontSize: "12px",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  provider: "Clerk",
                  purpose: "Authentication — login, session management, OAuth",
                  data: "Email, name, OAuth tokens",
                },
                {
                  provider: "Neon DB (PostgreSQL)",
                  purpose: "Primary cloud database storage",
                  data: "All user-generated data",
                },
                {
                  provider: "PostHog",
                  purpose: "Product analytics & usage event tracking",
                  data: "Anonymised event data, device info",
                },
                {
                  provider: "Sentry",
                  purpose: "Error monitoring & crash reporting",
                  data: "Stack traces, device info (no PII by default)",
                },
                {
                  provider: "Railway",
                  purpose: "API server hosting & deployment",
                  data: "API request logs",
                },
                {
                  provider: "Expo Push Service",
                  purpose: "Delivery of push notifications",
                  data: "Push tokens, notification payloads",
                },
                {
                  provider: "[Payment Processor]",
                  purpose: "Subscription billing & payment processing",
                  data: "Payment tokens, subscription status",
                },
                {
                  provider: "OpenAI / Google Gemini",
                  purpose: "AI assistant query processing",
                  data: "Anonymised conversation messages",
                },
              ].map((row, i) => (
                <tr
                  key={row.provider}
                  style={{
                    borderBottom: "1px solid var(--border)",
                    background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
                  }}
                >
                  <td style={{ padding: "12px", color: "var(--text)", fontWeight: 600 }}>
                    {row.provider}
                  </td>
                  <td style={{ padding: "12px", color: "var(--text-dim)" }}>{row.purpose}</td>
                  <td style={{ padding: "12px", color: "var(--text-dim)" }}>{row.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...s.p, marginTop: "20px" }}>
          <strong>AI Conversations:</strong> Your messages are forwarded to a third-party LLM
          provider with a safety system prompt applied first. We do not send your full health
          profile to the LLM — only the content of your submitted message.
        </p>
      </SectionCard>

      <SectionCard num="Section 05" title="Data Storage &amp; Security">
        <p style={s.p}>
          All data is stored in <strong>Neon DB (Serverless PostgreSQL, us-east-1)</strong>,
          encrypted <strong>at rest</strong> and <strong>in transit</strong> via TLS 1.2+ and
          AES-256. Database connections require SSL.
        </p>
        <ul style={s.ul}>
          <Bullet>
            <strong>Authentication:</strong> Clerk manages all credentials; we never store raw
            passwords.
          </Bullet>
          <Bullet>
            <strong>API Authorisation:</strong> Every endpoint verifies Clerk-issued JWT tokens
            before processing any request.
          </Bullet>
          <Bullet>
            <strong>Secrets Management:</strong> API keys and connection strings are managed via
            Doppler — never committed to source control.
          </Bullet>
          <Bullet>
            <strong>Input Validation:</strong> All user inputs are validated server-side using Zod
            schemas, preventing injection attacks.
          </Bullet>
          <Bullet>
            <strong>Error Monitoring:</strong> Sentry captures runtime exceptions without logging
            personally identifiable information.
          </Bullet>
        </ul>
      </SectionCard>

      <SectionCard num="Section 06" title="Data Retention &amp; Deletion">
        <ul style={s.ul}>
          <Bullet>
            <strong>Active account data:</strong> retained for the lifetime of your account.
          </Bullet>
          <Bullet>
            <strong>AI conversation history:</strong> automatically purged after 12 months.
          </Bullet>
          <Bullet>
            <strong>Payment records:</strong> retained for 7 years per financial regulations.
          </Bullet>
          <Bullet>
            <strong>Server logs:</strong> retained for 90 days then deleted.
          </Bullet>
          <Bullet>
            <strong>Anonymised analytics:</strong> retained for 24 months in aggregate form.
          </Bullet>
        </ul>
        <p style={s.p}>
          To delete your account, go to{" "}
          <strong>Settings → Account → Delete Account</strong> or email{" "}
          <strong>[Privacy Contact Email]</strong>. We will process your request within 30 days,
          except where retention is legally required.
        </p>
      </SectionCard>

      <SectionCard num="Section 07" title="Your Privacy Rights">
        <h3 style={s.h3}>GDPR Rights (EEA &amp; UK)</h3>
        <ul style={s.ul}>
          <Bullet>
            <strong>Access (Art. 15):</strong> Request a copy of your data.
          </Bullet>
          <Bullet>
            <strong>Rectification (Art. 16):</strong> Correct inaccurate data.
          </Bullet>
          <Bullet>
            <strong>Erasure / Right to be Forgotten (Art. 17):</strong> Request deletion.
          </Bullet>
          <Bullet>
            <strong>Restriction (Art. 18):</strong> Limit how we process your data.
          </Bullet>
          <Bullet>
            <strong>Data Portability (Art. 20):</strong> Receive your data in JSON/CSV format.
          </Bullet>
          <Bullet>
            <strong>Object (Art. 21):</strong> Object to processing based on legitimate interests.
          </Bullet>
          <Bullet>
            <strong>Withdraw Consent:</strong> Withdraw health data consent at any time.
          </Bullet>
        </ul>

        <h3 style={s.h3}>CCPA Rights (California Residents)</h3>
        <ul style={s.ul}>
          <Bullet>Right to Know what personal information is collected.</Bullet>
          <Bullet>Right to Delete personal information.</Bullet>
          <Bullet>
            Right to Opt-Out of Sale — <strong>ARC does not sell personal information.</strong>
          </Bullet>
          <Bullet>Right to Non-Discrimination for exercising CCPA rights.</Bullet>
        </ul>
        <p style={s.p}>
          Contact <strong>[Privacy Contact Email]</strong> to exercise any right. We respond
          within 30 days.
        </p>
      </SectionCard>

      <SectionCard num="Section 08" title="Children's Privacy">
        <p style={s.p}>
          ARC is not directed to children under <strong>16</strong> (or 13 where COPPA applies).
          We do not knowingly collect personal data from minors. If you believe a minor has
          provided us data, contact <strong>[Privacy Contact Email]</strong> immediately.
        </p>
      </SectionCard>

      <SectionCard num="Section 09" title="Cookies &amp; Local Storage">
        <ul style={s.ul}>
          <Bullet>
            <strong>Expo SecureStore:</strong> Caches Clerk session tokens securely on-device.
          </Bullet>
          <Bullet>
            <strong>AsyncStorage / MMKV:</strong> Caches offline-capable workout and habit data.
          </Bullet>
        </ul>
        <p style={s.p}>
          The web application may use cookies for session management and analytics (PostHog). A
          cookie consent banner is displayed on first visit where legally required.
        </p>
      </SectionCard>

      <SectionCard num="Section 10" title="International Data Transfers">
        <p style={s.p}>
          Your data may be processed in the <strong>United States</strong> and other countries
          where our providers operate. Cross-border transfers from the EEA or UK are protected by:
        </p>
        <ul style={s.ul}>
          <Bullet>Standard Contractual Clauses (SCCs) approved by the European Commission</Bullet>
          <Bullet>Data Processing Agreements with all sub-processors</Bullet>
          <Bullet>EU-US Data Privacy Framework certification (where applicable)</Bullet>
        </ul>
      </SectionCard>

      <SectionCard num="Section 11" title="Changes to This Privacy Policy">
        <p style={s.p}>
          We may update this policy periodically. For material changes, we will update the
          &quot;Last Updated&quot; date, send an in-app notification or email, and where required
          by law, seek renewed consent. Continued use after changes constitutes acceptance.
        </p>
      </SectionCard>

      <hr style={s.divider} />

      <div style={s.contactCard}>
        <span style={{ fontSize: "28px", display: "block", marginBottom: "12px" }}>📬</span>
        <h2 style={{ ...s.h2, marginBottom: "10px", textAlign: "center" }}>
          Questions About Your Privacy?
        </h2>
        <p style={{ ...s.p, textAlign: "center" }}>
          Our team is here to help. Reach out to our Privacy Officer at:
        </p>
        <p
          style={{
            textAlign: "center",
            fontWeight: 700,
            fontSize: "16px",
            color: "var(--accent2)",
          }}
        >
          [Privacy Contact Email]
        </p>
        <p style={{ ...s.p, textAlign: "center", marginTop: "8px", fontSize: "13px" }}>
          <strong>[Company Name]</strong> · [Registered Address]
        </p>
      </div>
    </div>
  );
}
