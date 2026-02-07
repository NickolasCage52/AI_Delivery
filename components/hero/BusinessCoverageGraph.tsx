"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useReducedMotion } from "@/lib/motion";
import { useElementSize } from "@/hooks/useElementSize";
import { polarToCartesian } from "@/lib/geometry/polar";
import { useQuality } from "@/hooks/useQuality";

type CoverageNode = {
  id: string;
  label: string;
  labelCompact?: string;
  summary: string;
  impact: string;
  anchor: "sites" | "n8n" | "bots" | "miniapps";
  services: Array<"Сайты" | "n8n" | "Боты" | "MiniApps">;
  angleOffset?: number;
  radiusOffset?: number;
};

const NODES: CoverageNode[] = [
  {
    id: "leads",
    label: "Лиды и маркетинг",
    labelCompact: "Лиды",
    summary: "Сбор лидов, сегментация, триггеры и быстрые гипотезы.",
    impact: "Сайт + бот + n8n",
    anchor: "sites",
    services: ["Сайты", "Боты", "n8n"],
  },
  {
    id: "sales",
    label: "Продажи и CRM",
    labelCompact: "CRM",
    summary: "Квалификация, скрипты, статусы и авто-задачи для менеджера.",
    impact: "n8n + бот",
    anchor: "n8n",
    services: ["n8n", "Боты"],
  },
  {
    id: "support",
    label: "Поддержка 24/7",
    labelCompact: "Поддержка",
    summary: "FAQ, статус-боты, авто-ответы и маршрутизация тикетов.",
    impact: "бот",
    anchor: "bots",
    services: ["Боты"],
  },
  {
    id: "operations",
    label: "Операции",
    labelCompact: "Операции",
    summary: "Передачи, постановка задач, напоминания и SLA без ручного труда.",
    impact: "n8n",
    anchor: "n8n",
    services: ["n8n"],
  },
  {
    id: "analytics",
    label: "Аналитика",
    labelCompact: "Аналитика",
    summary: "Сводки, дашборды, weekly-репорты и контроль показателей.",
    impact: "n8n + сайт",
    anchor: "n8n",
    services: ["n8n", "Сайты"],
  },
  {
    id: "content",
    label: "Контент/продукт",
    labelCompact: "Контент",
    summary: "Каталоги, карточки, анкеты и обновления ассортимента.",
    impact: "MiniApp + сайт",
    anchor: "miniapps",
    services: ["MiniApps", "Сайты"],
  },
  {
    id: "comms",
    label: "Коммуникации",
    labelCompact: "Коммуникации",
    summary: "Telegram/WhatsApp, рассылки и единый диалог с клиентом.",
    impact: "бот + n8n",
    anchor: "bots",
    services: ["Боты", "n8n"],
  },
  {
    id: "docs",
    label: "Документы и КП",
    labelCompact: "КП/Документы",
    summary: "Генерация КП, согласования и автосборки документов.",
    impact: "n8n + MiniApp",
    anchor: "n8n",
    services: ["n8n", "MiniApps"],
  },
];

const EDGES = [
  { from: "core", to: "leads" },
  { from: "core", to: "sales" },
  { from: "core", to: "operations" },
  { from: "core", to: "analytics" },
  { from: "core", to: "support" },
  { from: "core", to: "content" },
  { from: "core", to: "comms" },
  { from: "core", to: "docs" },
  { from: "leads", to: "sales" },
  { from: "sales", to: "support" },
  { from: "support", to: "comms" },
  { from: "comms", to: "leads" },
  { from: "operations", to: "docs" },
  { from: "docs", to: "content" },
  { from: "content", to: "analytics" },
  { from: "analytics", to: "operations" },
  { from: "sales", to: "docs" },
];

const PACKET_EDGES = [0, 4, 6, 10];

const ORBIT_START_ANGLE = -115;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function splitLabel(text: string, maxChars: number, maxLines: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars || current.length === 0) {
      current = next;
      return;
    }
    lines.push(current);
    current = word;
  });

  if (current) lines.push(current);

  if (lines.length > maxLines) {
    const trimmed = lines.slice(0, maxLines);
    trimmed[maxLines - 1] = `${trimmed[maxLines - 1].slice(0, Math.max(0, maxChars - 1))}…`;
    return trimmed;
  }

  return lines;
}

