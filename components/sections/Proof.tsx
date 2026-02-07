"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionCTA } from "@/components/cta";

const METRICS = [
  { label: "Заявки за 10 дней", value: "212" },
  { label: "Квалификация лидов", value: "+38%" },
  { label: "Экономия рутины", value: "18 ч/нед" },
  { label: "SLA ответа", value: "≤ 3 мин" },
];

function ProofInner() {
  return (
    <section id="proof" className="relative py-20 md:py-24 bg-[var(--bg-primary)]">
      <Container>
        <motion.h2
          className="text-3xl font-semibold tracking-tight md:text-4xl text-[var(--text-primary)]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Цифры, которые дают уверенность
        </motion.h2>
        <motion.p
          className="mt-4 text-[var(--text-secondary)] max-w-2xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Показываем измеримый эффект на пилотах и MVP — без «долгой классической разработки».
        </motion.p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              className="rounded-xl border border-white/10 bg-[var(--bg-elevated)]/70 p-5"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">{m.label}</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--accent)]">{m.value}</p>
            </motion.div>
          ))}
        </div>

        <p className="mt-6 text-xs text-[var(--text-muted)]">
          Данные на основе кейсов AI Delivery.
        </p>

        <SectionCTA primary="Запросить демо и план" />
      </Container>
    </section>
  );
}

export const Proof = memo(ProofInner);
