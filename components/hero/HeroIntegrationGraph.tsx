"use client";

import { useMemo, useRef } from "react";
import { useReducedMotion } from "@/lib/motion";
import { useQuality } from "@/hooks/useQuality";
import { useInViewport } from "@/hooks/useInViewport";
import { useFxLifecycle } from "@/hooks/useFxLifecycle";

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
const SIZE = 400;

function getPosition(index: number, total: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: CENTER.x + RADIUS * Math.cos(angle),
    y: CENTER.y + RADIUS * Math.sin(angle),
  };
}

/** Chip id (HeroServiceChips) -> node id for highlight sync */
export const CHIP_TO_NODE: Record<string, string> = {
  bots: "telegram",
  sites: "site",
  miniapps: "telegram",
  n8n: "n8n",
};

type HeroIntegrationGraphProps = {
  /** Node to highlight (e.g. from chip click) */
  highlightedNodeId?: string | null;
  className?: string;
};

export function HeroIntegrationGraph({
  highlightedNodeId = null,
  className = "",
}: HeroIntegrationGraphProps) {
  const reduced = useReducedMotion();
  const quality = useQuality();
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInViewport(containerRef);
  const fx = useFxLifecycle({ enabled: quality !== "low" && !reduced, isInViewport: inView });
  const lightFx = fx.isActive;
  const showPackets = lightFx && quality === "high";
  const showBreathing = lightFx;

  const positions = useMemo(
    () => NODES.map((_, i) => getPosition(i, NODES.length)),
    []
  );

  const activeNode = highlightedNodeId;

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 flex items-center justify-center md:justify-end md:pr-4 lg:pr-8 ${className}`}
      aria-hidden
      style={{ pointerEvents: "none" }}
    >
      <div
        className="relative w-full max-w-[280px] md:max-w-[360px] lg:max-w-[420px] aspect-square opacity-90 md:opacity-100"
        style={{ filter: "drop-shadow(0 0 32px rgba(86,240,255,0.14))" }}
      >
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-full w-full"
          aria-hidden
        >
          <defs>
            <linearGradient id="hero-ig-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#56F0FF" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#9B7BFF" stopOpacity="0.4" />
            </linearGradient>
            <radialGradient id="hero-ig-center-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#56F0FF" stopOpacity="0.2" />
              <stop offset="70%" stopColor="#56F0FF" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#56F0FF" stopOpacity="0" />
            </radialGradient>
            <filter id="hero-ig-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Depth: soft halo behind center */}
          {showBreathing && (
            <circle
              cx={CENTER.x}
              cy={CENTER.y}
              r={RADIUS + 24}
              fill="url(#hero-ig-center-glow)"
              className="integration-graph-breath"
            />
          )}

          {/* Lines: center → nodes (grouped for less DOM) */}
          <g strokeLinecap="round">
            {NODES.map((node, i) => {
              const pos = positions[i];
              const active = activeNode === node.id || activeNode === "center";
              return (
                <line
                  key={node.id}
                  x1={CENTER.x}
                  y1={CENTER.y}
                  x2={pos.x}
                  y2={pos.y}
                  stroke={active ? "rgba(86,240,255,0.45)" : "rgba(86,240,255,0.18)"}
                  strokeWidth={active ? 2 : 1.2}
                  className="transition-all duration-300"
                />
              );
            })}
          </g>

          {/* Center "AI" with glow */}
          <g filter="url(#hero-ig-glow)">
            <circle
              cx={CENTER.x}
              cy={CENTER.y}
              r={36}
              fill="rgba(86,240,255,0.12)"
              stroke="rgba(86,240,255,0.4)"
              strokeWidth="1.5"
            />
            <circle
              cx={CENTER.x}
              cy={CENTER.y}
              r={28}
              fill="rgba(7,10,15,0.6)"
              stroke="rgba(86,240,255,0.5)"
              strokeWidth="1"
            />
            <text
              x={CENTER.x}
              y={CENTER.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-[#56F0FF] text-sm font-bold"
            >
              AI
            </text>
          </g>

          {/* Orbit nodes (pointer-events on wrapper for hover) */}
          {NODES.map((node, i) => {
            const pos = positions[i];
            const isActive = activeNode === node.id;
            return (
              <g key={node.id}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isActive ? 18 : 14}
                  fill="rgba(10,15,28,0.95)"
                  stroke={isActive ? "#56F0FF" : "rgba(86,240,255,0.45)"}
                  strokeWidth={isActive ? 2 : 1}
                  className="transition-all duration-200"
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-[#E9ECF5] text-[10px] font-medium pointer-events-none"
                >
                  {node.label}
                </text>
              </g>
            );
          })}

          {/* Data packets: 2–3 dots along lines (high quality only, slow) */}
          {showPackets &&
            NODES.slice(0, 2).map((_, i) => (
              <circle key={`pkt-${i}`} r="3" fill="#56F0FF" opacity="0.9">
                <animateMotion
                  dur={`${4 + i * 0.8}s`}
                  repeatCount="indefinite"
                  path={`M ${CENTER.x} ${CENTER.y} L ${positions[i].x} ${positions[i].y}`}
                />
              </circle>
            ))}
        </svg>
      </div>
    </div>
  );
}
