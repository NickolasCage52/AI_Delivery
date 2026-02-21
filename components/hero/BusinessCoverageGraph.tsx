"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useReducedMotion } from "@/lib/motion";
import { useElementSize } from "@/hooks/useElementSize";
import { useInViewport } from "@/hooks/useInViewport";
import { useFxLifecycle } from "@/hooks/useFxLifecycle";
import { polarToCartesian } from "@/lib/geometry/polar";
import { useQuality } from "@/hooks/useQuality";
import {
  type HeroNode,
  HERO_NODES,
  HERO_EDGES,
} from "@/lib/hero/graph";

const PACKET_EDGES = [0, 4, 6, 10];
const ORBIT_START_ANGLE = -115;
const ROTATION_SPEED = 12; // deg/sec
const CENTER_LERP = 0.06;

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
  compact,
}: {
  size: number;
  nodeRadius: number;
  tooltipWidth: number;
  tooltipHeight: number;
  center: { x: number; y: number };
  pos: { x: number; y: number };
  compact?: boolean;
}) {
  const dx = pos.x - center.x;
  const offset = nodeRadius + clamp(size * 0.03, 12, 18);
  let x = dx >= 0 ? pos.x + offset : pos.x - offset - tooltipWidth;
  let y = pos.y - tooltipHeight / 2;

  if (compact) {
    x = center.x - tooltipWidth / 2;
    y = size - tooltipHeight - 16;
  } else {
    x = clamp(x, 8, size - tooltipWidth - 8);
    y = clamp(y, 8, size - tooltipHeight - 8);
  }

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
  node: HeroNode;
  position: { x: number; y: number };
  layout: Layout;
  compact: boolean;
  isActive: boolean;
  isPulse: boolean;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onNodeClick: (node: HeroNode) => void;
};

