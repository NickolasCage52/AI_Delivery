import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/motion";

type Options = {
  durationMs?: number;
  decimals?: number;
  startOnView?: boolean;
  inView?: boolean;
};

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
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
      const eased = easeOutCubic(t);
      const next = from + (to - from) * eased;
      setValue(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, reduced, startOnView, inView]);

  return { value, formatted: format(value) };
}

