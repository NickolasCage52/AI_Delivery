"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { useInViewport } from "@/hooks/useInViewport";
import { useRef } from "react";

function Handoff24DemoInner({ enabled = true }: { enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref, { rootMargin: "120px", threshold: 0.1 });
  const active = enabled && inView;

  return (
    <div ref={ref} className="flex flex-wrap items-center gap-4 md:gap-6 max-w-md">
      <motion.div
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ duration: 0.3 }}
        className="inline-flex items-center gap-1.5 rounded-full border-2 border-[var(--accent)]/60 bg-[rgba(139,92,246,0.15)] px-4 py-2"
      >
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
          24/7
        </span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
      >
        <span className="text-xs text-[var(--text-secondary)]">Handoff + инструкции</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.25 }}
        className="text-[10px] text-[var(--text-muted)]"
      >
        Команда фокусируется на решениях
      </motion.div>
    </div>
  );
}

export const Handoff24Demo = memo(Handoff24DemoInner);
