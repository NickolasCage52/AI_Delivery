"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInViewport } from "@/hooks/useInViewport";
import { useReducedMotion } from "@/lib/motion";

export type StoryCardProps = {
  id: string;
  index: number;
  title: string;
  pain: string;
  solution: string;
  effect: string;
  demo: ReactNode;
  isCta?: boolean;
  onCtaClick?: () => void;
};

export function StoryCard({
  id,
  index,
  title,
  pain,
  solution,
  effect,
  demo,
  isCta,
  onCtaClick,
}: StoryCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref, { rootMargin: "50%", threshold: 0.5 });
  const reduced = useReducedMotion();
  const isRevealed = inView || reduced;

  return (
    <div
      ref={ref}
      role="region"
      aria-labelledby={id + "-title"}
      id={id}
      data-scene-index={index}
      className="snap-story-card flex min-h-[calc(100svh-4rem)] w-full flex-shrink-0 items-center justify-center px-4 py-6 md:min-h-[calc(100svh-4rem)] md:px-8 md:py-10"
    >
      <div
        className={
          isCta
            ? "mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center text-center"
            : "mx-auto grid w-full max-w-6xl flex-1 gap-8 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-12"
        }
      >
        {isCta ? (
          <div className="flex w-full flex-col items-center gap-8">
            <div className="w-full max-w-md">{demo}</div>
            <div className="space-y-4 text-center">
              <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)] md:text-2xl">
                Запросить демо: бесплатный MVP за 24 часа
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Соберём демо за 24 часа после вводных.
              </p>
              <div className="flex flex-col items-center gap-4 pt-2 sm:flex-row sm:justify-center">
                <Link
                  href="/demo"
                  onClick={onCtaClick}
                  className="rounded-xl bg-[var(--accent)] px-8 py-3.5 text-base font-semibold text-[#09040F] transition-all hover:shadow-[0_0_24px_rgba(139,92,246,0.4)]"
                >
                  Запросить демо
                </Link>
                <Link href="/cases" className="text-sm text-[var(--accent)] hover:underline">
                  Смотреть кейсы →
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Left: title + pain/solution/effect */}
            <div className="flex flex-col justify-center order-1 md:order-1">
          <motion.h2
            id={id + "-title"}
            className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] md:text-3xl lg:text-4xl"
            initial={reduced ? undefined : { opacity: 0, y: 16 }}
            animate={isRevealed ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {title}
          </motion.h2>
          <motion.p
            className="mt-3 text-sm text-[var(--text-muted)] md:text-base"
            initial={reduced ? undefined : { opacity: 0 }}
            animate={isRevealed ? { opacity: 1 } : undefined}
            transition={{ duration: 0.35, delay: 0.05 }}
          >
            {pain}
          </motion.p>
          <motion.p
            className="mt-2 text-sm text-[var(--text-secondary)] md:text-base"
            initial={reduced ? undefined : { opacity: 0 }}
            animate={isRevealed ? { opacity: 1 } : undefined}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            → {solution}
          </motion.p>
          <motion.div
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-4 py-2"
            initial={reduced ? undefined : { opacity: 0 }}
            animate={isRevealed ? { opacity: 1 } : undefined}
            transition={{ duration: 0.35, delay: 0.15 }}
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)] md:text-sm">
              {effect}
            </span>
          </motion.div>
          <p className="mt-6 text-[10px] text-[var(--text-muted)] md:text-xs">
            {index + 1}/7 · Скролл →
          </p>
        </div>

        {/* Right: demo (center on mobile) */}
        <motion.div
          className="relative order-2 flex items-center justify-center md:order-2"
          initial={reduced ? undefined : { opacity: 0, y: 20 }}
          animate={isRevealed ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {demo}
        </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
