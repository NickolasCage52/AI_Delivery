"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/motion";
import { getGlowCursorScale } from "@/lib/perf/quality";
import { useQuality } from "@/hooks/useQuality";
import { rafLoopSubscribe } from "@/lib/perf/rafLoop";

const DOT_R = 3;
const CLICKABLE = "a, button, [role=button], [data-cursor-hover], input, select, textarea, [href]";

function isClickable(el: Element | null): boolean {
  if (!el || el === document.body) return false;
  if (el.matches(CLICKABLE)) return true;
  return isClickable(el.parentElement);
}

export function GlowCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isCoarse, setIsCoarse] = useState(false);
  const reduced = useReducedMotion();
  const quality = useQuality();
  const scale = getGlowCursorScale(reduced ? "low" : quality);

  useEffect(() => {
    setMounted(true);
    setIsCoarse(typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot || reduced || !mounted || isCoarse) return;

    const target = { x: 0, y: 0 };
    let dirty = false;
    let hover = false;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      hover = isClickable(e.target as Element | null);
      dirty = true;
    };

    const unsubscribe = rafLoopSubscribe(() => {
      if (!dirty) return;
      const scaleVal = hover ? 1.2 : 1;
      dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%,-50%) scale(${scaleVal})`;
      dot.style.setProperty("--cursor-glow", hover ? "1" : "0.7");
      dirty = false;
    });

    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      unsubscribe();
    };
  }, [mounted, reduced, isCoarse, scale]);

  if (!mounted || reduced || isCoarse) return null;

  const dotSize = DOT_R * 2;

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-[999] hidden md:block"
      aria-hidden
    >
      <div
        ref={dotRef}
        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
        style={{
          width: dotSize,
          height: dotSize,
          transform: "translate3d(0,0,0) translate(-50%,-50%) scale(var(--cursor-scale, 1))",
          background: "var(--cursor-dot, var(--accent, #8B5CF6))",
          boxShadow: `0 0 ${8 * scale}px ${3 * scale}px rgba(139,92,246,calc(0.85 * var(--cursor-glow, 0.7))), 0 0 ${16 * scale}px ${6 * scale}px rgba(236,72,153,calc(0.35 * var(--cursor-glow, 0.7)))`,
          ["--cursor-scale" as string]: "1",
          ["--cursor-glow" as string]: "0.7",
        }}
      />
    </div>
  );
}
