"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Sparkline } from "@/components/ui/Sparkline";

export type MetricCardProps = {
  label: string;
  value: string;
  /** Sparkline points in [0, 1] (up-only series) */
  sparklinePoints: number[];
  accent?: "violet" | "pink" | "soft";
  compact?: boolean;
  showLive?: boolean;
  /** e.g. "Стабильно" for SLA / non-growing metrics */
  stabilityBadge?: string;
  className?: string;
};

const ACCENT_STROKE: Record<string, string> = {
  violet: "rgba(167,139,250,0.9)",
  pink: "rgba(244,114,182,0.85)",
  soft: "rgba(167,139,250,0.8)",
};

function MetricCardInner({
  label,
  value,
  sparklinePoints,
  accent = "violet",
  compact = false,
  showLive = false,
  stabilityBadge,
  className = "",
}: MetricCardProps) {
  const stroke = ACCENT_STROKE[accent] ?? ACCENT_STROKE.violet;

  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg border border-white/[0.06] bg-[rgba(11,6,32,0.4)] p-4 sm:p-5 ${className}`}
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
      {(showLive || stabilityBadge) && (
        <div className="relative mb-2">
          {showLive && (
            <span className="inline-flex items-center gap-1 rounded border border-violet-500/30 bg-violet-500/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-violet-300">
              <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
              Live
            </span>
          )}
          {stabilityBadge && !showLive && (
            <span className="inline-flex items-center gap-1 rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-medium text-emerald-300">
              {stabilityBadge}
            </span>
          )}
        </div>
      )}
      <p className="relative text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
        {label}
      </p>
      <div
        className="relative mt-1 min-w-[6ch] text-3xl font-bold tabular-nums text-[var(--text-primary)] sm:text-4xl md:text-5xl lg:text-6xl"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </div>
      {sparklinePoints.length > 0 && (
        <div className={compact ? "mt-1" : "mt-2"}>
          <Sparkline
            points={sparklinePoints}
            width={compact ? 80 : 100}
            height={compact ? 14 : 18}
            stroke={stroke}
            animate={true}
          />
        </div>
      )}
    </motion.div>
  );
}

export const MetricCard = memo(MetricCardInner);
