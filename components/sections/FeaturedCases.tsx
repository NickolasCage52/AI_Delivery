"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { SectionShell } from "@/components/layout/SectionShell";
import { SpecularCard } from "@/components/fx/SpecularCard";
import type { Case } from "@/lib/cases/getCases";

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max).trimEnd() + "…";
}

function FeaturedCaseCard({ caseItem, index }: { caseItem: Case; index: number }) {
  const cover = caseItem.images?.[0] ?? "";
  const metrics = (caseItem.kpis ?? []).slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="h-full"
    >
      <Link href={`/cases/${caseItem.slug}`} className="block h-full group">
        <SpecularCard accent="violet" className="h-full flex flex-col overflow-hidden">
          {cover ? (
            <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-xl -mt-px -mx-px">
              <Image
                src={cover}
                alt=""
                width={640}
                height={400}
                className="object-cover w-full h-full transition duration-300 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 33vw"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="w-full aspect-[16/10] rounded-t-xl border border-white/10 bg-[var(--bg-elevated)]/50 -mt-px -mx-px" aria-hidden />
          )}
          <div className="p-5 md:p-6 flex flex-col flex-1">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--accent)]">
              {caseItem.category}
            </span>
            <h3 className="mt-2 text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
              {caseItem.title}
            </h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)] line-clamp-2">
              {truncate(caseItem.summary, 120)}
            </p>
            <div className="mt-4 space-y-1.5 text-xs text-[var(--text-secondary)]">
              <div><span className="text-[var(--text-muted)]">Было:</span> {truncate(caseItem.problem, 80)}</div>
              <div><span className="text-[var(--text-muted)]">Сделали:</span> {truncate(caseItem.solution, 80)}</div>
              <div><span className="text-[var(--text-muted)]">Стало:</span> {truncate(caseItem.result, 80)}</div>
            </div>
            {metrics.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {metrics.map((kpi) => (
                  <span
                    key={kpi.label}
                    className="rounded-md bg-white/10 px-2.5 py-1 text-xs text-[var(--text-secondary)]"
                  >
                    {kpi.label} {kpi.value}
                  </span>
                ))}
              </div>
            ) : null}
            <span className="link-trailing mt-4 inline-flex text-sm text-[var(--accent)] group-hover:underline">
              Открыть кейс →
            </span>
          </div>
        </SpecularCard>
      </Link>
    </motion.div>
  );
}

export function FeaturedCases({ cases }: { cases: Case[] }) {
  if (!cases.length) return null;

  return (
    <SectionShell id="cases" variant="panel" bg="secondary" seamless className="overflow-x-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-70"
        aria-hidden
        style={{
          background:
            "radial-gradient(900px 400px at 10% 50%, rgba(139,92,246,0.06) 0%, transparent 50%), radial-gradient(700px 350px at 90% 50%, rgba(236,72,153,0.04) 0%, transparent 50%)",
        }}
      />
      <div className="relative">
        <motion.h2
          className="text-3xl font-semibold tracking-tight md:text-4xl text-[var(--text-primary)]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Кейсы: было → сделали → стало
        </motion.h2>
        <motion.p
          className="mt-4 text-[var(--text-secondary)] max-w-2xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Оцифрованный эффект за 4–7 дней
        </motion.p>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((c, i) => (
            <FeaturedCaseCard key={c.slug} caseItem={c} index={i} />
          ))}
        </div>

        <motion.div
          className="mt-14 flex justify-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Link
            href="/cases"
            className="btn-glow inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-6 py-3 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent)]/20 transition-colors"
          >
            Смотреть все кейсы →
          </Link>
        </motion.div>
      </div>
    </SectionShell>
  );
}
