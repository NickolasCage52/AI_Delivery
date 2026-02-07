"use client";

import { useEffect, useRef, ReactNode } from "react";
import { rafLoopSubscribe } from "@/lib/perf/rafLoop";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<{ destroy: () => void } | null>(null);
  const rafUnsubRef = useRef<null | (() => void)>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let mounted = true;
    const init = async () => {
      const Lenis = (await import("lenis")).default;
      const lenis = new Lenis({ lerp: 0.08, duration: 1.2 });
      if (!mounted) {
        lenis.destroy();
        return;
      }
      lenisRef.current = lenis;
      let scrollTrigger: { update: () => void } | null = null;
      import("gsap/ScrollTrigger").then((mod) => {
        if (mounted) scrollTrigger = mod.default;
      });
      const onFrame = (time: number) => {
        if (!mounted) return;
        lenis.raf(time);
        scrollTrigger?.update();
      };
      rafUnsubRef.current = rafLoopSubscribe(onFrame);
    };
    init();
    return () => {
      mounted = false;
      rafUnsubRef.current?.();
      rafUnsubRef.current = null;
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
