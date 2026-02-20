"use client";

import { memo, useRef, useState, useEffect, forwardRef, Fragment } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HOME_COPY } from "@/content/site-copy";
import { SectionShell } from "@/components/layout/SectionShell";
import { useInViewport } from "@/hooks/useInViewport";
import { useTypewriterSequence } from "@/hooks/useTypewriterSequence";
import { useLiveGrowthMetrics, type GrowthMetricConfig } from "@/hooks/useLiveGrowthMetrics";
import { CodeWindow } from "@/components/ui/CodeWindow";
import { MetricCard } from "@/components/ui/MetricCard";
import { useReducedMotion } from "@/lib/motion";

const CODE_SNIPPETS: string[][] = [
  [
    "const score = await ai.classify(lead);",
    "if (score > 0.8) crm.create(lead);",
    "return score;",
  ],
  [
    "trigger: webhook → ai → crm",
    "if (lead.hot) notify();",
  ],
];

/** Максимально быстрые тики + крупные шаги */
const GROWTH_CONFIGS: GrowthMetricConfig[] = [
  {
    baseValue: 212,
    growthRateMin: 5,
    growthRateMax: 12,
    tickIntervalMs: [100, 280],
    decimals: 0,
    max: 380,
  },
  {
    baseValue: 38,
    growthRateMin: 0.15,
    growthRateMax: 0.35,
    tickIntervalMs: [120, 300],
    decimals: 1,
    max: 52,
  },
  {
    baseValue: 18,
    growthRateMin: 0.28,
    growthRateMax: 0.6,
    tickIntervalMs: [120, 280],
    decimals: 1,
    max: 32,
  },
];

const METRIC_LABELS = [
  "Заявки за 10 дней",
  "Квалификация лидов",
  "Экономия рутины",
  "SLA ответа",
] as const;

const FORMATTERS: ((n: number) => string)[] = [
  (n) => Math.round(n).toString(),
  (n) => `${n.toFixed(1)}%`,
  (n) => `${n.toFixed(1)} ч/нед`,
  () => "≤ 3 мин",
];

function formatLastUpdate(sec: number): string {
  if (sec === 0) return "только что";
  if (sec === 1) return "1 сек назад";
  return `${sec} сек назад`;
}

const AUTOMATION_MESSAGES = [
  "+1 лид в CRM",
  "Уведомление отправлено",
  "Квалификация обновлена",
  "Отчёт сформирован",
];

function BuildScene({
  inView,
  copy,
}: {
  inView: boolean;
  copy: typeof HOME_COPY.buildToMetrics;
}) {
  const { phase, display, statusLine, hasCursor } = useTypewriterSequence({
    inView,
    snippets: CODE_SNIPPETS,
    typeSpeed: 22,
    pauseBetweenSnippets: 280,
    buildDuration: 550,
    deployDuration: 750,
  });

  const bullets = copy?.bullets ?? ["Собираем MVP", "Интегрируем", "Запускаем"];

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
      <div className="flex-shrink-0 max-w-xl">
        <motion.h2
          className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-3xl md:text-4xl"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          {copy?.title ?? "Код → продукт → метрики"}
        </motion.h2>
        <motion.p
          className="mt-3 text-[var(--text-secondary)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          {copy?.subtitle ?? "Собираем MVP, интегрируем, запускаем. Результат виден сразу."}
        </motion.p>
        <ul className="mt-6 space-y-2">
          {bullets.map((bullet, i) => (
            <motion.li
              key={bullet}
              className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" aria-hidden />
              {bullet}
            </motion.li>
          ))}
        </ul>
        <div className="mt-6">
          <Link href="/cases" className="text-sm text-[var(--accent)] hover:underline">
            {HOME_COPY.proof.casesLink ?? HOME_COPY.hero.ctaSecondary} →
          </Link>
        </div>
      </div>
      <div className="flex-1 min-w-0 max-w-2xl lg:max-w-xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35 }}
        >
          <CodeWindow
            phase={phase}
            display={display}
            statusLine={statusLine}
            hasCursor={hasCursor}
            tabLabel={copy?.codeTab ?? "workflow.ts"}
            statusDeploy={copy?.statusDeploy ?? "Deploying..."}
            statusLive={copy?.statusLive ?? "Live"}
            previewLabel={copy?.previewLabel ?? "Preview"}
            staticCode={CODE_SNIPPETS[0]?.join("\n")}
          />
        </motion.div>
      </div>
    </div>
  );
}

const FLOW_LABELS = ["Лид", "Бот", "CRM", "Отчёты"] as const;
const FLOW_PULSE_INTERVAL_MS = 2800;

function AutomationScene({ inView }: { inView: boolean }) {
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const rowRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [packetStyle, setPacketStyle] = useState<{ left: number; top: number } | null>(null);

  useEffect(() => {
    if (!inView || reduced) return;
    const t = setInterval(() => {
      setActiveIndex((i) => (i + 1) % 4);
    }, FLOW_PULSE_INTERVAL_MS);
    return () => clearInterval(t);
  }, [inView, reduced]);

  useEffect(() => {
    if (!inView || reduced) return;
    const row = rowRef.current;
    const node = nodeRefs.current[activeIndex];
    if (!row || !node) return;
    const rowRect = row.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    setPacketStyle({
      left: nodeRect.left - rowRect.left + nodeRect.width / 2,
      top: nodeRect.top - rowRect.top + nodeRect.height / 2,
    });
  }, [inView, reduced, activeIndex]);

  return (
    <motion.div
      className="rounded-xl border border-white/[0.06] bg-[rgba(11,6,32,0.5)] p-6 md:p-8"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4 }}
    >
      <p className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider mb-4">
        Automation in motion
      </p>
      <div ref={rowRef} className="relative flex flex-wrap items-center justify-center gap-4 md:gap-6 min-h-[3rem]">
        {FLOW_LABELS.map((label, i) => (
          <Fragment key={label}>
            <FlowNode
              ref={(el) => { nodeRefs.current[i] = el; }}
              label={label}
              isActive={activeIndex === i}
              reducedMotion={reduced}
            />
            {i < 3 && <FlowArrow isActive={activeIndex === i} reducedMotion={reduced} />}
          </Fragment>
        ))}
        {inView && !reduced && packetStyle !== null && (
          <span
            className="absolute w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_var(--accent)] pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
            style={{ left: packetStyle.left, top: packetStyle.top }}
            aria-hidden
          />
        )}
      </div>
      {inView && (
        <LiveStatusTicker messages={AUTOMATION_MESSAGES} intervalMs={2200} />
      )}
    </motion.div>
  );
}

