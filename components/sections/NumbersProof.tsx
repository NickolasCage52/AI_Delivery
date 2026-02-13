"use client";

import { memo, useMemo, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HOME_COPY } from "@/content/site-copy";
import { SectionShell } from "@/components/layout/SectionShell";
import { useInViewport } from "@/hooks/useInViewport";
import { useCountUp } from "@/hooks/useCountUp";
import { useReducedMotion } from "@/lib/motion";

type Metric = {
  label: string;
  value: string;
  accent?: "violet" | "pink" | "soft";
  spark?: number[];
};

const METRICS: Metric[] = [
  { label: "Заявки за 10 дней", value: "212", accent: "violet", spark: [12, 14, 13, 16, 18, 21, 24] },
  { label: "Квалификация лидов", value: "+38%", accent: "pink", spark: [10, 11, 12, 13, 15, 16, 17] },
  { label: "Экономия рутины", value: "18 ч/нед", accent: "soft", spark: [9, 10, 10, 12, 12, 13, 14] },
  { label: "SLA ответа", value: "≤ 3 мин", accent: "violet", spark: [20, 18, 16, 12, 10, 8, 7] },
];

function parseMetric(value: string) {
  // Extract first number (supports decimals) to count up to.
  const m = value.replace(",", ".").match(/-?\d+(\.\d+)?/);
  if (!m) return null;
  return Number(m[0]);
}

function Sparkline({ points = [], accent = "violet" }: { points?: number[]; accent?: Metric["accent"] }) {
  const stroke =
    accent === "pink"
      ? "rgba(244,114,182,0.9)"
      : accent === "soft"
        ? "rgba(167,139,250,0.85)"
        : "rgba(167,139,250,0.95)";

  const fill =
    accent === "pink"
      ? "rgba(244,114,182,0.12)"
      : accent === "soft"
        ? "rgba(167,139,250,0.10)"
        : "rgba(167,139,250,0.10)";

  const d = useMemo(() => {
    if (!points.length) return "";
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = Math.max(1e-6, max - min);
    const w = 120;
    const h = 24;
    const step = w / Math.max(1, points.length - 1);
    const coords = points.map((p, i) => {
      const x = i * step;
      const y = h - ((p - min) / range) * (h - 2) - 1;
      return { x, y };
    });
    const line = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(2)} ${c.y.toFixed(2)}`).join(" ");
    const area = `${line} L ${w} ${h} L 0 ${h} Z`;
    return { line, area };
  }, [points]);

  if (!points.length) return null;
  const path = typeof d === "string" ? null : d;
  if (!path) return null;

  return (
    <svg width="120" height="24" viewBox="0 0 120 24" aria-hidden className="mt-3">
      <path d={path.area} fill={fill} />
      <path d={path.line} fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SmallMetricCard({ metric, inView, index }: { metric: Metric; inView: boolean; index: number }) {
  const reduced = useReducedMotion();
  const n = parseMetric(metric.value);
  const decimals = n !== null && String(n).includes(".") ? 1 : 0;
  const count = useCountUp(n ?? 0, { durationMs: 820 + index * 80, decimals, startOnView: true, inView });

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-[rgba(11,6,32,0.45)] p-6"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      whileHover={reduced ? undefined : { y: -2 }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-55"
        aria-hidden
        style={{
          background:
            metric.accent === "pink"
              ? "radial-gradient(320px 160px at 20% 0%, rgba(236,72,153,0.18) 0%, transparent 70%)"
              : metric.accent === "soft"
                ? "radial-gradient(320px 160px at 20% 0%, rgba(167,139,250,0.14) 0%, transparent 70%)"
                : "radial-gradient(320px 160px at 20% 0%, rgba(139,92,246,0.16) 0%, transparent 70%)",
        }}
      />
      <p className="relative text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">{metric.label}</p>
      <div
        className="relative mt-3 text-4xl md:text-5xl font-semibold text-[var(--text-primary)]"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {n === null || reduced ? metric.value : metric.value.replace(String(n), count.formatted)}
      </div>
      <Sparkline points={metric.spark} accent={metric.accent} />
    </motion.div>
  );
}

function NumbersProofInner() {
  const reduced = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const inView = useInViewport(hostRef, { rootMargin: "220px", threshold: 0.18 });

  const heroMetric = METRICS[0];
  const sideMetrics = METRICS.slice(1);

  const heroNum = parseMetric(heroMetric.value);
  const heroCount = useCountUp(heroNum ?? 0, { durationMs: 980, decimals: 0, startOnView: true, inView: inView });

  return (
    <SectionShell id="proof" variant="panel" bg="fade">
      <div ref={hostRef}>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <motion.h2
              className="text-3xl font-semibold tracking-tight md:text-4xl text-[var(--text-primary)]"
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
            <Link href="/cases" className="inline-flex text-sm text-[var(--accent)] hover:underline">
              {HOME_COPY.hero.ctaSecondary} →
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.25fr,1fr]">
          {/* One Big */}
          <motion.div
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-[rgba(11,6,32,0.55)] p-7 md:p-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45 }}
            whileHover={reduced ? undefined : { y: -2 }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-70"
              aria-hidden
              style={{
                background:
                  "radial-gradient(700px 260px at 20% 0%, rgba(139,92,246,0.28) 0%, transparent 65%), radial-gradient(540px 240px at 80% 30%, rgba(236,72,153,0.16) 0%, transparent 60%)",
              }}
            />
            <p className="relative text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              {heroMetric.label}
            </p>
            <div
              className="relative mt-4 text-[56px] leading-none md:text-[72px] font-semibold text-[var(--text-primary)]"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {heroNum === null || reduced ? heroMetric.value : heroMetric.value.replace(String(heroNum), heroCount.formatted)}
            </div>
            <div className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, rgba(139,92,246,0.9), rgba(244,114,182,0.9))",
                  width: reduced ? "70%" : "0%",
                }}
                animate={reduced ? undefined : inView ? { width: "78%" } : { width: "0%" }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <p className="relative mt-4 text-sm text-[var(--text-secondary)]">
              Пример метрики результата на пилоте/MVP. Без “сказочных” множителей.
            </p>
          </motion.div>

          {/* 3 Small */}
          <div className="grid gap-5">
            {sideMetrics.map((m, i) => (
              <SmallMetricCard key={m.label} metric={m} index={i} inView={inView} />
            ))}
          </div>
        </div>

        <p className="mt-6 text-xs text-[var(--text-muted)]">{HOME_COPY.proof.footnote}</p>
      </div>
    </SectionShell>
  );
}

export const NumbersProof = memo(NumbersProofInner);

