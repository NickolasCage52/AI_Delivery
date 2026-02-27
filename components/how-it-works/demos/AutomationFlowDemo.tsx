"use client";

import { memo } from "react";
import { useInViewport } from "@/hooks/useInViewport";
import { useRef } from "react";

const NODES = [
  { id: "lead", label: "Lead", x: 20 },
  { id: "bot", label: "Bot", x: 90 },
  { id: "crm", label: "CRM", x: 160 },
  { id: "reports", label: "Reports", x: 230 },
];

function AutomationFlowDemoInner({ enabled = true }: { enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref, { rootMargin: "120px", threshold: 0.1 });
  const active = enabled && inView;

  return (
    <div ref={ref} className="rounded-xl border border-white/[0.08] bg-[rgba(8,5,24,0.6)] p-4 md:p-5 overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <span className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" aria-hidden />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Lead → Bot → CRM → Reports
        </span>
      </div>
      <svg viewBox="0 0 280 60" className="w-full h-16 md:h-20" aria-hidden>
        <defs>
          <linearGradient id="flow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-pink)" />
          </linearGradient>
        </defs>
        {NODES.slice(0, -1).map((n, i) => (
          <line
            key={`line-${n.id}`}
            x1={n.x + 24}
            y1="30"
            x2={NODES[i + 1].x - 4}
            y2="30"
            stroke="url(#flow-grad)"
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
        ))}
        {active && (
          <circle r="4" fill="var(--accent)" opacity="0.9">
            <animateMotion dur="2.8s" repeatCount="indefinite" path="M 44 30 L 86 30 L 156 30 L 226 30" />
          </circle>
        )}
        {NODES.map((n) => (
          <g key={n.id}>
            <rect
              x={n.x}
              y="12"
              width="48"
              height="36"
              rx="6"
              fill="rgba(139,92,246,0.12)"
              stroke="rgba(139,92,246,0.4)"
              strokeWidth="1"
            />
            <text
              x={n.x + 24}
              y="32"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-[var(--text-secondary)]"
              style={{ fontSize: 10 }}
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
      <p className="mt-2 text-[10px] text-[var(--text-muted)]">
        Подсветка цепочки • данные идут автоматически
      </p>
    </div>
  );
}

export const AutomationFlowDemo = memo(AutomationFlowDemoInner);
