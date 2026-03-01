"use client";

import { memo, useEffect, useState, useRef } from "react";

const LERP = 0.12;
const SIZE = 24;
const SIZE_HOVER = 40;

function CustomCursorInner() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHover, setIsHover] = useState(false);
  const [mounted, setMounted] = useState(false);
  const targetRef = useRef({ x: -100, y: -100 });
  const currentRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    const handleMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t?.closest?.("a, button")) setIsHover(true);
    };
    const handleOut = (e: MouseEvent) => {
      const t = e.relatedTarget as HTMLElement | null;
      if (!t?.closest?.("a, button")) setIsHover(false);
    };

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);

    const tick = () => {
      const target = targetRef.current;
      const current = currentRef.current;
      currentRef.current = {
        x: current.x + (target.x - current.x) * LERP,
        y: current.y + (target.y - current.y) * LERP,
      };
      setPos({ ...currentRef.current });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!mounted || typeof window === "undefined") return null;

  const size = isHover ? SIZE_HOVER : SIZE;
  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
      aria-hidden
    >
      <div
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          borderRadius: "50%",
      border: "1.5px solid rgba(139,92,246,0.8)",
      opacity: isHover ? 0.9 : 0.7,
          backgroundColor: isHover ? "rgba(139,92,246,0.15)" : "transparent",
          transition: "width 0.2s, height 0.2s, background-color 0.2s",
        }}
      />
    </div>
  );
}

export const CustomCursor = memo(CustomCursorInner);
