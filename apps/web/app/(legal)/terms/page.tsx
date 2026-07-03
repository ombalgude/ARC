import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — ARC Fitness",
  description:
    "Read the Terms and Conditions governing your use of ARC Fitness — a premium fitness and nutrition SaaS platform.",
};

const s = {
  page: {
    maxWidth: "860px",
    margin: "0 auto",
    padding: "72px 24px 100px",
  } as React.CSSProperties,

  heroSection: {
    textAlign: "center" as const,
    marginBottom: "64px",
  },

  badge: {
    display: "inline-block",
    padding: "5px 14px",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase" as const,
    color: "var(--accent2)",
    border: "1px solid var(--border-glow)",
    borderRadius: "100px",
    background: "rgba(99,102,241,0.08)",
    marginBottom: "24px",
  },

  h1: {
    fontSize: "clamp(36px, 5vw, 56px)",
    fontWeight: 900,
    lineHeight: 1.08,
    letterSpacing: "-1.5px",
    marginBottom: "16px",
    background: "linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #a78bfa 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  } as React.CSSProperties,

  subtext: {
    fontSize: "16px",
    lineHeight: 1.7,
    color: "var(--text-muted)",
    maxWidth: "520px",
    margin: "0 auto",
  },

  effectiveDate: {
    marginTop: "12px",
    fontSize: "13px",
    color: "var(--text-muted)",
    fontStyle: "italic",
  },

  criticalCard: {
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: "var(--radius)",
    padding: "24px 28px",
    marginBottom: "48px",
  } as React.CSSProperties,

  criticalTitle: {
    fontSize: "14px",
    fontWeight: 800,
    color: "#f87171",
    marginBottom: "10px",
    letterSpacing: "0.5px",
    textTransform: "uppercase" as const,
  },

  criticalText: {
    fontSize: "14px",
    lineHeight: 1.7,
    color: "#fca5a5",
  },

  sectionCard: {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "32px 36px",
    marginBottom: "24px",
  } as React.CSSProperties,

  sectionNum: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    color: "var(--accent2)",
    marginBottom: "8px",
  },

  h2: {
    fontSize: "22px",
    fontWeight: 800,
    color: "var(--text)",
    marginBottom: "18px",
    letterSpacing: "-0.3px",
  },

  h3: {
    fontSize: "15px",
    fontWeight: 700,
    color: "var(--text)",
    marginBottom: "8px",
    marginTop: "20px",
  },

  p: {
    fontSize: "15px",
    lineHeight: 1.75,
    color: "var(--text-dim)",
    marginBottom: "14px",
  },

  ul: {
    listStyle: "none",
    padding: 0,
    margin: "0 0 14px 0",
  },

  li: {
    fontSize: "15px",
    lineHeight: 1.7,
    color: "var(--text-dim)",
    paddingLeft: "20px",
    position: "relative" as const,
    marginBottom: "8px",
  },

  liDot: {
    position: "absolute" as const,
    left: 0,
    top: "7px",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "var(--accent)",
  },

  highlightBox: {
    background: "rgba(99,102,241,0.07)",
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: "var(--radius-sm)",
    padding: "16px 20px",
    margin: "16px 0",
    fontSize: "14px",
    lineHeight: 1.7,
    color: "var(--text-dim)",
  } as React.CSSProperties,

  divider: {
    border: "none",
    borderTop: "1px solid var(--border)",
    margin: "40px 0",
  },

  contactCard: {
    background: "var(--bg-card2)",
    border: "1px solid var(--border-glow)",
    borderRadius: "var(--radius)",
    padding: "32px 36px",
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

export default function TermsAndConditionsPage(): React.JSX.Element {
  return (
    <div style={s.page}>
      {/* Hero */}
      <div style={s.heroSection}>
        <span style={s.badge}>Legal · Terms</span>
        <h1 style={s.h1}>Terms &amp; Conditions</h1>
        <p style={s.subtext}>
          These terms govern your access to and use of ARC Fitness. Please read them carefully
          before creating an account or beginning use of the Service.
        </p>
        <p style={s.effectiveDate}>
          Effective Date: <strong>[Effective Date]</strong> · Last Updated:{" "}
          <strong>[Last Updated Date]</strong>
        </p>
      </div>

      {/* ⚠ Critical Medical Disclaimer — must be most prominent */}
      <div style={s.criticalCard}>
        <p style={s.criticalTitle}>⚠ Critical Medical &amp; Fitness Disclaimer — Read Before Use</p>
        <p style={s.criticalText}>
          <strong>ARC Fitness provides fitness, nutritional, and wellness information for
          educational and informational purposes only. It is not a substitute for professional
          medical advice, diagnosis, or treatment.</strong> The workout plans, macro targets, habit
          suggestions, and AI assistant responses provided by ARC are generalised information tools,
          not personalised medical guidance. Always consult a qualified physician, dietitian, or
          certified personal trainer before beginning any new exercise programme, changing your
          diet, or making decisions about your physical health — particularly if you have a
          pre-existing medical condition, injury, or are pregnant. By using ARC, you acknowledge
          and accept that physical exercise carries inherent risks of injury, and you voluntarily
          assume all such risks. <strong>[Company Name]</strong> shall not be liable for any
          physical injury, health deterioration, or adverse outcome arising from your use of the
          Service.
        </p>
      </div>

      {/* Section 01 — Acceptance */}
      <SectionCard num="Section 01" title="Acceptance of Terms">
        <p style={s.p}>
          These Terms and Conditions (&quot;Terms&quot;) constitute a legally binding agreement
          between you (&quot;User&quot;, &quot;you&quot;) and{" "}
          <strong>[Company Name]</strong> (&quot;ARC&quot;, &quot;we&quot;, &quot;us&quot;,
          &quot;our&quot;), governing your use of the ARC Fitness mobile application (iOS &amp;
          Android), website at <strong>[Website URL]</strong>, and all associated services
          (collectively, the &quot;Service&quot;).
        </p>
        <p style={s.p}>
          By creating an account, downloading the app, or accessing any part of the Service, you
          confirm that you have read, understood, and agree to be bound by these Terms and our{" "}
          <strong>Privacy Policy</strong>, which is incorporated herein by reference.
        </p>
        <p style={s.p}>
          If you do not agree with these Terms, you must immediately discontinue use of the Service
          and, if applicable, cancel your subscription.
        </p>
        <div style={s.highlightBox}>
          <strong>Plain English Summary:</strong> By using ARC, you agree to these rules. If you
          disagree with anything here, please do not use the app.
        </div>
      </SectionCard>

      {/* Section 02 — Medical Disclaimer (Full) */}
      <SectionCard num="Section 02" title="Medical &amp; Fitness Disclaimer">
        <p style={s.p}>
          <strong>2.1 Not Medical Advice.</strong> All content, features, and functionality
          provided by ARC — including workout plans generated by our rules-based engine, daily
          macro and calorie targets, habit tracking guidance, and responses from the AI assistant —
          constitute general fitness and nutritional information only. <strong>Nothing within the
          Service constitutes medical advice, a medical diagnosis, a prescribed treatment plan, or
          professional dietary guidance.</strong>
        </p>

        <p style={s.p}>
          <strong>2.2 Consult a Professional.</strong> Before beginning any exercise programme or
          making significant dietary changes, you must consult a licensed physician or qualified
          healthcare provider, especially if you:
        </p>
        <ul style={s.ul}>
          <Bullet>Have a pre-existing medical condition (e.g., heart disease, diabetes, hypertension)</Bullet>
          <Bullet>Are pregnant or postpartum</Bullet>
          <Bullet>Have a current or recent injury or chronic pain</Bullet>
          <Bullet>Are under 18 years of age</Bullet>
          <Bullet>Have been inactive for an extended period</Bullet>
          <Bullet>Take prescription medications that may be affected by exercise or diet</Bullet>
        </ul>

        <p style={s.p}>
          <strong>2.3 Assumption of Risk.</strong> Physical exercise involves inherent risks,
          including muscle strain, joint injury, cardiovascular events, and in extreme cases,
          death. By using ARC, you voluntarily assume all risks associated with physical activity
          and acknowledge that you are physically capable of participating in the activities
          described.
        </p>

        <p style={s.p}>
          <strong>2.4 Workout Engine.</strong> ARC&apos;s workout plans are generated by a
          deterministic, rules-based algorithm (not AI) that selects exercise templates based on
          your stated preferences and goals. The engine operates on generalised population
          parameters and does <strong>not</strong> account for individual medical history,
          biomechanical limitations, or real-time physical condition.
        </p>

        <p style={s.p}>
          <strong>2.5 Nutritional Targets.</strong> Calorie and macronutrient targets are
          calculated using established formulae (e.g., Mifflin-St Jeor TDEE estimates) based on
          data you provide. These are estimates only. Individual metabolic variation, medical
          conditions, and medication interactions are not accounted for. Do not use ARC macro
          targets as a substitute for advice from a registered dietitian, especially if you have
          a specific health condition.
        </p>

        <p style={s.p}>
          <strong>2.6 Weight Targets.</strong> ARC does not recommend or endorse extreme weight
          loss or gain targets. The app is programmed to flag and decline requests for calorie
          targets that fall below safe thresholds. Nevertheless, you are responsible for setting
          goals that are appropriate for your individual health circumstances.
        </p>
      </SectionCard>

      {/* Section 03 — AI Disclaimer */}
      <SectionCard num="Section 03" title="AI Assistant — Scope &amp; Limitations">
        <p style={s.p}>
          ARC includes an in-app AI conversational assistant (&quot;AI Assistant&quot;) powered by
          third-party large language model (LLM) APIs. By using the AI Assistant, you explicitly
          acknowledge and agree to the following:
        </p>

        <h3 style={s.h3}>3.1 Permitted Scope</h3>
        <p style={s.p}>
          The AI Assistant is designed and restricted to answering questions related to:
        </p>
        <ul style={s.ul}>
          <Bullet>General exercise technique and form tips</Bullet>
          <Bullet>Explanations of fitness terminology and training concepts</Bullet>
          <Bullet>Simple macro and nutrition conversions (e.g., grams of protein per serving)</Bullet>
          <Bullet>General nutritional concepts and dietary information</Bullet>
        </ul>

        <h3 style={s.h3}>3.2 Prohibited Uses &amp; Hard Limits</h3>
        <p style={s.p}>
          The AI Assistant is programmed to refuse and is expressly prohibited from:
        </p>
        <ul style={s.ul}>
          <Bullet>Diagnosing injuries, pain, or medical symptoms</Bullet>
          <Bullet>Recommending specific medication dosages or supplements as medical treatment</Bullet>
          <Bullet>Providing advice that replaces a licensed physician, physiotherapist, or dietitian</Bullet>
          <Bullet>Generating personalised workout plans (this is handled by the deterministic engine)</Bullet>
          <Bullet>Recommending unsafe caloric deficits or extreme weight-loss protocols</Bullet>
        </ul>

        <h3 style={s.h3}>3.3 Hallucination &amp; Accuracy Disclaimer</h3>
        <div style={s.highlightBox}>
          <strong>Important:</strong> AI language models, including those powering the ARC
          Assistant, are capable of producing inaccurate, incomplete, or misleading information
          (commonly referred to as &quot;hallucinations&quot;). <strong>Do not rely on AI
          Assistant responses as definitive factual or medical guidance.</strong> Always verify
          AI-provided information with a qualified professional and with authoritative sources.
          [Company Name] accepts no liability for decisions made based on AI Assistant output.
        </div>

        <h3 style={s.h3}>3.4 No Trainer-Client Relationship</h3>
        <p style={s.p}>
          Use of the AI Assistant does not create a trainer-client, dietitian-client, or
          physician-patient relationship between you and [Company Name] or any of its employees,
          partners, or AI model providers.
        </p>
      </SectionCard>

      {/* Section 04 — Account Registration */}
      <SectionCard num="Section 04" title="Account Registration &amp; Eligibility">
        <p style={s.p}>
          <strong>4.1 Age Requirement.</strong> You must be at least{" "}
          <strong>16 years of age</strong> to create an account and use ARC. Users in
          jurisdictions where the minimum age for data processing consent is higher must meet that
          higher threshold. If you are under 18, you represent that you have obtained consent from
          a parent or legal guardian.
        </p>

        <p style={s.p}>
          <strong>4.2 Account Creation.</strong> All account registration is managed through our
          authentication provider, <strong>Clerk</strong>. You may register using an email address
          and password, or via Google or Apple OAuth. You agree to provide accurate and complete
          information during registration and to keep it up to date.
        </p>

        <p style={s.p}>
          <strong>4.3 Account Security.</strong> You are solely responsible for maintaining the
          confidentiality of your login credentials and for all activities that occur under your
          account. You must notify us immediately at <strong>[Support Email]</strong> if you
          suspect any unauthorised access to your account. ARC will not be liable for any loss
          arising from unauthorised use of your account.
        </p>

        <p style={s.p}>
          <strong>4.4 One Account Per Person.</strong> Each user may maintain only one active
          account. Creating multiple accounts to circumvent subscription requirements or usage
          limits is prohibited.
        </p>

        <p style={s.p}>
          <strong>4.5 Account Termination by ARC.</strong> We reserve the right to suspend or
          permanently terminate your account without prior notice if you violate these Terms,
          engage in fraudulent activity, or pose a security risk to the Service.
        </p>
      </SectionCard>

      {/* Section 05 — User Conduct */}
      <SectionCard num="Section 05" title="Acceptable Use &amp; User Conduct">
        <p style={s.p}>
          When using ARC, you agree that you will <strong>not</strong>:
        </p>
        <ul style={s.ul}>
          <Bullet>Use the Service for any unlawful purpose or in violation of any applicable laws</Bullet>
          <Bullet>
            Attempt to reverse engineer, decompile, disassemble, or extract source code from the
            app, backend API, or workout engine
          </Bullet>
          <Bullet>
            Use automated bots, scrapers, or scripts to access, query, or extract data from the
            Service
          </Bullet>
          <Bullet>
            Attempt to gain unauthorised access to other users&apos; accounts or data
          </Bullet>
          <Bullet>
            Transmit any malware, viruses, or harmful code through the Service
          </Bullet>
          <Bullet>
            Misuse the AI Assistant to generate harmful, dangerous, or illegal content
          </Bullet>
          <Bullet>
            Resell, sublicense, or commercially exploit any part of the Service without our
            written consent
          </Bullet>
          <Bullet>
            Impersonate any person, entity, or ARC employee
          </Bullet>
        </ul>
        <p style={s.p}>
          Violation of this section may result in immediate account termination and, where
          applicable, legal action.
        </p>
      </SectionCard>

      {/* Section 06 — Subscriptions & Billing */}
      <SectionCard num="Section 06" title="Subscriptions, Billing &amp; Refunds">
        <p style={s.p}>
          <strong>6.1 Subscription Model.</strong> ARC operates on a freemium subscription model.
          A free tier is available with limited features. Access to premium features (including
          advanced workout plans, full macro tracking, and AI assistant access) requires an active
          paid subscription.
        </p>

        <p style={s.p}>
          <strong>6.2 Billing.</strong> Subscription fees are billed on a recurring basis
          (monthly or annually, depending on your selected plan) via our payment processor.
          By providing your payment information, you authorise ARC to charge the applicable
          subscription fee at the start of each billing cycle automatically.
        </p>

        <p style={s.p}>
          <strong>6.3 Price Changes.</strong> We reserve the right to modify subscription pricing.
          We will provide at least <strong>30 days&apos; advance notice</strong> of any price
          changes via email or in-app notification. Continued use of the Service after the effective
          date of a price change constitutes acceptance of the new pricing.
        </p>

        <p style={s.p}>
          <strong>6.4 Cancellation.</strong> You may cancel your subscription at any time from:
        </p>
        <ul style={s.ul}>
          <Bullet>
            <strong>iOS:</strong> Apple App Store → Subscriptions → ARC Fitness
          </Bullet>
          <Bullet>
            <strong>Android:</strong> Google Play Store → Subscriptions → ARC Fitness
          </Bullet>
          <Bullet>
            <strong>Web:</strong> ARC Settings → Billing → Cancel Subscription
          </Bullet>
        </ul>
        <p style={s.p}>
          Cancellation takes effect at the <strong>end of your current billing period</strong>.
          You will retain access to premium features until that date. No partial refunds are issued
          for unused time within a billing period.
        </p>

        <p style={s.p}>
          <strong>6.5 Refunds.</strong> All purchases are final. We do not offer refunds for
          subscription fees already charged, except where required by applicable law (e.g., the
          EU Consumer Rights Directive, Australian Consumer Law) or where the Service has been
          materially non-functional due to an error on our part. To request a refund under these
          circumstances, contact <strong>[Support Email]</strong> within{" "}
          <strong>14 days</strong> of the charge.
        </p>

        <p style={s.p}>
          <strong>6.6 Free Trials.</strong> If we offer a free trial, your subscription will
          automatically convert to a paid subscription at the end of the trial period unless you
          cancel before the trial expires. We will send a reminder before the trial ends.
        </p>

        <p style={s.p}>
          <strong>6.7 Taxes.</strong> Stated prices are exclusive of taxes. You are responsible for
          all applicable taxes, VAT, GST, and similar charges imposed by your jurisdiction.
        </p>
      </SectionCard>

      {/* Section 07 — Intellectual Property */}
      <SectionCard num="Section 07" title="Intellectual Property">
        <p style={s.p}>
          <strong>7.1 ARC Ownership.</strong> All rights, title, and interest in and to the
          Service — including but not limited to the ARC brand, logo, app design, UI/UX, source
          code, the proprietary workout generation engine logic (
          <code style={{ color: "var(--accent2)", fontSize: "13px" }}>packages/fitness-core</code>
          ), exercise database, nutritional calculation formulae, and all associated intellectual
          property — are owned exclusively by <strong>[Company Name]</strong> and are protected
          by applicable copyright, trademark, and intellectual property laws.
        </p>

        <p style={s.p}>
          <strong>7.2 Limited Licence.</strong> Subject to your compliance with these Terms and
          payment of applicable fees, we grant you a limited, non-exclusive, non-transferable,
          revocable licence to download and use the ARC app on your personal devices solely for
          your personal, non-commercial fitness and health tracking purposes.
        </p>

        <p style={s.p}>
          <strong>7.3 Restrictions.</strong> You may not:
        </p>
        <ul style={s.ul}>
          <Bullet>Copy, modify, distribute, sell, or lease any part of the Service</Bullet>
          <Bullet>
            Reverse engineer or attempt to extract the source code of the workout engine or any
            other proprietary component
          </Bullet>
          <Bullet>Remove or alter any proprietary notices or labels</Bullet>
          <Bullet>Use ARC&apos;s trademarks or branding without explicit written permission</Bullet>
        </ul>

        <p style={s.p}>
          <strong>7.4 Your Content.</strong> You retain ownership of any health data, workout
          logs, and personal information you submit to ARC. By submitting this data, you grant us
          a worldwide, non-exclusive, royalty-free licence to process, store, and use it solely
          for the purposes described in our Privacy Policy and these Terms.
        </p>
      </SectionCard>

      {/* Section 08 — Limitation of Liability */}
      <SectionCard num="Section 08" title="Limitation of Liability">
        <p style={s.p}>
          <strong>8.1 &quot;As Is&quot; Service.</strong> THE SERVICE IS PROVIDED &quot;AS IS&quot;
          AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED,
          INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
          PARTICULAR PURPOSE, NON-INFRINGEMENT, AND ACCURACY.
        </p>

        <p style={s.p}>
          <strong>8.2 Liability Cap.</strong> TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW,
          IN NO EVENT SHALL [COMPANY NAME], ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS,
          SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
          CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
        </p>
        <ul style={s.ul}>
          <Bullet>Personal injury or physical harm arising from exercise performed based on ARC content</Bullet>
          <Bullet>Loss of data or unauthorised access to your account (except through our negligence)</Bullet>
          <Bullet>Errors, inaccuracies, or omissions in AI Assistant responses</Bullet>
          <Bullet>Service downtime, interruptions, or technical failures</Bullet>
          <Bullet>Decisions made based on macro calculations, workout plans, or habit tracking data</Bullet>
        </ul>

        <p style={s.p}>
          <strong>8.3 Maximum Aggregate Liability.</strong> Our total aggregate liability to you
          for any and all claims arising from or related to the Service shall not exceed the
          greater of: (a) the total amount paid by you to ARC in the{" "}
          <strong>12 months</strong> immediately preceding the event giving rise to the claim, or
          (b) <strong>[Minimum Liability Amount — e.g. USD $50]</strong>.
        </p>

        <p style={s.p}>
          <strong>8.4 Jurisdictional Limitations.</strong> Some jurisdictions do not allow the
          exclusion of certain warranties or limitation of liability for certain types of damages.
          In such jurisdictions, our liability will be limited to the fullest extent permitted by
          applicable law.
        </p>
      </SectionCard>

      {/* Section 09 — Indemnification */}
      <SectionCard num="Section 09" title="Indemnification">
        <p style={s.p}>
          You agree to indemnify, defend, and hold harmless <strong>[Company Name]</strong> and
          its officers, directors, employees, agents, and partners from and against any and all
          claims, liabilities, damages, losses, costs, and expenses (including reasonable
          attorneys&apos; fees) arising out of or in any way connected with:
        </p>
        <ul style={s.ul}>
          <Bullet>Your use of or access to the Service</Bullet>
          <Bullet>Your violation of these Terms</Bullet>
          <Bullet>Your violation of any applicable laws or regulations</Bullet>
          <Bullet>
            Your provision of false, inaccurate, or misleading health data during onboarding
          </Bullet>
          <Bullet>
            Any injury or damage caused by physical activities undertaken in reliance on ARC content
          </Bullet>
          <Bullet>Your infringement of any intellectual property or other rights of any person</Bullet>
        </ul>
      </SectionCard>

      {/* Section 10 — Third-Party Services */}
      <SectionCard num="Section 10" title="Third-Party Services">
        <p style={s.p}>
          ARC integrates with third-party services including Clerk (authentication), Neon DB
          (database), PostHog (analytics), Sentry (monitoring), Railway (hosting), and AI model
          providers (OpenAI / Google Gemini). Your use of these services is also subject to their
          respective terms and privacy policies.
        </p>
        <p style={s.p}>
          ARC is not responsible for the practices, availability, or content of third-party
          services. Links or references to third-party services do not constitute an endorsement.
        </p>
      </SectionCard>

      {/* Section 11 — Service Availability & Modifications */}
      <SectionCard num="Section 11" title="Service Availability &amp; Modifications">
        <p style={s.p}>
          <strong>11.1 Availability.</strong> We strive to maintain high availability but do not
          guarantee uninterrupted access to the Service. Scheduled maintenance, unexpected
          outages, or third-party service failures may cause temporary unavailability. We will
          endeavour to provide advance notice of planned downtime.
        </p>
        <p style={s.p}>
          <strong>11.2 Feature Modifications.</strong> We reserve the right at any time to modify,
          suspend, or discontinue any feature or the Service as a whole, with or without notice.
          Material changes affecting paid subscribers will be communicated with reasonable notice.
        </p>
        <p style={s.p}>
          <strong>11.3 Offline Support.</strong> ARC provides limited offline functionality via
          locally cached data on your device. We do not guarantee the accuracy or completeness
          of offline data, particularly after extended periods without synchronisation.
        </p>
      </SectionCard>

      {/* Section 12 — Termination */}
      <SectionCard num="Section 12" title="Termination">
        <p style={s.p}>
          <strong>12.1 By You.</strong> You may terminate your agreement with us at any time by
          deleting your account and uninstalling the application. Account deletion instructions are
          described in our Privacy Policy.
        </p>
        <p style={s.p}>
          <strong>12.2 By ARC.</strong> We may terminate or suspend your account immediately and
          without prior notice if we determine, in our sole discretion, that you have violated
          these Terms, engaged in fraudulent activity, or if we are required to do so by law.
        </p>
        <p style={s.p}>
          <strong>12.3 Effect of Termination.</strong> Upon termination, your licence to use the
          Service will immediately cease. Provisions of these Terms that by their nature should
          survive termination shall survive, including Sections 7 (Intellectual Property),
          8 (Limitation of Liability), and 9 (Indemnification).
        </p>
      </SectionCard>

      {/* Section 13 — Governing Law & Dispute Resolution */}
      <SectionCard num="Section 13" title="Governing Law &amp; Dispute Resolution">
        <p style={s.p}>
          <strong>13.1 Governing Law.</strong> These Terms shall be governed by and construed in
          accordance with the laws of <strong>[Governing Jurisdiction / Country]</strong>, without
          regard to its conflict of law provisions.
        </p>
        <p style={s.p}>
          <strong>13.2 Informal Resolution.</strong> Before initiating any formal legal
          proceeding, you agree to first contact us at <strong>[Legal Contact Email]</strong>{" "}
          and provide a written description of your complaint. We will endeavour to resolve the
          dispute informally within <strong>30 days</strong>.
        </p>
        <p style={s.p}>
          <strong>13.3 Jurisdiction.</strong> Any legal action or proceeding arising out of these
          Terms shall be brought exclusively in the courts of{" "}
          <strong>[Governing Jurisdiction / Venue]</strong>, and you consent to personal
          jurisdiction in such courts.
        </p>
        <p style={s.p}>
          <strong>13.4 EU / EEA Users.</strong> If you are a consumer resident in the European
          Union or EEA, you may also be entitled to bring claims in the courts of your country of
          residence, and mandatory consumer protection rights in your jurisdiction are not affected
          by these Terms.
        </p>
      </SectionCard>

      {/* Section 14 — Changes to Terms */}
      <SectionCard num="Section 14" title="Changes to These Terms">
        <p style={s.p}>
          We reserve the right to modify these Terms at any time. We will notify you of material
          changes by:
        </p>
        <ul style={s.ul}>
          <Bullet>Updating the &quot;Last Updated&quot; date at the top of this page</Bullet>
          <Bullet>Sending an in-app notification or email to registered users</Bullet>
          <Bullet>
            For material changes affecting paid subscriptions, providing at least 30 days&apos;
            advance notice
          </Bullet>
        </ul>
        <p style={s.p}>
          Your continued use of the Service after the effective date of any changes constitutes
          your acceptance of the modified Terms. If you do not agree with the updated Terms, you
          must stop using the Service.
        </p>
      </SectionCard>

      {/* Section 15 — General Provisions */}
      <SectionCard num="Section 15" title="General Provisions">
        <p style={s.p}>
          <strong>Entire Agreement.</strong> These Terms, together with our Privacy Policy,
          constitute the entire agreement between you and [Company Name] with respect to the
          Service and supersede all prior agreements, negotiations, and communications.
        </p>
        <p style={s.p}>
          <strong>Severability.</strong> If any provision of these Terms is found to be
          unenforceable, that provision shall be modified to the minimum extent necessary to make
          it enforceable, and the remaining provisions shall continue in full force and effect.
        </p>
        <p style={s.p}>
          <strong>Waiver.</strong> Our failure to enforce any right or provision of these Terms
          shall not constitute a waiver of that right or provision.
        </p>
        <p style={s.p}>
          <strong>Assignment.</strong> You may not assign or transfer your rights or obligations
          under these Terms without our prior written consent. We may assign our rights and
          obligations without restriction.
        </p>
        <p style={s.p}>
          <strong>Force Majeure.</strong> [Company Name] shall not be liable for any failure or
          delay in performance resulting from causes beyond our reasonable control, including acts
          of God, natural disasters, war, government action, or third-party infrastructure
          failures.
        </p>
        <p style={s.p}>
          <strong>Contact.</strong> For general enquiries about these Terms, contact us at:{" "}
          <strong>[Legal Contact Email]</strong>.
        </p>
      </SectionCard>

      <hr style={s.divider} />

      {/* Contact */}
      <div style={s.contactCard}>
        <span style={{ fontSize: "28px", display: "block", marginBottom: "12px" }}>⚖️</span>
        <h2 style={{ ...s.h2, marginBottom: "10px", textAlign: "center" }}>
          Questions About These Terms?
        </h2>
        <p style={{ ...s.p, textAlign: "center" }}>
          Reach out to our legal team and we will respond within 5 business days.
        </p>
        <p
          style={{
            textAlign: "center",
            fontWeight: 700,
            fontSize: "16px",
            color: "var(--accent2)",
          }}
        >
          [Legal Contact Email]
        </p>
        <p style={{ ...s.p, textAlign: "center", marginTop: "8px", fontSize: "13px" }}>
          <strong>[Company Name]</strong> · [Registered Address]
        </p>
      </div>
    </div>
  );
}
