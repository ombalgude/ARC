"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { CheckCircle, Trophy, Copy, Share2, MessageCircle } from "lucide-react";
import React from "react";
import { CountdownTimer } from "../../components/CountdownTimer";

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
}: ConfirmationScreenProps): React.JSX.Element {
  const [copied, setCopied] = useState(false);

  const [appUrl, setAppUrl] = useState("https://arcfitness.app");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAppUrl(window.location.origin);
    }
  }, []);

  const referralLink = `${appUrl}?ref=${referralCode}`;

  const twitterText = encodeURIComponent(
    `Just secured my spot for ARC Fitness. I'm #${position} in line — the ultimate fitness copilot for people who actually want results. Use my link and we both jump the queue: ${referralLink} #ARCFitness`
  );

  const whatsappText = encodeURIComponent(
    `I just locked my spot for ARC — an intelligent engine that plans your progression and removes all guesswork. I'm #${position} in line. Use my link and we both skip 5 spots instantly: ${referralLink}`
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
          text: `I'm #${position} on the ARC waitlist. Invite 3 friends and you can skip 15 spots. Join me:`,
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
    // Lock background scroll while modal is open
    document.body.style.overflow = "hidden";
    
    // Stop Lenis smooth scroll if it exists
    if (typeof window !== "undefined" && (window as any).lenis) {
      (window as any).lenis.stop();
    }

    const duration = 2500;
    const end = Date.now() + duration;
    const colors = ["#3B82F6", "#60A5FA", "#FFFFFF"];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        startVelocity: 55,
        origin: { x: 0, y: 0.9 },
        colors: colors,
        disableForReducedMotion: true,
        zIndex: 10000,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        startVelocity: 55,
        origin: { x: 1, y: 0.9 },
        colors: colors,
        disableForReducedMotion: true,
        zIndex: 10000,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    return () => {
      document.body.style.overflow = "";
      if (typeof window !== "undefined" && (window as any).lenis) {
        (window as any).lenis.start();
      }
    };
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
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
          padding: "1.5rem",
          background: "rgba(4, 5, 15, 0.4)",
          backdropFilter: "blur(60px) saturate(180%)",
          WebkitBackdropFilter: "blur(60px) saturate(180%)",
        }}
        className="modal-overlay-inner"
      >
      <style>{`
        .modal-close-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.5);
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 10;
        }
        .modal-close-btn:hover {
          background: rgba(255,255,255,0.1);
          color: #FFFFFF;
        }
        .waitlist-copy-btn {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          height: 3rem !important; /* 48px */
          padding: 0 1.5rem !important;
          min-width: 110px; /* Prevent jitter when text changes to COPIED */
          background: #3B82F6;
          border: none;
          border-radius: 12px;
          color: #FFFFFF;
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .waitlist-copy-btn:hover {
          background: #2563EB;
        }
        .waitlist-copy-btn-success {
          background: #22C55E;
        }
        .waitlist-copy-btn-success:hover {
          background: #16A34A;
        }
        .share-buttons-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .share-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          height: 3.5rem; /* 56px */
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .share-btn-instagram { color: #E1306C; }
        .share-btn-instagram:hover {
          background: rgba(225,48,108,0.12);
          border-color: rgba(225,48,108,0.3);
        }
        .share-btn-whatsapp { color: #25D366; }
        .share-btn-whatsapp:hover {
          background: rgba(37,211,102,0.12);
          border-color: rgba(37,211,102,0.3);
        }
        .share-btn-x { color: #FFFFFF; }
        .share-btn-x:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
        }
        .share-btn-native { color: #3B82F6; }
        .share-btn-native:hover {
          background: rgba(59,130,246,0.12);
          border-color: rgba(59,130,246,0.3);
        }
        @media (max-width: 480px) {
          .modal-card {
            padding: 1.25rem 1rem !important;
            max-height: 88vh !important;
          }
          .modal-card h3 {
            font-size: 1.6rem !important;
          }
          .share-buttons-grid {
            grid-template-columns: 1fr !important;
          }
          .share-btn {
            height: 2.75rem !important;
          }
          .modal-progress-block {
            margin-top: 1.25rem !important;
          }
          .modal-timer-block {
            margin-bottom: 1.25rem !important;
          }
          .modal-header-block {
            margin-bottom: 1rem !important;
          }
        }
        @media (max-width: 380px) {
          .modal-overlay-inner {
            padding: 0.5rem !important;
          }
        }
      `}</style>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "120%",
          height: "120%",
          background: "radial-gradient(circle at center, rgba(37,99,235,0.1) 0%, transparent 60%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <motion.div
        className="modal-card"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "440px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          padding: "2rem 2rem",
          maxHeight: "95vh",
          overflowY: "auto",
          background: "linear-gradient(180deg, rgba(10, 15, 30, 0.7) 0%, rgba(4, 5, 15, 0.9) 100%)",
          backdropFilter: "blur(40px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "32px",
          boxShadow: "0 40px 100px -20px rgba(0,0,0,1), 0 0 40px rgba(37,99,235,0.15), inset 0 2px 20px rgba(255,255,255,0.05), inset 0 1px 1px rgba(255,255,255,0.2)",
          zIndex: 1,
        }}
      >
        {onClose && (
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}

        <div className="modal-header-block" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ 
            width: "64px", height: "64px", margin: "0 auto 1rem", 
            background: "linear-gradient(135deg, rgba(37,99,235,0.2) 0%, rgba(96,165,250,0.05) 100%)",
            border: "1px solid rgba(96,165,250,0.3)",
            borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 30px rgba(37,99,235,0.2), inset 0 2px 4px rgba(255,255,255,0.1)",
            transform: "rotate(-5deg)",
          }}>
            {alreadyRegistered ? (
              <CheckCircle size={32} color="#60A5FA" strokeWidth={1.5} />
            ) : (
              <Trophy size={32} color="#60A5FA" strokeWidth={1.5} />
            )}
          </div>
          
          <p style={{ color: "var(--arc-blue)", fontSize: "0.875rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            {alreadyRegistered ? "Welcome Back" : "Spot Secured"}
          </p>

          <h3
            style={{
              fontSize: "clamp(1.75rem, 5vw, 2.25rem)",
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: "1rem",
            }}
          >
            <span style={{ color: "var(--arc-blue)" }}>#{position.toLocaleString()}</span> in line
          </h3>
          
          <p style={{ color: "var(--arc-text-secondary)", fontSize: "0.875rem", lineHeight: 1.5, maxWidth: "90%", margin: "0 auto" }}>
            The first 100 get 3 months Pro free. Every friend you invite skips you <span style={{ color: "#fff", fontWeight: 500 }}>5 spots forward</span>. Invite 3 — skip 15.
          </p>

          <div className="modal-progress-block" style={{ marginTop: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", padding: "0 4px" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--arc-text-muted)", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>Current Status</span>
              <span style={{ fontSize: "0.75rem", color: "var(--arc-blue)", fontWeight: 600 }}>Top {Math.round(positionPercent)}%</span>
            </div>
            <div
              style={{
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
        </div>

        <div
          style={{
            padding: "0.5rem",
            background: "rgba(0,0,0,0.4)",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.08)",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)"
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 0,
              padding: "0 0.75rem",
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                flex: 1,
                fontSize: "0.8125rem",
                color: "rgba(255,255,255,0.8)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap" as const,
                fontFamily: "monospace",
                letterSpacing: "0.02em"
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.4)" }}>{appUrl}</span>
              <span style={{ 
                color: "#60A5FA", 
                textShadow: "0 0 10px rgba(96,165,250,0.5)",
                fontWeight: 600
              }}>?ref={referralCode}</span>
            </span>
          </div>
          <button
            onClick={copyLink}
            className={`waitlist-copy-btn ${copied ? "waitlist-copy-btn-success" : ""}`}
          >
            {copied ? <CheckCircle size={15} strokeWidth={2.5} /> : <Copy size={15} strokeWidth={2.5} />}
            {copied ? "COPIED" : "COPY"}
          </button>
        </div>

        <div className="modal-timer-block" style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
          <CountdownTimer targetDate={process.env.NEXT_PUBLIC_LAUNCH_DATE ?? "2026-07-22T00:00:00.000Z"} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
          <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1))" }} />
          <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Skip the Line
          </span>
          <div style={{ height: "1px", flex: 1, background: "linear-gradient(270deg, transparent, rgba(255,255,255,0.1))" }} />
        </div>

        <div className="share-buttons-grid">
          <button
            onClick={nativeShare}
            className="share-btn share-btn-instagram"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            Instagram
          </button>

          <button
            onClick={shareWhatsApp}
            className="share-btn share-btn-whatsapp"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </button>

          <button
            onClick={() => window.open(`https://twitter.com/intent/tweet?text=${twitterText}`, "_blank", "noopener,noreferrer")}
            className="share-btn share-btn-x"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            Post to X
          </button>

          <button
            onClick={nativeShare}
            className="share-btn share-btn-native"
          >
            <Share2 size={18} color="currentColor" />
            Share Link
          </button>
        </div>
      </motion.div>
    </motion.div>
    </AnimatePresence>
  );
}
