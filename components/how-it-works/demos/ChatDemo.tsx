"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { useInViewport } from "@/hooks/useInViewport";
import { useRef } from "react";

const BUBBLES = [
  { text: "Здравствуйте! Интересует ваш продукт", side: "user", delay: 0 },
  { text: "Уточните, какой объём и сроки?", side: "ai", delay: 0.4 },
  { text: "Нужно 50 штук к пятнице", side: "user", delay: 0.9 },
  { text: "Фиксирую: 50 ед., срок — пятница ✓", side: "ai", delay: 1.4 },
];

function ChatDemoInner({ enabled = true }: { enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref, { rootMargin: "120px", threshold: 0.1 });
  const active = enabled && inView;

  return (
    <div ref={ref} className="rounded-xl border border-white/[0.08] bg-[rgba(8,5,24,0.6)] p-4 md:p-5 max-w-md">
      <div className="flex items-center gap-2 mb-4">
        <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Мини-чат
        </span>
      </div>
      <div className="space-y-3">
        {BUBBLES.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: b.side === "user" ? 8 : -8 }}
            animate={active ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.3, delay: b.delay }}
            className={`flex ${b.side === "user" ? "justify-end" : "justify-start"}`}
          >
            <span
              className={`rounded-lg px-3 py-2 text-xs max-w-[85%] ${
                b.side === "user"
                  ? "bg-[var(--accent)]/20 text-[var(--text-primary)] border border-[var(--accent)]/30"
                  : "bg-white/5 text-[var(--text-secondary)] border border-white/5"
              }`}
            >
              {b.text}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export const ChatDemo = memo(ChatDemoInner);
