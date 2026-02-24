"use client";

import { memo, useMemo, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HOME_COPY } from "@/content/site-copy";
import { DISCLAIMER_DEMO } from "@/lib/constants/messaging";
import { useInViewport } from "@/hooks/useInViewport";
import { useLiveMetrics } from "@/hooks/useLiveMetrics";
import type { MetricConfig } from "@/hooks/useLiveMetrics";
import { useReducedMotion } from "@/lib/motion";

const METRIC_CONFIGS: MetricConfig[] = [
  { initial: 212, min: 180, max: 265, step: 4, decimals: 0 },
  { initial: 38, min: 34, max: 44, step: 0.5, decimals: 1 },
  { initial: 18, min: 12, max: 26, step: 2.5, decimals: 0 },
  { initial: 3, min: 1.8, max: 4.5, step: 0.25, decimals: 1 },
];

const METRIC_LABELS = [
  "Заявки за 10 дней",
  "Квалификация лидов",
  "Экономия рутины",
  "SLA ответа",
] as const;

type FormatFn = (n: number) => string;
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, Number.isFinite(n) ? n : min));
const FORMATTERS: FormatFn[] = [
  (n) => Math.round(clamp(n, 180, 265)).toString(),
  (n) => `+${clamp(n, 34, 44).toFixed(1)}%`,
  (n) => `${Math.round(clamp(n, 12, 26))} ч/нед`,
  (n) => `≤${clamp(n, 1.8, 4.5).toFixed(1)} мин`,
];

const SPARK_BASE: number[][] = [
  [12, 14, 13, 16, 18, 21, 24],
  [10, 11, 12, 13, 15, 16, 17],
  [9, 10, 10, 12, 12, 13, 14],
  [20, 18, 16, 12, 10, 8, 7],
];

function sparkPoints(base: number[], liveValue: number, index: number): number[] {
  const v = Number.isFinite(liveValue) ? liveValue : base[base.length - 1] ?? 12;
  const scaled = index === 0 ? v / 10 : index === 1 ? v * 0.5 : index === 2 ? v * 0.6 : Math.max(4, 30 - v * 6);
  return [...base.slice(-6), scaled].slice(-8);
}

function Sparkline({ points, accent = "violet", compact }: { points: number[]; accent?: "violet" | "pink" | "soft"; compact?: boolean }) {
  const stroke = accent === "pink" ? "rgba(244,114,182,0.85)" : accent === "soft" ? "rgba(167,139,250,0.8)" : "rgba(167,139,250,0.9)";
  const w = compact ? 80 : 100;
  const h = compact ? 14 : 18;
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
        return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ");
  }, [points, w, h]);
  if (!points.length) return null;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden className={compact ? "mt-1" : "mt-2"}>
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function formatLastUpdate(sec: number): string {
  if (sec === 0) return "только что";
  if (sec === 1) return "1 сек назад";
  return `${sec} сек назад`;
}

function SmallMetricCard({
  label,
  displayValue,
  formatter,
  sparkPointsArr,
  accent,
  index,
}: {
  label: string;
  displayValue: number;
  formatter: FormatFn;
  sparkPointsArr: number[];
  accent: "violet" | "pink" | "soft";
  index: number;
}) {
  const reduced = useReducedMotion();
  const formatted = formatter(displayValue);
  return (
    <motion.div
      className="relative overflow-hidden rounded-lg border border-white/[0.06] bg-[rgba(11,6,32,0.4)] p-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25 }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden
        style={{
          background:
            accent === "pink"
              ? "radial-gradient(200px 100px at 10% 0%, rgba(236,72,153,0.12) 0%, transparent 70%)"
              : accent === "soft"
                ? "radial-gradient(200px 100px at 10% 0%, rgba(167,139,250,0.1) 0%, transparent 70%)"
                : "radial-gradient(200px 100px at 10% 0%, rgba(139,92,246,0.12) 0%, transparent 70%)",
        }}
      />
      <p className="relative text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">{label}</p>
      <div className="relative mt-1 w-[6ch] min-w-[6ch] text-xl font-semibold tabular-nums text-[var(--text-primary)] md:text-2xl" style={{ fontVariantNumeric: "tabular-nums" }}>
        {reduced ? formatter(METRIC_CONFIGS[index + 1]?.initial ?? displayValue) : formatted}
      </div>
      <Sparkline points={sparkPointsArr} accent={accent} compact />
    </motion.div>
  );
}

