"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/motion";
import { useQuality } from "@/hooks/useQuality";
import { useInViewport } from "@/hooks/useInViewport";
import { useFxLifecycle } from "@/hooks/useFxLifecycle";

const CENTER = { x: 200, y: 200 };
const NODE_RADIUS = 140;
const SIZE = 400;

const NODES = [
  {
    id: "sites",
    slug: "sites",
    label: "Сайты",
    hoverLabel: "Лендинг под трафик за 48–72 часа",
    timing: "3–7 дней / 48–72ч",
    tooltip: "Лендинг или многостраничник под ваш трафик",
  },
  {
    id: "n8n",
    slug: "n8n",
    label: "n8n-автоматизации",
    hoverLabel: "Лиды → CRM → отчёты за 5–7 дней",
    timing: "5–7 дней",
    tooltip: "Автоматизация лидов, CRM и отчётов",
  },
  {
    id: "bots",
    slug: "bots",
    label: "Боты",
    hoverLabel: "Лиды и поддержка 24/7 за 5–7 дней",
    timing: "5–7 дней",
    tooltip: "Сбор лидов и поддержка в мессенджерах",
  },
  {
    id: "miniapps",
    slug: "miniapps",
    label: "Telegram MiniApps",
    hoverLabel: "MVP каталога/анкеты за 3–5 дней",
    timing: "3–5 дней",
    tooltip: "Мини-приложение: каталог, анкеты, формы",
  },
] as const;

function getNodePosition(index: number) {
  const angle = (index / 4) * Math.PI * 2 - Math.PI / 2;
  return {
    x: CENTER.x + NODE_RADIUS * Math.cos(angle),
    y: CENTER.y + NODE_RADIUS * Math.sin(angle),
  };
}

