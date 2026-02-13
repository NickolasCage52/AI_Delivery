"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { FAQ_ITEMS } from "@/lib/content/faq";

export function FAQ() {
  return (
    <section id="faq" className="relative py-24 md:py-32 bg-[var(--bg-secondary)]/40">
      <Container>
        <motion.h2
          className="text-3xl font-semibold tracking-tight md:text-4xl text-[var(--text-primary)]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          FAQ
        </motion.h2>

        <div className="mt-12 space-y-4">
          {FAQ_ITEMS.map((item, i) => (
            <motion.dl
              key={item.question}
              className="rounded-xl border border-white/10 bg-[var(--bg-elevated)]/60 p-6"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <dt className="font-semibold text-[var(--text-primary)]">{item.question}</dt>
              <dd className="mt-2 text-[var(--text-secondary)]">{item.answer}</dd>
            </motion.dl>
          ))}
        </div>

      </Container>
    </section>
  );
}
