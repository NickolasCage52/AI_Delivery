"use client";

import { useEffect, useRef, useState } from "react";
import { getGlowCursorScale } from "@/lib/perf/quality";
import { useQuality } from "@/hooks/useQuality";
import { setFxDebugStatus } from "@/lib/perf/fxDebug";

const DOT_R = 3;
const CLICKABLE = "a, button, [role=button], [data-cursor-hover], input, select, textarea, [href]";

function isClickable(el: Element | null): boolean {
  if (!el || el === document.body) return false;
  if (el.matches(CLICKABLE)) return true;
  return isClickable(el.parentElement);
}

export function GlowCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [isFine, setIsFine] = useState(false);
  const quality = useQuality();
  const scale = getGlowCursorScale(quality);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(pointer: fine)");
    const update = () => setIsFine(media.matches);
    update();
    media.addEventListener("change", update);
    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    setFxDebugStatus("cursor", isFine ? "running" : "off");
  }, [isFine]);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot || !isFine) return;

    const target = { x: 0, y: 0 };
    let hover = false;
    let rafId = 0;

    const update = () => {
      rafId = 0;
      const scaleVal = hover ? 1.15 : 1;
      dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%,-50%) scale(${scaleVal})`;
      dot.style.setProperty("--cursor-glow", hover ? "1" : "0.7");
    };

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      hover = isClickable(e.target as Element | null);
      if (!rafId) rafId = window.requestAnimationFrame(update);
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [isFine]);

  if (!isFine) return null;

  const dotSize = DOT_R * 2;

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-[1200]"
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
