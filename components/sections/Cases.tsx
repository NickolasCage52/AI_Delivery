"use client";

import Link from "next/link";
import { memo } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SpecularCard } from "@/components/fx/SpecularCard";
import { SectionCTA } from "@/components/cta";
import type { CaseStudy } from "@/lib/content/cases";
import { CaseArtifactPreview } from "@/components/cases/CaseArtifact";

function CasesInner({ cases = [] }: { cases?: CaseStudy[] }) {
  return (
    <section id="cases" className="relative py-24 md:py-32 bg-[var(--bg-secondary)]/40">
      <Container>
        <motion.h2
          className="text-3xl font-semibold tracking-tight md:text-4xl text-[var(--text-primary)]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Кейсы
        </motion.h2>
        <motion.p
          className="mt-4 text-[var(--text-secondary)] max-w-2xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Формат: контекст → цель → решение → результат (цифры). Ниже — обезличенные кейсы.
        </motion.p>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {cases.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <SpecularCard accent="violet">
                <span className="text-xs font-medium uppercase tracking-wider text-[var(--accent-pink-strong)]">
                  Обезличенный кейс
                </span>
                <h3 className="mt-3 font-semibold text-[var(--text-primary)]">{c.title}</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{c.context}</p>
                <div className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
                  <div>
                    <span className="text-[var(--text-muted)]">Цель:</span> {c.goal}
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)]">Срок:</span> {c.timeline}
                  </div>
                </div>
                <div className="mt-4">
                  <CaseArtifactPreview artifact={c.artifact} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--text-secondary)]">
                  {c.stack.slice(0, 3).map((s) => (
                    <span key={s} className="rounded bg-white/10 px-2 py-1">
                      {s}
                    </span>
                  ))}
                </div>
                <Link href={`/cases/${c.slug}`} className="mt-4 inline-flex text-sm text-[var(--accent)] hover:underline">
                  Смотреть кейс →
                </Link>
              </SpecularCard>
            </motion.div>
          ))}
        </div>

        <SectionCTA />
      </Container>
    </section>
  );
}

export const Cases = memo(CasesInner);
