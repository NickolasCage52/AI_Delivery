"use client";

import { memo, useRef } from "react";
import { motion } from "framer-motion";
import { useInViewport } from "@/hooks/useInViewport";
import { useReducedMotion } from "@/lib/motion";
import Link from "next/link";
import { trackCtaEvent } from "@/lib/analytics/cta";
import { CTA_PRIMARY } from "@/lib/constants/messaging";
import s from "../how-it-works.module.css";

function FinalCTAInner({ enabled = true }: { enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref, { rootMargin: "120px", threshold: 0.5 });
  const active = enabled && inView;
  const reduced = useReducedMotion();
  const show = active || reduced;

  return (
    <div
      ref={ref}
      className={`relative flex flex-col items-center justify-center gap-8 p-8 rounded-2xl overflow-hidden w-full ${
        show && !reduced ? s.ctaGradientBg : ""
      }`}
      style={
        reduced || !show
          ? {
              background:
                "linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(236,72,153,0.05) 100%)",
            }
          : undefined
      }
    >
      <div className="flex flex-col items-center justify-center gap-6 text-center max-w-xl w-full">
        <motion.h2
          className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] md:text-3xl"
          initial={reduced ? undefined : { opacity: 0, y: 20 }}
          animate={show ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          Первый результат — через 24 часа. Бесплатно.
        </motion.h2>
        <motion.p
          className="text-base text-[var(--text-secondary)] md:text-lg"
          initial={reduced ? undefined : { opacity: 0 }}
          animate={show ? { opacity: 1 } : undefined}
          transition={{ duration: 0.35, delay: 0.2 }}
        >
          Один сценарий, один прототип, ноль риска для вашей операционки.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          initial={reduced ? undefined : { opacity: 0 }}
          animate={show ? { opacity: 1 } : undefined}
          transition={{ duration: 0.35, delay: 0.4 }}
        >
          <Link
            href="/demo"
            onClick={() =>
              trackCtaEvent({
                action: "click",
                label: CTA_PRIMARY,
                location: "how-it-works-final-cta",
                href: "/demo",
              })
            }
            aria-label="Получить бесплатный MVP за 24 часа"
            className={`inline-flex items-center justify-center min-h-[52px] sm:min-h-[56px] w-full sm:w-auto sm:min-w-[280px] rounded-xl bg-[var(--accent)] px-10 py-4 text-base sm:text-lg font-semibold text-[#09040F] transition-[transform,box-shadow] duration-[180ms] hover:shadow-[0_0_24px_rgba(139,92,246,0.4)] hover:scale-[1.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
              show && !reduced ? s.ctaButtonPulse : ""
            }`}
          >
            Получить бесплатный MVP за 24 часа
          </Link>
          <Link
            href="/demo#contact"
            aria-label="Разобрать задачу за 15 минут"
            className="inline-flex items-center justify-center min-h-[48px] rounded-xl border-2 border-[var(--accent)]/50 bg-transparent px-8 py-3 text-base font-medium text-[var(--accent)] hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/70 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            Разобрать задачу за 15 минут
          </Link>
        </motion.div>
        <p className="text-[13px] text-[var(--text-muted)] opacity-60">
          1 сценарий · 24 часа · без предоплаты
        </p>
      </div>
    </div>
  );
}

export const FinalCTA = memo(FinalCTAInner);
