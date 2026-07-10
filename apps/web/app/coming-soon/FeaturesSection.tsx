"use client";
import React from "react";

import { useRef } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accentColor: "#3B82F6",
    accentDim: "rgba(59,130,246,0.08)",
    accentBorder: "rgba(59,130,246,0.18)",
    tag: "AI-Powered",
    title: "Workouts built just for you",
    desc: "Leave the guesswork at the door. ARC builds your weekly training plan based on your exact goals and experience. It tells you exactly what to do to build muscle or lose fat. You just show up and put in the work.",
    stat: { value: "40%", label: "faster progression" },
    colSpanClass: "md:col-span-8 col-span-12",
    number: "01",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accentColor: "rgba(255,255,255,0.70)",
    accentDim: "rgba(255,255,255,0.03)",
    accentBorder: "rgba(255,255,255,0.08)",
    tag: "Science",
    title: "Unstoppable momentum",
    desc: "Great results come from daily habits. Log your sleep, water, and steps in seconds. Our smart streak system keeps you hooked.",
    stat: { value: "3×", label: "habit retention" },
    colSpanClass: "md:col-span-4 col-span-12",
    number: "02",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1470&auto=format&fit=crop",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accentColor: "rgba(255,255,255,0.70)",
    accentDim: "rgba(255,255,255,0.03)",
    accentBorder: "rgba(255,255,255,0.08)",
    tag: "Nutrition",
    title: "Perfect your nutrition",
    desc: "Fuel your body the right way. ARC calculates exactly how many calories, protein, and fats you need to hit your goals. No more guessing—just clear daily targets that actually work.",
    stat: { value: "100%", label: "macro precision" },
    colSpanClass: "md:col-span-5 col-span-12",
    number: "03",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1453&auto=format&fit=crop",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accentColor: "rgba(255,255,255,0.70)",
    accentDim: "rgba(255,255,255,0.03)",
    accentBorder: "rgba(255,255,255,0.08)",
    tag: "AI Chat",
    title: "Your 24/7 fitness coach",
    desc: "Get instant answers to your training and nutrition questions. Our AI companion provides real-time exercise tips and guidance exactly when you need it.",
    stat: { value: "24/7", label: "instant guidance" },
    colSpanClass: "md:col-span-7 col-span-12",
    number: "04",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1470&auto=format&fit=crop",
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0], index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className={`card-spotlight-wrapper feature-spotlight ${feature.colSpanClass}`}
      style={{
        padding: "clamp(2.5rem, 4vw, 3.5rem)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "380px",
        backdropFilter: "blur(48px)",
        WebkitBackdropFilter: "blur(48px)",
        position: "relative",
        overflow: "hidden",
        borderRadius: "1.5rem",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div 
        style={{ 
          position: "absolute", 
          top: "-20px", 
          right: "-10px", 
          fontSize: "12rem", 
          fontWeight: 700, 
          color: "rgba(255,255,255,0.02)",
          fontFamily: "'Space Grotesk', sans-serif",
          lineHeight: 1,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {feature.number}
      </div>

      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.04),
              transparent 80%
            )
          `,
          zIndex: 3,
        }}
      />
      
      {/* Background Image Layer */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${feature.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.15,
          filter: "grayscale(100%) contrast(1.2)",
          zIndex: 0,
          mixBlendMode: "overlay",
        }}
      />
      {/* Gradient Mask to keep text readable */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(3,3,3,1) 0%, rgba(3,3,3,0.7) 40%, rgba(3,3,3,0.2) 100%)",
          zIndex: 1,
        }}
      />

      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "2.5rem",
        }}>
          <div style={{
            width: "56px", height: "56px",
            borderRadius: "16px",
            background: feature.accentDim,
            border: `1px solid ${feature.accentBorder}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: feature.accentColor,
          }}>
            {feature.icon}
          </div>
          <div
            style={{
              padding: "6px 14px",
              borderRadius: "100px",
              background: feature.accentDim,
              border: `1px solid ${feature.accentBorder}`,
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              color: feature.accentColor,
            }}
          >
            {feature.tag}
          </div>
        </div>
        <h3
          style={{
            fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
            fontWeight: 500,
            color: "#FFFFFF",
            marginBottom: "1rem",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            fontFamily: "'Space Grotesk', sans-serif",
            maxWidth: "90%",
          }}
        >
          {feature.title}
        </h3>
        <p
          style={{
            fontSize: "1rem",
            color: "#8B96A5",
            lineHeight: 1.7,
            letterSpacing: "-0.01em",
            maxWidth: "90%",
          }}
        >
          {feature.desc}
        </p>
      </div>
      <div
        style={{
          position: "relative",
          zIndex: 2,
          marginTop: "3rem",
          paddingTop: "1.5rem",
          borderTop: `1px solid ${feature.accentBorder}`,
          display: "flex",
          alignItems: "baseline",
          gap: "0.75rem",
        }}
      >
        <span
          style={{
            fontSize: "2rem",
            fontWeight: 500,
            color: feature.accentColor,
            letterSpacing: "-0.04em",
          }}
        >
          {feature.stat.value}
        </span>
        <span
          style={{
            fontSize: "0.875rem",
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.03em",
            textTransform: "uppercase" as const,
          }}
        >
          {feature.stat.label}
        </span>
      </div>
    </motion.div>
  );
}

export default function FeaturesSection(): React.JSX.Element | Promise<React.JSX.Element> {
  return (
    <section
      id="features"
      style={{
        padding: "5rem 1.5rem 8rem",
        maxWidth: "1400px",
        margin: "0 auto",
        width: "100%",
        position: "relative",
      }}
    >
      <div className="section-divider" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-20%" }}
        variants={{
          visible: { transition: { staggerChildren: 0.15 } },
          hidden: {}
        }}
        style={{ textAlign: "center", marginBottom: "6rem" }}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
          }}
          className="glass-blue"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 20px",
            borderRadius: "100px",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            color: "var(--arc-blue)",
            marginBottom: "2rem",
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--arc-blue)", display: "inline-block" }} />
          Core Intelligence
        </motion.div>

        <motion.h2
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
          }}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(3rem, 5vw, 5.5rem)",
            fontWeight: 500,
            letterSpacing: "-0.04em",
            lineHeight: 1.02,
            color: "#FFFFFF",
            marginBottom: "1.5rem",
          }}
        >
          Train smarter.{" "}
          <span
            style={{
              background: "linear-gradient(130deg, #93C5FD 0%, #3B82F6 60%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Not harder.
          </span>
        </motion.h2>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
          }}
          style={{
            color: "#8B96A5",
            fontSize: "1.25rem",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: 1.6,
            letterSpacing: "-0.01em",
          }}
        >
          Four pillars of elite performance, unified in one beautifully engineered system.
        </motion.p>
      </motion.div>

      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "120%",
          height: "800px",
          background: "radial-gradient(ellipse at center, rgba(37,99,235,0.04) 0%, transparent 60%)",
          filter: "blur(100px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div 
        className="cards-dim-siblings group grid gap-5"
        style={{
          gridTemplateColumns: "repeat(12, 1fr)",
          width: "100%",
        }}
      >
        {features.map((feature, i) => (
          <FeatureCard key={feature.title} feature={feature} index={i} />
        ))}
      </div>
    </section>
  );
}