function getTooltipPosition({
  size,
  nodeRadius,
  tooltipWidth,
  tooltipHeight,
  center,
  pos,
}: {
  size: number;
  nodeRadius: number;
  tooltipWidth: number;
  tooltipHeight: number;
  center: { x: number; y: number };
  pos: { x: number; y: number };
}) {
  const dx = pos.x - center.x;
  const dy = pos.y - center.y;
  const offset = nodeRadius + clamp(size * 0.03, 12, 18);
  let x = dx >= 0 ? pos.x + offset : pos.x - offset - tooltipWidth;
  let y = pos.y - tooltipHeight / 2;

  x = clamp(x, 8, size - tooltipWidth - 8);
  y = clamp(y, 8, size - tooltipHeight - 8);

  return { x, y };
}

type Layout = {
  size: number;
  center: { x: number; y: number };
  nodeRadius: number;
  coreRadius: number;
  coreInnerRadius: number;
  positions: Map<string, { x: number; y: number; angle: number }>;
  hoverScale: number;
  labelFontSize: number;
  labelLineHeight: number;
  maxChars: number;
  useTwoOrbits: boolean;
};

type BusinessNodeProps = {
  node: CoverageNode;
  position: { x: number; y: number };
  layout: Layout;
  compact: boolean;
  isActive: boolean;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onClick: (anchor: CoverageNode["anchor"]) => void;
};

function BusinessNode({
  node,
  position,
  layout,
  compact,
  isActive,
  isHovered,
  onHover,
  onClick,
}: BusinessNodeProps) {
  const label = compact && node.labelCompact ? node.labelCompact : node.label;
  const lines = splitLabel(label, layout.maxChars, 2);
  const fontSize = layout.labelFontSize;
  const lineHeight = layout.labelLineHeight;
  const textYOffset = lines.length === 2 ? -lineHeight * 0.45 : 0;

  return (
    <g
      className="cursor-pointer outline-none"
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(node.anchor)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(node.anchor);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${node.label}. Перейти к решению`}
      style={{ pointerEvents: "all" }}
    >
      <circle
        cx={position.x}
        cy={position.y}
        r={layout.nodeRadius}
        fill="var(--bg-elevated)"
        stroke={isHovered ? "var(--accent)" : isActive ? "rgba(139,92,246,0.55)" : "rgba(255,255,255,0.2)"}
        strokeWidth={isHovered ? clamp(layout.size * 0.003, 1.4, 2) : clamp(layout.size * 0.002, 1, 1.4)}
        className="transition-all duration-200"
        style={{
          transform: isHovered ? `scale(${layout.hoverScale})` : "scale(1)",
          transformOrigin: `${position.x}px ${position.y}px`,
        }}
      />
      <text
        x={position.x}
        y={position.y + textYOffset}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-[var(--text-primary)] font-semibold"
        style={{ fontSize, lineHeight }}
      >
        {lines.map((line, idx) => (
          <tspan key={`${node.id}-line-${idx}`} x={position.x} dy={idx === 0 ? 0 : lineHeight}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

type GraphEdgesProps = {
  edges: typeof EDGES;
  layout: Layout;
  hoveredId: string | null;
  showPackets: boolean;
  packetEdges: number[];
};

function GraphEdges({ edges, layout, hoveredId, showPackets, packetEdges }: GraphEdgesProps) {
  return (
    <>
      {edges.map((edge, i) => {
        const from = layout.positions.get(edge.from)!;
        const to = layout.positions.get(edge.to)!;
        const active = hoveredId ? edge.from === hoveredId || edge.to === hoveredId : false;
        return (
          <line
            key={`${edge.from}-${edge.to}-${i}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={active ? "url(#bcg-line-active)" : "url(#bcg-line)"}
            strokeWidth={active ? clamp(layout.size * 0.0032, 1.3, 2.4) : clamp(layout.size * 0.0022, 1, 1.6)}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        );
      })}
      {showPackets &&
        packetEdges.map((edgeIndex, idx) => {
          const edge = edges[edgeIndex];
          const from = layout.positions.get(edge.from)!;
          const to = layout.positions.get(edge.to)!;
          const pathD = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
          return (
            <circle key={`packet-${edgeIndex}`} r={clamp(layout.size * 0.006, 2.5, 4)} fill="var(--accent)" opacity="0.9">
              <animateMotion
                dur={`${3 + idx * 0.6}s`}
                begin={`${idx * 0.8}s`}
                repeatCount="indefinite"
                path={pathD}
              />
            </circle>
          );
        })}
    </>
  );
}

