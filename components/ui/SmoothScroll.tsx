"use client";

import { useEffect, useRef, ReactNode, useState } from "react";
import { rafLoopSubscribe } from "@/lib/perf/rafLoop";
import { useReducedMotion } from "@/lib/motion";
import { useFxLifecycle } from "@/hooks/useFxLifecycle";
import { installScrollDebug, wrapLenisScrollTo } from "@/lib/scroll/debug";

export function SmoothScroll({ children }: { children: ReactNode }) {
  type LenisLike = {
    destroy: () => void;
    raf: (t: number) => void;
  };
  const lenisRef = useRef<LenisLike | null>(null);
  const rafUnsubRef = useRef<null | (() => void)>(null);
  const frameRef = useRef<null | ((time: number) => void)>(null);
  const [frameReady, setFrameReady] = useState(false);
  const reduced = useReducedMotion();
  const fx = useFxLifecycle({ enabled: !reduced, isInViewport: true });

  useEffect(() => {
    return installScrollDebug();
  }, []);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      if (reduced) return;
      const Lenis = (await import("lenis")).default;
      const lenis = new Lenis({ lerp: 0.08, duration: 1.2 });
      wrapLenisScrollTo(lenis);
      if (!mounted) {
        lenis.destroy();
        return;
      }
      lenisRef.current = lenis;
      let scrollTrigger: { update: () => void } | null = null;
      import("gsap/ScrollTrigger").then((mod) => {
        if (mounted) scrollTrigger = mod.default;
      });
      frameRef.current = (time: number) => {
        if (!mounted) return;
        lenis.raf(time);
        scrollTrigger?.update();
      };
      setFrameReady(true);
    };
    init();
    return () => {
      mounted = false;
      rafUnsubRef.current?.();
      rafUnsubRef.current = null;
      frameRef.current = null;
      setFrameReady(false);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    if (!frameReady || !frameRef.current) return;
    if (!fx.isActive) {
      rafUnsubRef.current?.();
      rafUnsubRef.current = null;
      return;
    }
    if (rafUnsubRef.current) return;
    rafUnsubRef.current = rafLoopSubscribe((time) => frameRef.current?.(time));
    return () => {
      rafUnsubRef.current?.();
      rafUnsubRef.current = null;
    };
  }, [fx.isActive, reduced, frameReady]);

  return <>{children}</>;
}
