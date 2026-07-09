"use client";
import React from "react";

import { useEffect } from "react";

export default function ScrollRevealInit(): React.JSX.Element | null {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.12 });
    
    els.forEach((el) => { obs.observe(el); });
    
    return () => {
      obs.disconnect();
    };
  }, []);

  return null;
}
