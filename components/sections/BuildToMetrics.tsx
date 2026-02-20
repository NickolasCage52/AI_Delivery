"use client";

import { memo, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HOME_COPY } from "@/content/site-copy";
import { SectionShell } from "@/components/layout/SectionShell";
import { useInViewport } from "@/hooks/useInViewport";
import { useTypewriterSequence } from "@/hooks/useTypewriterSequence";
import { CodeWindow } from "@/components/ui/CodeWindow";
import { NumbersProofLive } from "@/components/sections/NumbersProofLive";

const CODE_SNIPPETS: string[][] = [
  [
    "const score = await ai.classify(lead);",
    "if (score > 0.8) crm.create(lead);",
    "return score;",
  ],
  [
    "trigger: webhook → ai → crm",
    "if (lead.hot) notify();",
  ],
];

function BuildToMetricsInner() {
  const hostRef = useRef<HTMLDivElement>(null);
  const inView = useInViewport(hostRef, { rootMargin: "200px", threshold: 0.1 });

  const { phase, display, statusLine, hasCursor } = useTypewriterSequence({
    inView,
    snippets: CODE_SNIPPETS,
    typeSpeed: 22,
    pauseBetweenSnippets: 280,
    buildDuration: 550,
    deployDuration: 750,
  });

  const copy = HOME_COPY.buildToMetrics;
  const bullets = copy?.bullets ?? ["Собираем MVP", "Интегрируем", "Запускаем"];

  return (
    <SectionShell
      id="proof"
      variant="panel"
      bg="fade"
      className="relative"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        aria-hidden
        style={{
          background:
            "radial-gradient(900px 400px at 20% 0%, rgba(139,92,246,0.12) 0%, transparent 55%), radial-gradient(700px 350px at 80% 10%, rgba(236,72,153,0.08) 0%, transparent 50%)",
        }}
      />
      <div ref={hostRef} className="relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          {/* Left: title + bullets */}
          <div className="flex-shrink-0 max-w-xl">
            <motion.h2
              className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-3xl md:text-4xl"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              {copy?.title ?? "Код → продукт → метрики"}
            </motion.h2>
            <motion.p
              className="mt-3 text-[var(--text-secondary)]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              {copy?.subtitle ?? "Собираем MVP, интегрируем, запускаем. Результат виден сразу."}
            </motion.p>
            <ul className="mt-6 space-y-2">
              {bullets.map((bullet, i) => (
                <motion.li
                  key={bullet}
                  className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" aria-hidden />
                  {bullet}
                </motion.li>
              ))}
            </ul>
            <div className="mt-6">
              <Link href="/cases" className="text-sm text-[var(--accent)] hover:underline">
                {HOME_COPY.proof.casesLink ?? HOME_COPY.hero.ctaSecondary} →
              </Link>
            </div>
          </div>

          {/* Right: Code Window */}
          <div className="flex-1 min-w-0 max-w-2xl lg:max-w-xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35 }}
            >
              <CodeWindow
                phase={phase}
                display={display}
                statusLine={statusLine}
                hasCursor={hasCursor}
                tabLabel={copy?.codeTab ?? "workflow.ts"}
                statusDeploy={copy?.statusDeploy ?? "Deploying..."}
                statusLive={copy?.statusLive ?? "Live"}
                previewLabel={copy?.previewLabel ?? "Preview"}
                staticCode={CODE_SNIPPETS[0]?.join("\n")}
              />
            </motion.div>
          </div>
        </div>

        {/* Below: Live Metrics panel */}
        <motion.div
          className="mt-6 lg:mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.35 }}
        >
          <NumbersProofLive enabled={phase === "live"} compact />
        </motion.div>

        <p className="mt-4 text-xs text-[var(--text-muted)]">
          {HOME_COPY.proof.footnote}
          <span className="ml-2 opacity-75" aria-hidden>
            ({HOME_COPY.proof.liveDemoLabelRu})
          </span>
        </p>
      </div>
    </SectionShell>
  );
}

export const BuildToMetrics = memo(BuildToMetricsInner);
