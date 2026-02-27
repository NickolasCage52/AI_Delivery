"use client";

import { useRef, useState, useCallback } from "react";
import { StoryCard } from "./StoryCard";
import { SnapStory } from "./SnapStory";
import { StoryRail } from "./StoryRail";
import {
  IncomingRequestDemo,
  ChatDemo,
  QualificationDemo,
  AutomationFlowDemo,
  CodeToMetricsDemo,
  DashboardGrowthDemo,
  Handoff24Demo,
} from "./demos";
import { trackCtaEvent } from "@/lib/analytics/cta";
import { CTA_PRIMARY } from "@/lib/constants/messaging";

const SCENES: Array<{
  id: string;
  title: string;
  pain: string;
  solution: string;
  effect: string;
  Demo: React.ComponentType<{ enabled?: boolean }>;
  isCta?: boolean;
}> = [
  {
    id: "incoming",
    title: "Ни одной заявки мимо",
    pain: "Заявки теряются в чатах и почте.",
    solution: "ИИ фиксирует каждый запрос в любом канале.",
    effect: "0 потерянных лидов",
    Demo: IncomingRequestDemo,
    isCta: false,
  },
  {
    id: "ai-context",
    title: "Квалификация быстрее",
    pain: "Менеджеры тратят часы на уточнения.",
    solution: "ИИ задаёт 2–3 вопроса и структурирует данные.",
    effect: "Минус 70% ручных вопросов",
    Demo: ChatDemo,
    isCta: false,
  },
  {
    id: "qualification",
    title: "Горячие — сразу в работу",
    pain: "Нет скорости: важные заявки ждут в очереди.",
    solution: "Авто-квалификация, горячие — менеджеру.",
    effect: "Ответ ≤ 5 минут",
    Demo: QualificationDemo,
    isCta: false,
  },
  {
    id: "integrations",
    title: "Минус часы рутины",
    pain: "Ручной перенос в CRM, задачи, отчёты.",
    solution: "Lead → Bot → CRM → задачи — автоматически.",
    effect: "Авто-интеграции 24/7",
    Demo: AutomationFlowDemo,
    isCta: false,
  },
  {
    id: "code-metrics",
    title: "MVP за 24–72 часа",
    pain: "Долго собирать и тестировать прототип.",
    solution: "Код → прототип → демо — результат виден сразу.",
    effect: "Бесплатный MVP за 24 часа",
    Demo: CodeToMetricsDemo,
    isCta: false,
  },
  {
    id: "growth",
    title: "Рост на дистанции",
    pain: "Нет контроля — не видно, что работает.",
    solution: "Дашборд, отчёты, метрики по каналам.",
    effect: "Up-only: рост пропускной способности",
    Demo: DashboardGrowthDemo,
    isCta: false,
  },
  {
    id: "handoff",
    title: "Запуск и поддержка",
    pain: "Нужно решение под ключ, без головной боли.",
    solution: "Handoff + инструкции, работает 24/7.",
    effect: "Под ключ с поддержкой",
    Demo: Handoff24Demo,
    isCta: true,
  },
];

export function HowItWorksStory() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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

  return (
    <div className="relative">
      <StoryRail activeIndex={activeIndex} onDotClick={scrollToCard} />

      <SnapStory onActiveIndexChange={handleActiveChange} scrollRef={scrollRef}>
        {SCENES.map((scene, index) => (
          <StoryCard
            key={scene.id}
            id={scene.id}
            index={index}
            title={scene.title}
            pain={scene.pain}
            solution={scene.solution}
            effect={scene.effect}
            demo={<scene.Demo enabled={activeIndex === index} />}
            isCta={scene.isCta}
            onCtaClick={() =>
              trackCtaEvent({ action: "click", label: CTA_PRIMARY, location: "how-it-works-cta", href: "/demo" })
            }
          />
        ))}
      </SnapStory>
    </div>
  );
}
