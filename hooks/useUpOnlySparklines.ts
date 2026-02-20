"use client";

import { useEffect, useRef, useState } from "react";
import {
  getInitialUpOnlySeriesDeterministic,
  advanceUpOnlySeries,
} from "@/lib/metrics/generateUpOnlySeries";

const MAX_POINTS = 18;
/** Максимально быстро: непрерывный рост линии */
const ADVANCE_INTERVAL_MS = 120;

/**
 * Returns one series per metric. Initial state is deterministic (seed = index)
 * to avoid SSR/client hydration mismatch. When enabled, each series advances
 * with one new point (up-only). Offscreen (enabled=false) = no updates.
 */
export function useUpOnlySparklines(
  enabled: boolean,
  count: number = 4
): number[][] {
  const [seriesList, setSeriesList] = useState<number[][]>(() =>
    Array.from({ length: count }, (_, i) => getInitialUpOnlySeriesDeterministic(i))
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setSeriesList((prev) =>
        prev.map((series) => advanceUpOnlySeries(series, MAX_POINTS))
      );
    }, ADVANCE_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, count]);

  return seriesList;
}
