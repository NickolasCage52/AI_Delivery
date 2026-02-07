"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Container } from "@/components/ui/Container";

const STEPS = [
  {
    range: "48–72 часа",
    label: "Быстрые запуски",
    desc: "Лендинг, базовый бот, простая автоматизация, прототип",
  },
  {
    range: "3–5 дней",
    label: "MiniApp MVP",
    desc: "Telegram MiniApp MVP или продвинутый прототип",
  },
  {
    range: "5–7 дней",
    label: "Бот + интеграции",
    desc: "Бот с CRM и автоматизация «под ключ»",
  },
  {
    range: "7–10 дней",
    label: "Комплексные решения",
    desc: "Несколько каналов и интеграций",
  },
];

export function Timeline() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="timeline" ref={ref} className="relative py-24 md:py-32">
      <Container>
        <motion.h2
          className="text-3xl font-semibold tracking-tight md:text-4xl text-white"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Сроки
        </motion.h2>
        <motion.p
          className="mt-4 text-[var(--text-secondary)] max-w-2xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          От быстрого старта за 48 часов до комплексного внедрения за 7–10 дней.
        </motion.p>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.range}
              className="relative rounded-xl border border-white/[0.08] bg-elevated/80 p-6 transition-colors hover:border-accent-cyan/30"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <span className="text-2xl font-bold text-accent-cyan">
                {step.range}
              </span>
              <h3 className="mt-2 font-semibold text-white">{step.label}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
