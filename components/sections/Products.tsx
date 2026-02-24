"use client";

import { memo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionShell } from "@/components/layout/SectionShell";
import { CTA_PRIMARY } from "@/lib/constants/messaging";

const SERVICES = [
  {
    title: "ИИ-бот «Лиды и поддержка»",
    id: "bots",
    result: "Квалификация + ответы 24/7 + передача лида в CRM без участия менеджера.",
    icon: "◎",
    accent: "violet" as const,
  },
  {
    title: "Лендинг / сайт под трафик",
    id: "sites",
    result: "Лендинг под тест гипотезы с аналитикой и заявками в CRM.",
    icon: "↗",
    accent: "pink" as const,
  },
  {
    title: "n8n «Автоматизация процессов»",
    id: "n8n",
    result: "Лид → CRM → уведомления → задачи → отчёты без ручных действий.",
    icon: "▣",
    accent: "soft" as const,
  },
  {
    title: "Telegram MiniApp MVP",
    id: "miniapps",
    result: "MVP в Telegram для проверки спроса (каталог / анкета / заказ).",
    icon: "◈",
    accent: "pink" as const,
  },
];

const ACCENT_GRADIENTS: Record<string, string> = {
  violet: "radial-gradient(320px 200px at 20% 0%, rgba(139,92,246,0.18) 0%, transparent 70%)",
  pink: "radial-gradient(320px 200px at 20% 0%, rgba(236,72,153,0.18) 0%, transparent 70%)",
  soft: "radial-gradient(320px 200px at 20% 0%, rgba(167,139,250,0.14) 0%, transparent 70%)",
};

function ProductsInner() {
  return (
    <SectionShell id="services" variant="panel" bg="secondary" seamless>
      <motion.h2
        className="text-3xl font-semibold tracking-tight md:text-4xl text-[var(--text-primary)]"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Услуги и пакеты
      </motion.h2>
      <motion.p
        className="mt-4 text-[var(--text-secondary)] max-w-2xl"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        4 направления под ключ — прозрачные сроки и состав работ.
      </motion.p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.id}
            className="scroll-mt-24 flex"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <div
              id={s.id}
              className="group relative flex flex-col w-full h-full min-h-[220px] overflow-hidden rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/60 p-6 transition-all hover:border-[var(--accent)]/25 hover:bg-[var(--bg-elevated)]/75"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
                style={{ background: ACCENT_GRADIENTS[s.accent] }}
              />
              <div className="relative flex flex-col flex-1 min-h-0">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-[var(--text-primary)] leading-snug">{s.title}</h3>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-lg text-[var(--accent)]">
                    {s.icon}
                  </span>
                </div>
                <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
                  {s.result}
                </p>
                <div className="mt-5 pt-4 border-t border-white/5">
                  <Link
                    href={`/directions/${s.id}`}
                    className="text-sm font-medium text-[var(--accent)] hover:underline inline-flex items-center gap-1"
                  >
                    Подробнее о направлении →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Link
          href="/services"
          className="btn-glow inline-flex rounded-lg border border-[var(--accent)]/40 px-5 py-2.5 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/10"
        >
          Все услуги и пакеты
        </Link>
        <Link
          href="/demo"
          className="btn-glow inline-flex rounded-lg border border-[var(--accent)]/40 px-5 py-2.5 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/10"
        >
          {CTA_PRIMARY}
        </Link>
      </div>
    </SectionShell>
  );
}

export const Products = memo(ProductsInner);
