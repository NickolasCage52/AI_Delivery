"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/motion";

export interface UseAnimationCycleOpts {
  enabled: boolean;
  pauseMs: number;
  onStart: () => void;
  onReset: () => void;
  cycleDurationMs: number;
}

/**
 * Drives looping animations: onStart → play cycleDurationMs → onReset → pause pauseMs → repeat.
 * When enabled=false: calls onReset, clears timers. When prefers-reduced-motion: cycle never starts.
 */
export function useAnimationCycle(opts: UseAnimationCycleOpts): void {
  const { enabled, pauseMs, onStart, onReset, cycleDurationMs } = opts;
  const reduced = useReducedMotion();
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const onStartRef = useRef(onStart);
  const onResetRef = useRef(onReset);
  onStartRef.current = onStart;
  onResetRef.current = onReset;

  const clearAll = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    if (!enabled || reduced) {
      onResetRef.current();
      clearAll();
      return;
    }

    const scheduleNext = () => {
      const t1 = setTimeout(() => {
        onResetRef.current();
        const t2 = setTimeout(() => {
          onStartRef.current();
          scheduleNext();
        }, pauseMs);
        timersRef.current.push(t2);
      }, cycleDurationMs);
      timersRef.current.push(t1);
    };

    onStartRef.current();
    scheduleNext();
    return clearAll;
  }, [enabled, reduced, cycleDurationMs, pauseMs]);
}
