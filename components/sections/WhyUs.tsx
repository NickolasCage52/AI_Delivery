"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { HOME_COPY } from "@/content/site-copy";

function WhyUsInner() {
  return (
    <section id="why-us" className="relative py-24 md:py-32 bg-[var(--bg-secondary)]/40">
      <Container>
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

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {HOME_COPY.whyUs.facts.map((fact, i) => (
            <motion.div
              key={fact}
              className="rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/70 p-6"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <p className="text-sm text-[var(--text-secondary)]">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)]/15 text-[var(--accent)] text-xs font-semibold">
                  ✓
                </span>
                {fact}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export const WhyUs = memo(WhyUsInner);

