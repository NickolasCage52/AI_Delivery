"use client";

import { useMemo } from "react";

/** Simplified integration graph as logo mark: center + 4 nodes + 4 lines. Readable at 24–32px. */
const CENTER = { x: 16, y: 16 };
const R = 10;
const NODE_ANGLES = [0, 90, 180, 270].map((d) => (d * Math.PI) / 180);

function getPos(angle: number) {
  return {
    x: CENTER.x + R * Math.cos(angle),
    y: CENTER.y + R * Math.sin(angle),
  };
}

const positions = NODE_ANGLES.map(getPos);

type LogoMarkProps = {
  size?: number;
  className?: string;
  /** Slightly brighter on hover */
  hover?: boolean;
};

export function LogoMark({ size = 32, className = "", hover = false }: LogoMarkProps) {
  const stroke = hover ? "rgba(139,92,246,0.9)" : "rgba(139,92,246,0.7)";
  const centerFill = hover ? "rgba(236,72,153,0.18)" : "rgba(139,92,246,0.1)";

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      {/* 4 lines: center to nodes */}
      {positions.map((pos, i) => (
        <line
          key={i}
          x1={CENTER.x}
          y1={CENTER.y}
          x2={pos.x}
          y2={pos.y}
          stroke={stroke}
          strokeWidth="1"
          fill="none"
        />
      ))}
      {/* Center circle */}
      <circle
        cx={CENTER.x}
        cy={CENTER.y}
        r={5}
        fill={centerFill}
        stroke={stroke}
        strokeWidth="1"
      />
      {/* 4 nodes */}
      {positions.map((pos, i) => (
        <circle
          key={i}
          cx={pos.x}
          cy={pos.y}
          r={2.5}
          fill="rgba(11,6,32,0.95)"
          stroke={stroke}
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}
