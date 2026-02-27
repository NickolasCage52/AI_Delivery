"use client";

import { useRef, useEffect, useCallback, type ReactNode } from "react";

const HEADER_H = 64;

type SnapStoryProps = {
  children: ReactNode;
  onActiveIndexChange?: (index: number) => void;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
};

/**
 * Scroll snap container: 1 scroll = 1 card.
 * Uses native overflow scroll (not Lenis) for reliable scroll-snap.
 */
export function SnapStory({ children, onActiveIndexChange, scrollRef: externalRef }: SnapStoryProps) {
  const internalRef = useRef<HTMLDivElement>(null);

  const setRef = useCallback(
    (el: HTMLDivElement | null) => {
      (internalRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      if (externalRef) {
        (externalRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }
    },
    [externalRef]
  );

  useEffect(() => {
    const el = internalRef.current;
    if (!el || !onActiveIndexChange) return;

    const handleScroll = () => {
      const { scrollTop, clientHeight } = el;
      const cardHeight = clientHeight;
      const index = Math.round(scrollTop / cardHeight);
      onActiveIndexChange(Math.max(0, Math.min(index, 6)));
    };

    handleScroll();
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [onActiveIndexChange]);

  return (
    <div
      ref={setRef}
      tabIndex={0}
      role="region"
      aria-label="Сцены сценария работы"
      className="overflow-y-auto overflow-x-hidden snap-y snap-mandatory overscroll-contain will-change-scroll"
      style={{
        height: `calc(100svh - ${HEADER_H}px)`,
        scrollBehavior: "smooth",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {children}
    </div>
  );
}
