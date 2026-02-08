"use client";

import { useEffect, useRef, useState } from "react";
import { getQualityLevel, invalidateQualityCache, QualityLevel } from "@/lib/perf/quality";

/**
 * Returns current quality level. Re-evaluates on resize (debounced) and
 * prefers-reduced-motion changes. No FPS-based auto-downgrade.
 */
export function useQuality(): QualityLevel {
  const [level, setLevel] = useState<QualityLevel>("high");
  const resizeTimeout = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      invalidateQualityCache();
      setLevel(getQualityLevel());
    };
    update();

    const onResize = () => {
      if (resizeTimeout.current !== null) window.clearTimeout(resizeTimeout.current);
      resizeTimeout.current = window.setTimeout(update, 120);
    };
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => update();
    window.addEventListener("resize", onResize);
    motionQuery.addEventListener("change", onMotionChange);
    return () => {
      window.removeEventListener("resize", onResize);
      motionQuery.removeEventListener("change", onMotionChange);
      if (resizeTimeout.current !== null) window.clearTimeout(resizeTimeout.current);
      resizeTimeout.current = null;
    };
  }, []);

  return level;
}
