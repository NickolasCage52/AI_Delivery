"use client";

import { memo, useRef } from "react";
import { useInViewport } from "@/hooks/useInViewport";
import { useCountUp } from "@/hooks/useCountUp";
import { useReducedMotion } from "@/lib/motion";
import Link from "next/link";
import s from "../how-it-works.module.css";

/* Real data from cases.json */
const TODO_QUOTE = "Быстро проверили спрос без долгой разработки.";
const TODO_CLIENT = "Онлайн-школа, case-02";

const METRICS = [
  {
    value: 212,
    suffix: "",
    prefix: "+",
    label: "новых заявок за месяц",
    bar: 78,
    icon: "📈",
    format: (n: number) => `+${Math.round(n)}`,
    decimals: 0,
  },
  {
    value: 6.2,
    suffix: "%",
    prefix: "",
    label: "конверсия в заявку",
    bar: 62,
    icon: "🎯",
    format: (n: number) => n.toFixed(1),
    decimals: 1,
  },
  {
    value: 18,
    suffix: " ч/нед",
    prefix: "",
    label: "экономия времени команды",
    bar: 72,
    icon: "⏱",
    format: (n: number) => `${Math.round(n)}`,
    decimals: 0,
  },
  {
    value: 28,
    suffix: "%",
    prefix: "-",
    label: "снижение стоимости лида",
    bar: 56,
    icon: "💰",
    format: (n: number) => `-${Math.round(n)}`,
    decimals: 0,
  },
];

const EASING = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

function MetricCell({
  target,
  format,
  suffix,
  label,
  bar,
  icon,
  decimals,
  inView,
  reduced,
  delayMs,
}: {
  target: number;
  format: (n: number) => string;
  suffix: string;
  label: string;
  bar: number;
  icon: string;
  decimals: number;
  inView: boolean;
  reduced: boolean;
  delayMs?: number;
}) {
  const { value } = useCountUp(target, {
    durationMs: 1800,
    decimals,
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
        <span className="text-lg" aria-hidden>
          {icon}
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
            width: inView || reduced ? `${bar}%` : "0%",
            background:
              "linear-gradient(90deg, var(--accent) 0%, var(--accent-pink) 100%)",
            transition: `width 1800ms ${EASING}`,
            transitionDelay: inView || reduced ? "200ms" : "0ms",
          }}
        />
      </div>
    </div>
  );
}

function MetricsGridInner({ enabled = true }: { enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref, { rootMargin: "150px", threshold: 0.2 });
  const shouldAnimate = enabled && inView;
  const reduced = useReducedMotion();
  const showContent = enabled && (inView || reduced);

  return (
    <div
      ref={ref}
      className={`relative space-y-6 max-w-2xl ml-0 mr-0 md:ml-auto ${s.metricsGridBg}`}
    >
      <div
        className="grid grid-cols-2 gap-3 md:gap-4 transition-opacity duration-500"
        style={{
          opacity: showContent ? 1 : 0,
        }}
      >
        {METRICS.map((m, i) => (
          <MetricCell
            key={`${m.label}-${i}`}
            target={m.value}
            format={m.format}
            suffix={m.suffix}
            label={m.label}
            bar={m.bar}
            icon={m.icon}
            decimals={m.decimals}
            inView={shouldAnimate}
            reduced={reduced}
            delayMs={i * 120}
          />
        ))}
      </div>
      <blockquote
        className="relative pl-6 border-l-2 border-[var(--accent)]/40 transition-opacity duration-500"
        style={{
          opacity: showContent ? 1 : 0,
          transitionDelay: showContent ? "800ms" : "0ms",
        }}
      >
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
          opacity: showContent ? 0.4 : 0,
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
