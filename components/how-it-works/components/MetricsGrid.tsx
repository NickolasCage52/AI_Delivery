"use client";

import { memo, useRef, useState, useCallback } from "react";
import { useInViewport } from "@/hooks/useInViewport";
import { useCountUp } from "@/hooks/useCountUp";
import { useReducedMotion } from "@/lib/motion";
import { useAnimationCycle } from "../hooks/useAnimationCycle";
import Link from "next/link";
import s from "../how-it-works.module.css";

/* Real data from cases.json */
const METRIC_LEADS = 212; // case-02
const METRIC_CONVERSION = 6.2; // case-02
const METRIC_HOURS = 18; // case-03
const METRIC_CPL = 28; // case-02

const TODO_QUOTE = "Быстро проверили спрос без долгой разработки.";
const TODO_CLIENT = "Онлайн-школа, case-02";

const METRICS = [
  {
    value: METRIC_LEADS,
    format: (n: number) => `+${Math.round(n)}`,
    suffix: "",
    label: "Заявок за месяц",
    icon: "↑",
    tone: "growth" as const,
  },
  {
    value: METRIC_CONVERSION,
    format: (n: number) => n.toFixed(1),
    suffix: "%",
    label: "Конверсия",
    icon: "↑",
    tone: "growth" as const,
  },
  {
    value: METRIC_HOURS,
    format: (n: number) => `${Math.round(n)}`,
    suffix: " ч/нед",
    label: "Экономия времени",
    icon: "↑",
    tone: "growth" as const,
  },
  {
    value: METRIC_CPL,
    format: (n: number) => `-${Math.round(n)}`,
    suffix: "%",
    label: "Снижение CPL",
    icon: "↑",
    tone: "growth" as const,
  },
];

const CYCLE_MS = 4800;
const FADE_MS = 600;
const PAUSE_MS = FADE_MS + 200;

function MetricCell({
  target,
  format,
  suffix,
  label,
  inView,
  reduced,
  delayMs,
  tone,
}: {
  target: number;
  format: (n: number) => string;
  suffix: string;
  label: string;
  inView: boolean;
  reduced: boolean;
  delayMs?: number;
  tone: "growth" | "speed";
}) {
  const { value } = useCountUp(target, {
    durationMs: 1800,
    decimals: target === METRIC_CONVERSION ? 1 : 0,
    startOnView: true,
    inView,
  });
  const numStr = format(value);

  return (
    <div
      className={`${s.metricsCard} rounded-2xl border border-white/[0.08] bg-[rgba(255,255,255,0.04)] p-6 flex flex-col gap-3 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/30 md:backdrop-blur-[12px]`}
      style={{
        opacity: inView || reduced ? 1 : 0,
        filter: inView || reduced ? "blur(0)" : "blur(20px)",
        transform: inView || reduced ? "scale(1)" : "scale(0.9)",
        transitionDelay: delayMs ? `${delayMs}ms` : undefined,
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-lg ${
            tone === "growth" ? "text-emerald-400" : "text-[var(--accent)]"
          }`}
          aria-hidden
        >
          {tone === "growth" ? "↑" : "⚡"}
        </span>
        <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-[36px] md:text-[52px] font-extrabold tabular-nums text-[var(--accent)] leading-none">
          {numStr}
        </span>
        {suffix && (
          <span
            className={`text-xl md:text-2xl font-bold text-[var(--accent)] ${s.metricsSuffix}`}
            style={{
              opacity: inView || reduced ? 1 : 0,
              transform: inView || reduced ? "scale(1)" : "scale(0)",
              transition: "opacity 0.2s, transform 0.2s",
              transitionDelay: inView ? "1.6s" : "0s",
            }}
          >
            {suffix}
          </span>
        )}
      </div>
      <div
        className="h-[6px] rounded-[3px] bg-[var(--accent)]/20 overflow-hidden"
        style={{ boxShadow: "0 0 12px rgba(139,92,246,0.15)" }}
      >
        <div
          className={`h-full rounded-[3px] ${s.metricsBar}`}
          style={{
            width: inView || reduced ? "100%" : "0%",
            background:
              "linear-gradient(90deg, var(--accent) 0%, var(--accent-pink) 100%)",
            transition: "width 1.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            transitionDelay: inView || reduced ? "200ms" : "0ms",
          }}
        />
      </div>
    </div>
  );
}

function MetricsGridInner({ enabled = true }: { enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref, { rootMargin: "0px", threshold: 0.5 });
  const active = enabled && inView;
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [cycleKey, setCycleKey] = useState(0);

  useAnimationCycle({
    enabled: active,
    pauseMs: PAUSE_MS,
    cycleDurationMs: CYCLE_MS,
    onStart: useCallback(() => {
      setResetting(false);
      setPlaying(true);
      setCycleKey((k) => k + 1);
    }, []),
    onReset: useCallback(() => {
      setPlaying(false);
      setResetting(true);
    }, []),
  });

  const show = active || reduced;
  const runAnimation = show && !reduced && playing;
  const showContent = runAnimation && !resetting;
  const countersCanAnimate = (showContent || enabled) && !resetting;

  return (
    <div
      ref={ref}
      className={`relative space-y-6 max-w-2xl mx-auto ${s.metricsGridBg}`}
    >
      <div
        className="grid grid-cols-2 gap-3 md:gap-4 transition-opacity duration-500"
        style={{
          opacity: reduced ? 1 : resetting ? 0 : showContent ? 1 : 0,
        }}
      >
        {METRICS.map((m, i) => (
          <MetricCell
            key={`${cycleKey}-${i}`}
            target={m.value}
            format={m.format}
            suffix={m.suffix}
            label={m.label}
            inView={countersCanAnimate}
            reduced={reduced}
            delayMs={i * 120}
            tone={m.tone}
          />
        ))}
      </div>
      <blockquote
        className="relative pl-6 border-l-2 border-[var(--accent)]/40 transition-opacity duration-500"
        style={{
          opacity: reduced ? 1 : showContent ? 1 : 0,
          transitionDelay: showContent ? "800ms" : "0ms",
        }}
      >
        <span className="absolute -left-2 top-0 text-[48px] text-[var(--accent)] opacity-20 leading-none">
          «
        </span>
        <p className="text-base text-[var(--text-muted)] italic">
          {TODO_QUOTE}
        </p>
        <cite className="block mt-2 not-italic text-sm text-[var(--text-muted)]">
          — {TODO_CLIENT}
        </cite>
      </blockquote>
      <p
        className="text-xs text-[var(--text-muted)] opacity-40 transition-opacity"
        style={{
          opacity: reduced ? 0.4 : showContent ? 0.4 : 0,
        }}
      >
        Результаты конкретных проектов. Ваши показатели зависят от специфики
        бизнеса.
      </p>
      <Link
        href="/cases"
        className="inline-flex items-center gap-1 rounded-lg border border-[var(--accent)]/40 px-4 py-2.5 text-base font-medium text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        Смотреть кейсы подробнее →
      </Link>
    </div>
  );
}

export const MetricsGrid = memo(MetricsGridInner);
