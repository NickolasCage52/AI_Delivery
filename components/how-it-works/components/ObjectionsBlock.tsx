"use client";

import { memo, useRef, useState, useCallback } from "react";
import { useInViewport } from "@/hooks/useInViewport";
import { useReducedMotion } from "@/lib/motion";
import { useAnimationCycle } from "../hooks/useAnimationCycle";
import s from "../how-it-works.module.css";

const OBJECTIONS = [
  {
    question: "Долго внедрять",
    answer: "Первый рабочий прототип — через 24 часа. Бесплатно.",
  },
  {
    question: "Дорого",
    answer: "Платите поэтапно. Первый этап — за наш счёт.",
  },
  {
    question: "Не разберёмся",
    answer: "Настраиваем мы. Вам — только описать проблему.",
  },
];

/** Rows appear stagger 300ms (3 rows ~900ms) + question/answer offset. Last row + footer. Pause 3s. Fade 500ms. */
const ANIM_IN_MS = 900 + 300 + 200;
const PAUSE_MS = 3000;
const FADE_MS = 500;
const CYCLE_MS = ANIM_IN_MS + PAUSE_MS;
const PAUSE_BETWEEN_MS = FADE_MS + 200;

function ObjectionsBlockInner({ enabled = true }: { enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref, { rootMargin: "120px", threshold: 0.5 });
  const active = enabled && inView;
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [resetting, setResetting] = useState(false);

  useAnimationCycle({
    enabled: active,
    pauseMs: PAUSE_BETWEEN_MS,
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
      className="space-y-5 max-w-lg transition-opacity"
      style={{
        opacity: reduced ? 1 : resetting ? 0 : runAnimation ? 1 : 0,
        transitionDuration: `${FADE_MS}ms`,
      }}
    >
      {OBJECTIONS.map((obj, i) => (
        <div
          key={obj.question}
          className={`flex flex-wrap items-start gap-3 ${s.objectionRow} ${
            runAnimation ? s.objectionRowActive : ""
          } ${reduced ? "opacity-100" : ""}`}
          style={
            runAnimation ? { animationDelay: `${i * 300}ms` } : undefined
          }
        >
          <div className="flex items-center gap-2 shrink-0">
            <span aria-hidden>❓</span>
            <span className="text-base text-[var(--text-muted)]">
              «{obj.question}»
            </span>
          </div>
          <div
            className={`flex items-center gap-2 shrink-0 ${s.objectionRow} ${
              runAnimation ? s.objectionRowActive : ""
            } ${reduced ? "opacity-100" : ""}`}
            style={
              runAnimation
                ? { animationDelay: `${i * 300 + 200}ms` }
                : undefined
            }
          >
            <span aria-hidden>✅</span>
            <span className="text-base text-[var(--text-primary)] font-medium md:text-lg">
              «{obj.answer}»
            </span>
          </div>
        </div>
      ))}
      <p
        className={`text-sm text-[var(--text-muted)] mt-5 ${s.objectionRow} ${
          runAnimation ? s.objectionRowActive : ""
        } ${reduced ? "opacity-100" : ""}`}
        style={
          runAnimation ? { animationDelay: `${OBJECTIONS.length * 300}ms` } : undefined
        }
      >
        Никакого риска для вашей операционки на старте.
      </p>
    </div>
  );
}

export const ObjectionsBlock = memo(ObjectionsBlockInner);
