"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/motion";
import { useInViewport } from "@/hooks/useInViewport";
import { useFxLifecycle } from "@/hooks/useFxLifecycle";

/**
 * Animated "data packets" flowing along lines toward center (CRM).
 * Lightweight SVG animation; disabled when prefers-reduced-motion.
 */
export function DataStreams() {
  const reduced = useReducedMotion();
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInViewport(ref);
  const fx = useFxLifecycle({ enabled: !reduced, isInViewport: inView });

  if (!fx.isActive) return null;

  const paths = [
    "M 80 80 Q 200 80 200 200",
    "M 320 80 Q 200 80 200 200",
    "M 80 320 Q 200 320 200 200",
    "M 320 320 Q 200 320 200 200",
  ];

  return (
    <svg
      ref={ref}
      viewBox="0 0 400 400"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-30"
      aria-hidden
    >
      <defs>
        <linearGradient id="streamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
          <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
        </linearGradient>
      </defs>
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="url(#streamGrad)"
          strokeWidth="1"
          strokeDasharray="4 8"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-24"
            dur={`${1.5 + i * 0.2}s`}
            repeatCount="indefinite"
          />
        </path>
      ))}
      {/* Small "packet" circles moving along path - simplified as opacity pulse at center */}
      <motion.circle
        cx="200"
        cy="200"
        r="4"
        fill="#8B5CF6"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}
