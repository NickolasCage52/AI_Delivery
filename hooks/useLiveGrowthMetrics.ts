"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type GrowthMetricConfig = {
  /** Start value */
  baseValue: number;
  /** Min step per tick (positive) */
  growthRateMin: number;
  /** Max step per tick */
  growthRateMax: number;
  /** Tick interval in ms (e.g. 1200–2800) */
  tickIntervalMs: [number, number];
  /** Decimal places for display */
  decimals: number;
  /** Optional cap (value never exceeds this) */
  max?: number;
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export type UseLiveGrowthMetricsOptions = {
  configs: GrowthMetricConfig[];
  /** When false, pause all timers and tweens */
  enabled: boolean;
  /** Tween duration range in ms */
  tweenDurationMs?: [number, number];
};

export type GrowthMetricsControls = {
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
};

function randomInRange(lo: number, hi: number): number {
  return lo + Math.random() * (hi - lo);
}

/** Returns a random step >= 0 for monotonic growth */
function randomStep(config: GrowthMetricConfig): number {
  return randomInRange(config.growthRateMin, config.growthRateMax);
}

export function useLiveGrowthMetrics({
  configs,
  enabled,
  tweenDurationMs = [350, 650],
}: UseLiveGrowthMetricsOptions): {
  displayValues: number[];
  lastUpdateSec: number;
  controls: GrowthMetricsControls;
} {
  const [displayValues, setDisplayValues] = useState<number[]>(() =>
    configs.map((c) => c.baseValue)
  );
  const [lastUpdateSec, setLastUpdateSec] = useState(0);

  const targetsRef = useRef<number[]>(configs.map((c) => c.baseValue));
  const displayRef = useRef<number[]>(configs.map((c) => c.baseValue));
  const runningRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number>(0);
  const lastTickRef = useRef(0);

  displayRef.current = displayValues;

  const getNextInterval = useCallback((config: GrowthMetricConfig) => {
    const [lo, hi] = config.tickIntervalMs;
    return randomInRange(lo, hi);
  }, []);

  const tweenToTarget = useCallback(
    (metricIndex: number, from: number, to: number) => {
      const [durLo, durHi] = tweenDurationMs;
      const duration = randomInRange(durLo, durHi);
      const start = performance.now();

      const tick = (now: number) => {
        const elapsed = now - start;
        const t = Math.min(1, elapsed / duration);
        const eased = easeOutCubic(t);
        const current = from + (to - from) * eased;
        const cfg = configs[metricIndex];
        const rounded =
          Math.round(current * Math.pow(10, cfg.decimals)) /
          Math.pow(10, cfg.decimals);

        setDisplayValues((prev) => {
          const next = [...prev];
          next[metricIndex] = rounded;
          return next;
        });

        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    },
    [tweenDurationMs, configs]
  );

  const scheduleNextTick = useCallback(() => {
    if (!runningRef.current || !enabled) return;

    const idx = Math.floor(Math.random() * configs.length);
    const cfg = configs[idx];
    const target = targetsRef.current[idx];
    const step = randomStep(cfg);
    let next = target + step;
    if (cfg.max != null && next > cfg.max) next = cfg.max;
    next =
      Math.round(next * Math.pow(10, cfg.decimals)) /
      Math.pow(10, cfg.decimals);

    if (next > target) {
      targetsRef.current[idx] = next;
      lastTickRef.current = Date.now();
      setLastUpdateSec(0);
      tweenToTarget(idx, displayRef.current[idx], next);
    }

    const ms = getNextInterval(cfg);
    timeoutRef.current = setTimeout(scheduleNextTick, ms);
  }, [configs, enabled, getNextInterval, tweenToTarget]);

  const start = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    const ms = randomInRange(30, 100);
    timeoutRef.current = setTimeout(scheduleNextTick, ms);
  }, [scheduleNextTick]);

  const pause = useCallback(() => {
    runningRef.current = false;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }, []);

  const resume = useCallback(() => {
    if (!enabled) return;
    runningRef.current = true;
    scheduleNextTick();
  }, [enabled, scheduleNextTick]);

  const reset = useCallback(() => {
    pause();
    const initial = configs.map((c) => c.baseValue);
    targetsRef.current = [...initial];
    displayRef.current = [...initial];
    setDisplayValues(initial);
    setLastUpdateSec(0);
  }, [configs, pause]);

  useEffect(() => {
    if (!enabled) {
      pause();
      return;
    }
    start();
    return () => pause();
  }, [enabled, start, pause]);

  useEffect(() => {
    if (!enabled) return;
    const iv = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastTickRef.current) / 1000);
      setLastUpdateSec(elapsed);
    }, 1000);
    return () => clearInterval(iv);
  }, [enabled]);

  return {
    displayValues,
    lastUpdateSec,
    controls: { start, pause, resume, reset },
  };
}
