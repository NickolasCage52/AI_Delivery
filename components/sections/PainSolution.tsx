"use client";

import { memo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Typewriter } from "@/components/ui/Typewriter";
import { HOME_COPY } from "@/content/site-copy";

const RESULT_LINES = [
  "Заявки начинают приходить уже на MVP",
  "Рутина уходит в автоматизацию: лид → CRM → задачи → отчёты",
  "Гипотеза проверяется за 3–7 дней, а не за месяцы",
  "Команда фокусируется на решениях, а не на ручной работе",
];

const FLOW = [
  {
    title: "Типичная ситуация",
    text: "Сроки и бюджет непредсказуемы. Классическая разработка тянет месяцы, а гипотезу хочется проверить быстро.",
    icon: "—",
  },
  {
    title: "Мы делаем иначе",
    text: "MVP и автоматизации на ИИ за дни. Фиксируем задачу → внедряем → сдаём под ключ с инструкциями.",
    icon: "→",
  },
  {
    title: "В итоге",
    text: "Дешевле и быстрее тест гипотезы, лиды и экономия времени без найма разработчиков.",
    icon: "✓",
  },
];

function PainSolutionInner() {
  return (
    <section id="results" className="relative py-24 md:py-32 bg-[var(--bg-secondary)]/40">
      <Container>
        <motion.h2
          className="text-3xl font-semibold tracking-tight md:text-4xl text-[var(--text-primary)]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {HOME_COPY.valueArtifacts.title}
        </motion.h2>
        <motion.p
          className="mt-4 text-[var(--text-secondary)] max-w-2xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {HOME_COPY.valueArtifacts.subtitle}
        </motion.p>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {FLOW.map((item, i) => (
            <motion.div
              key={item.title}
              className="rounded-xl border border-white/10 bg-[var(--bg-elevated)]/60 p-6 md:p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <span className="text-3xl text-[var(--accent)]">{item.icon}</span>
              <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">{item.title}</h3>
              <p className="mt-2 text-[var(--text-secondary)]">{item.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 grid gap-4 md:grid-cols-2"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/60 p-6">
            <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">Без AI Delivery</p>
            <p className="mt-3 text-sm text-[var(--text-secondary)] blur-[1.5px]">
              Много ручной работы, задержки с ответом, гипотезы проверяются месяцами.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent)]/5 p-6">
            <p className="text-xs uppercase tracking-wider text-[var(--accent)]">С AI Delivery</p>
            <p className="mt-3 text-sm text-[var(--text-primary)]">
              Быстрый запуск, понятные метрики, автоматизация рутины и прогнозируемые сроки.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="mt-10 rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/60 p-6 md:p-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">Артефакты</p>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {HOME_COPY.valueArtifacts.artifacts.map((a) => (
              <li key={a} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="mt-16 rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent)]/5 p-6 md:p-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            aria-hidden
            style={{
              background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(139,92,246,0.12) 0%, transparent 70%)",
            }}
          />
          <p className="relative text-sm font-medium text-[var(--accent)] mb-2">Результат:</p>
          <div className="relative min-h-[2.5rem] flex items-center">
            <Typewriter
              lines={RESULT_LINES}
              typeSpeed={55}
              pauseAfter={2200}
              eraseSpeed={30}
              pauseBefore={500}
              className="text-lg md:text-xl font-medium text-[var(--text-primary)] leading-relaxed"
              caretClassName="bg-[var(--accent)] shadow-[0_0_8px_rgba(139,92,246,0.6)]"
            />
          </div>
        </motion.div>

        <motion.div
          className="mt-12 rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-6 md:p-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg text-[var(--text-primary)] md:text-xl leading-relaxed">
            Запустим ИИ‑решение, которое начнёт приносить заявки или экономить время за{" "}
            <strong className="text-[var(--accent)]">48 часов – 7 дней</strong> — без найма разработчиков и без лишних созвонов.
          </p>
        </motion.div>

        <div className="mt-12 flex flex-wrap gap-6">
          <Link href="/stack" className="inline-flex text-sm text-[var(--accent)] hover:underline">
            Показать примеры сценариев →
          </Link>
          <Link href="/cases" className="inline-flex text-sm text-[var(--accent)] hover:underline">
            {HOME_COPY.hero.ctaSecondary} →
          </Link>
        </div>
      </Container>
    </section>
  );
}

export const PainSolution = memo(PainSolutionInner);
