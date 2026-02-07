"use client";

import { useEffect, useRef, useState } from "react";

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const el = ref.current;
    if (!el) return;

    let x = 0,
      y = 0;
    let targetX = 0,
      targetY = 0;
    const lerp = 0.12;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      x += (targetX - x) * lerp;
      y += (targetY - y) * lerp;
      el.style.setProperty("--x", `${x}px`);
      el.style.setProperty("--y", `${y}px`);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[999] hidden md:block"
      style={
        {
          "--x": "50%",
          "--y": "50%",
        } as React.CSSProperties
      }
      aria-hidden
    >
      <div
        className="absolute h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-accent-cyan/15 via-accent-violet/5 to-transparent blur-3xl transition-opacity duration-300"
        style={{ left: "var(--x)", top: "var(--y)" }}
      />
    </div>
  );
}
