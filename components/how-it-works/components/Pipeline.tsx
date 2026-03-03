"use client";

import { memo, useRef, useState, useEffect, Fragment } from "react";
import { motion } from "framer-motion";
import { useInViewport } from "@/hooks/useInViewport";
import { useReducedMotion } from "@/lib/motion";

const NODES = [
  { id: "lead", label: "Лид" },
  { id: "qualify", label: "Квалификация" },
  { id: "crm", label: "CRM" },
  { id: "manager", label: "Менеджер" },
  { id: "sale", label: "Продажа" },
  { id: "repeat", label: "Повтор" },
];

const FLOW_PULSE_INTERVAL_MS = 900;

function FlowNode({
  label,
  isActive,
  reducedMotion,
}: {
  label: string;
  isActive: boolean;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      className={`rounded-lg border px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-colors duration-150 ${
        isActive
          ? "border-violet-400/80 bg-violet-500/25 shadow-[0_0_28px_rgba(139,92,246,0.4),0_0_0_1px_rgba(139,92,246,0.3)]"
          : "border-violet-500/25 bg-violet-500/8"
      } ${reducedMotion && isActive ? "ring-2 ring-violet-400/50" : ""}`}
      animate={isActive && !reducedMotion ? { scale: [1, 1.03, 1] } : {}}
      transition={{ duration: 0.2 }}
    >
      <span className={isActive ? "drop-shadow-[0_0_6px_rgba(139,92,246,0.6)]" : ""}>
        {label}
      </span>
    </motion.div>
  );
}

function FlowArrow({ isActive, reducedMotion }: { isActive: boolean; reducedMotion: boolean }) {
  return (
    <svg
      width="24"
      height="16"
      viewBox="0 0 24 16"
      fill="none"
      aria-hidden
      className={`flex-shrink-0 transition-all duration-150 ${isActive ? "text-violet-300 drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]" : "text-violet-400/60"}`}
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

function PipelineInner({ enabled = true }: { enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref, { rootMargin: "120px", threshold: 0.5 });
  const active = enabled && inView;
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!active || reduced) return;
    const t = setInterval(() => {
      setActiveIndex((i) => (i + 1) % NODES.length);
    }, FLOW_PULSE_INTERVAL_MS);
    return () => clearInterval(t);
  }, [active, reduced]);

  return (
    <div
      ref={ref}
      className="rounded-xl border border-white/[0.06] bg-[rgba(11,6,32,0.5)] p-6 md:p-8 overflow-hidden max-w-3xl"
    >
      <p className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider mb-4">
        Lead → CRM → Продажа
      </p>
      <div className="relative flex flex-wrap items-center justify-center gap-4 md:gap-6 min-h-[3rem]">
        {NODES.map((node, i) => (
          <Fragment key={node.id}>
            <FlowNode
              label={node.label}
              isActive={activeIndex === i}
              reducedMotion={reduced}
            />
            {i < NODES.length - 1 && (
              <FlowArrow
                isActive={activeIndex === i}
                reducedMotion={reduced}
              />
            )}
          </Fragment>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
        Один сквозной процесс вместо хаоса в мессенджерах
      </p>
    </div>
  );
}

export const Pipeline = memo(PipelineInner);
