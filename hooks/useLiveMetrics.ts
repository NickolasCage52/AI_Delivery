"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/motion";

export type MetricConfig = {
  initial: number;
  min: number;
  max: number;
  step: number; // max abs delta per tick (for int: 1–6, for %: 0.1–0.5)
  decimals: number;
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export type UseLiveMetricsOptions = {
  configs: MetricConfig[];
  inView: boolean;
  /** When false, metrics stay static (no live updates). */
  enabled?: boolean;
  tickIntervalMs?: [number, number];
  tweenDurationMs?: [number, number];
};

export function useLiveMetrics({
  configs,
  inView,
  enabled = true,
  tickIntervalMs = [1800, 3200],
  tweenDurationMs = [380, 580],
}: UseLiveMetricsOptions) {
  const reduced = useReducedMotion();
  const [displayValues, setDisplayValues] = useState<number[]>(() => configs.map((c) => c.initial));
  const [lastUpdateSec, setLastUpdateSec] = useState(0);

  const targetsRef = useRef<number[]>(configs.map((c) => c.initial));
  const displayRef = useRef<number[]>(configs.map((c) => c.initial));
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number>(0);
  const lastTickRef = useRef(0);
  const initialCountUpDoneRef = useRef(false);

  displayRef.current = displayValues;

  const getNextInterval = useCallback(() => {
    const [lo, hi] = tickIntervalMs;
    return lo + Math.random() * (hi - lo);
  }, [tickIntervalMs]);

  const tweenToTarget = useCallback(
    (metricIndex: number, from: number, to: number) => {
      const [durLo, durHi] = tweenDurationMs;
      const duration = durLo + Math.random() * (durHi - durLo);
      const start = performance.now();
      let raf = 0;

      const tick = (now: number) => {
        const elapsed = now - start;
        const t = Math.min(1, elapsed / duration);
        const eased = easeOutCubic(t);
        const current = from + (to - from) * eased;

        setDisplayValues((prev) => {
          const next = [...prev];
          next[metricIndex] = current;
          return next;
        });

        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    },
    [tweenDurationMs]
  );

  useEffect(() => {
    if (reduced || !inView || !enabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      if (reduced) {
        setDisplayValues(configs.map((c) => c.initial));
        targetsRef.current = configs.map((c) => c.initial);
        initialCountUpDoneRef.current = false;
      }
      return;
    }

    const runTick = () => {
      const idx = Math.floor(Math.random() * configs.length);
      const cfg = configs[idx];
      const target = targetsRef.current[idx];
      const delta = (Math.random() - 0.5) * 2 * cfg.step;
      let next = target + delta;
      next = Math.round(next * Math.pow(10, cfg.decimals)) / Math.pow(10, cfg.decimals);
      next = Math.max(cfg.min, Math.min(cfg.max, next));

      if (Math.abs(next - target) >= 1e-6) {
        targetsRef.current[idx] = next;
        lastTickRef.current = Date.now();
        setLastUpdateSec(0);
        tweenToTarget(idx, displayRef.current[idx], next);
      }

      const ms = getNextInterval();
      timeoutRef.current = setTimeout(runTick, ms);
    };

    lastTickRef.current = Date.now();

    const startLiveLoop = (firstTickDelay = 0) => {
      initialCountUpDoneRef.current = true;
      const ms = firstTickDelay > 0 ? firstTickDelay : getNextInterval();
      timeoutRef.current = setTimeout(runTick, ms);
    };

    if (!initialCountUpDoneRef.current) {
      initialCountUpDoneRef.current = true;
      targetsRef.current = configs.map((c) => c.initial);
      displayRef.current = configs.map((c) => c.initial);
      setDisplayValues(configs.map((c) => c.initial));
      startLiveLoop(800);
    } else {
      const ms = getNextInterval();
      timeoutRef.current = setTimeout(runTick, ms);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };
  }, [reduced, inView, enabled, configs, tweenToTarget, getNextInterval]);

  useEffect(() => {
    if (!inView || reduced || !enabled) return;
    const iv = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastTickRef.current) / 1000);
      setLastUpdateSec(elapsed);
    }, 1000);
    return () => clearInterval(iv);
  }, [inView, reduced, enabled]);

  return { displayValues, lastUpdateSec };
}
