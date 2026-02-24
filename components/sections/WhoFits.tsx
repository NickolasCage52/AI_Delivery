"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";

const SEGMENTS = [
  {
    label: "A",
    title: "B2B услуги с заявками и ручной обработкой",
    desc: "Если у вас клининг, монтаж, сервисный аутсорсинг и менеджеры тонут в заявках — мы выстраиваем пайплайн «лид → CRM → задача → уведомление» без ручных действий.",
  },
  {
    label: "B",
    title: "Локальный бизнес с высокой конкуренцией",
    desc: "СТО, клиники, косметология, школы/секции — там, где важна скорость ответа: MVP за 24 часа покажет, как бот закрывает запись и первичный вопрос до звонка менеджера.",
  },
  {
    label: "D",
    title: "Опт и дистрибуция (B2B продажи)",
    desc: "Прайсы, повторные заявки, напоминания — автоматизируем без изменения вашей CRM.",
  },
  {
    label: "E",
    title: "Инфобизнес, эксперты, онлайн-школы",
    desc: "Тестируете офферы и воронки постоянно? MVP за 24 часа — один сценарий, реальные данные, никакой инфоцыганщины.",
  },
];

const NOT_FOR = `Если вы ищете «просто автоматизацию ради автоматизации» без конкретной задачи — мы не подойдём. Мы внедряем под измеримый результат, и для старта нужен хотя бы один понятный процесс или боль.`;

function WhoFitsInner() {
  return (
    <section id="who-fits" className="relative py-24 md:py-32 bg-[var(--bg-secondary)]/40">
      <Container>
        <motion.h2
          className="text-3xl font-semibold tracking-tight md:text-4xl text-[var(--text-primary)]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Кому подходит
        </motion.h2>

        <div className="mt-12 space-y-6">
          {SEGMENTS.map((seg, i) => (
            <motion.div
              key={seg.label}
              className="rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/60 p-6 md:p-8"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)]/20 text-sm font-bold text-[var(--accent)]">
                {seg.label}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">{seg.title}</h3>
              <p className="mt-2 text-[var(--text-secondary)]">{seg.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 rounded-2xl border border-white/15 bg-[var(--bg-elevated)]/80 p-6 md:p-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-sm font-semibold text-[var(--text-muted)]">Кому НЕ подходит</p>
          <p className="mt-3 text-[var(--text-secondary)]">{NOT_FOR}</p>
        </motion.div>
      </Container>
    </section>
  );
}

export const WhoFits = memo(WhoFitsInner);
