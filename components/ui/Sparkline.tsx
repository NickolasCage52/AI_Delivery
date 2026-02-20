"use client";

import { memo, useMemo } from "react";

export type SparklineProps = {
  /** Values in [0, 1] or any range — will be normalized for path */
  points: number[];
  width?: number;
  height?: number;
  stroke?: string;
  strokeWidth?: number;
  /** Animate path draw-in (stroke-dasharray) */
  animate?: boolean;
  className?: string;
  "aria-hidden"?: boolean;
};

function SparklineInner({
  points,
  width = 100,
  height = 18,
  stroke = "rgba(167,139,250,0.9)",
  strokeWidth = 1.4,
  animate = true,
  className = "",
  "aria-hidden": ariaHidden = true,
}: SparklineProps) {
  const { d, pathLength } = useMemo(() => {
    if (!points.length) return { d: "", pathLength: 0 };
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = Math.max(1e-9, max - min);
    const step = width / Math.max(1, points.length - 1);
    const pathParts = points.map((p, i) => {
      const x = i * step;
      const y = height - ((p - min) / range) * (height - 2) - 1;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    });
    const d = pathParts.join(" ");
    const pathLength =
      points.length < 2
        ? 0
        : points.slice(1).reduce((acc, p, i) => {
            const x0 = i * step;
            const x1 = (i + 1) * step;
            const y0 = height - ((points[i] - min) / range) * (height - 2) - 1;
            const y1 = height - ((p - min) / range) * (height - 2) - 1;
            return acc + Math.hypot(x1 - x0, y1 - y0);
          }, 0);
    return { d, pathLength };
  }, [points, width, height]);

  if (!points.length) return null;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden={ariaHidden}
    >
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...(animate && pathLength > 0
          ? {
              strokeDasharray: pathLength,
              strokeDashoffset: pathLength,
              style: {
                ["--sparkline-length" as string]: pathLength,
                animation: "sparkline-draw 0.14s ease-out forwards",
              } as React.CSSProperties,
            }
          : {})}
      />
    </svg>
  );
}

export const Sparkline = memo(SparklineInner);
