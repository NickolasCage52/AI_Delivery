"use client";

import { memo, useRef, useState, useEffect, useCallback } from "react";
import { useReducedMotion } from "@/lib/motion";
import { useAnimationCycle } from "../hooks/useAnimationCycle";
import { useInViewport } from "@/hooks/useInViewport";

const PARTICLE_COUNT = 25;
const MOBILE_PARTICLE_COUNT = 12;
const LOST_RATIO = 0.3;
const ACCENT = "#8B5CF6";
const ACCENT_LIGHT = "#A78BFA";

interface Particle {
  startX: number;
  startY: number;
  ctrl1X: number;
  ctrl1Y: number;
  ctrl2X: number;
  ctrl2Y: number;
  radius: number;
  lost: boolean;
  opacity: number;
  scale: number;
  progress: number;
  id: number;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function bezier(t: number, p0: number, p1: number, p2: number, p3: number) {
  const t1 = 1 - t;
  return (
    t1 * t1 * t1 * p0 +
    3 * t1 * t1 * t * p1 +
    3 * t1 * t * t * p2 +
    t * t * t * p3
  );
}

function ParticleFunnelCanvas({
  enabled,
  onProcessed,
}: {
  enabled: boolean;
  onProcessed?: (count: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const processedRef = useRef(0);
  const reduced = useReducedMotion();

  const spawnParticles = useCallback(
    (width: number, height: number) => {
      const count =
        typeof window !== "undefined" && window.innerWidth < 768
          ? MOBILE_PARTICLE_COUNT
          : PARTICLE_COUNT;
      const particles: Particle[] = [];
      const cx = width / 2;
      const cy = height / 2;
      for (let i = 0; i < count; i++) {
        const lost = Math.random() < LOST_RATIO;
        const startX = width * (0.1 + Math.random() * 0.35);
        const startY = height * (0.05 + Math.random() * 0.35);
        particles.push({
          startX,
          startY,
          ctrl1X: lerp(startX, cx, 0.3) + (Math.random() - 0.5) * 30,
          ctrl1Y: lerp(startY, cy, 0.2),
          ctrl2X: lerp(startX, cx, 0.7),
          ctrl2Y: lerp(startY, cy, 0.5) + (Math.random() - 0.5) * 20,
          radius: 4 + Math.random() * 4,
          lost,
          opacity: 1,
          scale: 1,
          progress: 0,
          id: i,
        });
      }
      return particles;
    },
    []
  );

  useEffect(() => {
    if (!enabled || reduced) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    particlesRef.current = spawnParticles(canvas.width, canvas.height);
    processedRef.current = 0;

    const animate = () => {
      if (!enabled || reduced) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      let allDone = true;

      for (const p of particles) {
        if (p.progress >= 1) continue;
        allDone = false;

        p.progress += 0.008 + (p.lost ? 0.004 : 0.006);
        if (p.progress > 1) p.progress = 1;

        const t = p.progress;
        const x = bezier(t, p.startX, p.ctrl1X, p.ctrl2X, centerX);
        const y = bezier(t, p.startY, p.ctrl1Y, p.ctrl2Y, centerY);

        if (p.lost) {
          p.opacity = Math.max(0, 1 - t * 2.5);
        } else {
          if (t > 0.85) {
            p.scale = Math.max(0, 1 - (t - 0.85) * 6.67);
          }
        }

        const alpha = p.opacity * (p.lost ? 1 : p.scale);
        if (alpha <= 0) continue;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.lost ? "#6B7280" : ACCENT;
        ctx.beginPath();
        ctx.arc(x, y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        if (!p.lost && t > 0.9 && p.scale > 0) {
          ctx.shadowColor = ACCENT_LIGHT;
          ctx.shadowBlur = 12;
          ctx.fill();
        }
        ctx.restore();

        if (!p.lost && t >= 1) {
          processedRef.current++;
          onProcessed?.(processedRef.current);
        }
      }

      if (allDone && enabled) {
        onProcessed?.(processedRef.current);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, reduced, spawnParticles, onProcessed]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={280}
      className="w-full max-w-[600px] mx-auto rounded-xl border border-white/[0.06] h-[200px] md:h-[220px] lg:h-[280px]"
      aria-hidden
    />
  );
}

const CYCLE_MS = 4500;
const PAUSE_MS = 1500;

function ParticleFunnelInner({ enabled = true }: { enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref, { rootMargin: "120px", threshold: 0.1 });
  const active = enabled && inView;
  const reduced = useReducedMotion();
  const [processedCount, setProcessedCount] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);

  useAnimationCycle({
    enabled: active,
    pauseMs: PAUSE_MS,
    cycleDurationMs: CYCLE_MS,
    onStart: useCallback(() => {
      setProcessedCount(0);
      setCycleKey((k) => k + 1);
    }, []),
    onReset: useCallback(() => setProcessedCount(0), []),
  });

  const handleProcessed = useCallback((count: number) => {
    setProcessedCount(count);
  }, []);

  if (reduced) {
    return (
      <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
        <div className="flex items-center gap-4 w-full">
          <div className="flex-1 h-16 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center">
            <span className="text-xs text-[var(--text-muted)] opacity-70">
              Входящие заявки
            </span>
          </div>
          <span className="text-[var(--accent)]">→</span>
          <div className="flex-1 h-16 rounded-lg border-2 border-[var(--accent)]/50 bg-[var(--accent)]/10 flex items-center justify-center">
            <span className="text-xs font-medium text-[var(--accent)]">
              Обработано системой
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative w-full max-w-[600px] mx-auto">
      <ParticleFunnelCanvas
        key={cycleKey}
        enabled={active && !reduced}
        onProcessed={handleProcessed}
      />
      <div
        className="absolute left-[8%] top-[10%] text-[10px] md:text-xs text-[var(--text-muted)] opacity-50"
        aria-hidden
      >
        Входящие заявки
      </div>
      <div
        className="absolute right-[15%] top-[45%] text-[10px] md:text-xs font-medium text-[var(--accent)] opacity-90"
        aria-hidden
      >
        Обработано системой
      </div>
      <div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] md:text-xs text-[var(--accent)] tabular-nums"
        aria-hidden
      >
        {processedCount}
      </div>
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-2 border-[var(--accent)]/50 flex items-center justify-center"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)",
          boxShadow: "0 0 24px rgba(139,92,246,0.3)",
        }}
        aria-hidden
      />
    </div>
  );
}

export const LeadsFlowVisual = memo(ParticleFunnelInner);