export type NumbersProofLiveProps = {
  enabled: boolean;
  /** Optional: show as compact (e.g. inside BuildToMetrics) */
  compact?: boolean;
};

function NumbersProofLiveInner({ enabled, compact = false }: NumbersProofLiveProps) {
  const reduced = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const inView = useInViewport(hostRef, { rootMargin: "180px", threshold: 0.12 });

  const { displayValues, lastUpdateSec } = useLiveMetrics({
    configs: METRIC_CONFIGS,
    inView,
    enabled,
    tickIntervalMs: [2200, 3600],
    tweenDurationMs: [350, 500],
  });

  const heroValue = displayValues[0];
  const sideValues = displayValues.slice(1);
  const heroFormatted = FORMATTERS[0](heroValue);
  const heroStatic = FORMATTERS[0](METRIC_CONFIGS[0].initial);
  const accents: Array<"violet" | "pink" | "soft"> = ["violet", "pink", "soft", "violet"];

  return (
    <div ref={hostRef} className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[rgba(11,6,32,0.6)] p-4 md:p-5">
      <p className="relative text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
        {DISCLAIMER_DEMO}
      </p>
      <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden style={{ background: "radial-gradient(400px 150px at 50% 0%, rgba(139,92,246,0.15) 0%, transparent 70%)" }} />
      <div className="relative flex flex-wrap items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1 rounded border border-violet-500/30 bg-violet-500/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-violet-300">
          <span className={`h-1 w-1 rounded-full bg-emerald-400 ${enabled && !reduced ? "animate-pulse" : ""}`} aria-hidden />
          {HOME_COPY.proof.liveDemoLabel ?? "Live"}
        </span>
        {enabled && inView && !reduced && (
          <span className="text-[10px] text-[var(--text-muted)]">{formatLastUpdate(lastUpdateSec)}</span>
        )}
      </div>
      <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.1fr,1fr]">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">{METRIC_LABELS[0]}</p>
          <div className="mt-1 w-[3.5ch] min-w-[3.5ch] text-[clamp(2rem,6vw,3.5rem)] font-semibold leading-none tabular-nums text-[var(--text-primary)]" style={{ fontVariantNumeric: "tabular-nums" }}>
            {reduced ? heroStatic : heroFormatted}
          </div>
          <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, rgba(139,92,246,0.9), rgba(244,114,182,0.9))", width: reduced || !enabled ? "70%" : "0%" }}
              animate={reduced || !enabled ? undefined : inView ? { width: "72%" } : { width: "0%" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <Sparkline points={sparkPoints(SPARK_BASE[0], heroValue, 0)} accent="violet" compact />
        </div>
        <div className="grid gap-3 sm:grid-cols-1 sm:grid-rows-3">
          {[1, 2, 3].map((i) => (
            <SmallMetricCard
              key={METRIC_LABELS[i]}
              label={METRIC_LABELS[i]}
              displayValue={sideValues[i - 1] ?? METRIC_CONFIGS[i].initial}
              formatter={FORMATTERS[i]}
              sparkPointsArr={sparkPoints(SPARK_BASE[i], sideValues[i - 1] ?? METRIC_CONFIGS[i].initial, i)}
              accent={accents[i]}
              index={i - 1}
            />
          ))}
        </div>
      </div>
      {!compact && (
        <>
          <div className="relative mt-5 flex flex-wrap items-center gap-4">
            <p className="text-xs text-[var(--text-muted)]">{HOME_COPY.proof.footnote}</p>
            <Link href="/cases" className="text-xs text-[var(--accent)] hover:underline">{HOME_COPY.proof.casesLink ?? HOME_COPY.hero.ctaSecondary} →</Link>
          </div>
          <div className="relative mt-5 rounded-lg border border-white/[0.06] bg-[rgba(11,6,32,0.4)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Как мы измеряем успех на реальных проектах</p>
            <p className="mt-2 text-[11px] text-[var(--text-secondary)]">На старте фиксируем: скорость первого ответа клиенту (мин/часы), долю обработанных лидов без потерь (%), конверсию в запись / встречу / заказ (%), время менеджера на рутинные задачи (часы/день), долю повторных покупок (для опта/дистрибуции). После запуска сравниваем с этими же метриками.</p>
          </div>
        </>
      )}
    </div>
  );
}

export const NumbersProofLive = memo(NumbersProofLiveInner);
