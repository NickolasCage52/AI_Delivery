"use client";

import { useReducedMotion } from "@/lib/motion";

/**
 * Subtle animated noise/grain overlay for premium texture.
 * Very low opacity; disabled when prefers-reduced-motion.
 */
export function NoiseOverlay() {
  const reduced = useReducedMotion();

  if (reduced) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1000] opacity-[0.025]"
      aria-hidden
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        animation: "noiseShift 8s steps(10) infinite",
      }}
    />
  );
}
