"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useReducedMotion } from "@/lib/motion";
import { useQuality } from "@/hooks/useQuality";

const CENTER = { x: 200, y: 200 };
const NODE_RADIUS = 140;
const SIZE = 400;

const NODES = [
  {
    id: "sites",
    label: "Сайты",
    hoverLabel: "Лендинг под трафик за 48–72 часа",
    tooltip: "Сайт или лендинг под ваш трафик",
  },
  {
    id: "n8n",
    label: "n8n‑автоматизации",
    hoverLabel: "Лиды → CRM → отчёты за 5–7 дней",
    tooltip: "Автоматизируем лиды, CRM и отчёты",
  },
  {
    id: "bots",
    label: "Боты",
    hoverLabel: "Лиды и поддержка 24/7 за 5–7 дней",
    tooltip: "Сбор лидов и поддержка в мессенджерах",
  },
  {
    id: "miniapps",
    label: "Telegram MiniApps",
    hoverLabel: "MVP каталога/анкеты за 3–5 дней",
    tooltip: "Мини‑приложение в Telegram",
  },
] as const;

function getNodePosition(index: number) {
  const angle = (index / 4) * Math.PI * 2 - Math.PI / 2;
  return {
    x: CENTER.x + NODE_RADIUS * Math.cos(angle),
    y: CENTER.y + NODE_RADIUS * Math.sin(angle),
  };
}

export function ServiceGraph() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const quality = useQuality();
  const pathname = usePathname();
  const router = useRouter();
  const showParticles = !reduced && quality !== "low";
  const particleCount = quality === "high" ? 2 : 1;

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
      if (pathname === "/") {
        scrollToSection(slug);
        return;
      }
      router.push(`/services#${slug}`);
    },
    [pathname, router, scrollToSection]
  );

  return (
    <div className="relative flex items-center justify-center w-full max-w-[420px] mx-auto aspect-square select-none">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-full drop-shadow-[0_0_40px_var(--hero-glow)]">
        <defs>
          <linearGradient id="sg-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--accent-pink)" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="sg-line-active" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent-strong)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--accent-pink-strong)" stopOpacity="0.6" />
          </linearGradient>
          <radialGradient id="sg-center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
            <stop offset="70%" stopColor="var(--accent)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
          <filter id="sg-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx={CENTER.x} cy={CENTER.y} r={NODE_RADIUS + 20} fill="url(#sg-center-glow)" className="origin-center animate-[pulse_4s_ease-in-out_infinite]" />

        {NODES.map((node, i) => {
          const pos = positions[i];
          const active = hoveredId === node.id;
          const pathD = `M ${CENTER.x} ${CENTER.y} L ${pos.x} ${pos.y}`;
          return (
            <g key={node.id}>
              <line
                x1={CENTER.x}
                y1={CENTER.y}
                x2={pos.x}
                y2={pos.y}
                stroke={active ? "url(#sg-line-active)" : "url(#sg-line)"}
                strokeWidth={active ? 2 : 1.2}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
              {showParticles && (
                <>
                  <circle r="3" fill="var(--accent)" opacity="0.9">
                    <animateMotion dur="2.8s" repeatCount="indefinite" path={pathD} />
                  </circle>
                  {particleCount > 1 && (
                    <circle r="2.5" fill="var(--accent-pink)" opacity="0.8">
                      <animateMotion dur="3.4s" begin="1.1s" repeatCount="indefinite" path={pathD} />
                    </circle>
                  )}
                </>
              )}
            </g>
          );
        })}

        <g filter="url(#sg-glow)">
          <circle cx={CENTER.x} cy={CENTER.y} r={40} fill="rgba(0,0,0,0.2)" stroke="var(--accent)" strokeWidth="1.5" />
          <circle cx={CENTER.x} cy={CENTER.y} r={32} fill="var(--bg-elevated)" stroke="var(--accent)" strokeWidth="1" opacity="0.95" />
          <text x={CENTER.x} y={CENTER.y} textAnchor="middle" dominantBaseline="middle" className="fill-[var(--accent)] text-base font-bold">
            AI
          </text>
        </g>

        {NODES.map((node, i) => {
          const pos = positions[i];
          const isHovered = hoveredId === node.id;
          const r = 38;
          return (
            <g
              key={node.id}
              className="cursor-pointer outline-none"
              style={{ pointerEvents: "all" }}
              onMouseEnter={() => setHoveredId(node.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleNodeClick(node.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleNodeClick(node.id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`${node.label}. Перейти к услуге`}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isHovered ? r * 1.03 : r}
                fill="var(--bg-elevated)"
                stroke={isHovered ? "var(--accent)" : "rgba(255,255,255,0.2)"}
                strokeWidth={isHovered ? 2 : 1}
                className="transition-all duration-200"
              />
              <g pointerEvents="none">
                <text
                  x={pos.x}
                  y={pos.y - 6}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-[var(--text-primary)] text-[11px] font-semibold transition-opacity duration-200"
                  style={{ opacity: isHovered ? 0 : 1 }}
                >
                  {node.label}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-[var(--text-muted)] text-[9px] transition-opacity duration-200"
                  style={{ opacity: isHovered ? 0 : 1 }}
                >
                  {node.id === "sites" ? "48–72ч" : node.id === "miniapps" ? "3–5 дней" : "5–7 дней"}
                </text>
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-[var(--text-primary)] text-[10px] font-medium transition-opacity duration-200"
                  style={{ opacity: isHovered ? 1 : 0 }}
                >
                  {node.hoverLabel}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {hoveredId && (
        <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--accent)]/40 text-[var(--text-secondary)] text-xs whitespace-nowrap pointer-events-none z-10">
          {NODES.find((n) => n.id === hoveredId)?.tooltip}
        </div>
      )}
    </div>
  );
}