export function HeroServiceGraph() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const quality = useQuality();
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInViewport(containerRef);
  const fx = useFxLifecycle({ enabled: !reduced && quality !== "low", isInViewport: inView });
  const showParticles = fx.isActive;
  const particleCount = quality === "high" ? 1 : 1;

  const positions = useMemo(() => NODES.map((_, i) => getNodePosition(i)), []);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("section-highlight");
    const t = setTimeout(() => {
      el.classList.remove("section-highlight");
    }, 800);
    return () => clearTimeout(t);
  }, []);

  const handleNodeClick = useCallback(
    (slug: string) => {
      scrollToSection(slug);
    },
    [scrollToSection]
  );

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full max-w-[380px] md:max-w-[420px] mx-auto aspect-square select-none"
      role="group"
      aria-label="Граф направлений и сроков"
    >
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full h-full drop-shadow-[0_0_32px_var(--hero-glow,rgba(86,240,255,0.1))]"
      >
        <defs>
          <linearGradient id="hero-sg-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent, #56F0FF)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--accent2, #9B7BFF)" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="hero-sg-line-active" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent, #56F0FF)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--accent2, #9B7BFF)" stopOpacity="0.5" />
          </linearGradient>
          <radialGradient id="hero-sg-center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent, #56F0FF)" stopOpacity="0.2" />
            <stop offset="70%" stopColor="var(--accent, #56F0FF)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="var(--accent, #56F0FF)" stopOpacity="0" />
          </radialGradient>
          <filter id="hero-sg-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Soft halo behind center */}
        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r={NODE_RADIUS + 20}
          fill="url(#hero-sg-center-glow)"
          className={!fx.isActive ? "" : "origin-center animate-[pulse_4s_ease-in-out_infinite]"}
        />

        {/* Branches: line + particles per node */}
        {NODES.map((node, i) => {
          const pos = positions[i];
          const active = hoveredId === node.slug;
          const pathD = `M ${CENTER.x} ${CENTER.y} L ${pos.x} ${pos.y}`;
          return (
            <g key={node.slug} className={active ? "branch-active" : ""}>
              <line
                x1={CENTER.x}
                y1={CENTER.y}
                x2={pos.x}
                y2={pos.y}
                stroke={active ? "url(#hero-sg-line-active)" : "url(#hero-sg-line)"}
                strokeWidth={active ? 2 : 1.2}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
              {showParticles && (
                <>
                  <circle r="4" fill="var(--accent, #56F0FF)" opacity="0.9" className="hero-particle">
                    <animateMotion
                      dur="2.8s"
                      repeatCount="indefinite"
                      path={pathD}
                      keyTimes="0;1"
                      keySplines="0.25 0.1 0.25 1"
                    />
                  </circle>
                  {particleCount > 1 && (
                    <circle r="3" fill="var(--accent2, #9B7BFF)" opacity="0.7" className="hero-particle hero-particle-2">
                      <animateMotion
                        dur="3.2s"
                        repeatCount="indefinite"
                        begin="1.4s"
                        path={pathD}
                        keyTimes="0;1"
                        keySplines="0.25 0.1 0.25 1"
                      />
                    </circle>
                  )}
                </>
              )}
            </g>
          );
        })}

        {/* Center "AI" */}
        <g filter="url(#hero-sg-glow)">
          <circle
            cx={CENTER.x}
            cy={CENTER.y}
            r={40}
            fill="rgba(0,0,0,0.25)"
            stroke="var(--accent, #56F0FF)"
            strokeWidth="1.5"
            className="stroke-[length:0.4]"
          />
          <circle
            cx={CENTER.x}
            cy={CENTER.y}
            r={32}
            fill="var(--bg-secondary, #0A0F1C)"
            stroke="var(--accent, #56F0FF)"
            strokeWidth="1"
            opacity="0.95"
          />
          <text
            x={CENTER.x}
            y={CENTER.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-[var(--accent,#56F0FF)] text-base font-bold"
          >
            AI
          </text>
        </g>

        {/* Nodes (clickable groups) */}
        {NODES.map((node, i) => {
          const pos = positions[i];
          const isHovered = hoveredId === node.slug;
          const r = 42;
          return (
            <g
              key={node.slug}
              className="cursor-pointer outline-none"
              style={{ pointerEvents: "all" }}
              onMouseEnter={() => setHoveredId(node.slug)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(node.slug)}
              onBlur={() => setHoveredId(null)}
              onClick={() => handleNodeClick(node.slug)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleNodeClick(node.slug);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`${node.label}, ${node.tooltip}. Перейти к секции`}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={r + 6}
                fill="transparent"
              />
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isHovered ? r * 1.03 : r}
                fill="var(--bg-elevated, #0E131C)"
                stroke={isHovered ? "var(--accent, #56F0FF)" : "rgba(255,255,255,0.15)"}
                strokeWidth={isHovered ? 2 : 1}
                className="transition-all duration-200"
                style={{ willChange: "transform" }}
              />
              {isHovered && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={r + 10}
                  fill="none"
                  stroke="rgba(86,240,255,0.35)"
                  strokeWidth={1}
                />
              )}
              <g pointerEvents="none">
                {/* Idle: label + timing */}
                <text
                  x={pos.x}
                  y={pos.y - 6}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-[var(--text-primary,#E9ECF5)] text-[11px] font-semibold transition-opacity duration-200"
                  style={{ opacity: isHovered ? 0 : 1 }}
                >
                  {node.label}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-[var(--text-muted,#7A8299)] text-[9px] transition-opacity duration-200"
                  style={{ opacity: isHovered ? 0 : 1 }}
                >
                  {node.timing}
                </text>
                {/* Hover: longer description (fade) */}
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-[var(--text-primary,#E9ECF5)] text-[10px] font-medium transition-opacity duration-200"
                  style={{ opacity: isHovered ? 1 : 0 }}
                >
                  {node.hoverLabel}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Micro-tooltip on hover */}
      {hoveredId && (
        <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--accent)/0.3] text-[var(--text-secondary)] text-xs whitespace-nowrap pointer-events-none z-10 animate-[fadeIn_0.2s_ease-out_forwards]">
          {NODES.find((n) => n.slug === hoveredId)?.tooltip}
        </div>
      )}
    </div>
  );
}
