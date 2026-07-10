"use client";
import React from "react";
import { useState } from "react";

interface WaitlistFormProps {
  onSuccess: (data: { position: number; referralCode: string; totalCount: number; alreadyRegistered?: boolean }) => void;
  initialCount: number;
  referralCode?: string;
}

export default function WaitlistForm({ onSuccess, initialCount, referralCode }: WaitlistFormProps): React.JSX.Element | Promise<React.JSX.Element> {
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
        setFocused(false); // trigger visual shake if error
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
      setFocused(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "480px" }}>
      <div 
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "10px",
          animation: error ? "shake 0.4s cubic-bezier(.36,.07,.19,.97) both" : "none",
        }}
      >
        <style>{`
          @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
            40%, 60% { transform: translate3d(3px, 0, 0); }
          }
          @keyframes pulseGlow {
            0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
            100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
          }
        `}</style>
        
        <div
          id="waitlist"
          className="waitlist-pill-wrapper"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(4,5,15,0.7)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: `1px solid ${focused ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)"}`,
            boxShadow: focused
              ? "0 0 0 1px rgba(255,255,255,0.3), 0 24px 40px rgba(0,0,0,0.6), inset 0 2px 10px rgba(0,0,0,1)"
              : "0 20px 40px rgba(0,0,0,0.5), inset 0 2px 10px rgba(0,0,0,0.8)",
            borderRadius: "7.5rem",
            padding: "6px 6px 6px 1.25rem",
            transition: "all 0.3s ease",
            scrollMarginTop: "120px",
            transform: focused ? "translateY(-1px)" : "translateY(0)",
          }}
        >
          
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

          <button
            type="submit"
            disabled={loading}
            className="btn-primary animate-gradient-shift"
            style={{
              height: "2.75rem",
              padding: "0 1.5rem",
              fontSize: "0.875rem",
              fontWeight: 800,
              flexShrink: 0,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
              background: "linear-gradient(135deg, rgba(37,99,235,0.9) 0%, rgba(37,99,235,0.9) 42%, rgba(96,165,250,0.8) 50%, rgba(37,99,235,0.9) 58%, rgba(37,99,235,0.9) 100%)",
              color: "#FFFFFF",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 6px 20px rgba(37,99,235,0.4), inset 0 1px 1px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderRadius: "100px",
              transition: "transform 0.2s ease"
            }}
          >
            {loading ? (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.875rem",
                  animation: "arcFadeIn 0.3s ease",
                }}
              >
                <div style={{
                  width: "14px", height: "14px", 
                  borderRadius: "50%", 
                  background: "#fff",
                  animation: "pulseGlow 1.5s infinite"
                }} />
                Securing...
              </span>
            ) : (
              "Claim Early Access →"
            )}
          </button>
        </div>

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
