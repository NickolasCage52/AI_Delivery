"use client";

import { useEffect, useState } from "react";

/**
 * Returns true if user prefers reduced motion (system or media query).
 * Use to disable heavy fx: particles, pinned scenes, velocity blur, boot sequence.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
