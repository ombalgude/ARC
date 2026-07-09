"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

interface ConfirmationScreenProps {
  position: number;
  referralCode: string;
  totalCount: number;
  alreadyRegistered?: boolean;
  onClose?: () => void;
}

export default function ConfirmationScreen({
  position,
  referralCode,
  totalCount,
  alreadyRegistered,
  onClose,
}: ConfirmationScreenProps) {
  const [copied, setCopied] = useState(false);

  const appUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://arcfitness.app";
  const referralLink = `${appUrl}?ref=${referralCode}`;

  const twitterText = encodeURIComponent(
    `I just claimed my spot for ARC Fitness—the ultimate app for people who take training seriously. Use my link to join and we both jump ahead in line! ${referralLink}`
  );

  const whatsappText = encodeURIComponent(
    `Just locked in my spot for ARC. It's a massive upgrade that perfectly plans your workouts and meals. Use my link to get in, and we both skip the waitlist: ${referralLink}`
  );

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {  }
  }

  async function nativeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "ARC Fitness",
          text: `I'm #${position} on the waitlist for ARC Fitness 🔥 Join me:`,
          url: referralLink,
        });
      } catch (err) {}
    } else {
      copyLink(); 
    }
  }

  function shareWhatsApp() {
    const waLink = `whatsapp://send?text=${whatsappText}`;
    const waWebLink = `https://api.whatsapp.com/send?text=${whatsappText}`;
    if (typeof navigator !== "undefined" && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      window.location.href = waLink;
    } else {
      window.open(waWebLink, "_blank");
    }
  }

  useEffect(() => {
    
    const duration = 2500;
    const end = Date.now() + duration;

    const colors = ["#3B82F6", "#60A5FA", "#FFFFFF"];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
        disableForReducedMotion: true,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  useEffect(() => {
    if (!onClose) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const positionPercent = Math.min(95, Math.max(5, ((totalCount - position) / totalCount) * 100));

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        animation: "arcFadeUp 0.4s ease-out forwards",
      }}
    >
      
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: "800px",
          height: "100%",
          background: "radial-gradient(circle at center, rgba(37,99,235,0.15) 0%, rgba(37,99,235,0.03) 40%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className="card-glass animate-scale-up"
        style={{
          width: "100%",
          maxWidth: "420px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          padding: "2.5rem 2rem",
          background: "rgba(4, 5, 15, 0.75)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "24px",
          boxShadow: "0 40px 100px rgba(0,0,0,0.8), 0 0 40px rgba(37,99,235,0.15), inset 0 1px 2px rgba(255,255,255,0.1)",
          zIndex: 1,
        }}
      >
        
        {onClose && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close modal"
            style={{
              position: "absolute",
              top: "1.25rem",
              right: "1.25rem",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.5)",
              width: "2.25rem",
              height: "2.25rem",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s cubic-bezier(0.23, 1, 0.32, 1)",
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "#FFFFFF";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              e.currentTarget.style.color = "rgba(255,255,255,0.5)";
              e.currentTarget.style.transform = "scale(1)";
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}

        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{ 
            width: "64px", height: "64px", margin: "0 auto 1.25rem", 
            background: "linear-gradient(135deg, rgba(37,99,235,0.2) 0%, rgba(96,165,250,0.05) 100%)",
            border: "1px solid rgba(96,165,250,0.3)",
            borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(37,99,235,0.3), inset 0 2px 4px rgba(255,255,255,0.1)"
          }}>
            <span style={{ fontSize: "1.75rem" }}>{alreadyRegistered ? "👋" : "🎫"}</span>
          </div>
          <h3
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
              marginBottom: "0.5rem",
            }}
          >
            {alreadyRegistered ? (
              <>You&apos;re <span style={{ color: "var(--arc-blue)" }}>#{position}</span> in line</>
            ) : (
              <>You&apos;re <span style={{ color: "var(--arc-blue)" }}>#{position}</span> in line!</>
            )}
          </h3>
          <p style={{ color: "var(--arc-text-secondary)", fontSize: "0.875rem", lineHeight: 1.6, marginTop: "0.5rem" }}>
            Want to skip the wait? The first 500 people get 3 months of Pro for free. Share your link to jump 5 spots ahead for every friend who joins.
          </p>

          <div
            style={{
              marginTop: "1.5rem",
              height: "6px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "100px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.05)",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)"
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${positionPercent}%`,
                background: "linear-gradient(90deg, #1E3A8A, #3B82F6, #93C5FD)",
                borderRadius: "100px",
                boxShadow: "0 0 10px rgba(59,130,246,0.5)",
                transition: "width 1.2s cubic-bezier(0.23,1,0.32,1)",
              }}
            />
          </div>
        </div>

        <div
          style={{
            padding: "1.25rem",
            background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
            borderRadius: "1rem",
            border: "1px solid rgba(255,255,255,0.08)",
            marginBottom: "1.5rem",
            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.05)"
          }}
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

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.25rem", marginTop: "0.5rem" }}>
          <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15))" }} />
          <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Share &amp; Move Up
          </span>
          <div style={{ height: "1px", flex: 1, background: "linear-gradient(270deg, transparent, rgba(255,255,255,0.15))" }} />
        </div>

        <div className="animate-fade-in" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.75rem" }}>

          <button
            onClick={nativeShare}
            className="btn-ghost"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "4rem",
              padding: "0 1rem 0 0.75rem",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.05)",
              color: "#FFFFFF",
              borderRadius: "1rem",
              transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 10px 30px -10px rgba(225, 48, 108, 0.4), inset 0 1px 1px rgba(255,255,255,0.1)";
              e.currentTarget.style.background = "linear-gradient(90deg, rgba(225, 48, 108, 0.1), rgba(131, 58, 180, 0.1))";
              e.currentTarget.style.borderColor = "rgba(225, 48, 108, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "inset 0 1px 1px rgba(255,255,255,0.05)";
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = "translateY(1px)"}
            onMouseUp={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "50%", background: "rgba(225, 48, 108, 0.1)", border: "1px solid rgba(225, 48, 108, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </div>
              <span style={{ fontSize: "0.9375rem", fontWeight: 500, letterSpacing: "-0.01em" }}>Share on Instagram</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>

          <button
            onClick={shareWhatsApp}
            className="btn-ghost"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "4rem",
              padding: "0 1rem 0 0.75rem",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.05)",
              color: "#FFFFFF",
              borderRadius: "1rem",
              transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 10px 30px -10px rgba(37, 211, 102, 0.4), inset 0 1px 1px rgba(255,255,255,0.1)";
              e.currentTarget.style.background = "linear-gradient(90deg, rgba(37, 211, 102, 0.1), rgba(18, 140, 126, 0.1))";
              e.currentTarget.style.borderColor = "rgba(37, 211, 102, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "inset 0 1px 1px rgba(255,255,255,0.05)";
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = "translateY(1px)"}
            onMouseUp={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "50%", background: "rgba(37, 211, 102, 0.1)", border: "1px solid rgba(37, 211, 102, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              </div>
              <span style={{ fontSize: "0.9375rem", fontWeight: 500, letterSpacing: "-0.01em" }}>Share on WhatsApp</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            
            <a
              href={`https://twitter.com/intent/tweet?text=${twitterText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.625rem",
                height: "3.5rem",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.05)",
                color: "#FFFFFF",
                textDecoration: "none",
                borderRadius: "1rem",
                transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = "translateY(1px)"}
              onMouseUp={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>Post to X</span>
            </a>

            <button
              onClick={copyLink}
              className="btn-ghost"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.625rem",
                height: "3.5rem",
                background: copied ? "rgba(34, 197, 94, 0.15)" : "rgba(255, 255, 255, 0.03)",
                border: `1px solid ${copied ? "rgba(34, 197, 94, 0.4)" : "rgba(255, 255, 255, 0.08)"}`,
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.05)",
                color: copied ? "var(--arc-success)" : "#FFFFFF",
                borderRadius: "1rem",
                transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
              }}
              onMouseEnter={(e) => {
                if (!copied) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                }
              }}
              onMouseLeave={(e) => {
                if (!copied) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                }
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = "translateY(1px)"}
              onMouseUp={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            >
              {copied ? (
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
              )}
              <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{copied ? "Copied!" : "Copy Link"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
