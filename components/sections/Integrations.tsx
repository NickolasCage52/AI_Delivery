"use client";

import { memo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { IntegrationGraph } from "@/components/stack/IntegrationGraph";
import { TechStackBlock } from "@/components/stack/TechStackBlock";
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
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <IntegrationGraph />
          <motion.div
            className="rounded-2xl border border-white/[0.06] bg-[var(--bg-elevated)]/70 p-5 md:p-6"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-4">Pipeline</p>
            <dl className="space-y-4 text-sm">
              {STACK_BLOCKS.map((block) => (
                <div key={block.title}>
                  <dt className="font-medium text-[var(--text-muted)] mb-2">{block.title}</dt>
                  <dd className="flex flex-wrap gap-2">
                    {block.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-md border border-white/10 bg-black/20 px-2.5 py-1 text-[var(--text-secondary)]"
                      >
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)] mb-2">Что получаете</p>
              <ul className="space-y-1.5 text-sm text-[var(--text-secondary)]">
                {STACK_OUTCOMES.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 pt-16 border-t border-white/[0.06]">
          <TechStackBlock />
        </div>

        <div className="mt-12 flex flex-wrap gap-6">
          <Link href="/stack" className="link-trailing inline-flex text-sm text-[var(--accent)]">
            Смотреть стек и интеграции →
          </Link>
          <Link href="/cases" className="link-trailing inline-flex text-sm text-[var(--accent)]">
            {HOME_COPY.hero.ctaSecondary} →
          </Link>
          <Link href="/demo" className="link-trailing inline-flex text-sm text-[var(--accent)]">
            Получить бесплатное демо →
          </Link>
        </div>
      </Container>
    </section>
  );
}

export const Integrations = memo(IntegrationsInner);
