"use client";

import { useState } from "react";

interface ConfirmationScreenProps {
  position: number;
  referralCode: string;
  totalCount: number;
  alreadyRegistered?: boolean;
}

export default function ConfirmationScreen({
  position,
  referralCode,
  totalCount,
  alreadyRegistered,
}: ConfirmationScreenProps) {
  const [copied, setCopied] = useState(false);

  const appUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://arcfitness.app";
  const referralLink = `${appUrl}?ref=${referralCode}`;

  const twitterText = encodeURIComponent(
    `Just joined the @ARCFitnessApp waitlist! I'm #${position} in line for the AI fitness app changing everything.\n\nJoin me → ${referralLink}`
  );

  const whatsappText = encodeURIComponent(
    `I just signed up for ARC Fitness — an AI fitness coach launching soon 🔥 Use my link to join and we both move up the waitlist: ${referralLink}`
  );

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* fallback */ }
  }

  const positionPercent = Math.min(95, Math.max(5, ((totalCount - position) / totalCount) * 100));

  return (
    <div
      className="animate-scale-up"
      style={{
        width: "100%",
        maxWidth: "520px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {/* Success header */}
      <div
        className="card-glass"
        style={{
          textAlign: "center",
          padding: "2rem 1.5rem 1.75rem",
          borderColor: "rgba(59,130,246,0.25)",
        }}
      >
        <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{alreadyRegistered ? "👋" : "🎉"}</div>
        <h3
          style={{
            fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
            fontWeight: 500,
            color: "#FFFFFF",
            letterSpacing: "-0.015em",
            marginBottom: "0.5rem",
          }}
        >
          {alreadyRegistered ? (
            <>You&apos;re already <span style={{ color: "var(--arc-blue)" }}>#{position}</span> in line!</>
          ) : (
            <>You&apos;re <span style={{ color: "var(--arc-blue)" }}>#{position}</span> on the waitlist!</>
          )}
        </h3>
        <p style={{ color: "var(--arc-text-secondary)", fontSize: "0.875rem" }}>
          Share your link — each referral moves you up 5 spots.
        </p>

        {/* Progress bar */}
        <div
          style={{
            marginTop: "1.25rem",
            height: "4px",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "100px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${positionPercent}%`,
              background: "linear-gradient(90deg, #3B82F6, #93C5FD)",
              borderRadius: "100px",
              transition: "width 1.2s cubic-bezier(0.23,1,0.32,1)",
            }}
          />
        </div>
        <p style={{ color: "var(--arc-text-muted)", fontSize: "0.75rem", marginTop: "0.5rem" }}>
          Each referral = +5 positions
        </p>
      </div>

      {/* Referral link */}
      <div
        className="card-glass"
        style={{ padding: "1.25rem", borderColor: "rgba(34,197,94,0.20)" }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "var(--arc-success)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: "0.625rem",
          }}
        >
          Your referral link
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "0.5rem",
            padding: "0.625rem 0.875rem",
          }}
        >
          <span
            style={{
              flex: 1,
              fontSize: "0.8125rem",
              color: "var(--arc-text-muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap" as const,
              fontFamily: "monospace",
            }}
          >
            {referralLink}
          </span>
          <button
            onClick={copyLink}
            id="copy-referral-link"
            style={{
              padding: "5px 14px",
              background: copied ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.07)",
              border: `1px solid ${copied ? "rgba(34,197,94,0.35)" : "rgba(255,255,255,0.10)"}`,
              borderRadius: "6px",
              color: copied ? "var(--arc-success)" : "var(--arc-text-secondary)",
              fontSize: "0.75rem",
              fontWeight: 500,
              cursor: "pointer",
              whiteSpace: "nowrap" as const,
              transition: "all 0.2s",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Share buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <p
          style={{
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "var(--arc-text-muted)",
            textAlign: "center",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Share &amp; move up the list
        </p>

        <div style={{ display: "flex", gap: "0.625rem" }}>
          {/* X / Twitter */}
          <a
            href={`https://twitter.com/intent/tweet?text=${twitterText}`}
            target="_blank"
            rel="noopener noreferrer"
            id="share-twitter"
            className="btn-ghost"
            style={{ flex: 1, justifyContent: "center" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,0,0,0.35)";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share on X
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            id="share-whatsapp"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "0 1.25rem",
              height: "3rem",
              background: "rgba(37,211,102,0.08)",
              border: "1px solid rgba(37,211,102,0.22)",
              borderRadius: "var(--radius-pill)",
              color: "#25D366",
              fontSize: "0.9375rem",
              fontWeight: 500,
              cursor: "pointer",
              textDecoration: "none",
              transition: "background 0.2s ease, border-color 0.2s ease",
              whiteSpace: "nowrap" as const,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(37,211,102,0.15)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(37,211,102,0.40)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(37,211,102,0.08)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(37,211,102,0.22)";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