const FlowNode = memo(
  forwardRef<HTMLDivElement, { label: string; isActive: boolean; reducedMotion: boolean }>(
    function FlowNode({ label, isActive, reducedMotion }, ref) {
      return (
        <div
          ref={ref}
          className={`rounded-lg border px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-all duration-300 ${
            isActive
              ? "border-violet-400/60 bg-violet-500/20 shadow-[0_0_20px_rgba(139,92,246,0.25)]"
              : "border-violet-500/30 bg-violet-500/10"
          } ${reducedMotion && isActive ? "ring-2 ring-violet-400/50" : ""}`}
        >
          {label}
        </div>
      );
    }
  )
);

function FlowArrow({ isActive, reducedMotion }: { isActive: boolean; reducedMotion: boolean }) {
  return (
    <svg
      width="24"
      height="16"
      viewBox="0 0 24 16"
      fill="none"
      aria-hidden
      className={`flex-shrink-0 transition-all duration-300 ${isActive ? "text-violet-300 drop-shadow-[0_0_6px_rgba(139,92,246,0.5)]" : "text-violet-400/70"}`}
    >
      <path
        d="M0 8h18m0 0l-5-5m5 5l-5 5"
        stroke="currentColor"
        strokeWidth={isActive && !reducedMotion ? 2 : 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LiveStatusTicker({ messages, intervalMs }: { messages: string[]; intervalMs: number }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, intervalMs);
    return () => clearInterval(t);
  }, [messages.length, intervalMs]);
  return (
    <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
      <span className="text-violet-300">{messages[index]}</span>
    </p>
  );
}

function MetricsScene({
  inView,
  enabled,
}: {
  inView: boolean;
  enabled: boolean;
}) {
  const reduced = useReducedMotion();
  const active = inView && enabled && !reduced;

  const { displayValues, lastUpdateSec } = useLiveGrowthMetrics({
    configs: GROWTH_CONFIGS,
    enabled: active,
    tweenDurationMs: [60, 120],
  });

  const accents: Array<"violet" | "pink" | "soft"> = ["violet", "pink", "soft", "violet"];

  return (
    <motion.div
      className="rounded-xl border border-white/[0.06] bg-[rgba(11,6,32,0.6)] p-5 md:p-6"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 rounded border border-violet-500/30 bg-violet-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-violet-300">
          <span className={`h-1.5 w-1.5 rounded-full bg-emerald-400 ${active ? "animate-pulse" : ""}`} aria-hidden />
          {HOME_COPY.proof.liveDemoLabel ?? "Live demo"}
        </span>
        {active && (
          <span className="text-[10px] text-[var(--text-muted)]">
            {formatLastUpdate(lastUpdateSec)}
          </span>
        )}
      </div>
      <p className="text-[11px] text-[var(--text-muted)] mb-4">
        На основе обезличенных кейсов · симуляция роста
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2].map((i) => (
          <MetricCard
            key={METRIC_LABELS[i]}
            label={METRIC_LABELS[i]}
            value={reduced ? FORMATTERS[i](GROWTH_CONFIGS[i].baseValue) : FORMATTERS[i](displayValues[i] ?? GROWTH_CONFIGS[i].baseValue)}
            sparklinePoints={[]}
            accent={accents[i]}
            compact
            showLive={i === 0}
          />
        ))}
        <MetricCard
          label={METRIC_LABELS[3]}
          value="≤ 3 мин"
          sparklinePoints={[]}
          accent="violet"
          compact
          stabilityBadge="Стабильно"
        />
      </div>
    </motion.div>
  );
}

function GrowthStoryInner() {
  const hostRef = useRef<HTMLDivElement>(null);
  const inView = useInViewport(hostRef, { rootMargin: "200px", threshold: 0.08 });
  const copy = HOME_COPY.buildToMetrics;

  return (
    <SectionShell id="proof" variant="panel" bg="fade" seamless className="relative">
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        aria-hidden
        style={{
          background:
            "radial-gradient(900px 400px at 20% 0%, rgba(139,92,246,0.12) 0%, transparent 55%), radial-gradient(700px 350px at 80% 10%, rgba(236,72,153,0.08) 0%, transparent 50%)",
        }}
      />
      <div ref={hostRef} className="relative space-y-16 md:space-y-20">
        {/* Scene 1 — Build */}
        <BuildScene inView={inView} copy={copy} />

        {/* Scene 2 — Automation in motion */}
        <AutomationScene inView={inView} />

        {/* Scene 3 — Metrics growth */}
        <MetricsScene inView={inView} enabled={true} />

        <p className="text-xs text-[var(--text-muted)]">
          {HOME_COPY.proof.footnote}
          <span className="ml-2 opacity-75" aria-hidden>
            ({HOME_COPY.proof.liveDemoLabelRu})
          </span>
        </p>
      </div>
    </SectionShell>
  );
}

export const GrowthStory = memo(GrowthStoryInner);
