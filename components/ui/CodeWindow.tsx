"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import type { Phase } from "@/hooks/useTypewriterSequence";
import { useReducedMotion } from "@/lib/motion";

type CodeWindowProps = {
  phase: Phase;
  display: string;
  statusLine: string | null;
  hasCursor: boolean;
  tabLabel: string;
  statusDeploy: string;
  statusLive: string;
  previewLabel: string;
  staticCode?: string;
};

function MiniFlowPreview() {
  return (
    <div className="flex items-center justify-center gap-3 py-6 px-4">
      <svg
        width={240}
        height={80}
        viewBox="0 0 240 80"
        aria-hidden
        className="opacity-90"
      >
        <defs>
          <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(139,92,246,0.8)" />
            <stop offset="100%" stopColor="rgba(244,114,182,0.8)" />
          </linearGradient>
        </defs>
        <rect x="20" y="20" width="50" height="36" rx="6" fill="rgba(139,92,246,0.15)" stroke="rgba(139,92,246,0.5)" strokeWidth="1" />
        <text x="45" y="42" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">Lead</text>
        <path d="M 70 38 L 95 38" stroke="url(#flowGrad)" strokeWidth="1.5" strokeDasharray="4 2" fill="none" strokeDashoffset="0" />
        <rect x="95" y="20" width="50" height="36" rx="6" fill="rgba(167,139,250,0.12)" stroke="rgba(167,139,250,0.5)" strokeWidth="1" />
        <text x="120" y="42" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">Bot</text>
        <path d="M 145 38 L 170 38" stroke="url(#flowGrad)" strokeWidth="1.5" strokeDasharray="4 2" fill="none" strokeDashoffset="0" />
        <rect x="170" y="20" width="50" height="36" rx="6" fill="rgba(244,114,182,0.12)" stroke="rgba(244,114,182,0.5)" strokeWidth="1" />
        <text x="195" y="42" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">CRM</text>
      </svg>
    </div>
  );
}

function CodeWindowInner({
  phase,
  display,
  statusLine,
  hasCursor,
  tabLabel,
  statusDeploy,
  statusLive,
  previewLabel,
  staticCode,
}: CodeWindowProps) {
  const reduced = useReducedMotion();
  const isLive = phase === "live";

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[rgba(8,5,24,0.85)] shadow-xl">
      {/* Mac-style title bar */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden />
        </div>
        <span className="ml-2 text-[11px] font-medium text-[var(--text-muted)]">
          {isLive ? previewLabel : tabLabel}
        </span>
      </div>

      {/* Content */}
      <div className="min-h-[140px] md:min-h-[180px] p-4 font-mono text-xs md:text-[13px] leading-relaxed">
        {isLive ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <MiniFlowPreview />
            <div className="flex items-center justify-center gap-2 py-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-violet-500/40 bg-violet-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
                {statusLive}
              </span>
            </div>
          </motion.div>
        ) : reduced ? (
          <pre className="overflow-x-auto text-[var(--text-secondary)]">
            <code>{(staticCode ?? display) || "// workflow logic"}</code>
          </pre>
        ) : (
          <pre className="overflow-x-auto text-[var(--text-secondary)]">
            <code>
              {display}
              {hasCursor && (
                <span
                  className="ml-0.5 inline-block w-0.5 bg-[var(--accent)] animate-[caret-blink_1s_step-end_infinite] align-middle"
                  aria-hidden
                />
              )}
            </code>
          </pre>
        )}

        {statusLine && !isLive && (
          <div className="mt-3 flex items-center gap-2 border-t border-white/[0.06] pt-3 text-[11px] text-[var(--text-muted)]">
            <span
              className={
                statusLine === statusLive
                  ? "text-emerald-400"
                  : statusLine === statusDeploy
                    ? "text-violet-400"
                    : "text-[var(--accent)]"
              }
            >
              {statusLine}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export const CodeWindow = memo(CodeWindowInner);
