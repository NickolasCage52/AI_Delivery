import { useEffect, useMemo, useState, type RefObject } from "react";

type InViewportOptions = {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
};

const DEFAULT_OPTIONS: Required<Pick<InViewportOptions, "rootMargin" | "threshold">> = {
  rootMargin: "250px",
  threshold: 0.12,
};

export function useInViewport<T extends Element>(
  ref: RefObject<T>,
  options: InViewportOptions = {}
) {
  const [inView, setInView] = useState(false);
  const observerOptions = useMemo(
    () => ({
      root: options.root ?? null,
      rootMargin: options.rootMargin ?? DEFAULT_OPTIONS.rootMargin,
      threshold: options.threshold ?? DEFAULT_OPTIONS.threshold,
    }),
    [options.root, options.rootMargin, options.threshold]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, observerOptions);

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [ref, observerOptions]);

  return inView;
}
