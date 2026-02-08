"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/motion";
import { getScrollBlurMax } from "@/lib/perf/quality";
import { useQuality } from "@/hooks/useQuality";
import { startScrollVelocityTracking, stopScrollVelocityTracking, getScrollVelocity } from "@/lib/scroll/velocity";
import { rafLoopSubscribe } from "@/lib/perf/rafLoop";
import { useFxLifecycle } from "@/hooks/useFxLifecycle";

const VELOCITY_THRESHOLD = 400;
const DECAY = 0.9;

export function ScrollVelocityBlur() {
  const reduced = useReducedMotion();
  const quality = useQuality();
  const overlayRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef(0);
  const maxBlurRef = useRef(0);
  const isMobileRef = useRef(false);
  const fx = useFxLifecycle({ enabled: !reduced, isInViewport: true });

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => {
      isMobileRef.current = media.matches;
      maxBlurRef.current = getScrollBlurMax(quality, isMobileRef.current);
      if (overlayRef.current) {
        overlayRef.current.style.visibility =
          !reduced && maxBlurRef.current > 0 ? "visible" : "hidden";
      }
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [quality, reduced]);

  useEffect(() => {
    if (reduced || !fx.isActive) return;
    const el = overlayRef.current;
    if (!el) return;

    maxBlurRef.current = getScrollBlurMax(quality, isMobileRef.current);
    if (maxBlurRef.current <= 0) {
      el.style.visibility = "hidden";
      return;
    }

    el.style.willChange = "filter, opacity, transform";
    el.style.visibility = "visible";
    startScrollVelocityTracking();

    const unsubscribe = rafLoopSubscribe(() => {
      const maxBlur = maxBlurRef.current;
      if (!overlayRef.current || maxBlur <= 0) return;
      const v = Math.abs(getScrollVelocity());
      if (v > VELOCITY_THRESHOLD) {
        const t = Math.min(1, (v - VELOCITY_THRESHOLD) / 800);
        blurRef.current = Math.min(maxBlur, blurRef.current * DECAY + t * maxBlur * 0.15);
      } else {
        blurRef.current *= DECAY;
      }
      const amount = blurRef.current;
      overlayRef.current.style.filter = amount > 0.05 ? `blur(${amount}px)` : "none";
      overlayRef.current.style.opacity = amount > 0.05 ? "0.2" : "0";
    });

    return () => {
      unsubscribe();
      stopScrollVelocityTracking();
    };
  }, [reduced, quality, fx.isActive]);

  const active = fx.isActive && maxBlurRef.current > 0;
  return (
    <div
      ref={overlayRef}
      className="pointer-events-none fixed left-1/2 top-1/3 z-[1] h-[55vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-75"
      aria-hidden
      style={{
        filter: "none",
        opacity: 0,
        visibility: active ? "visible" : "hidden",
        background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(139,92,246,0.08) 0%, transparent 65%)",
      }}
    />
  );
}
