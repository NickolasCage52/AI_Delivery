"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { SectionShell } from "@/components/layout/SectionShell";
import { HOME_COPY } from "@/content/site-copy";

function WhyUsInner() {
  return (
    <SectionShell id="why-us" variant="panel" bg="secondary" seamless>
      <motion.h2
        className="text-3xl font-semibold tracking-tight md:text-4xl text-[var(--text-primary)]"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {HOME_COPY.whyUs.title}
      </motion.h2>
      <motion.p
        className="mt-4 text-[var(--text-secondary)] max-w-3xl"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {HOME_COPY.whyUs.subtitle}
      </motion.p>

      <motion.div
        className="mt-12 rounded-2xl border border-white/[0.06] bg-[var(--bg-elevated)]/50 p-6 md:p-8"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <ul className="space-y-5">
          {HOME_COPY.whyUs.facts.map((fact) => (
            <li key={fact} className="flex items-start gap-4 text-[var(--text-secondary)]">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15 text-[var(--accent)] text-sm font-semibold">
                ✓
              </span>
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </SectionShell>
  );
}

export const WhyUs = memo(WhyUsInner);

