"use client";

import { useEffect, useRef } from "react";
import { useInViewport } from "@/hooks/useInViewport";
import { useReducedMotion } from "@/lib/motion";

/**
 * Lightweight cursor-reactive grid overlay for Hero.
 * Uses CSS vars + ref (no setState) to avoid re-renders on mousemove.
 */
export function CursorReactiveGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref, { rootMargin: "0px", threshold: 0.1 });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView || reduced) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--grid-x", `${x}%`);
      el.style.setProperty("--grid-y", `${y}%`);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [inView, reduced]);

  if (reduced) return null;

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 transition-opacity duration-300 [--grid-x:50%] [--grid-y:40%]"
      style={{
        opacity: inView ? 0.08 : 0,
        backgroundImage: `
          linear-gradient(rgba(139,92,246,0.09) 1px, transparent 1px),
          linear-gradient(90deg, rgba(236,72,153,0.06) 1px, transparent 1px)
        `,
        backgroundSize: "72px 72px",
        maskImage: "radial-gradient(280px 280px at var(--grid-x) var(--grid-y), black 0%, transparent 72%)",
        WebkitMaskImage: "radial-gradient(280px 280px at var(--grid-x) var(--grid-y), black 0%, transparent 72%)",
      }}
      aria-hidden
    />
  );
}
