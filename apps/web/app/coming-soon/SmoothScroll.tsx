"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll(): React.JSX.Element | null {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      // Force scroll to top on mount for a fresh visit feel
      window.scrollTo(0, 0);
    }

    const lenis = new Lenis({
      lerp: 0.08, // Physical inertia instead of fixed duration
      smoothWheel: true,
      wheelMultiplier: 1.2, // Slightly more sensitive for luxurious glide
      touchMultiplier: 2,
      infinite: false,
    });

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
