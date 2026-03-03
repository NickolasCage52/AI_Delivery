"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import Link from "next/link";

export function LocalSEO() {
  return (
    <section id="geo" className="relative py-24 md:py-32 bg-[var(--bg-secondary)]/40">
      <Container>
        <motion.h2
          className="text-3xl font-semibold tracking-tight md:text-4xl text-[var(--text-primary)]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Автоматизация бизнеса в Москве и Санкт-Петербурге
        </motion.h2>
        <motion.p
          className="mt-4 max-w-2xl text-[var(--text-secondary)]"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Работаем с компаниями в Москве, Санкт-Петербурге и по всей России. Внедряем автоматизацию удалённо — онбординг, настройка и запуск без необходимости личных встреч. Первый результат — бесплатный MVP за 24 часа после заявки.
        </motion.p>
        <ul className="mt-6 space-y-2 text-[var(--text-secondary)]">
          <li>✓ Автоматизация бизнеса Москва</li>
          <li>✓ Автоматизация бизнеса Санкт-Петербург</li>
          <li>✓ Работаем с бизнесом по всей России удалённо</li>
        </ul>
        <div className="mt-8">
          <Link
            href="/demo"
            className="inline-flex rounded-lg border border-[var(--accent)]/40 px-5 py-2.5 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/10"
          >
            Получить бесплатный MVP
          </Link>
        </div>
      </Container>
    </section>
  );
}
