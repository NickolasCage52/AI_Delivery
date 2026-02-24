"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useReducedMotion } from "@/lib/motion";
import { useQuality } from "@/hooks/useQuality";
import { useInViewport } from "@/hooks/useInViewport";

const SIZE = 420;
const CENTER = { x: 210, y: 210 };
const RADIUS = 150;
const NODE_RADIUS = 30;
const NODE_RADIUS_ACTIVE = 36;
const CYCLE_INTERVAL_MS = 2200;

type IntegrationNode = {
  id: string;
  label: string;
  title: string;
  description: string;
};

const NODES: IntegrationNode[] = [
  {
    id: "n8n",
    label: "n8n",
    title: "Сценарии автоматизации",
    description: "Входящий узел: лиды с сайта, Telegram, WhatsApp → CRM → уведомления → задачи → отчёты.",
  },
  {
    id: "telegram",
    label: "Telegram",
    title: "Канал общения",
    description: "Лиды, вопросы и статусы в мессенджере — быстро и привычно.",
  },
  {
    id: "crm",
    label: "CRM",
    title: "Карточка лида",
    description: "Контакты, статусы, сделки и история взаимодействий.",
  },
  {
    id: "sheets",
    label: "Sheets",
    title: "Таблицы и реестры",
    description: "Быстрые выгрузки, ручная проверка и отчёты для команды.",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    title: "Входящий поток",
    description: "Заявки и диалоги из WhatsApp без потери в контексте.",
  },
  {
    id: "site",
    label: "Сайт",
    title: "Источник лидов",
    description: "Формы, квизы, каталоги и первичное вовлечение.",
  },
  {
    id: "analytics",
    label: "Аналитика",
    title: "Контроль результата",
    description: "Дашборды, метрики и отчёты по эффективности.",
  },
];

function getPosition(index: number, total: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: CENTER.x + RADIUS * Math.cos(angle),
    y: CENTER.y + RADIUS * Math.sin(angle),
  };
}

