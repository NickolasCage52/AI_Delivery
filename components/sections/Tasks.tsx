"use client";

import { memo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { HOME_COPY } from "@/content/site-copy";

const TASKS = [
  {
    title: "Лиды и поддержка 24/7",
    timing: "5–7 дней",
    id: "bots",
    desc: "Квалификация, ответы, передача в CRM.",
    icon: "◎",
    accent: "violet",
  },
  {
    title: "Лендинг под трафик",
    timing: "48–72 часа",
    id: "sites",
    desc: "Быстрый запуск и аналитика.",
    icon: "↗",
    accent: "pink",
  },
  {
    title: "n8n‑автоматизации",
    timing: "5–7 дней",
    id: "n8n",
    desc: "Лид → CRM → отчёты без рутины.",
    icon: "▣",
    accent: "soft",
  },
  {
    title: "Telegram MiniApp MVP",
    timing: "3–5 дней",
    id: "miniapps",
    desc: "Каталог/анкета/форма в Telegram.",
    icon: "◈",
    accent: "pink",
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
          {HOME_COPY.services.title}
        </motion.h2>
        <motion.p
          className="mt-4 text-[var(--text-secondary)] max-w-2xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {HOME_COPY.services.subtitle}
        </motion.p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TASKS.map((task, i) => (
            <motion.div
              key={task.id}
              className="scroll-mt-24"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link
                href={`/directions/${task.id}`}
                id={task.id}
                className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/55 p-5 transition-all hover:border-white/15 hover:bg-[var(--bg-elevated)]/70"
                aria-label={`${task.title}. Подробнее о направлении`}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden
                  style={{
                    background:
                      task.accent === "pink"
                        ? "radial-gradient(320px 200px at 20% 0%, rgba(236,72,153,0.18) 0%, transparent 70%)"
                        : task.accent === "soft"
                          ? "radial-gradient(320px 200px at 20% 0%, rgba(167,139,250,0.14) 0%, transparent 70%)"
                          : "radial-gradient(320px 200px at 20% 0%, rgba(139,92,246,0.18) 0%, transparent 70%)",
                  }}
                />

                <div className="relative flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-[var(--text-secondary)]">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Срок</span>
                      <span className="font-semibold text-[var(--accent)]">{task.timing}</span>
                    </div>
                    <h3 className="mt-3 font-semibold text-[var(--text-primary)] leading-snug">{task.title}</h3>
                    <p className="mt-2 text-sm text-[var(--text-secondary)] line-clamp-2">{task.desc}</p>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-[var(--accent)]">
                    <span className="text-base font-semibold" aria-hidden>
                      {task.icon}
                    </span>
                  </div>
                </div>

                <span className="relative mt-4 inline-flex text-xs text-[var(--accent)]/80 transition-colors group-hover:text-[var(--accent)]">
                  Подробнее →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/services"
            className="inline-flex rounded-lg border border-[var(--accent)]/40 px-5 py-2.5 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/10"
          >
            Все услуги и пакеты
          </Link>
        </div>
      </Container>
    </section>
  );
}

export const Tasks = memo(TasksInner);
