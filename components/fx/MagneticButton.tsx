"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/lib/motion";
import { clamp } from "@/lib/motion/utils";

const MAGNETIC_STRENGTH = 0.35;
const SPRING = { stiffness: 300, damping: 20 };

type Props = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  size?: "default" | "large";
  className?: string;
  onClick?: () => void;
};

export function MagneticButton({
  children,
  href,
  variant = "primary",
  size = "default",
  className = "",
  onClick,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);
  const reduced = useReducedMotion();
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * MAGNETIC_STRENGTH;
    const deltaY = (e.clientY - centerY) * MAGNETIC_STRENGTH;
    const maxD = 12;
    x.set(clamp(deltaX, -maxD, maxD));
    y.set(clamp(deltaY, -maxD, maxD));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus-visible:outline focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]";
  const variants = {
    primary:
      "bg-gradient-to-r from-[var(--accent)] to-[#7C3AED] text-[#09040F] shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:shadow-[0_0_28px_rgba(139,92,246,0.4)] hover:-translate-y-0.5 active:scale-[0.98]",
    secondary:
      "border border-[var(--accent)]/50 text-[var(--accent)] bg-transparent hover:bg-[var(--accent)]/10 hover:border-[var(--accent)] hover:shadow-[0_0_24px_rgba(139,92,246,0.25)] hover:-translate-y-0.5 active:scale-[0.98]",
  };
  const sizes = {
    default: "h-11 px-6 text-sm",
    large: "h-12 px-8 text-base",
  };

  const style = reduced
    ? undefined
    : { x: springX, y: springY };

  const inner = (
    <motion.span
      style={style}
      className={`inline-flex items-center justify-center ${base} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={reduced ? undefined : { scale: 1.02 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
    >
      {children}
    </motion.span>
  );

  const wrapper = (
    <div
      ref={ref}
      className="inline-block"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {inner}
    </div>
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} className="inline-block">
        {wrapper}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className="inline-block border-0 bg-transparent p-0 cursor-pointer">
      {wrapper}
    </button>
  );
}
