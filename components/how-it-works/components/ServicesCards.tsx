"use client";

import { memo, useRef, useState, useCallback, useEffect } from "react";
import { useInViewport } from "@/hooks/useInViewport";
import { useReducedMotion } from "@/lib/motion";
import { useAnimationCycle } from "../hooks/useAnimationCycle";
import s from "../how-it-works.module.css";

const SERVICES = [
  {
    emoji: "🤖",
    title: "Боты и автоответчики",
    desc: "Квалификация и ответы 24/7",
  },
  {
    emoji: "⚙️",
    title: "Автоматизация процессов",
    desc: "Лид → CRM → задачи → отчёты",
  },
  {
    emoji: "🌐",
    title: "Лендинги и сайты",
    desc: "Страницы под гипотезу с аналитикой",
  },
  {
    emoji: "📱",
    title: "Telegram Mini App",
    desc: "MVP в Telegram для проверки спроса",
  },
];

const SPOTLIGHT_MS = 1200;
const PAUSE_AFTER_LAST_MS = 2000;
const CYCLE_MS = SERVICES.length * SPOTLIGHT_MS + PAUSE_AFTER_LAST_MS;
const PAUSE_MS = 200;

function ServicesCardsInner({ enabled = true }: { enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref, { rootMargin: "120px", threshold: 0.5 });
  const active = enabled && inView;
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [spotlightIndex, setSpotlightIndex] = useState(-1);

  useAnimationCycle({
    enabled: active,
    pauseMs: PAUSE_MS,
    cycleDurationMs: CYCLE_MS,
    onStart: useCallback(() => {
      setPlaying(true);
      setSpotlightIndex(0);
    }, []),
    onReset: useCallback(() => {
      setPlaying(false);
      setSpotlightIndex(-1);
    }, []),
  });

  // Advance spotlight every 1.2s while playing
  useEffect(() => {
    if (!playing || reduced) return;
    const iv = setInterval(() => {
      setSpotlightIndex((prev) => {
        if (prev >= SERVICES.length - 1) return prev;
        return prev + 1;
      });
    }, SPOTLIGHT_MS);
    return () => clearInterval(iv);
  }, [playing, reduced]);

  const show = active || reduced;
  const runAnimation = show && !reduced && playing;

  return (
    <div ref={ref} className="grid grid-cols-2 gap-4 md:gap-6 max-w-3xl">
      {SERVICES.map((svc, i) => (
        <div
          key={svc.title}
          className={`rounded-xl border border-white/[0.08] bg-[rgba(8,5,24,0.6)] p-5 md:p-6 transition-transform duration-200 active:scale-[1.02] md:active:scale-100 ${s.servicesCard} ${
            show && !reduced ? s.servicesCardActive : ""
          } ${reduced ? s.servicesCardReduced : ""} ${s.servicesCardHover} ${
            runAnimation && spotlightIndex === i ? s.servicesCardSpotlight : ""
          }`}
          style={show && !reduced ? { animationDelay: `${i * 100}ms` } : undefined}
        >
          <span
            className={`text-3xl block mb-3 ${s.servicesCardIcon} ${
              show && !reduced ? s.servicesCardIconActive : ""
            }`}
            style={show && !reduced ? { animationDelay: `${i * 100}ms` } : undefined}
            aria-hidden
          >
            {svc.emoji}
          </span>
          <p className="text-base font-semibold text-[var(--text-primary)] md:text-lg">
            {svc.title}
          </p>
          <p className="text-sm text-[var(--text-secondary)] mt-2">{svc.desc}</p>
        </div>
      ))}
    </div>
  );
}

export const ServicesCards = memo(ServicesCardsInner);
