"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll(): React.JSX.Element | null {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      // FIX: Removed window.scrollTo(0, 0)
      // Forcing a scroll to the top on mount breaks section anchor links
      // (like /#features or /#waitlist) and breaks browser Back button restoration.
    }

    // Abort Lenis on touch devices. Native OS scroll is 100% hardware-accelerated.
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 0.7,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-style Expo Ease Out
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });
    
    // Expose lenis globally so we can trigger smooth anchor scrolls without native tearing
    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}
