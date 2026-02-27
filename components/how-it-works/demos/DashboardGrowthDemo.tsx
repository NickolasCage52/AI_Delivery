"use client";

import { memo, useMemo, useRef } from "react";
import { useInViewport } from "@/hooks/useInViewport";
import { useLiveMetrics } from "@/hooks/useLiveMetrics";
import type { MetricConfig } from "@/hooks/useLiveMetrics";
import { useReducedMotion } from "@/lib/motion";

const METRIC_CONFIGS: MetricConfig[] = [
  { initial: 212, min: 180, max: 265, step: 4, decimals: 0 },
  { initial: 38, min: 34, max: 44, step: 0.5, decimals: 1 },
  { initial: 18, min: 12, max: 26, step: 2.5, decimals: 0 },
];

const LABELS = ["Заявки", "Квалификация", "Экономия ч/нед"];
const FORMATTERS = [
  (n: number) => Math.round(Math.max(180, Math.min(265, n))).toString(),
  (n: number) => `+${Math.max(34, Math.min(44, n)).toFixed(1)}%`,
  (n: number) => `${Math.round(Math.max(12, Math.min(26, n)))} ч`,
];

const SPARK_BASE: number[][] = [
  [12, 14, 16, 18, 21, 24, 26],
  [10, 11, 12, 14, 16, 17, 18],
  [9, 10, 11, 12, 13, 14, 15],
];

function sparkPoints(base: number[], live: number, i: number): number[] {
  const v = Number.isFinite(live) ? live : base[base.length - 1] ?? 12;
  const scaled = i === 0 ? v / 10 : i === 1 ? v * 0.5 : v * 0.6;
  return [...base.slice(-6), scaled].slice(-8);
}

function Sparkline({ points, compact }: { points: number[]; compact?: boolean }) {
  const w = compact ? 60 : 80;
  const h = compact ? 12 : 16;
  const d = useMemo(() => {
    if (!points.length) return "";
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = Math.max(1e-6, max - min);
    const step = w / Math.max(1, points.length - 1);
    return points
      .map((p, i) => {
        const x = i * step;
        const y = h - ((p - min) / range) * (h - 2) - 1;
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }, [points, w, h]);
  if (!points.length) return null;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden className="mt-1">
      <path
        d={d}
        fill="none"
        stroke="rgba(167,139,250,0.9)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DashboardGrowthDemoInner({ enabled = true }: { enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref, { rootMargin: "120px", threshold: 0.1 });
  const reduced = useReducedMotion();
  const active = enabled && inView;

  const { displayValues } = useLiveMetrics({
    configs: METRIC_CONFIGS,
    inView: active,
    enabled: active,
    tickIntervalMs: [2400, 3800],
    tweenDurationMs: [320, 480],
  });

  return (
    <div ref={ref} className="rounded-xl border border-white/[0.08] bg-[rgba(8,5,24,0.6)] p-4 md:p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Live demo
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={LABELS[i]}
            className="rounded-lg border border-white/[0.06] bg-[rgba(11,6,32,0.4)] p-3"
          >
            <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {LABELS[i]}
            </p>
            <div className="mt-1 text-lg font-semibold tabular-nums text-[var(--text-primary)]">
              {reduced
                ? FORMATTERS[i](METRIC_CONFIGS[i].initial)
                : FORMATTERS[i](displayValues[i] ?? METRIC_CONFIGS[i].initial)}
            </div>
            <Sparkline
              points={sparkPoints(
                SPARK_BASE[i],
                displayValues[i] ?? METRIC_CONFIGS[i].initial,
                i
              )}
              compact
            />
          </div>
        ))}
      </div>
      <p className="mt-3 text-[10px] text-[var(--text-muted)]">
        Up-only sparklines • меньше рутины — больше результата
      </p>
    </div>
  );
}

export const DashboardGrowthDemo = memo(DashboardGrowthDemoInner);
