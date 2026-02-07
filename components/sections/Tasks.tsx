"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionCTA } from "@/components/cta";

const TASKS = [
  {
    title: "Лиды и поддержка 24/7",
    timing: "5–7 дней",
    href: "#bots",
    id: "bots",
    desc: "Квалификация, ответы, передача в CRM.",
  },
  {
    title: "Лендинг под трафик",
    timing: "48–72 часа",
    href: "#sites",
    id: "sites",
    desc: "Быстрый запуск и аналитика.",
  },
  {
    title: "n8n‑автоматизации",
    timing: "5–7 дней",
    href: "#n8n",
    id: "n8n",
    desc: "Лид → CRM → отчёты без рутины.",
  },
  {
    title: "Telegram MiniApp MVP",
    timing: "3–5 дней",
    href: "#miniapps",
    id: "miniapps",
    desc: "Каталог/анкета/форма в Telegram.",
  },
];

function TasksInner() {
  return (
    <section id="services" className="relative py-20 md:py-24 bg-[var(--bg-secondary)]/50">
      <Container>
        <motion.h2
          className="text-3xl font-semibold tracking-tight md:text-4xl text-[var(--text-primary)]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Сервисы и направления
        </motion.h2>
        <motion.p
          className="mt-4 text-[var(--text-secondary)] max-w-2xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Четыре направления — от быстрого лендинга до комплексной автоматизации.
        </motion.p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TASKS.map((task, i) => (
            <motion.a
              key={task.id}
              href={task.href}
              id={task.id}
              className="scroll-mt-24 rounded-xl border border-white/10 bg-[var(--bg-elevated)]/80 p-5 transition-colors hover:border-[var(--accent)]/25 hover:bg-[var(--bg-elevated)]"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <span className="text-sm font-medium text-[var(--accent)]">{task.timing}</span>
              <h3 className="mt-2 font-semibold text-[var(--text-primary)]">{task.title}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{task.desc}</p>
            </motion.a>
          ))}
        </div>

        <SectionCTA primary="Запросить демо и план" />
      </Container>
    </section>
  );
}

export const Tasks = memo(TasksInner);
