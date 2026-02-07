"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/motion";

const ITEMS = [
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

export function OrbitIntegrations() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const positions = ITEMS.map((_, i) => getPosition(i, ITEMS.length));

  return (
    <div className="relative flex justify-center py-12">
      <svg
        ref={svgRef}
        viewBox="0 0 400 400"
        className="h-[280px] w-full max-w-[400px] md:h-[320px]"
        aria-hidden
      >
        {/* Lines between points (constellation) - highlight on hover */}
        {!reduced &&
          ITEMS.map((a, i) =>
            ITEMS.slice(i + 1).map((b, j) => {
              const idxA = i;
              const idxB = i + 1 + j;
              const posA = positions[idxA];
              const posB = positions[idxB];
              const isActive = hovered === a.id || hovered === b.id;
              return (
                <line
                  key={`${a.id}-${b.id}`}
                  x1={posA.x}
                  y1={posA.y}
                  x2={posB.x}
                  y2={posB.y}
                  stroke="rgba(139,92,246,0.15)"
                  strokeWidth={isActive ? 1.5 : 0.5}
                  className="transition-all duration-300"
                />
              );
            })
          )}
        {/* Center "AI Delivery" */}
        <g>
          <circle
            cx={CENTER.x}
            cy={CENTER.y}
            r={28}
            fill="rgba(139,92,246,0.08)"
            stroke="rgba(139,92,246,0.25)"
            strokeWidth="1"
          />
          <text
            x={CENTER.x}
            y={CENTER.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-[#8B5CF6] text-[8px] font-semibold"
          >
            AI
          </text>
        </g>
        {/* Orbit nodes */}
        {ITEMS.map((item, i) => {
          const pos = positions[i];
          const isHovered = hovered === item.id;
          return (
            <g
              key={item.id}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "default" }}
            >
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={isHovered ? 20 : 14}
                fill="rgba(11,6,32,0.9)"
                stroke={isHovered ? "#8B5CF6" : "rgba(139,92,246,0.4)"}
                strokeWidth={isHovered ? 2 : 1}
                className="transition-colors duration-200"
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-[#F3F4F6] text-[10px] font-medium"
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
