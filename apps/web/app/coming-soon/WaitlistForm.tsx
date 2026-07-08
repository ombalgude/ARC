"use client";

import { useState } from "react";

interface WaitlistFormProps {
  onSuccess: (data: { position: number; referralCode: string; totalCount: number; alreadyRegistered?: boolean }) => void;
  initialCount: number;
  referralCode?: string;
}

export default function WaitlistForm({ onSuccess, initialCount, referralCode }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/waitlist/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, referralCode }),
      });

      const data = await res.json() as {
        success?: boolean;
        alreadyRegistered?: boolean;
        position?: number;
        referralCode?: string;
        totalCount?: number;
        error?: string;
      };

      if (!res.ok || data.error) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      onSuccess({
        position: data.position ?? 1,
        referralCode: data.referralCode ?? "",
        totalCount: data.totalCount ?? initialCount,
        alreadyRegistered: data.alreadyRegistered,
      });
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "480px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Input + button row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: `1px solid ${focused ? "rgba(59,130,246,0.50)" : "rgba(255,255,255,0.12)"}`,
            borderRadius: "7.5rem",
            padding: "6px 6px 6px 1.25rem",
            transition: "border-color 0.2s ease",
          }}
        >
          {/* Email icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            style={{ flexShrink: 0, color: focused ? "var(--arc-blue)" : "rgba(255,255,255,0.35)", transition: "color 0.2s" }}
          >
            <path
              d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
              fill="currentColor"
            />
          </svg>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Enter your email"
            required
            id="waitlist-email"
            autoComplete="email"
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              fontSize: "0.9375rem",
              color: "#FFFFFF",
              padding: "0.75rem 0",
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
            }}
          />

          {/* CTA Button — inside pill */}
          <button
            type="submit"
            disabled={loading}
            id="waitlist-submit"
            className="btn-primary"
            style={{
              height: "2.5rem",
              padding: "0 1.25rem",
              fontSize: "0.875rem",
              flexShrink: 0,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? (
              <span
                className="animate-spin"
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  display: "inline-block",
                }}
              />
            ) : (
              "Get Early Access →"
            )}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <p
            style={{
              color: "var(--arc-error)",
              fontSize: "0.8125rem",
              textAlign: "center",
              animation: "arcFadeIn 0.3s ease",
            }}
          >
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
