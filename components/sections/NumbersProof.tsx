"use client";

import { memo, useMemo, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HOME_COPY } from "@/content/site-copy";
import { SectionShell } from "@/components/layout/SectionShell";
import { useInViewport } from "@/hooks/useInViewport";
import { useLiveMetrics } from "@/hooks/useLiveMetrics";
import type { MetricConfig } from "@/hooks/useLiveMetrics";
import { useReducedMotion } from "@/lib/motion";

const METRIC_CONFIGS: MetricConfig[] = [
  { initial: 212, min: 206, max: 220, step: 3, decimals: 0 },
  { initial: 38, min: 36.5, max: 39.5, step: 0.35, decimals: 1 },
  { initial: 18, min: 15, max: 22, step: 2, decimals: 0 },
  { initial: 3, min: 2.2, max: 3.8, step: 0.2, decimals: 1 },
];

const METRIC_LABELS = [
  "Заявки за 10 дней",
  "Квалификация лидов",
  "Экономия рутины",
  "SLA ответа",
] as const;

type FormatFn = (n: number) => string;
const FORMATTERS: FormatFn[] = [
  (n) => Math.round(n).toString(),
  (n) => `+${n.toFixed(1)}%`,
  (n) => `${Math.round(n)} ч/нед`,
  (n) => `≤${n.toFixed(1)} мин`,
];

const SPARK_BASE: number[][] = [
  [12, 14, 13, 16, 18, 21, 24],
  [10, 11, 12, 13, 15, 16, 17],
  [9, 10, 10, 12, 12, 13, 14],
  [20, 18, 16, 12, 10, 8, 7],
];

function sparkPoints(base: number[], liveValue: number, index: number): number[] {
  const scaled = index === 0 ? liveValue / 9 : index === 1 ? liveValue * 0.45 : index === 2 ? liveValue * 0.7 : 28 - liveValue * 7;
  return [...base.slice(-6), scaled].slice(-8);
}

function Sparkline({
  points,
  accent = "violet",
}: {
  points: number[];
  accent?: "violet" | "pink" | "soft";
}) {
  const stroke =
    accent === "pink"
      ? "rgba(244,114,182,0.85)"
      : accent === "soft"
        ? "rgba(167,139,250,0.8)"
        : "rgba(167,139,250,0.9)";

  const d = useMemo(() => {
    if (!points.length) return "";
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = Math.max(1e-6, max - min);
    const w = 100;
    const h = 18;
    const step = w / Math.max(1, points.length - 1);
    return points
      .map((p, i) => {
        const x = i * step;
        const y = h - ((p - min) / range) * (h - 2) - 1;
        return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ");
  }, [points]);

  if (!points.length) return null;

  return (
    <svg width={100} height={18} viewBox="0 0 100 18" aria-hidden className="mt-2">
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function formatLastUpdate(sec: number): string {
  if (sec === 0) return "только что";
  if (sec === 1) return "1 сек назад";
  if (sec >= 2 && sec <= 4) return `${sec} сек назад`;
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
      className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[rgba(11,6,32,0.4)] p-5"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={reduced ? undefined : { y: -1 }}
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
      <p className="relative text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">{label}</p>
      <div
        className="relative mt-2 min-w-[4ch] text-2xl font-semibold tabular-nums text-[var(--text-primary)] md:text-3xl"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {reduced ? formatter(METRIC_CONFIGS[index + 1]?.initial ?? displayValue) : formatted}
      </div>
      <Sparkline points={sparkPointsArr} accent={accent} />
    </motion.div>
  );
}

function NumbersProofInner() {
  const reduced = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const inView = useInViewport(hostRef, { rootMargin: "220px", threshold: 0.18 });

  const { displayValues, lastUpdateSec } = useLiveMetrics({
    configs: METRIC_CONFIGS,
    inView,
    tickIntervalMs: [1500, 3500],
    tweenDurationMs: [350, 650],
  });

  const heroValue = displayValues[0];
  const sideValues = displayValues.slice(1);
  const heroFormatted = FORMATTERS[0](heroValue);
  const heroStatic = FORMATTERS[0](METRIC_CONFIGS[0].initial);

  const accents: Array<"violet" | "pink" | "soft"> = ["violet", "pink", "soft", "violet"];

  return (
    <SectionShell id="proof" variant="panel" bg="fade">
      <div ref={hostRef}>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <motion.h2
              className="text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl lg:text-[2.5rem]"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {HOME_COPY.proof.title}
            </motion.h2>
            <motion.p
              className="mt-4 text-[var(--text-secondary)]"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.06 }}
            >
              {HOME_COPY.proof.subtitle}
            </motion.p>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/cases" className="text-sm text-[var(--accent)] hover:underline">
              {HOME_COPY.proof.casesLink ?? HOME_COPY.hero.ctaSecondary} →
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr,1fr] lg:gap-8">
          {/* Hero metric — left, large */}
          <motion.div
            className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[rgba(11,6,32,0.5)] p-8 md:p-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45 }}
            whileHover={reduced ? undefined : { y: -2 }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-80"
              aria-hidden
              style={{
                background:
                  "radial-gradient(600px 240px at 15% 0%, rgba(139,92,246,0.22) 0%, transparent 60%), radial-gradient(400px 200px at 85% 20%, rgba(236,72,153,0.12) 0%, transparent 55%)",
              }}
            />
            <div className="relative flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
                {HOME_COPY.proof.liveDemoLabel ?? "Live demo"}
              </span>
              {inView && !reduced && (
                <span className="text-[11px] text-[var(--text-muted)]">
                  {formatLastUpdate(lastUpdateSec)}
                </span>
              )}
            </div>
            <p className="relative mt-4 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              {METRIC_LABELS[0]}
            </p>
            <div
              className="relative mt-3 min-w-[4ch] text-[clamp(3.5rem,10vw,5.5rem)] font-semibold leading-none tabular-nums text-[var(--text-primary)]"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {reduced ? heroStatic : heroFormatted}
            </div>
            <div className="relative mt-4 h-1 w-full overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, rgba(139,92,246,0.9), rgba(244,114,182,0.9))",
                  width: reduced ? "75%" : "0%",
                }}
                animate={reduced ? undefined : inView ? { width: "75%" } : { width: "0%" }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <Sparkline
              points={sparkPoints(SPARK_BASE[0], heroValue, 0)}
              accent="violet"
            />
          </motion.div>

          {/* 3 smaller metrics — right panel */}
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:gap-5">
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

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            {HOME_COPY.proof.footnote}
          </p>
          <span className="text-[10px] text-[var(--text-muted)] opacity-75" aria-hidden>
            {HOME_COPY.proof.liveDemoLabelRu}
          </span>
          <Link href="/cases" className="text-xs text-[var(--accent)] hover:underline">
            {HOME_COPY.proof.casesLink ?? HOME_COPY.hero.ctaSecondary} →
          </Link>
        </div>
      </div>
    </SectionShell>
  );
}

export const NumbersProof = memo(NumbersProofInner);
