"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { useReducedMotion } from "@/lib/motion";
import { useQuality } from "@/hooks/useQuality";

const NODES = [
  { id: "n8n", label: "n8n" },
  { id: "telegram", label: "Telegram" },
  { id: "crm", label: "CRM" },
  { id: "sheets", label: "Sheets" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "site", label: "Сайт" },
  { id: "analytics", label: "Аналитика" },
];

const RADIUS = 140;
const CENTER = { x: 200, y: 200 };

function getPosition(index: number, total: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: CENTER.x + RADIUS * Math.cos(angle),
    y: CENTER.y + RADIUS * Math.sin(angle),
  };
}

/** Lines from center to each node (for data packets) */
function getLinePath(cx: number, cy: number, px: number, py: number) {
  return `M ${cx} ${cy} L ${px} ${py}`;
}

type IntegrationGraphProps = {
  /** Opacity of the whole graph (e.g. 0.12 for Hero background) */
  opacity?: number;
  /** Show labels on nodes */
  showLabels?: boolean;
  /** Size / viewBox scale */
  size?: number;
  /** Optional className for wrapper */
  className?: string;
  /** Simplified: fewer lines, no data packets (for mobile/low quality) */
  simplified?: boolean;
  /** Variant: full (integrations section) or minimal (Hero background) */
  variant?: "full" | "minimal";
};

export function IntegrationGraph({
  opacity = 1,
  showLabels = true,
  size = 400,
  className = "",
  simplified = false,
  variant = "full",
}: IntegrationGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const quality = useQuality();
  const lightFx = quality !== "low" && !reduced;
  const packetCount = quality === "high" ? 4 : quality === "medium" ? 2 : 0;

  const positions = useMemo(
    () => NODES.map((_, i) => getPosition(i, NODES.length)),
    []
  );

  const showDataPackets = lightFx && packetCount > 0 && !simplified && variant === "full";
  const showBreathing = lightFx && !simplified && variant === "full";

  return (
    <div className={`relative flex justify-center ${className}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${size} ${size}`}
        className="h-full w-full max-h-[320px] max-w-[400px] md:max-h-[360px]"
        style={{ opacity }}
        aria-hidden
      >
        <defs>
          <linearGradient id="ig-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#56F0FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#9B7BFF" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="ig-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#56F0FF" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#56F0FF" stopOpacity="0.05" />
          </linearGradient>
          <filter id="ig-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Lines: center to each node (full = interactive hover; minimal = static) */}
        {NODES.map((node, i) => {
          const pos = positions[i];
          const active = variant === "full" && (hovered === node.id || hovered === "center");
          return (
            <line
              key={`line-${node.id}`}
              x1={CENTER.x}
              y1={CENTER.y}
              x2={pos.x}
              y2={pos.y}
              stroke={active ? "rgba(86,240,255,0.35)" : "rgba(86,240,255,0.12)"}
              strokeWidth={active ? 1.5 : 0.8}
              className="transition-all duration-300"
            />
          );
        })}

        {/* Center "AI" node with optional breathing glow */}
        <g
          onMouseEnter={() => variant === "full" && setHovered("center")}
          onMouseLeave={() => variant === "full" && setHovered(null)}
          style={{ cursor: variant === "full" ? "default" : "inherit" }}
        >
          {showBreathing && (
            <circle
              cx={CENTER.x}
              cy={CENTER.y}
              r={32}
              fill="rgba(86,240,255,0.06)"
              className="animate-[breath_4s_ease-in-out_infinite]"
            />
          )}
          <circle
            cx={CENTER.x}
            cy={CENTER.y}
            r={28}
            fill="rgba(86,240,255,0.08)"
            stroke="rgba(86,240,255,0.3)"
            strokeWidth="1"
          />
          <text
            x={CENTER.x}
            y={CENTER.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-[#56F0FF] text-[10px] font-semibold"
          >
            AI
          </text>
        </g>

        {/* Orbit nodes */}
        {NODES.map((node, i) => {
          const pos = positions[i];
          const isHovered = hovered === node.id;
          return (
            <g
              key={node.id}
              onMouseEnter={() => variant === "full" && setHovered(node.id)}
              onMouseLeave={() => variant === "full" && setHovered(null)}
              style={{ cursor: variant === "full" ? "default" : "inherit" }}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isHovered ? 20 : 14}
                fill="rgba(10,15,28,0.9)"
                stroke={isHovered ? "#56F0FF" : "rgba(86,240,255,0.4)"}
                strokeWidth={isHovered ? 2 : 1}
                className="transition-all duration-200"
              />
              {showLabels && (
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-[#E9ECF5] text-[10px] font-medium"
                >
                  {node.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Data packets: small circles moving along lines (quality + full only) */}
        {showDataPackets &&
          NODES.slice(0, packetCount).map((_, i) => (
            <circle key={`packet-${i}`} r="3" fill="#56F0FF" opacity="0.8">
              <animateMotion
                dur={`${2.5 + i * 0.3}s`}
                repeatCount="indefinite"
                path={getLinePath(CENTER.x, CENTER.y, positions[i].x, positions[i].y)}
              />
            </circle>
          ))}
      </svg>
    </div>
  );
}
