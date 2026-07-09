"use client";

import { useEffect, useRef, useState } from "react";
import { Droplets, Moon, Footprints, Dumbbell, Timer, Activity, Flame } from "lucide-react";
import ConfirmationScreen from "./ConfirmationScreen";
import WaitlistForm from "./WaitlistForm";

interface HeroProps {
  initialCount: number;
  referralCode?: string;
}

interface SignupResult {
  position: number;
  referralCode: string;
  totalCount: number;
  alreadyRegistered?: boolean;
}

export default function HeroSection({ initialCount, referralCode }: HeroProps) {
  const [count, setCount] = useState(initialCount);
  const [confirmed, setConfirmed] = useState<SignupResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const countRef = useRef(initialCount);

  const phoneRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const lerpRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const tick = () => {
      const delay = Math.random() * 16000 + 8000;
      const t = setTimeout(() => {
        countRef.current += 1;
        setCount(countRef.current);
        tick();
      }, delay);
      return t;
    };
    const timer = tick();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    window.addEventListener("mousemove", handleMove, { passive: true });

    const loop = () => {
      lerpRef.current.x += (mouseRef.current.x - lerpRef.current.x) * 0.06;
      lerpRef.current.y += (mouseRef.current.y - lerpRef.current.y) * 0.06;

      if (phoneRef.current) {
        const rx = (lerpRef.current.y - 0.5) * -18;  
        const ry = (lerpRef.current.x - 0.5) *  22;  
        phoneRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function handleSuccess(data: SignupResult) {
    setCount(data.totalCount);
    setConfirmed(data);
    setShowModal(true);
  }

  return (
    <section
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100svh",
        padding: "0 1.5rem",
        overflow: "hidden",
        background: "transparent",
      }}
    >

      <div style={{
        position: "relative", zIndex: 1,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "clamp(3rem, 5vw, 6rem)",
        alignItems: "center",
        maxWidth: "1240px",
        width: "100%",
        margin: "0 auto",
        marginTop: "-10vh",
        padding: "clamp(5rem, 10vh, 8rem) 0 clamp(4rem, 8vh, 6rem)",
      }}>
        
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "flex-start", textAlign: "left",
        }}>

          <div
            className="glass-blue animate-fade-up opacity-0-init"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "5px 14px 5px 10px", borderRadius: "100px",
              fontSize: "0.6875rem", fontWeight: 500,
              letterSpacing: "0.07em", textTransform: "uppercase" as const,
              color: "var(--arc-blue)", marginBottom: "2rem",
            }}
          >
            <span className="animate-pulse-dot" style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: "var(--arc-blue)", display: "inline-block", flexShrink: 0,
            }} />
            Early access waitlist open
          </div>

          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 500,
              letterSpacing: "-0.035em",
              lineHeight: 1.08,
              color: "#FFFFFF",
              marginBottom: "1.75rem",
              fontSize: "clamp(3.25rem, 6.5vw, 7rem)",
            }}
          >
            <span className="text-reveal-wrapper" style={{ display: "block" }}>
              <span className="text-reveal-inner delay-100">Upgrade</span>
            </span>
            <span className="text-reveal-wrapper" style={{ display: "block", marginTop: "-0.12em", marginBottom: "0.02em" }}>
              <span className="text-reveal-inner delay-250">your fitness.</span>
            </span>
            <span className="text-reveal-wrapper" style={{ display: "block" }}>
              <span
                className="text-reveal-inner delay-400"
                style={{
                  background: "linear-gradient(130deg, #ffffff 0%, #BFDBFE 45%, #3B82F6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  paddingBottom: "0.15em",
                  display: "inline-block",
                }}
              >
                Forever.
              </span>
            </span>
          </h1>

          <p
            className="animate-fade-in opacity-0-init delay-600"
            style={{
              fontSize: "clamp(1rem, 1.4vw, 1.175rem)",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.58)",
              maxWidth: "500px",
              marginBottom: "2.25rem",
              letterSpacing: "-0.01em",
            }}
          >
            ARC doesn't just track your progress—it plans it. Get an AI-powered coach that perfectly connects your workouts, meals, and daily habits into one winning system.
          </p>

          <div
            className="animate-fade-up opacity-0-init delay-800"
            style={{ width: "100%", maxWidth: "460px", marginBottom: "1.5rem" }}
          >
            {confirmed ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "rgba(4,5,15,0.8)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  boxShadow: "0 8px 32px rgba(34,197,94,0.15), inset 0 1px 2px rgba(255,255,255,0.1)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "100px",
                  padding: "0.375rem 0.375rem 0.375rem 1.25rem",
                  width: "100%",
                  maxWidth: "480px",
                  margin: "0 auto",
                  animation: "arcScaleUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div className="animate-pulse-dot" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 12px #22C55E" }} />
                  <span style={{ fontSize: "0.9375rem", fontWeight: 500, color: "#fff", letterSpacing: "0.01em" }}>
                    Spot secured
                  </span>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="btn-primary animate-gradient-shift"
                  style={{
                    height: "2.75rem",
                    padding: "0 1.5rem",
                    fontSize: "0.875rem",
                    fontWeight: 800,
                    cursor: "pointer",
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
                  View Ticket
                </button>
              </div>
            ) : (
              <WaitlistForm
                onSuccess={handleSuccess}
                initialCount={initialCount}
                referralCode={referralCode}
              />
            )}
          </div>

          {!confirmed && (
            <div
              className="animate-fade-in opacity-0-init delay-1000"
              style={{
                display: "flex", alignItems: "center", gap: "1rem",
                fontSize: "0.8rem", color: "rgba(255,255,255,0.35)",
              }}
            >
              
              <div style={{ display: "flex", alignItems: "center" }}>
                {[
                  { bg: "#3B82F6", label: "A" },
                  { bg: "#22C55E", label: "J" },
                  { bg: "#F59E0B", label: "S" },
                  { bg: "#8B5CF6", label: "M" },
                  { bg: "#EF4444", label: "K" },
                ].map((av, i) => (
                  <div
                    key={i}
                    style={{
                      width: "26px", height: "26px", borderRadius: "50%",
                      background: av.bg,
                      border: "2px solid #000",
                      marginLeft: i > 0 ? "-8px" : "0",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "9px", fontWeight: 600, color: "#fff",
                      position: "relative", zIndex: 5 - i,
                    }}
                  >
                    {av.label}
                  </div>
                ))}
              </div>

              <span>
                Join{" "}
                <strong style={{ color: "rgba(255,255,255,0.80)", fontWeight: 500 }}>
                  {(12500 + count).toLocaleString()}+
                </strong>
                {" "}top performers already in line
              </span>
            </div>
          )}

          <div
            className="animate-fade-in opacity-0-init delay-1200"
            style={{
              display: "flex", alignItems: "center", gap: "1.5rem",
              marginTop: "2.5rem",
              paddingTop: "2rem",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              width: "100%", maxWidth: "460px",
            }}
          >
            {[
              { value: "100%", label: "Custom Plans" },
              { value: "24/7", label: "AI Guidance" },
              { value: "0", label: "Guesswork" },
            ].map((stat, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{
                  fontSize: "1.25rem", fontWeight: 500,
                  color: i === 2 ? "var(--arc-blue)" : "#FFFFFF",
                  letterSpacing: "-0.03em",
                }}>{stat.value}</span>
                <span style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.38)", letterSpacing: "0.04em", textTransform: "uppercase" as const }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            marginTop: "-80px"
          }}
        >
          
          <div style={{
            position: "absolute",
            inset: "-30%",
            background: "radial-gradient(ellipse at 50% 55%, rgba(37,99,235,0.30) 0%, rgba(29,78,216,0.10) 45%, transparent 72%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }} />

          <div className="phone-parallax-container animate-scale-up opacity-0-init delay-500">
            <div
              ref={phoneRef}
              className="phone-parallax-inner"
              style={{
                transform: "rotateX(4deg) rotateY(-14deg)",
                transformStyle: "preserve-3d",
              }}
            >
              
              <div
                style={{
                  position: "relative",
                  width: "260px",
                  height: "540px",
                  borderRadius: "44px",
                  overflow: "hidden",
                  background: "linear-gradient(165deg, #0c0d1e 0%, #04050f 100%)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  boxShadow: [
                    "0 40px 80px rgba(0,0,0,0.60)",
                    "0 0 0 1px rgba(255,255,255,0.06)",
                    "inset 0 1px 0 rgba(255,255,255,0.12)",
                    "inset 0 0 40px rgba(59,130,246,0.05)",
                  ].join(", "),
                }}
              >
                
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(165deg, rgba(59,130,246,0.04) 0%, transparent 50%)",
                  pointerEvents: "none", zIndex: 10,
                }} />

                <div style={{
                  position: "absolute", top: "16px", left: "50%", transform: "translateX(-50%)",
                  width: "96px", height: "30px",
                  background: "#000", borderRadius: "100px", zIndex: 20,
                  boxShadow: "inset 0 -1px 2px rgba(255,255,255,0.08), 0 2px 8px rgba(0,0,0,0.6)",
                }} />

                <div 
                  className="custom-scrollbar"
                  style={{ 
                    padding: "48px 16px 20px", 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "16px", 
                    height: "100%",
                    overflowY: "auto",
                    position: "relative",
                    zIndex: 30
                  }}
                >

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ fontSize: "9px", fontWeight: 600, color: "#8B96A5", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>Thursday · Jun 25</p>
                      <h1 style={{ fontSize: "18px", fontWeight: 600, color: "#fff", letterSpacing: "-0.02em" }}>Morning, Alex 👋</h1>
                    </div>
                    <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3B82F6", fontSize: "12px", fontWeight: 600 }}>
                      A
                    </div>
                  </div>

                  <div style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: "4px", padding: "6px 10px", borderRadius: "8px", background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.15)", marginBottom: "-6px" }}>
                    <Flame size={10} color="#FF6B6B" strokeWidth={2.5} />
                    <span style={{ fontSize: "8.5px", fontWeight: 700, color: "#FF6B6B", letterSpacing: "0.05em", textTransform: "uppercase" }}>14-day streak</span>
                  </div>

                  <div style={{ 
                    position: "relative", 
                    padding: "16px", 
                    borderRadius: "16px", 
                    background: "linear-gradient(160deg, rgba(59,130,246,0.15) 0%, rgba(4,5,15,0.8) 100%)", 
                    border: "1px solid rgba(255,255,255,0.08)", 
                    boxShadow: "0 20px 40px -10px rgba(0,0,0,0.8), 0 0 30px rgba(59,130,246,0.1), inset 0 1px 1px rgba(255,255,255,0.15)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    overflow: "hidden",
                    flexShrink: 0
                  }}>
                    
                    <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "16px 16px", opacity: 0.8 }} />
                    
                    <div style={{ position: "absolute", right: "-30px", top: "-30px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(59,130,246,0.2)", filter: "blur(40px)", pointerEvents: "none" }} />
                    <div style={{ position: "absolute", left: "-20px", bottom: "-20px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(59,130,246,0.1)", filter: "blur(30px)", pointerEvents: "none" }} />
                    
                    <div style={{ position: "relative", zIndex: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#60A5FA", boxShadow: "0 0 10px #60A5FA" }} />
                          <span style={{ fontSize: "8.5px", fontWeight: 700, color: "#93C5FD", letterSpacing: "0.15em", textTransform: "uppercase" }}>Today's Session</span>
                        </div>
                        <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Week 3 · Day 2</span>
                      </div>

                      <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", letterSpacing: "-0.03em", marginBottom: "2px", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>Push Day A</h2>
                      <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)", marginBottom: "16px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Chest · Shoulders · Triceps</p>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "rgba(255,255,255,0.6)" }}>
                            <Timer size={10} strokeWidth={2.5} />
                            <span style={{ fontSize: "9.5px", fontWeight: 500, color: "rgba(255,255,255,0.85)" }}>55m</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "rgba(255,255,255,0.6)" }}>
                            <Dumbbell size={10} strokeWidth={2.5} />
                            <span style={{ fontSize: "9.5px", fontWeight: 500, color: "rgba(255,255,255,0.85)" }}>6ex</span>
                          </div>
                        </div>
                        <button style={{ 
                          background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)", 
                          color: "#1e3a8a", 
                          border: "none", 
                          borderRadius: "8px", 
                          padding: "6px 12px", 
                          fontSize: "10px", 
                          fontWeight: 800, 
                          display: "flex", 
                          alignItems: "center", 
                          gap: "4px", 
                          boxShadow: "0 4px 12px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,1)",
                          cursor: "pointer"
                        }}>
                          Start <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <h2 style={{ fontSize: "12px", fontWeight: 600, color: "#fff" }}>Habits</h2>
                        <span style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", color: "#3B82F6", fontSize: "8px", fontWeight: 600, padding: "2px 6px", borderRadius: "10px" }}>2/4</span>
                      </div>
                      <span style={{ fontSize: "9px", color: "#3B82F6", fontWeight: 500 }}>All →</span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                      {[
                        { name: "Water", icon: <Droplets size={16} />, done: true, color: "#06B6D4" },
                        { name: "Sleep", icon: <Moon size={16} />, done: true, color: "#7C5CFC" },
                        { name: "Steps", icon: <Footprints size={16} />, done: false, color: "#FF6B6B" },
                        { name: "Train", icon: <Dumbbell size={16} />, done: false, color: "#3B82F6" },
                      ].map(habit => (
                        <div key={habit.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                          <div style={{ 
                            width: "36px", height: "36px", borderRadius: "12px", 
                            background: habit.done ? `rgba(${habit.color === '#06B6D4' ? '6,182,212' : '124,92,252'}, 0.15)` : "rgba(255,255,255,0.03)",
                            border: `1px solid ${habit.done ? habit.color : 'rgba(255,255,255,0.08)'}`,
                            color: habit.done ? habit.color : "rgba(255,255,255,0.4)",
                            display: "flex", alignItems: "center", justifyContent: "center"
                          }}>
                            {habit.icon}
                          </div>
                          <span style={{ fontSize: "8px", color: habit.done ? "#fff" : "#8B96A5", fontWeight: habit.done ? 600 : 400 }}>{habit.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <div>
                        <p style={{ fontSize: "12px", fontWeight: 600, color: "#fff", letterSpacing: "-0.01em" }}>Nutrition</p>
                        <p style={{ fontSize: "9px", color: "#8B96A5", marginTop: "2px" }}>1,840 / 2,650 kcal · 69%</p>
                      </div>
                      
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "3px solid rgba(59,130,246,0.2)", borderTopColor: "#3B82F6", transform: "rotate(45deg)", display: "flex", alignItems: "center", justifyContent: "center" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {[
                        { label: "Protein", current: 142, target: 185, color: "#3B82F6" },
                        { label: "Carbs", current: 198, target: 330, color: "#93C5FD" },
                        { label: "Fats", current: 51, target: 75, color: "#60A5FA" },
                      ].map(m => (
                        <div key={m.label}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                            <span style={{ fontSize: "9px", color: "#8B96A5" }}>{m.label}</span>
                            <span style={{ fontSize: "9px", color: "#fff", fontWeight: 500 }}>{m.current}g <span style={{ color: "rgba(255,255,255,0.3)" }}>/ {m.target}g</span></span>
                          </div>
                          <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${(m.current / m.target) * 100}%`, background: m.color, borderRadius: "2px" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(29,78,216,0.05))", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "14px", padding: "10px 12px" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, #3B82F6, #1D4ED8)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 10px rgba(59,130,246,0.4)" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "11px", fontWeight: 600, color: "#fff" }}>Ask Arc anything</p>
                      <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)" }}>Your AI coach is ready</p>
                    </div>
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>→</span>
                  </div>

                </div>
              </div>

              <div style={{
                position: "absolute",
                top: "10%", left: "-3px",
                width: "3px", height: "80%",
                background: "linear-gradient(180deg, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0.0) 100%)",
                borderRadius: "2px 0 0 2px",
              }} />

              <div
                className="animate-fade-up opacity-0-init delay-1000"
                style={{
                  position: "absolute",
                  top: "15%",
                  right: "-20%",
                  background: "rgba(0,0,0,0.7)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.2)",
                  borderRadius: "14px",
                  padding: "12px 16px",
                  display: "flex", alignItems: "center", gap: "10px",
                  transform: "translateZ(100px)",
                }}
              >
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 10px rgba(34,197,94,0.6)" }} />
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#fff", whiteSpace: "nowrap" as const }}>
                  14-day streak
                </span>
              </div>

              <div
                className="animate-fade-up opacity-0-init delay-1200"
                style={{
                  position: "absolute",
                  bottom: "20%",
                  left: "-25%",
                  background: "rgba(0,0,0,0.7)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(59,130,246,0.25)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.1)",
                  borderRadius: "14px",
                  padding: "14px 18px",
                  transform: "translateZ(120px)",
                }}
              >
                <p style={{ fontSize: "10px", color: "#8B96A5", letterSpacing: "0.06em", textTransform: "uppercase" as const, marginBottom: "4px", fontWeight: 600 }}>Recovery</p>
                <p style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--arc-blue)", letterSpacing: "-0.025em", textShadow: "0 0 20px rgba(59,130,246,0.4)" }}>87%</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-phone-col { display: none !important; }
        }
      `}</style>

      {showModal && confirmed && (
        <ConfirmationScreen
          position={confirmed.position}
          referralCode={confirmed.referralCode}
          totalCount={confirmed.totalCount}
          alreadyRegistered={confirmed.alreadyRegistered}
          onClose={() => setShowModal(false)}
        />
      )}
    </section>
  );
}
