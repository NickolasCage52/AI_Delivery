"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { HOME_COPY } from "@/content/site-copy";

function LeverageInner() {
  return (
    <section id="leverage" className="relative py-24 md:py-32 bg-[var(--bg-primary)]">
      <Container>
        <motion.h2
          className="text-3xl font-semibold tracking-tight md:text-4xl text-[var(--text-primary)]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {HOME_COPY.leverage.title}
        </motion.h2>
        <motion.p
          className="mt-4 text-[var(--text-secondary)] max-w-3xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {HOME_COPY.leverage.subtitle}
        </motion.p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {HOME_COPY.leverage.cards.map((card, i) => (
            <motion.div
              key={card.title}
              className="rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/70 p-6"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            >
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">AI leverage</p>
              <h3 className="mt-3 text-lg font-semibold text-[var(--text-primary)]">{card.title}</h3>
              <ul className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
                {card.points.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export const Leverage = memo(LeverageInner);

