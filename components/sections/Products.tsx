"use client";

import { memo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SpecularCard } from "@/components/fx/SpecularCard";
import { SectionCTA } from "@/components/cta";
import { useLeadModal } from "@/components/cta/LeadModal";
import { trackCtaEvent } from "@/lib/analytics/cta";

const PRODUCTS = [
  {
    title: "ИИ-бот «Лиды и поддержка»",
    duration: "5–7 дней",
    result: "Лиды в CRM, ответы 24/7, квалификация без вашего участия",
    accent: "violet" as const,
    cta: "Запросить демо",
    anchorId: "bots",
  },
  {
    title: "Лендинг / сайт под трафик",
    duration: "48–72 часа",
    result: "Готовый лендинг под рекламу и заявки",
    accent: "pink" as const,
    cta: "Запустить за 72 часа",
    anchorId: "sites",
  },
  {
    title: "n8n «Автоматизация процессов»",
    duration: "5–7 дней",
    result: "Лиды → CRM → уведомления → задачи → отчёты без рутины",
    accent: "soft" as const,
    cta: "Узнать цену",
    anchorId: "n8n",
  },
  {
    title: "Telegram MiniApp MVP",
    duration: "3–5 дней",
    result: "Рабочий MVP в Telegram для быстрой проверки гипотезы",
    accent: "pink" as const,
    cta: "Хочу MVP",
    anchorId: "miniapps",
  },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function ProductsInner() {
  const openModal = useLeadModal();

  return (
    <section id="products" className="relative py-24 md:py-32 bg-[var(--bg-secondary)]/50">
      <Container>
        <motion.h2
          className="text-3xl font-semibold tracking-tight md:text-4xl text-[var(--text-primary)]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          Услуги и пакеты
        </motion.h2>
        <motion.p
          className="mt-4 text-[var(--text-secondary)] max-w-2xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          4 продукта под ключ — сроки, результат и прозрачный состав работ.
        </motion.p>

        <motion.div
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {PRODUCTS.map((p) => (
            <motion.div key={p.title} variants={item} className="scroll-mt-24">
              <SpecularCard
                accent={p.accent}
                className="min-h-[260px]"
                revealContent={
                  <div className="space-y-3">
                    <p>{p.result}</p>
                    <Link href={`/directions/${p.anchorId}`} className="inline-flex text-xs text-[var(--accent)]">
                      Подробнее →
                    </Link>
                  </div>
                }
              >
                <span className="text-xs font-medium uppercase tracking-wider text-[var(--accent)]">
                  {p.duration}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-[var(--text-primary)]">{p.title}</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)] line-clamp-2">{p.result}</p>
                <Link href={`/directions/${p.anchorId}`} className="mt-3 inline-flex text-xs text-[var(--accent)]/80 hover:text-[var(--accent)]">
                  Подробнее →
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    trackCtaEvent({ action: "open-modal", label: p.title, location: "products" });
                    openModal?.();
                  }}
                  className="mt-4 w-full rounded-lg border border-[var(--accent)]/40 py-2.5 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/10"
                >
                  {p.cta}
                </button>
              </SpecularCard>
            </motion.div>
          ))}
        </motion.div>
        <div className="mt-10">
          <Link
            href="/services"
            className="inline-flex rounded-lg border border-[var(--accent)]/40 px-5 py-2.5 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/10"
          >
            Все услуги и пакеты
          </Link>
        </div>

        <SectionCTA />
      </Container>
    </section>
  );
}

export const Products = memo(ProductsInner);
