"use client";

import { memo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { IntegrationGraph } from "@/components/stack/IntegrationGraph";
import { HOME_COPY } from "@/content/site-copy";

const STACK_BLOCKS = [
  {
    title: "Что подключаем",
    items: ["Сайт и формы", "Telegram / WhatsApp", "Email и webhooks", "Маркетинговые источники"],
  },
  {
    title: "Куда отдаём данные",
    items: ["CRM (amoCRM, Bitrix24)", "Google Sheets / Notion", "Единый реестр лидов"],
  },
  {
    title: "Как автоматизируем",
    items: ["n8n-сценарии и цепочки", "Распределение задач", "Уведомления команде"],
  },
  {
    title: "Как контролируем",
    items: ["Дашборды и отчёты", "SLA и статусы", "Регулярные сводки в мессенджер"],
  },
];

const STACK_OUTCOMES = [
  "Единый pipeline: лид → CRM → задачи → отчёты",
  "Понятные статусы по каждому каналу",
  "Контроль качества и прозрачная аналитика",
];

function IntegrationsInner() {
  return (
    <section id="why" className="relative py-24 md:py-32 bg-[var(--bg-secondary)]/50 overflow-hidden">
      <Container>
        <motion.h2
          className="text-3xl font-semibold tracking-tight md:text-4xl text-[var(--text-primary)]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Интеграции и стек
        </motion.h2>
        <motion.p
          className="mt-4 text-[var(--text-secondary)] max-w-3xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Связываем каналы, данные и процессы в единый pipeline: лид → CRM → задачи → отчёты.
        </motion.p>
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <IntegrationGraph />
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {STACK_BLOCKS.map((block, i) => (
                <motion.div
                  key={block.title}
                  className="rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/80 p-4"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                    {block.title}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
                    {block.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
            <motion.div
              className="rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/80 p-5"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35 }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">Что получаете</p>
              <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
                {STACK_OUTCOMES.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-6">
          <Link href="/stack" className="link-trailing inline-flex text-sm text-[var(--accent)]">
            Смотреть стек и интеграции →
          </Link>
          <Link href="/cases" className="link-trailing inline-flex text-sm text-[var(--accent)]">
            {HOME_COPY.hero.ctaSecondary} →
          </Link>
          <Link href="/demo" className="link-trailing inline-flex text-sm text-[var(--accent)]">
            Запросить демо →
          </Link>
        </div>
      </Container>
    </section>
  );
}

export const Integrations = memo(IntegrationsInner);
