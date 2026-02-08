"use client";

import { useMemo, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/motion";
import { useQuality } from "@/hooks/useQuality";
import { useInViewport } from "@/hooks/useInViewport";

const SIZE = 420;
const CENTER = { x: 210, y: 210 };
const RADIUS = 150;

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
    description: "Собираем цепочки: лид → CRM → уведомления → задачи → отчёты.",
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

  const activeNode = hovered ? NODES.find((node) => node.id === hovered) : null;

  return (
    <div ref={containerRef} className="relative flex flex-col items-center">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="h-full w-full max-h-[360px] max-w-[420px]"
        aria-hidden
      >
        <defs>
          <linearGradient id="stack-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--accent-pink)" stopOpacity="0.22" />
          </linearGradient>
          <linearGradient id="stack-line-active" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--accent-pink)" stopOpacity="0.6" />
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
        </defs>

        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r={RADIUS + 22}
          fill="url(#stack-core-glow)"
          className={reduced || !inView ? "" : "integration-graph-breath"}
        />

        {NODES.map((node, i) => {
          const pos = positions[i];
          const active = hovered === node.id;
          return (
            <line
              key={`line-${node.id}`}
              x1={CENTER.x}
              y1={CENTER.y}
              x2={pos.x}
              y2={pos.y}
              stroke={active ? "url(#stack-line-active)" : "url(#stack-line)"}
              strokeWidth={active ? 1.8 : 1}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          );
        })}

        {showPackets &&
          NODES.slice(0, packetCount).map((node, i) => {
            const pos = positions[i];
            const pathD = `M ${CENTER.x} ${CENTER.y} L ${pos.x} ${pos.y}`;
            return (
              <circle key={`packet-${node.id}`} r="3" fill="var(--accent)" opacity="0.85">
                <animateMotion dur={`${2.8 + i * 0.4}s`} repeatCount="indefinite" path={pathD} />
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
          const isHovered = hovered === node.id;
          return (
            <g
              key={node.id}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(node.id)}
              onBlur={() => setHovered(null)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`${node.label}. ${node.title}`}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isHovered ? 20 : 16}
                fill="var(--bg-elevated)"
                stroke={isHovered ? "var(--accent)" : "rgba(255,255,255,0.2)"}
                strokeWidth={isHovered ? 2 : 1}
                className="transition-all duration-200"
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-[var(--text-primary)] text-[10px] font-medium pointer-events-none"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-4 w-full max-w-[420px] rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/90 p-4 text-xs text-[var(--text-secondary)]">
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
