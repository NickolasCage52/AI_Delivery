"use client";

import { useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useInViewport } from "@/hooks/useInViewport";
import { useReducedMotion } from "@/lib/motion";

export type StoryCardAnimationVariant =
  | "pipeline"
  | "chat"
  | "counters"
  | "timeline"
  | "cta"
  | "hook"
  | "default";

export type StoryCardProps = {
  id: string;
  index: number;
  totalCards: number;
  title: string;
  subtitle?: string;
  isActive?: boolean;
  pain?: string;
  solution?: string;
  effect?: string;
  bullets?: string[];
  demo: ReactNode;
  isCta?: boolean;
  animationVariant?: StoryCardAnimationVariant;
};

export function StoryCard({
  id,
  index,
  totalCards,
  title,
  subtitle,
  pain,
  solution,
  effect,
  bullets,
  demo,
  isCta,
  animationVariant = "default",
  isActive = true,
}: StoryCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref, { rootMargin: "50%", threshold: 0.5 });
  const reduced = useReducedMotion();
  const isRevealed = inView || reduced;

  const useCenteredLayout = isCta || animationVariant === "cta";
  const useStackedLayout =
    animationVariant === "counters" || animationVariant === "timeline";
  const useHookLayout = animationVariant === "hook";

  return (
    <div
      ref={ref}
      role="region"
      aria-labelledby={useCenteredLayout && animationVariant === "cta" ? undefined : id + "-title"}
      aria-label={useCenteredLayout && animationVariant === "cta" ? "Готовы получить первый результат за 24 часа?" : undefined}
      id={id}
      data-scene-index={index}
      className={`snap-story-card flex min-h-[calc(100svh-4rem)] w-full flex-shrink-0 items-center justify-center px-6 py-8 transition-opacity duration-150 md:min-h-[calc(100svh-4rem)] md:px-12 md:py-12 ${isActive ? "opacity-100" : "opacity-80"}`}
    >
      <div
        className={
          useCenteredLayout
            ? "mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center text-center"
            : "mx-auto grid w-full max-w-7xl flex-1 gap-10 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-16"
        }
      >
        {useCenteredLayout && animationVariant === "cta" ? (
          <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 text-center">
            {demo}
          </div>
        ) : useHookLayout ? (
          <>
            <div className="flex flex-col justify-center order-1 md:order-1">
              <motion.h2
                id={id + "-title"}
                className="text-[min(26px,7vw)] font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl lg:text-5xl max-w-[520px]"
                initial={reduced ? undefined : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                animate={isRevealed ? { opacity: 1, clipPath: "inset(0 0 0 0)" } : undefined}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {title}
              </motion.h2>
              {subtitle && (
                <motion.p
                  className="mt-3 text-base text-[var(--text-muted)] md:text-lg max-w-[480px] opacity-[0.7]"
                  initial={reduced ? undefined : { opacity: 0, y: 16 }}
                  animate={isRevealed ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  {subtitle}
                </motion.p>
              )}
              {bullets && bullets.length > 0 && (
                <ul className="mt-5 space-y-3 max-w-[440px]">
                  {bullets.map((b, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start gap-3 text-[min(15px,4vw)] text-[var(--text-secondary)] md:text-lg min-[768px]:text-lg"
                      initial={reduced ? undefined : { opacity: 0 }}
                      animate={isRevealed ? { opacity: 1 } : undefined}
                      transition={{ duration: 0.35, delay: 0.4 + i * 0.15 }}
                    >
                      <span className="text-[var(--accent)] shrink-0">•</span>
                      {b}
                    </motion.li>
                  ))}
                </ul>
              )}
              <p className="mt-6 text-xs text-[var(--text-muted)]">
                {index + 1}/{totalCards} · Скролл →
              </p>
            </div>
            <motion.div
              className="relative order-2 flex items-end justify-end md:items-center md:justify-end"
              initial={reduced ? undefined : { opacity: 0, y: 20 }}
              animate={isRevealed ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="w-full max-w-[600px] ml-auto">{demo}</div>
            </motion.div>
          </>
        ) : useStackedLayout ? (
          <>
            <div className="flex flex-col justify-center order-1 md:order-1">
              <motion.h2
                id={id + "-title"}
                className="text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl max-w-[520px]"
                initial={reduced ? undefined : { opacity: 0, y: 16 }}
                animate={isRevealed ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {title}
              </motion.h2>
              {subtitle && (
                <motion.p
                  className="mt-3 text-base text-[var(--text-muted)] md:text-lg"
                  initial={reduced ? undefined : { opacity: 0 }}
                  animate={isRevealed ? { opacity: 1 } : undefined}
                  transition={{ duration: 0.35, delay: 0.05 }}
                >
                  {subtitle}
                </motion.p>
              )}
              <p className="mt-6 text-xs text-[var(--text-muted)]">
                {index + 1}/{totalCards} · Скролл →
              </p>
            </div>
            <motion.div
              className="relative order-2 flex items-end justify-end md:items-center md:justify-end"
              initial={reduced ? undefined : { opacity: 0, y: 20 }}
              animate={isRevealed ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="w-full max-w-[600px] ml-auto">{demo}</div>
            </motion.div>
          </>
        ) : useCenteredLayout ? (
          <div className="flex w-full flex-1 flex-col items-center justify-center gap-8 text-center">
            <div className="space-y-3">
              <motion.h2
                id={id + "-title"}
                className="text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl"
                initial={reduced ? undefined : { opacity: 0, y: 16 }}
                animate={isRevealed ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {title}
              </motion.h2>
              {subtitle && (
                <motion.p
                  className="text-base text-[var(--text-muted)] md:text-lg"
                  initial={reduced ? undefined : { opacity: 0 }}
                  animate={isRevealed ? { opacity: 1 } : undefined}
                  transition={{ duration: 0.35, delay: 0.05 }}
                >
                  {subtitle}
                </motion.p>
              )}
            </div>
            <div className="w-full flex justify-center">{demo}</div>
            <p className="text-xs text-[var(--text-muted)] md:text-sm">
              {index + 1}/{totalCards} · Скролл →
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col justify-center order-1 md:order-1">
              <motion.h2
                id={id + "-title"}
                className="text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl lg:text-5xl"
                initial={reduced ? undefined : { opacity: 0, y: 16 }}
                animate={isRevealed ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {title}
              </motion.h2>
              {subtitle && (
                <motion.p
                  className="mt-4 text-base text-[var(--text-muted)] md:text-lg"
                  initial={reduced ? undefined : { opacity: 0 }}
                  animate={isRevealed ? { opacity: 1 } : undefined}
                  transition={{ duration: 0.35, delay: 0.05 }}
                >
                  {subtitle}
                </motion.p>
              )}
              {bullets && bullets.length > 0 ? (
                <ul className="mt-5 space-y-3">
                  {bullets.map((b, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start gap-3 text-base text-[var(--text-secondary)] md:text-lg"
                      initial={reduced ? undefined : { opacity: 0 }}
                      animate={isRevealed ? { opacity: 1 } : undefined}
                      transition={{ duration: 0.35, delay: 0.1 + i * 0.05 }}
                    >
                      <span className="text-[var(--accent)] shrink-0">•</span>
                      {b}
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <>
                  {pain && (
                    <motion.p
                      className="mt-4 text-base text-[var(--text-muted)] md:text-lg"
                      initial={reduced ? undefined : { opacity: 0 }}
                      animate={isRevealed ? { opacity: 1 } : undefined}
                      transition={{ duration: 0.35, delay: 0.05 }}
                    >
                      {pain}
                    </motion.p>
                  )}
                  {solution && (
                    <motion.p
                      className="mt-3 text-base text-[var(--text-secondary)] md:text-lg"
                      initial={reduced ? undefined : { opacity: 0 }}
                      animate={isRevealed ? { opacity: 1 } : undefined}
                      transition={{ duration: 0.35, delay: 0.1 }}
                    >
                      → {solution}
                    </motion.p>
                  )}
                  {effect && (
                    <motion.div
                      className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-5 py-2.5"
                      initial={reduced ? undefined : { opacity: 0 }}
                      animate={isRevealed ? { opacity: 1 } : undefined}
                      transition={{ duration: 0.35, delay: 0.15 }}
                    >
                      <span className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)] md:text-base">
                        {effect}
                      </span>
                    </motion.div>
                  )}
                </>
              )}
              <p className="mt-6 text-xs text-[var(--text-muted)] md:text-sm">
                {index + 1}/{totalCards} · Скролл →
              </p>
            </div>

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