export function IntegrationGraph() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [cycleIndex, setCycleIndex] = useState(0);
  const reduced = useReducedMotion();
  const quality = useQuality();
  const packetCount = quality === "high" ? 4 : quality === "medium" ? 2 : 0;
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInViewport(containerRef);
  const showPackets = !reduced && inView && packetCount > 0;

  const positions = useMemo(
    () => NODES.map((_, i) => getPosition(i, NODES.length)),
    []
  );

  const n8nPos = positions[0];
  const n8nPathD = `M ${CENTER.x} ${CENTER.y} L ${n8nPos.x} ${n8nPos.y}`;

  /** Входящие связи в n8n: Сайт, Telegram, WhatsApp → n8n */
  const incomingConnections = useMemo(() => {
    const sourceIds = ["site", "telegram", "whatsapp"];
    const n8n = positions[0];
    return sourceIds.map((id) => {
      const idx = NODES.findIndex((n) => n.id === id);
      if (idx < 0) return null;
      const from = positions[idx];
      return {
        id,
        from,
        to: n8n,
        pathD: `M ${from.x} ${from.y} L ${n8n.x} ${n8n.y}`,
      };
    }).filter(Boolean) as { id: string; from: { x: number; y: number }; to: { x: number; y: number }; pathD: string }[];
  }, [positions]);

  useEffect(() => {
    if (!inView || reduced || hovered) return;
    const t = setInterval(() => {
      setCycleIndex((i) => (i + 1) % NODES.length);
    }, CYCLE_INTERVAL_MS);
    return () => clearInterval(t);
  }, [inView, reduced, hovered]);

  const highlightedId = hovered ?? NODES[cycleIndex]?.id ?? null;
  const activeNode = highlightedId ? NODES.find((n) => n.id === highlightedId) : null;

  return (
    <div ref={containerRef} className="relative flex flex-col items-center">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="h-full w-full max-h-[360px] max-w-[420px]"
        aria-hidden
      >
        <defs>
          <linearGradient id="stack-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--accent-pink)" stopOpacity="0.18" />
          </linearGradient>
          <linearGradient id="stack-line-active" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--accent-pink)" stopOpacity="0.65" />
          </linearGradient>
          <linearGradient id="stack-line-n8n" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
            <stop offset="50%" stopColor="var(--accent-pink)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.5" />
          </linearGradient>
          <radialGradient id="stack-core-glow" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
            <stop offset="70%" stopColor="var(--accent)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
          <filter id="stack-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="stack-node-glow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r={RADIUS + 22}
          fill="url(#stack-core-glow)"
          className={reduced || !inView ? "" : "integration-graph-breath"}
        />

        {/* Lines — n8n path emphasized */}
        {NODES.map((node, i) => {
          const pos = positions[i];
          const active = highlightedId === node.id;
          const isN8n = node.id === "n8n";
          return (
            <line
              key={`line-${node.id}`}
              x1={CENTER.x}
              y1={CENTER.y}
              x2={pos.x}
              y2={pos.y}
              stroke={
                isN8n ? (active ? "url(#stack-line-active)" : "url(#stack-line-n8n)") : active ? "url(#stack-line-active)" : "url(#stack-line)"
              }
              strokeWidth={isN8n ? (active ? 2.2 : 1.6) : active ? 1.8 : 1}
              strokeLinecap="round"
              className="transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
            />
          );
        })}

        {/* n8n pipeline — dedicated flow animation (AI ↔ n8n) */}
        {!reduced && inView && (
          <>
            <circle r="4" fill="var(--accent)" opacity="0.9">
              <animateMotion dur="2.2s" repeatCount="indefinite" path={n8nPathD} />
            </circle>
            <circle r="3" fill="var(--accent-pink)" opacity="0.75">
              <animateMotion dur="2.2s" begin="0.55s" repeatCount="indefinite" path={n8nPathD} />
            </circle>
          </>
        )}

        {/* Входящие узлы в n8n: Сайт, Telegram, WhatsApp → n8n */}
        {!reduced &&
          inView &&
          incomingConnections.map(({ id, from, to, pathD }, i) => (
            <g key={`incoming-${id}`}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="var(--accent-pink)"
                strokeOpacity="0.35"
                strokeWidth="0.9"
                strokeDasharray="5 7"
                strokeLinecap="round"
                className="transition-opacity duration-300"
              />
              <circle r="2.5" fill="var(--accent-pink)" opacity="0.9">
                <animateMotion dur={`${2.8 + i * 0.4}s`} repeatCount="indefinite" path={pathD} />
              </circle>
            </g>
          ))}

        {showPackets &&
          NODES.slice(0, packetCount).map((node, i) => {
            const pos = positions[i];
            const pathD = `M ${CENTER.x} ${CENTER.y} L ${pos.x} ${pos.y}`;
            return (
              <circle key={`packet-${node.id}`} r="3" fill="var(--accent)" opacity="0.8">
                <animateMotion dur={`${2.5 + i * 0.35}s`} repeatCount="indefinite" path={pathD} />
              </circle>
            );
          })}

        <g filter="url(#stack-glow)">
          <circle cx={CENTER.x} cy={CENTER.y} r={36} fill="rgba(0,0,0,0.2)" stroke="var(--accent)" strokeWidth="1.5" />
          <circle cx={CENTER.x} cy={CENTER.y} r={28} fill="var(--bg-elevated)" stroke="var(--accent)" strokeWidth="1" />
          <text
            x={CENTER.x}
            y={CENTER.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-[var(--accent)] text-sm font-semibold"
          >
            AI
          </text>
        </g>

        {NODES.map((node, i) => {
          const pos = positions[i];
          const isActive = highlightedId === node.id;
          return (
            <g
              key={node.id}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(node.id)}
              onBlur={() => setHovered(null)}
              className="cursor-pointer outline-none"
              role="button"
              tabIndex={0}
              aria-label={`${node.label}. ${node.title}`}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isActive ? NODE_RADIUS_ACTIVE : NODE_RADIUS}
                fill="var(--bg-elevated)"
                stroke={isActive ? "var(--accent)" : "rgba(255,255,255,0.18)"}
                strokeWidth={isActive ? 2 : 1}
                filter={isActive ? "url(#stack-node-glow)" : undefined}
                className="transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
              />
              {isActive && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={NODE_RADIUS_ACTIVE + 4}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="1"
                  strokeOpacity="0.35"
                  className="integration-graph-node-pulse"
                />
              )}
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`fill-[var(--text-primary)] pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isActive ? "font-semibold" : "font-medium"}`}
                style={{ fontSize: 12 }}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-4 w-full max-w-[420px] rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/90 p-4 text-xs text-[var(--text-secondary)] transition-opacity duration-300">
        {activeNode ? (
          <>
            <div className="text-[10px] uppercase tracking-widest text-[var(--accent)]">{activeNode.label}</div>
            <div className="mt-1 text-sm text-[var(--text-primary)]">{activeNode.title}</div>
            <div className="mt-1">{activeNode.description}</div>
          </>
        ) : (
          <>
            <div className="text-[10px] uppercase tracking-widest text-[var(--accent)]">Наведи на узел</div>
            <div className="mt-1 text-sm text-[var(--text-primary)]">Показываем, что подключаем и зачем.</div>
            <div className="mt-1">Каждый узел — источник данных или точка контроля результата.</div>
          </>
        )}
      </div>
    </div>
  );
}
