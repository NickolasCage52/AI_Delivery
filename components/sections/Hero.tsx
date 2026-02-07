"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DataStreamsBg } from "@/components/ui/DataStreamsBg";

const HERO_VARIANTS = [
  {
    id: "a",
    title: "AI Delivery — быстрые ИИ‑решения под ключ",
    subtitle:
      "Боты • сайты • Telegram MiniApps • n8n-автоматизации. Запустим MVP быстрее и дешевле разработки — чтобы вы сразу тестировали гипотезу и получали результат.",
    cta1: "Запросить демо и план",
    cta2: "Смотреть кейсы",
  },
  {
    id: "b",
    title: "Запустим ИИ-решение за 5–7 дней",
    subtitle:
      "Которое начнёт приносить заявки или экономить время. Без найма разработчиков. Без лишних созвонов. Под ключ.",
    cta1: "Запросить демо и план",
    cta2: "Показать примеры",
  },
  {
    id: "c",
    title: "Проверим вашу гипотезу в рынке за 3–7 дней",
    subtitle:
      "Соберём MVP на ИИ дешевле классической разработки — чтобы не платить за «идеальный продукт», пока спрос не подтверждён.",
    cta1: "Запросить демо и план",
    cta2: "Какие решения делаете?",
  },
];

export function Hero() {
  const hero = HERO_VARIANTS[0];

  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden">
      {/* Background: grid + gradient */}
      <div className="absolute inset-0 bg-primary">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 211, 238, 0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 211, 238, 0.06) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary to-accent-cyan/5" />
        <div
          className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-cyan/10 blur-[120px]"
          aria-hidden
        />
        <DataStreamsBg />
      </div>

      <Container className="relative z-10 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <motion.h1
            className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl leading-[1.1]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            {hero.title}
          </motion.h1>
          <motion.p
            className="mt-6 text-lg text-[var(--text-secondary)] md:text-xl max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {hero.subtitle}
          </motion.p>
          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            <Button href="#cta" variant="primary" size="large">
              {hero.cta1}
            </Button>
            <Button href="#timeline" variant="secondary" size="large">
              {hero.cta2}
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--text-muted)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <span className="text-xs uppercase tracking-widest">Листайте</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="h-8 w-5 rounded-full border-2 border-current flex justify-center pt-1"
          >
            <motion.span className="h-1.5 w-1 rounded-full bg-current" />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
