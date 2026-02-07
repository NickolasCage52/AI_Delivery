"use client";

import { useRef, ReactNode } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/motion";
import { rafThrottle } from "@/lib/motion/utils";

type Accent = "violet" | "pink" | "soft";

const ACCENT_MAP: Record<Accent, string> = {
  violet: "rgba(139,92,246,0.18)",
  pink: "rgba(236,72,153,0.18)",
  soft: "rgba(167,139,250,0.12)",
};

export function SpecularCard({
  children,
  accent = "violet",
  className = "",
  revealContent,
}: {
  children: ReactNode;
  accent?: Accent;
  className?: string;
  /** Optional second layer that reveals on hover (mask/clip) */
  revealContent?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(50);
  const y = useMotionValue(50);
  const reduced = useReducedMotion();

  const handleMove = useRef(
    rafThrottle((e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      x.set(((e.clientX - rect.left) / rect.width) * 100);
      y.set(((e.clientY - rect.top) / rect.height) * 100);
    })
  ).current;

  const handleLeave = () => {
    x.set(50);
    y.set(50);
  };

  const background = useTransform([x, y], ([xVal, yVal]) =>
    `radial-gradient(circle 120px at ${xVal}% ${yVal}%, ${ACCENT_MAP[accent]}, transparent 60%)`
  );

  return (
    <motion.div
      ref={ref}
      className={`group relative overflow-hidden rounded-xl border border-white/10 bg-[var(--bg-elevated)]/90 transition-colors hover:border-[var(--accent)]/30 ${className}`}
      onMouseMove={reduced ? undefined : handleMove}
      onMouseLeave={handleLeave}
      whileHover={reduced ? undefined : { y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Specular highlight - follows cursor (MotionValue, no re-render) */}
      {!reduced && (
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background }}
        />
      )}
      <div className="relative z-10 p-6 md:p-8">
        {children}
      </div>
      {revealContent && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--bg-secondary)]/95 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="px-6 text-center text-sm text-[var(--text-secondary)]">
            {revealContent}
          </div>
        </div>
      )}
    </motion.div>
  );
}
