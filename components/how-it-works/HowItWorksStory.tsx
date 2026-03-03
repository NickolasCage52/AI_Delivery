"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { StoryCard } from "./StoryCard";
import { SnapStory } from "./SnapStory";
import { StoryRail } from "./StoryRail";
import { AmbientLight } from "./AmbientLight";
import hiwStyles from "./how-it-works.module.css";
import { LeadsFlowVisual } from "./components/LeadsFlowVisual";
import { Pipeline } from "./components/Pipeline";
import { LiveChatDemo } from "./components/LiveChatDemo";
import { MetricsGrid } from "./components/MetricsGrid";
import { ServicesCards } from "./components/ServicesCards";
import { ObjectionsBlock } from "./components/ObjectionsBlock";
import { OnboardingTimeline } from "./components/OnboardingTimeline";
import { FinalCTA } from "./components/FinalCTA";

const NUM_CARDS = 8;

const SCENES = [
  {
    id: "hook",
    title: "Ваш бизнес теряет заявки прямо сейчас",
    subtitle:
      "Пока менеджер не ответил — клиент уже позвонил конкуренту.",
    bullets: [
      "Ответ через час = потерянная заявка",
      "Ручная обработка = дорого и ненадёжно",
      "Конкурент автоматизировал — вы ещё нет",
    ],
    Demo: LeadsFlowVisual,
    animationVariant: "hook" as const,
  },
  {
    id: "solution",
    title: "Мы строим систему, которая работает за вас",
    subtitle:
      "От первого касания до повторной покупки — один сквозной процесс, без ручных действий.",
    bullets: [
      "Один сквозной процесс вместо хаоса в мессенджерах",
      "Автоматические уведомления и задачи без ручных действий",
      "Интегрируем с вашей CRM или строим с нуля",
    ],
    Demo: Pipeline,
    animationVariant: "default" as const,
  },
  {
    id: "process",
    title: "Клиент написал — система уже работает",
    subtitle: "Смотрите, что происходит за секунды после входящей заявки.",
    bullets: [
      "Ответ клиенту за секунды — 24/7 без выходных",
      "Квалификация вопросами — менеджер получает уже «горячий» лид",
      "Всё фиксируется в CRM автоматически",
    ],
    Demo: LiveChatDemo,
    animationVariant: "default" as const,
  },
  {
    id: "metrics",
    title: "Реальные результаты — не прогнозы",
    subtitle: "Цифры из проектов, которые уже запущены.",
    Demo: MetricsGrid,
    animationVariant: "counters" as const,
  },
  {
    id: "services",
    title: "Что именно мы внедряем",
    subtitle:
      "Четыре направления — одна цель: больше клиентов и меньше ручной работы.",
    Demo: ServicesCards,
    animationVariant: "default" as const,
  },
  {
    id: "trust",
    title: "Боитесь, что будет сложно? Мы это предусмотрели.",
    subtitle: undefined,
    Demo: ObjectionsBlock,
    animationVariant: "default" as const,
  },
  {
    id: "onboarding",
    title: "Что нужно сделать, чтобы начать",
    subtitle: "Три шага — и первый результат у вас.",
    Demo: OnboardingTimeline,
    animationVariant: "timeline" as const,
  },
  {
    id: "cta",
    title: "",
    Demo: FinalCTA,
    animationVariant: "cta" as const,
    isCta: true,
  },
];

export function HowItWorksStory() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const scrollToCard = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector(`[data-scene-index="${index}"]`);
    if (card) {
      (card as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleActiveChange = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const progressPct = NUM_CARDS > 1 ? (activeIndex / (NUM_CARDS - 1)) * 100 : 0;

  return (
    <div className="relative min-h-[calc(100svh-4rem)]">
      <StoryRail activeIndex={activeIndex} onDotClick={scrollToCard} />
      <div
        className="fixed left-0 right-0 top-16 z-[90] h-0.5 bg-transparent"
        aria-hidden
      >
        <div
          className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-pink)] transition-[width] duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <AmbientLight activeIndex={activeIndex} />
      <div className={hiwStyles.hiwNoiseWrapper}>
        <SnapStory
          onActiveIndexChange={handleActiveChange}
          scrollRef={scrollRef}
        >
          {SCENES.map((scene, index) => (
            <StoryCard
              key={scene.id}
              id={scene.id}
              index={index}
              totalCards={NUM_CARDS}
              title={scene.title}
              subtitle={scene.subtitle}
              bullets={scene.bullets}
              demo={<scene.Demo enabled={activeIndex === index} />}
              isCta={scene.isCta}
              animationVariant={scene.animationVariant}
              isActive={activeIndex === index}
            />
          ))}
        </SnapStory>
      </div>
    </div>
  );
}
