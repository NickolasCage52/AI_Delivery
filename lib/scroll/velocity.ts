/**
 * Scroll velocity tracker — RAF-based, passive.
 * Used for scroll-blur and motion-smoothness effects.
 * No scroll listener; we sample scroll position each frame.
 */

import { rafLoopSubscribe } from "@/lib/perf/rafLoop";

let lastScrollY = 0;
let lastTime = 0;
let currentVelocity = 0;

let unsubscribe: (() => void) | null = null;
const DECAY = 0.92;

function tick(time: number) {
  if (typeof document !== "undefined" && document.hidden) {
    currentVelocity *= DECAY;
    return;
  }
  const now = time;
  const y = typeof window !== "undefined" ? window.scrollY ?? document.documentElement.scrollTop : 0;
  const dt = (now - lastTime) / 1000;
  if (dt > 0 && dt < 0.2) {
    const v = (y - lastScrollY) / dt;
    currentVelocity = Math.max(-2500, Math.min(2500, v));
  }
  lastScrollY = y;
  lastTime = now;
  currentVelocity *= DECAY;
}

let started = false;

export function startScrollVelocityTracking() {
  if (typeof window === "undefined" || started) return;
  started = true;
  lastScrollY = window.scrollY;
  lastTime = performance.now();
  unsubscribe = rafLoopSubscribe(tick);
}

export function stopScrollVelocityTracking() {
  unsubscribe?.();
  unsubscribe = null;
  started = false;
}

export function getScrollVelocity(): number {
  return currentVelocity;
}
