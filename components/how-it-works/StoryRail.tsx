"use client";

import { memo } from "react";

const NUM_CARDS = 7;

type StoryRailProps = {
  activeIndex: number;
  onDotClick: (index: number) => void;
};

function StoryRailInner({ activeIndex, onDotClick }: StoryRailProps) {
  return (
    <nav
      className="pointer-events-auto absolute left-3 top-1/2 z-10 -translate-y-1/2 flex flex-col gap-1.5 sm:left-4 sm:gap-2 md:left-6"
      aria-label="Прогресс по сценам"
    >
      {Array.from({ length: NUM_CARDS }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onDotClick(i)}
          className="group flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          aria-label={`Перейти к сцене ${i + 1}`}
          aria-current={activeIndex === i ? "step" : undefined}
        >
          <span
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              activeIndex === i
                ? "h-2.5 w-2.5 bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]"
                : "bg-white/30 group-hover:bg-white/50"
            }`}
            aria-hidden
          />
          <span className="sr-only">
            Сцена {i + 1} из {NUM_CARDS}
          </span>
        </button>
      ))}
    </nav>
  );
}

export const StoryRail = memo(StoryRailInner);
