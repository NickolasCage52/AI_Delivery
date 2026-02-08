"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/motion";
import { getCanvasDPR, getCanvasTargetFPS } from "@/lib/perf/quality";
import { useQuality } from "@/hooks/useQuality";
import { rafLoopSubscribe } from "@/lib/perf/rafLoop";
import { useInViewport } from "@/hooks/useInViewport";
import { useFxLifecycle } from "@/hooks/useFxLifecycle";

const NEON_VIOLET = "139, 92, 246";
const NEON_PINK = "236, 72, 153";

export function NeuralGridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const quality = useQuality();
  const inView = useInViewport(canvasRef);
  const fx = useFxLifecycle({ enabled: !reduced, isInViewport: inView });
  const dpr = getCanvasDPR(quality);
  const targetFPS = getCanvasTargetFPS(quality);
  const frameInterval = 1000 / targetFPS;

  useEffect(() => {
    if (!fx.isActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let pulsePhase = 0;
    let lastFrameTime = 0;

    const setSize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      if (targetFPS < 60 && now - lastFrameTime < frameInterval) return;
      lastFrameTime = now;

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      pulsePhase += 0.01;
      const pulse = 0.12 + 0.06 * Math.sin(pulsePhase);

      const step = 60;
      ctx.strokeStyle = `rgba(${NEON_VIOLET}, ${0.06 + pulse * 0.5})`;
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= w + step; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h + step; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const cx = w * 0.5;
      const cy = h * 0.55;
      const radius = Math.min(w, h) * 0.35;
      ctx.strokeStyle = `rgba(${NEON_PINK}, ${0.1 + pulse * 0.3})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    };

    setSize();
    const unsubscribe = rafLoopSubscribe(draw);
    window.addEventListener("resize", setSize);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", setSize);
    };
  }, [fx.isActive, quality, dpr, targetFPS, frameInterval]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
      aria-hidden
    />
  );
}
