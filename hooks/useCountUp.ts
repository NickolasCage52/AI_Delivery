import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/motion";

type Options = {
  durationMs?: number;
  decimals?: number;
  startOnView?: boolean;
  inView?: boolean;
};

/** Cubic-bezier(0.25, 0.46, 0.45, 0.94) — smooth ease-out for counters. */
function easeOutBezier(t: number) {
  const [p1x, p1y, p2x, p2y] = [0.25, 0.46, 0.45, 0.94];
  const sample = (x: number) => {
    const t1 = 1 - x;
    return 3 * t1 * t1 * x * p1x + 3 * t1 * x * x * p2x + x * x * x;
  };
  let lo = 0, hi = 1;
  for (let i = 0; i < 10; i++) {
    const mid = (lo + hi) / 2;
    if (sample(mid) < t) lo = mid;
    else hi = mid;
  }
  const x = (lo + hi) / 2;
  const t1 = 1 - x;
  return 3 * t1 * t1 * x * p1y + 3 * t1 * x * x * p2y + x * x * x;
}

export function useCountUp(target: number, { durationMs = 900, decimals = 0, startOnView = true, inView = true }: Options) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(() => (reduced ? target : 0));
  const startedRef = useRef(false);

  const format = useMemo(() => {
    const fmt = new Intl.NumberFormat("ru-RU", {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    });
    return (n: number) => fmt.format(n);
  }, [decimals]);

  useEffect(() => {
    if (reduced) {
      setValue(target);
      return;
    }
    if (startOnView && !inView) return;
    if (startedRef.current) return;
    startedRef.current = true;

    const start = performance.now();
    const from = 0;
    const to = target;
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = easeOutBezier(t);
      const next = from + (to - from) * eased;
      setValue(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, reduced, startOnView, inView]);

  return { value, formatted: format(value) };
}

