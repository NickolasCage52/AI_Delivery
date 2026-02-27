"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { useInViewport } from "@/hooks/useInViewport";
import { useRef } from "react";

function QualificationDemoInner({ enabled = true }: { enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref, { rootMargin: "120px", threshold: 0.1 });
  const active = enabled && inView;

  return (
    <div ref={ref} className="rounded-xl border border-white/[0.08] bg-[rgba(8,5,24,0.6)] p-4 md:p-5 max-w-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Квалификация
        </span>
      </div>
      <div className="space-y-2">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={active ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden />
          <span className="text-xs font-medium text-[var(--text-primary)]">Горячий → менеджер</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={active ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.35 }}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)]" aria-hidden />
          <span className="text-xs text-[var(--text-secondary)]">Обычный → сценарий</span>
        </motion.div>
      </div>
    </div>
  );
}

export const QualificationDemo = memo(QualificationDemoInner);
