import Link from "next/link";

export default function Home(): React.JSX.Element {
  return (
    <div className="arc-landing">
      {/* NAV */}
      <nav className="arc-nav">
        <span className="arc-wordmark">ARC</span>
        <div className="arc-nav-links">
          <Link href="/sign-in" className="arc-btn-ghost">Sign In</Link>
          <Link href="/sign-up" className="arc-btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="arc-hero">
        <div className="arc-hero-glow" />
        <div className="arc-hero-content">
          <div className="arc-badge">SDK 54 · Expo · Next.js 16</div>
          <h1 className="arc-headline">
            Your fitness,<br />
            <span className="arc-gradient-text">engineered.</span>
          </h1>
          <p className="arc-subtext">
            AI-generated workout splits, precision macro tracking, and real-time
            habit streaks — all synced across web and mobile.
          </p>
          <div className="arc-cta-group">
            <Link href="/sign-up" className="arc-btn-hero" id="cta-signup">
              Start for free →
            </Link>
            <Link href="/sign-in" className="arc-btn-outline" id="cta-signin">
              Already have an account
            </Link>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="arc-stats">
          {[
            { label: "Workout Plans", value: "∞" },
            { label: "Macro Accuracy", value: "99%" },
            { label: "Avg Streak", value: "21d" },
          ].map((s) => (
            <div key={s.label} className="arc-stat-card">
              <span className="arc-stat-value">{s.value}</span>
              <span className="arc-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURE GRID */}
      <section className="arc-features">
        {[
          {
            icon: "⚡",
            title: "AI Workout Generation",
            desc: "Adaptive splits based on your goals, schedule, equipment, and experience level.",
          },
          {
            icon: "🎯",
            title: "Macro Calculator",
            desc: "Precise protein, carb, and fat targets calculated from your body metrics and goal.",
          },
          {
            icon: "📊",
            title: "Admin Dashboard",
            desc: "Full visibility over user onboarding, engagement metrics, and habit completion.",
          },
          {
            icon: "📱",
            title: "Mobile App",
            desc: "Native Expo app — log sessions, track habits, and hit your macros on the go.",
          },
        ].map((f) => (
          <div key={f.title} className="arc-feature-card">
            <span className="arc-feature-icon">{f.icon}</span>
            <h3 className="arc-feature-title">{f.title}</h3>
            <p className="arc-feature-desc">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="arc-footer">
        <span className="arc-wordmark-sm">ARC</span>
        <span className="arc-footer-copy">© {new Date().getFullYear()} ARC Fitness Platform</span>
      </footer>
    </div>
  );
}
