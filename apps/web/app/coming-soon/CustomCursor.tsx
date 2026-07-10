"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor(): React.JSX.Element | null {
  // Use MotionValues instead of React state for 60fps+ hardware-accelerated performance
  // This completely eliminates React re-render stuttering bugs!
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Apply ultra-smooth fluid spring physics directly to the motion values
  const springConfig = { damping: 40, stiffness: 800, mass: 0.05 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener("mousemove", updateMousePosition, { passive: true });

    // Hide default cursor
    document.body.style.cursor = "none";
    
    // Also hide for links/buttons to let the custom cursor shine
    const style = document.createElement("style");
    style.innerHTML = `
      * { cursor: none !important; }
      input, textarea, [contenteditable="true"] { cursor: text !important; }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      document.body.style.cursor = "auto";
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "20px",
        height: "20px",
        pointerEvents: "none",
        zIndex: 99999,
        backgroundImage: "url('/cursor.png')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        x: smoothX,
        y: smoothY,
        rotate: "9deg",
        filter: "brightness(0) invert(1)",
      }}
    />
  );
}
