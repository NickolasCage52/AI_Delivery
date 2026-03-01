"use client";

import { memo } from "react";

const NUM_CARDS = 8;

type StoryRailProps = {
  activeIndex: number;
  onDotClick: (index: number) => void;
};

function StoryRailInner({ activeIndex, onDotClick }: StoryRailProps) {
  return (
    <nav
      className="pointer-events-auto absolute left-3 top-1/2 z-10 -translate-y-1/2 flex flex-col gap-1.5 sm:left-4 sm:gap-2 md:left-6"
      aria-label="Навигация по карточкам: переключение между разделами"
    >
      {Array.from({ length: NUM_CARDS }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onDotClick(i)}
          className="group flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          aria-label={`Перейти к карточке ${i + 1}`}
          aria-current={activeIndex === i ? "step" : undefined}
        >
          <span
            className={`rounded-full transition-all duration-200 ease-out ${
              activeIndex === i
                ? "h-3 w-3 bg-[var(--accent)] shadow-[0_0_10px_var(--accent)] scale-[1.4]"
                : "h-2 w-2 opacity-40 bg-white/50 group-hover:opacity-70 group-hover:scale-105"
            }`}
            aria-hidden
          />
          <span className="sr-only">
            Карточка {i + 1} из {NUM_CARDS}
          </span>
        </button>
      ))}
    </nav>
  );
}

export const StoryRail = memo(StoryRailInner);