export function BusinessCoverageGraph() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const quality = useQuality();
  const pathname = usePathname();
  const router = useRouter();
  const { ref: containerRef, size } = useElementSize<HTMLDivElement>(520);
  const compact = size <= 440;
  const packetCount = quality === "high" ? PACKET_EDGES.length : quality === "medium" ? 2 : 0;
  const packetEdges = useMemo(() => PACKET_EDGES.slice(0, packetCount), [packetCount]);
  const showPackets = !reduced && !compact && packetCount > 0;

  const layout = useMemo(() => {
    const center = { x: size / 2, y: size / 2 };
    const useTwoOrbits = NODES.length >= 8 && size <= 500;
    const outerRadius = size * 0.41;
    const innerRadius = size * 0.28;
    const orbitRadius = size * 0.39;
    const nodeRadius = clamp(size * 0.088, 32, 54);
    const hoverScale = compact ? 1.03 : 1.05;
    const coreRadius = clamp(size * 0.125, 54, 70);
    const coreInnerRadius = coreRadius * 0.72;
    const labelFontSize = clamp(size * 0.022, 10, 13);
    const labelLineHeight = labelFontSize * 1.15;
    const maxChars = compact ? 10 : 16;
    const positions = new Map<string, { x: number; y: number; angle: number }>();

    if (useTwoOrbits) {
      const outerCount = Math.ceil(NODES.length / 2);
      const innerCount = NODES.length - outerCount;
      const outerStep = 360 / outerCount;
      const innerStep = 360 / Math.max(innerCount, 1);

      NODES.slice(0, outerCount).forEach((node, i) => {
        const angle = (ORBIT_START_ANGLE + i * outerStep + (node.angleOffset ?? 0)) * (Math.PI / 180);
        const radius = outerRadius + (node.radiusOffset ?? 0);
        const pos = polarToCartesian(center, radius, angle);
        positions.set(node.id, { ...pos, angle });
      });

      NODES.slice(outerCount).forEach((node, i) => {
        const angle = (ORBIT_START_ANGLE + outerStep / 2 + i * innerStep + (node.angleOffset ?? 0)) * (Math.PI / 180);
        const radius = innerRadius + (node.radiusOffset ?? 0);
        const pos = polarToCartesian(center, radius, angle);
        positions.set(node.id, { ...pos, angle });
      });
    } else {
      const step = 360 / NODES.length;
      NODES.forEach((node, i) => {
        const angle = (ORBIT_START_ANGLE + i * step + (node.angleOffset ?? 0)) * (Math.PI / 180);
        const radius = orbitRadius + (node.radiusOffset ?? 0);
        const pos = polarToCartesian(center, radius, angle);
        positions.set(node.id, { ...pos, angle });
      });
    }

    positions.set("core", { x: center.x, y: center.y, angle: 0 });

    return {
      size,
      center,
      nodeRadius,
      coreRadius,
      coreInnerRadius,
      positions,
      hoverScale,
      labelFontSize,
      labelLineHeight,
      maxChars,
      useTwoOrbits,
    };
  }, [compact, size]);

  const activeNode = hoveredId ? NODES.find((n) => n.id === hoveredId) : null;
  const activeNodes = useMemo(() => {
    if (!hoveredId) return new Set<string>();
    const connected = new Set<string>([hoveredId, "core"]);
    EDGES.forEach((edge) => {
      if (edge.from === hoveredId || edge.to === hoveredId) {
        connected.add(edge.from);
        connected.add(edge.to);
      }
    });
    return connected;
  }, [hoveredId]);

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
    (anchor: CoverageNode["anchor"]) => {
      if (pathname === "/") {
        scrollToSection(anchor);
        return;
      }
      router.push(`/services#${anchor}`);
    },
    [pathname, router, scrollToSection]
  );

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center w-[clamp(320px,86vw,420px)] sm:w-[clamp(360px,70vw,520px)] lg:w-[clamp(360px,44vw,560px)] aspect-square select-none"
    >
      <svg
        viewBox={`0 0 ${layout.size} ${layout.size}`}
        className="w-full h-full drop-shadow-[0_0_50px_rgba(139,92,246,0.18)]"
        aria-hidden
      >
        <defs>
          <linearGradient id="bcg-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--accent-pink)" stopOpacity="0.16" />
          </linearGradient>
          <linearGradient id="bcg-line-active" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.65" />
            <stop offset="100%" stopColor="var(--accent-pink)" stopOpacity="0.55" />
          </linearGradient>
          <radialGradient id="bcg-core-glow" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
            <stop offset="70%" stopColor="var(--accent)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
          <filter id="bcg-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={layout.center.x}
          cy={layout.center.y}
          r={(layout.useTwoOrbits ? layout.size * 0.44 : layout.size * 0.42) + layout.nodeRadius * 0.45}
          fill="url(#bcg-core-glow)"
          className={reduced ? "" : "origin-center animate-[pulse_5s_ease-in-out_infinite]"}
        />

        <GraphEdges
          edges={EDGES}
          layout={layout}
          hoveredId={hoveredId}
          showPackets={showPackets}
          packetEdges={packetEdges}
        />

        {/* Core */}
        <g
          filter="url(#bcg-glow)"
          onMouseEnter={() => setHoveredId(null)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <circle
            cx={layout.center.x}
            cy={layout.center.y}
            r={layout.coreRadius}
            fill="rgba(0,0,0,0.2)"
            stroke="var(--accent)"
            strokeWidth={clamp(layout.size * 0.003, 1.2, 1.8)}
          />
          <circle
            cx={layout.center.x}
            cy={layout.center.y}
            r={layout.coreInnerRadius}
            fill="var(--bg-elevated)"
            stroke="var(--accent)"
            strokeWidth={clamp(layout.size * 0.002, 0.9, 1.4)}
          />
          <text
            x={layout.center.x}
            y={layout.center.y - clamp(layout.size * 0.01, 4, 6)}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-[var(--text-primary)] font-semibold"
            style={{ fontSize: clamp(layout.size * 0.028, 12, 16) }}
          >
            AI Delivery
          </text>
          <text
            x={layout.center.x}
            y={layout.center.y + clamp(layout.size * 0.02, 9, 12)}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-[var(--text-muted)] font-medium"
            style={{ fontSize: clamp(layout.size * 0.022, 10, 12) }}
          >
            AI Core
          </text>
        </g>

        {NODES.map((node) => {
          const pos = layout.positions.get(node.id)!;
          const isActive = hoveredId ? activeNodes.has(node.id) : false;
          const isHovered = hoveredId === node.id;
          return (
            <BusinessNode
              key={node.id}
              node={node}
              position={pos}
              layout={layout}
              compact={compact}
              isActive={isActive}
              isHovered={isHovered}
              onHover={setHoveredId}
              onClick={handleNodeClick}
            />
          );
        })}
      </svg>

      {activeNode && (() => {
        const pos = layout.positions.get(activeNode.id)!;
        const tooltipWidth = clamp(layout.size * 0.5, 200, 260);
        const tooltipHeight = clamp(layout.size * 0.22, 120, 160);
        const tooltipPos = getTooltipPosition({
          size: layout.size,
          nodeRadius: layout.nodeRadius,
          tooltipWidth,
          tooltipHeight,
          center: layout.center,
          pos,
        });

        return (
          <div
            className="absolute rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/95 p-4 text-xs text-[var(--text-secondary)] shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
            style={{
              width: tooltipWidth,
              height: tooltipHeight,
              left: tooltipPos.x,
              top: tooltipPos.y,
            }}
            onMouseEnter={() => setHoveredId(activeNode.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="text-[11px] uppercase tracking-widest text-[var(--accent)]">{activeNode.label}</div>
            <div className="mt-1 text-sm text-[var(--text-primary)]">{activeNode.summary}</div>
            <button
              type="button"
              onClick={() => handleNodeClick(activeNode.anchor)}
              className="mt-3 flex w-full items-center justify-between rounded-full border border-[var(--accent)]/40 px-3 py-1 text-[10px] uppercase tracking-widest text-[var(--accent)] transition hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
            >
              <span>Перейти к решению</span>
              <span aria-hidden>↗</span>
            </button>
          </div>
        );
      })()}
    </div>
  );
}
