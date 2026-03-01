"use client";

import { memo, useRef, useState, useCallback } from "react";
import { useInViewport } from "@/hooks/useInViewport";
import { useReducedMotion } from "@/lib/motion";
import { useAnimationCycle } from "../hooks/useAnimationCycle";
import s from "../how-it-works.module.css";

const NODES = [
  { id: "lead", label: "Лид" },
  { id: "qualify", label: "Квалификация" },
  { id: "crm", label: "CRM" },
  { id: "manager", label: "Менеджер" },
  { id: "sale", label: "Продажа" },
  { id: "repeat", label: "Повтор" },
];

const CYCLE_MS = 4000;
const PAUSE_MS = 2000;

function PipelineInner({ enabled = true }: { enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref, { rootMargin: "120px", threshold: 0.5 });
  const active = enabled && inView;
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);

  useAnimationCycle({
    enabled: active,
    pauseMs: PAUSE_MS,
    cycleDurationMs: CYCLE_MS,
    onStart: useCallback(() => setPlaying(true), []),
    onReset: useCallback(() => setPlaying(false), []),
  });

  const show = active || reduced;
  const runAnimation = show && !reduced && playing;

  return (
    <div
      ref={ref}
      className="rounded-xl border border-white/[0.08] bg-[rgba(8,5,24,0.6)] p-5 md:p-6 overflow-hidden max-w-3xl"
    >
      <div className="flex items-center gap-2 mb-4">
        <span
          className={`h-2 w-2 rounded-full bg-violet-500 ${runAnimation ? "animate-pulse" : ""}`}
          aria-hidden
        />
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Lead → CRM → Продажа
        </span>
      </div>
      <div className="relative flex flex-col items-stretch gap-3 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-4 md:flex-nowrap">
        {/* Mobile: vertical line left of nodes */}
        <div
          className={`absolute left-[11px] top-2 bottom-2 w-0.5 bg-[var(--accent)]/50 md:hidden ${s.timelineLine} ${
            runAnimation ? s.timelineLineActive : ""
          } ${reduced ? s.timelineLineReduced : ""}`}
          style={{ transformOrigin: "top" }}
          aria-hidden
        />
        {NODES.map((node, i) => (
          <div
            key={node.id}
            className={`relative flex flex-col items-center gap-1 pl-6 md:pl-0 ${s.pipelineNode} ${
              runAnimation ? s.pipelineNodeActive : ""
            } ${reduced ? "opacity-100" : ""}`}
            style={runAnimation ? { animationDelay: `${i * 150}ms` } : undefined}
          >
            <div className="rounded-lg border border-[var(--accent)]/40 bg-[rgba(139,92,246,0.12)] px-2 py-1.5 min-w-[60px] text-center">
              <span className="text-xs font-medium text-[var(--text-secondary)]">
                {node.label}
              </span>
            </div>
            {i < NODES.length - 1 && (
              <span
                className="hidden md:inline text-[var(--accent)]/50 text-xs"
                aria-hidden
              >
                →
              </span>
            )}
            {i < NODES.length - 1 && (
              <span
                className="md:hidden block text-[var(--accent)]/50 text-xs text-center"
                aria-hidden
              >
                ↓
              </span>
            )}
          </div>
        ))}
      </div>
      <svg
        viewBox="0 0 360 60"
        className="hidden md:block w-full h-16 md:h-20 mt-4"
        aria-hidden
      >
        <defs>
          <linearGradient id="hiw-pipeline-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-pink)" />
          </linearGradient>
        </defs>
        <line
          x1="30"
          y1="30"
          x2="330"
          y2="30"
          stroke="url(#hiw-pipeline-grad)"
          strokeWidth="1.5"
          strokeOpacity="0.4"
          strokeDasharray="300"
          strokeDashoffset={reduced ? 0 : runAnimation ? 0 : 300}
          style={{
            transition: "stroke-dashoffset 1.2s ease-out",
            transitionDelay: runAnimation ? "0.2s" : "0s",
          }}
        />
      </svg>
      <p className="mt-3 text-xs text-[var(--text-muted)]">
        Один сквозной процесс вместо хаоса в мессенджерах
      </p>
    </div>
  );
}

export const Pipeline = memo(PipelineInner);
