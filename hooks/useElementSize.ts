"use client";

import { useEffect, useRef, useState } from "react";

type ElementSize = {
  width: number;
  height: number;
};

export function useElementSize<T extends HTMLElement>(fallbackSize = 0) {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState<ElementSize>({
    width: fallbackSize,
    height: fallbackSize,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize((prev) => {
        const nextWidth = Math.round(width);
        const nextHeight = Math.round(height);
        if (prev.width === nextWidth && prev.height === nextHeight) return prev;
        return { width: nextWidth, height: nextHeight };
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return {
    ref,
    size: Math.min(size.width || fallbackSize, size.height || fallbackSize),
    width: size.width,
    height: size.height,
  };
}
