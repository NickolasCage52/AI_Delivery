"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { useInViewport } from "@/hooks/useInViewport";
import { useRef } from "react";

function IncomingRequestDemoInner({ enabled = true }: { enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref, { rootMargin: "120px", threshold: 0.1 });
  const active = enabled && inView;

  return (
    <div ref={ref} className="flex items-center gap-4 md:gap-6 max-w-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={active ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.35 }}
        className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl border-2 border-[var(--accent)]/50 bg-[rgba(139,92,246,0.15)] flex items-center justify-center"
      >
        <span className="text-[10px] font-semibold uppercase text-[var(--accent)]">Вход</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={active ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 max-w-[220px]"
      >
        <span className="text-xs text-[var(--text-secondary)]">
          «Интересует продукт для опта»
        </span>
      </motion.div>
    </div>
  );
}

export const IncomingRequestDemo = memo(IncomingRequestDemoInner);