function BusinessNode({
  node,
  position,
  layout,
  compact,
  isActive,
  isPulse,
  isHovered,
  onHover,
  onNodeClick,
}: BusinessNodeProps) {
  const label = compact && node.labelCompact ? node.labelCompact : node.title;
  const lines = splitLabel(label, layout.maxChars, 2);
  const fontSize = layout.labelFontSize;
  const lineHeight = layout.labelLineHeight;
  const textYOffset = lines.length === 2 ? -lineHeight * 0.45 : 0;
  const hitRadius = layout.nodeRadius + clamp(layout.size * 0.02, 8, 14);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onNodeClick(node);
    },
    [node, onNodeClick]
  );

  return (
    <g
      className="cursor-pointer outline-none"
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(node.id)}
      onBlur={() => onHover(null)}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onNodeClick(node);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${node.title}. Показать детали`}
      style={{ pointerEvents: "all" }}
    >
      <circle
        cx={position.x}
        cy={position.y}
        r={hitRadius}
        fill="transparent"
      />
      <circle
        cx={position.x}
        cy={position.y}
        r={layout.nodeRadius}
        fill="var(--bg-elevated)"
        stroke={
          isHovered
            ? "var(--accent)"
            : isActive
              ? "rgba(139,92,246,0.55)"
              : "rgba(255,255,255,0.2)"
        }
        strokeWidth={
          isHovered
            ? clamp(layout.size * 0.003, 1.4, 2)
            : clamp(layout.size * 0.002, 1, 1.4)
        }
        className={`transition-all duration-200 ${isPulse ? "animate-[pulse-ring_2s_ease-in-out_infinite]" : ""}`}
        style={{
          transform: isHovered ? `scale(${layout.hoverScale})` : "scale(1)",
          transformOrigin: `${position.x}px ${position.y}px`,
          willChange: "transform",
        }}
      />
      {(isHovered || isPulse) && (
        <circle
          cx={position.x}
          cy={position.y}
          r={layout.nodeRadius + clamp(layout.size * 0.018, 6, 10)}
          fill="none"
          stroke="rgba(139,92,246,0.35)"
          strokeWidth={1}
        />
      )}
      <g
        style={{
          transform: "rotate(calc(-1 * var(--orbit-rot, 0) * 1deg))",
          transformOrigin: `${position.x}px ${position.y}px`,
        }}
      >
        <text
          x={position.x}
          y={position.y + textYOffset}
          textAnchor="middle"
          dominantBaseline="middle"
          className="font-display fill-[var(--text-primary)] font-semibold"
          style={{ fontSize, lineHeight }}
        >
          {lines.map((line, idx) => (
            <tspan key={`${node.id}-line-${idx}`} x={position.x} dy={idx === 0 ? 0 : lineHeight}>
              {line}
            </tspan>
          ))}
        </text>
      </g>
    </g>
  );
}

type GraphEdgesProps = {
  edges: typeof HERO_EDGES;
  layout: Layout;
  highlightedIds: Set<string>;
  showPackets: boolean;
  packetEdges: number[];
};

function GraphEdges({
  edges,
  layout,
  highlightedIds,
  showPackets,
  packetEdges,
}: GraphEdgesProps) {
  return (
    <>
      {edges.map((edge, i) => {
        const from = layout.positions.get(edge.from)!;
        const to = layout.positions.get(edge.to)!;
        const active =
          highlightedIds.size > 0
            ? highlightedIds.has(edge.from) || highlightedIds.has(edge.to)
            : false;
        return (
          <line
            key={`${edge.from}-${edge.to}-${i}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={active ? "url(#bcg-line-active)" : "url(#bcg-line)"}
            strokeWidth={
              active
                ? clamp(layout.size * 0.0032, 1.3, 2.4)
                : clamp(layout.size * 0.0022, 1, 1.6)
            }
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
            <circle
              key={`packet-${edgeIndex}`}
              r={clamp(layout.size * 0.006, 2.5, 4)}
              fill="var(--accent)"
              opacity="0.9"
            >
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
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const rotationAngleRef = useRef(0);
  const targetRotationRef = useRef<number | null>(null);
  const rotateGroupRef = useRef<SVGGElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const reduced = useReducedMotion();
  const quality = useQuality();
  const pathname = usePathname();
  const router = useRouter();
  const { ref: containerRef, size } = useElementSize<HTMLDivElement>(520);
  const inView = useInViewport(containerRef);
  const fx = useFxLifecycle({
    enabled: !reduced,
    isInViewport: inView,
    debugKey: "graph",
  });
  const compact = size <= 440;
  const packetCount = quality === "high" ? 3 : quality === "medium" ? 1 : 0;
  const packetEdges = useMemo(
    () => PACKET_EDGES.slice(0, packetCount),
    [packetCount]
  );
  const showPackets = fx.isActive && !compact && packetCount > 0;

  const layout = useMemo(() => {
    const center = { x: size / 2, y: size / 2 };
    const useTwoOrbits = HERO_NODES.length >= 8 && size <= 500;
    const outerRadius = size * 0.41;
    const innerRadius = size * 0.28;
    const orbitRadius = size * 0.39;
    const nodeRadius = clamp(size * 0.095, 36, 60);
    const hoverScale = compact ? 1.04 : 1.06;
    const coreRadius = clamp(size * 0.125, 54, 70);
    const coreInnerRadius = coreRadius * 0.72;
    const labelFontSize = clamp(size * 0.024, 11, 15);
    const labelLineHeight = labelFontSize * 1.15;
    const maxChars = compact ? 10 : 16;
    const positions = new Map<string, { x: number; y: number; angle: number }>();

    if (useTwoOrbits) {
      const outerCount = Math.ceil(HERO_NODES.length / 2);
      const innerCount = HERO_NODES.length - outerCount;
      const outerStep = 360 / outerCount;
      const innerStep = 360 / Math.max(innerCount, 1);

      HERO_NODES.slice(0, outerCount).forEach((node, i) => {
        const angle =
          (ORBIT_START_ANGLE + i * outerStep) * (Math.PI / 180);
        const radius = outerRadius;
        const pos = polarToCartesian(center, radius, angle);
        positions.set(node.id, { ...pos, angle: angle * (180 / Math.PI) });
      });

      HERO_NODES.slice(outerCount).forEach((node, i) => {
        const angle =
          (ORBIT_START_ANGLE + outerStep / 2 + i * innerStep) * (Math.PI / 180);
        const radius = innerRadius;
        const pos = polarToCartesian(center, radius, angle);
        positions.set(node.id, { ...pos, angle: angle * (180 / Math.PI) });
      });
    } else {
      const step = 360 / HERO_NODES.length;
      HERO_NODES.forEach((node, i) => {
        const angle =
          (ORBIT_START_ANGLE + i * step) * (Math.PI / 180);
        const radius = orbitRadius;
        const pos = polarToCartesian(center, radius, angle);
        positions.set(node.id, { ...pos, angle: angle * (180 / Math.PI) });
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

  const highlightedIds = useMemo(() => {
    if (!activeNodeId) return new Set<string>();
    const node = HERO_NODES.find((n) => n.id === activeNodeId);
    if (!node) return new Set<string>([activeNodeId]);
    return new Set<string>([activeNodeId, ...node.relatedIds]);
  }, [activeNodeId]);

  const centerViewOnNode = useCallback(
    (nodeId: string) => {
      const node = HERO_NODES.find((n) => n.id === nodeId);
      if (!node) return;
      const pos = layout.positions.get(nodeId);
      if (!pos) return;
      const baseAngle = pos.angle;
      targetRotationRef.current = (270 - baseAngle + 360) % 360;
    },
    [layout.positions]
  );

  const handleNodeClick = useCallback(
    (node: HeroNode) => {
      setActiveNodeId(node.id);
      setAutoRotate(false);
      centerViewOnNode(node.id);
    },
    [centerViewOnNode]
  );

  const handleBackgroundClick = useCallback(() => {
    setActiveNodeId(null);
    setAutoRotate(true);
    targetRotationRef.current = null;
  }, []);

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

  const handleCtaClick = useCallback(
    (anchor: HeroNode["anchor"]) => {
      if (pathname === "/") {
        scrollToSection(anchor);
        return;
      }
      router.push(`/services#${anchor}`);
    },
    [pathname, router, scrollToSection]
  );

  const handleConnectedNodeClick = useCallback(
    (nodeId: string) => {
      setActiveNodeId(nodeId);
      centerViewOnNode(nodeId);
    },
    [centerViewOnNode]
  );

  useEffect(() => {
    if (!inView || !fx.isActive || reduced) {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      return;
    }

    const cx = layout.center.x;
    const cy = layout.center.y;

    const tick = (now: number) => {
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (autoRotate) {
        rotationAngleRef.current =
          (rotationAngleRef.current + ROTATION_SPEED * delta) % 360;
      } else if (targetRotationRef.current !== null) {
        const target = targetRotationRef.current;
        const current = rotationAngleRef.current;
        let diff = ((target - current) % 360 + 360) % 360;
        if (diff > 180) diff -= 360;
        const next = current + diff * CENTER_LERP;
        if (Math.abs(diff) < 0.5) {
          rotationAngleRef.current = target;
          targetRotationRef.current = null;
        } else {
          rotationAngleRef.current = (next + 360) % 360;
        }
      }

      const angle = rotationAngleRef.current;
      const g = rotateGroupRef.current;
      if (g) {
        g.setAttribute(
          "transform",
          `rotate(${angle} ${cx} ${cy})`
        );
        g.style.setProperty("--orbit-rot", String(angle));
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    lastTimeRef.current = performance.now();
    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [
    inView,
    fx.isActive,
    reduced,
    autoRotate,
    layout.center.x,
    layout.center.y,
  ]);

  const activeNode = activeNodeId
    ? HERO_NODES.find((n) => n.id === activeNodeId)
    : null;

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center w-full max-w-[420px] sm:max-w-[520px] lg:max-w-[560px] aspect-square select-none"
      onClick={handleBackgroundClick}
      role="presentation"
    >
      <svg
        viewBox={`0 0 ${layout.size} ${layout.size}`}
        className="w-full h-full drop-shadow-[0_0_38px_rgba(139,92,246,0.14)]"
        aria-hidden
        onClick={(e) => e.stopPropagation()}
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
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background click area — behind everything */}
        <rect
          width={layout.size}
          height={layout.size}
          fill="transparent"
          onClick={handleBackgroundClick}
          style={{ cursor: "default" }}
        />

        <circle
          cx={layout.center.x}
          cy={layout.center.y}
          r={
            (layout.useTwoOrbits ? layout.size * 0.44 : layout.size * 0.42) +
            layout.nodeRadius * 0.45
          }
          fill="url(#bcg-core-glow)"
          className={
            !fx.isActive ? "" : "origin-center animate-[pulse_5s_ease-in-out_infinite]"
          }
          onClick={handleBackgroundClick}
          style={{ cursor: "default" }}
        />

        <g ref={rotateGroupRef} transform={`rotate(0 ${layout.center.x} ${layout.center.y})`}>
          <GraphEdges
            edges={HERO_EDGES}
            layout={layout}
            highlightedIds={highlightedIds}
            showPackets={showPackets}
            packetEdges={packetEdges}
          />

          {HERO_NODES.map((node) => {
            const pos = layout.positions.get(node.id)!;
            const isActive = highlightedIds.has(node.id);
            const isPulse =
              activeNodeId !== null &&
              node.id !== activeNodeId &&
              highlightedIds.has(node.id);
            const isHovered = hoveredId === node.id;
            return (
              <BusinessNode
                key={node.id}
                node={node}
                position={pos}
                layout={layout}
                compact={compact}
                isActive={isActive}
                isPulse={isPulse}
                isHovered={isHovered}
                onHover={setHoveredId}
                onNodeClick={handleNodeClick}
              />
            );
          })}
        </g>

        {/* Core — fixed, not rotating */}
        <g
          filter="url(#bcg-glow)"
          onClick={handleBackgroundClick}
          style={{ cursor: "default" }}
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
            className="font-display fill-[var(--text-primary)] font-semibold"
            style={{ fontSize: clamp(layout.size * 0.028, 12, 16) }}
          >
            AI Delivery
          </text>
          <text
            x={layout.center.x}
            y={layout.center.y + clamp(layout.size * 0.02, 9, 12)}
            textAnchor="middle"
            dominantBaseline="middle"
            className="font-display fill-[var(--text-muted)] font-medium"
            style={{ fontSize: clamp(layout.size * 0.022, 10, 12) }}
          >
            AI Core
          </text>
        </g>
      </svg>

      {activeNode && (() => {
        const pos = layout.positions.get(activeNode.id)!;
        const tooltipWidth = clamp(layout.size * 0.5, 200, 260);
        const tooltipHeight = compact
          ? clamp(layout.size * 0.32, 160, 200)
          : clamp(layout.size * 0.28, 140, 180);
        const tooltipPos = getTooltipPosition({
          size: layout.size,
          nodeRadius: layout.nodeRadius,
          tooltipWidth,
          tooltipHeight,
          center: layout.center,
          pos,
          compact,
        });

        return (
          <div
            className="absolute z-20 pointer-events-auto"
            style={{
              width: tooltipWidth,
              left: tooltipPos.x,
              top: tooltipPos.y,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="font-display rounded-2xl border border-white/10 bg-black/70 backdrop-blur-md p-4 text-xs text-[var(--text-secondary)] shadow-[0_18px_40px_rgba(5,5,10,0.45)]"
              style={{ minHeight: tooltipHeight }}
            >
              <div className="text-[11px] uppercase tracking-widest text-[var(--accent)]">
                {activeNode.title}
              </div>
              <div className="mt-1 text-sm text-[var(--text-primary)] leading-relaxed">
                {activeNode.description}
              </div>

              {/* Energy bar */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                  Энергия
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-pink)] transition-all duration-300"
                    style={{ width: `${activeNode.energy}%` }}
                  />
                </div>
                <span className="text-[10px] text-[var(--text-muted)] w-6">
                  {activeNode.energy}%
                </span>
              </div>

              {/* Connected nodes */}
              {activeNode.relatedIds.length > 0 && (
                <div className="mt-3">
                  <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                    Связанные узлы
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeNode.relatedIds.map((rid) => {
                      const related = HERO_NODES.find((n) => n.id === rid);
                      if (!related) return null;
                      return (
                        <button
                          key={rid}
                          type="button"
                          onClick={() => handleConnectedNodeClick(rid)}
                          className="rounded-lg border border-[var(--accent)]/40 px-2.5 py-1 text-[10px] text-[var(--accent)] transition hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/60"
                        >
                          {related.labelCompact ?? related.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => handleCtaClick(activeNode.anchor)}
                className="mt-3 flex w-full items-center justify-between rounded-full border border-[var(--accent)]/40 px-3 py-1.5 text-[10px] uppercase tracking-widest text-[var(--accent)] transition hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
              >
                <span>Перейти к решению</span>
                <span aria-hidden>↗</span>
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
