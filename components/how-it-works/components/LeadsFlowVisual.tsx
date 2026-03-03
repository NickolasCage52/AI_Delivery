"use client";

import { memo, useRef, useState, useEffect, useCallback } from "react";
import { useReducedMotion } from "@/lib/motion";
import { useAnimationCycle } from "../hooks/useAnimationCycle";
import { useInViewport } from "@/hooks/useInViewport";

const PARTICLE_COUNT = 18;
const MOBILE_PARTICLE_COUNT = 10;
const LOST_RATIO = 0.25;
const ACCENT = "#8B5CF6";
const ACCENT_LIGHT = "#A78BFA";
const MAX_MONEY_BURSTS = 16;
const MONEY_PER_CONVERSION = 4;

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

interface MoneyBurst {
  angle: number;
  dist: number;
  speed: number;
  opacity: number;
  scale: number;
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

function ParticleFunnelCanvas({ enabled }: { enabled: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
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

  const moneyBurstsRef = useRef<MoneyBurst[]>([]);
  const flashRef = useRef(0);

  useEffect(() => {
    if (!enabled || reduced) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    particlesRef.current = spawnParticles(canvas.width, canvas.height);
    moneyBurstsRef.current = [];
    flashRef.current = 0;

    const flashGrad = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, 45
    );
    flashGrad.addColorStop(0, "rgba(250, 204, 21, 0.5)");
    flashGrad.addColorStop(0.5, "rgba(250, 204, 21, 0.15)");
    flashGrad.addColorStop(1, "transparent");

    const spawnMoneyBurst = () => {
      flashRef.current = 1;
      const arr = moneyBurstsRef.current;
      if (arr.length >= MAX_MONEY_BURSTS) return;
      const add = Math.min(MONEY_PER_CONVERSION, MAX_MONEY_BURSTS - arr.length);
      for (let i = 0; i < add; i++) {
        const angle = (Math.PI * 2 * i) / add + (i * 0.3);
        arr.push({
          angle,
          dist: 0,
          speed: 2.5 + (i % 3) * 0.3,
          opacity: 1,
          scale: 0.95,
        });
      }
    };

    const PROGRESS_STEP = 0.021;
    const PROGRESS_LOST = 0.003;

    const animate = () => {
      if (!enabled || reduced) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (flashRef.current > 0) {
        flashRef.current -= 0.1;
        ctx.globalAlpha = flashRef.current;
        ctx.fillStyle = flashGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      const particles = particlesRef.current;
      const moneyBursts = moneyBurstsRef.current;

      for (const p of particles) {
        if (p.progress >= 1) continue;

        p.progress += PROGRESS_STEP + (p.lost ? PROGRESS_LOST : 0.005);
        if (p.progress > 1) p.progress = 1;

        const t = p.progress;
        const x = bezier(t, p.startX, p.ctrl1X, p.ctrl2X, centerX);
        const y = bezier(t, p.startY, p.ctrl1Y, p.ctrl2Y, centerY);

        if (p.lost) {
          p.opacity = Math.max(0, 1 - t * 2.2);
        } else if (t > 0.9) {
          p.scale = Math.max(0, 1 - (t - 0.9) * 10);
        }

        const alpha = p.opacity * (p.lost ? 1 : p.scale);
        if (alpha > 0) {
          ctx.globalAlpha = alpha;
          ctx.fillStyle = p.lost ? "#6B7280" : ACCENT;
          ctx.beginPath();
          ctx.arc(x, y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          if (!p.lost && t > 0.85 && p.scale > 0) {
            ctx.shadowColor = ACCENT_LIGHT;
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
          ctx.globalAlpha = 1;
        }

        if (!p.lost && t >= 1) {
          spawnMoneyBurst();
        }
      }

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = '22px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';

      for (let i = moneyBursts.length - 1; i >= 0; i--) {
        const m = moneyBursts[i];
        m.dist += m.speed;
        m.opacity = Math.max(0, 1 - m.dist / 85);

        if (m.opacity <= 0) {
          moneyBursts.splice(i, 1);
          continue;
        }

        const mx = centerX + Math.cos(m.angle) * m.dist;
        const my = centerY + Math.sin(m.angle) * m.dist;

        ctx.globalAlpha = m.opacity;
        ctx.fillText("💵", mx, my);
      }

      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, reduced, spawnParticles]);

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

const CYCLE_MS = 2800;
const PAUSE_MS = 1200;

function ParticleFunnelInner({ enabled = true }: { enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref, { rootMargin: "120px", threshold: 0.1 });
  const active = enabled && inView;
  const reduced = useReducedMotion();
  const [cycleKey, setCycleKey] = useState(0);

  useAnimationCycle({
    enabled: active,
    pauseMs: PAUSE_MS,
    cycleDurationMs: CYCLE_MS,
    onStart: useCallback(() => setCycleKey((k) => k + 1), []),
    onReset: useCallback(() => {}, []),
  });

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
    <div ref={ref} className="relative w-full max-w-[600px] ml-auto">
      <ParticleFunnelCanvas
        key={cycleKey}
        enabled={active && !reduced}
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
