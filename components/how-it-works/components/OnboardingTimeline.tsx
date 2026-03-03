"use client";

import { memo, useRef, useState, useCallback } from "react";
import { useInViewport } from "@/hooks/useInViewport";
import { useReducedMotion } from "@/lib/motion";
import { useAnimationCycle } from "../hooks/useAnimationCycle";
import Link from "next/link";
import { trackCtaEvent } from "@/lib/analytics/cta";
import { CTA_PRIMARY } from "@/lib/constants/messaging";
import s from "../how-it-works.module.css";

const STEPS = [
  {
    num: 1,
    title: "Опишите одну боль",
    desc: "Расскажите про процесс, который мешает расти.",
    tag: "Бесплатно",
    tagStyle: "accent" as const,
  },
  {
    num: 2,
    title: "Получите прототип за 24 часа",
    desc: "Рабочий сценарий — не презентация, а реальный инструмент.",
    tag: "24 часа",
    tagStyle: "accent" as const,
  },
  {
    num: 3,
    title: "Решайте: идём дальше или нет",
    desc: "Никакого давления. Видите результат — продолжаем по этапам.",
    tag: "Без риска",
    tagStyle: "neutral" as const,
  },
];

const CYCLE_MS = 1200 + 800 * 3 + 900 + 3000;
const FADE_MS = 500;
const PAUSE_MS = FADE_MS + 200;

function OnboardingTimelineInner({ enabled = true }: { enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref, { rootMargin: "120px", threshold: 0.5 });
  const active = enabled && inView;
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [resetting, setResetting] = useState(false);

  useAnimationCycle({
    enabled: active,
    pauseMs: PAUSE_MS,
    cycleDurationMs: CYCLE_MS,
    onStart: useCallback(() => {
      setResetting(false);
      setPlaying(true);
    }, []),
    onReset: useCallback(() => {
      setPlaying(false);
      setResetting(true);
    }, []),
  });

  const show = active || reduced;
  const runAnimation = show && !reduced && playing && !resetting;

  return (
    <div
      ref={ref}
      className={`relative w-full max-w-[520px] ml-auto px-0 md:px-0 ${s.timelineAmbient}`}
      style={{
        opacity: reduced ? 1 : resetting ? 0 : runAnimation ? 1 : 0,
        transitionDuration: `${FADE_MS}ms`,
      }}
    >
      <div className="relative pl-10">
        <div
          className={`absolute left-[15px] top-0 w-0.5 bg-gradient-to-b from-[var(--accent)] to-[var(--accent)]/20 ${s.timelineLine} ${
            runAnimation ? s.timelineLineActive : ""
          } ${reduced ? s.timelineLineReduced : ""}`}
          style={{ height: "calc(100% - 20px)", transformOrigin: "top" }}
          aria-hidden
        />
        {STEPS.map((step, i) => (
          <div
            key={step.num}
            className={`relative pb-10 last:pb-0 ${s.timelineStep} ${
              runAnimation ? s.timelineStepActive : ""
            } ${reduced ? s.timelineStepReduced : ""}`}
            style={
              runAnimation
                ? { animationDelay: `${400 + i * 800}ms` }
                : undefined
            }
          >
            <div className="absolute -left-10 top-0 flex items-center justify-center">
              <div
                className={`relative w-8 h-8 rounded-full border-2 border-[var(--accent)] bg-[var(--bg-primary)] flex items-center justify-center ${s.timelineDot}`}
                style={
                  runAnimation
                    ? { animationDelay: `${400 + i * 800}ms` }
                    : undefined
                }
              >
                <span className="text-xs font-bold text-[var(--accent)] relative z-10">
                  {step.num}
                </span>
                <span
                  className={`absolute inset-0 rounded-full border-2 border-[var(--accent)] ${s.timelineRipple}`}
                  style={
                    runAnimation
                      ? { animationDelay: `${800 + i * 800}ms` }
                      : undefined
                  }
                  aria-hidden
                />
              </div>
            </div>
            <div className="ml-0">
              <p className="text-base font-semibold text-[var(--text-primary)] md:text-lg">
                {step.title}
              </p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {step.desc}
              </p>
              <span
                className={`inline-block mt-2 rounded-full px-2.5 py-0.5 text-[11px] md:text-xs font-semibold ${
                  step.tagStyle === "accent"
                    ? "bg-[var(--accent)]/20 text-[var(--accent)]"
                    : "bg-white/10 text-[var(--text-secondary)]"
                }`}
                style={
                  runAnimation
                    ? { animationDelay: `${700 + i * 800}ms` }
                    : undefined
                }
              >
                {step.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p
        className="text-sm text-[var(--text-muted)] opacity-60 text-center mt-6"
        style={
          runAnimation
            ? { animationDelay: "3200ms" }
            : undefined
        }
      >
        Никакой подготовки. Никаких технических знаний. Просто один разговор.
      </p>
      <Link
        href="/demo"
        onClick={() =>
          trackCtaEvent({
            action: "click",
            label: CTA_PRIMARY,
            location: "how-it-works-onboarding",
            href: "/demo",
          })
        }
        aria-label="Начать бесплатно"
        className="flex mt-8 mx-auto w-full max-w-[320px] sm:w-auto sm:max-w-none min-h-[52px] items-center justify-center rounded-xl border-2 border-[var(--accent)] bg-transparent px-8 py-4 text-base font-semibold text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        style={
          runAnimation
            ? { animationDelay: "3800ms" }
            : undefined
        }
      >
        Начать бесплатно
      </Link>
    </div>
  );
}

export const OnboardingTimeline = memo(OnboardingTimelineInner);
