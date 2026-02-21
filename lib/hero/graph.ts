/**
 * Hero graph data model for orbital timeline.
 * Used by BusinessCoverageGraph with relatedIds for highlight/focus.
 */

export type HeroNodeStatus = "completed" | "in-progress" | "pending";

export type HeroNodeAnchor = "sites" | "n8n" | "bots" | "miniapps";

export type HeroNode = {
  id: string;
  title: string;
  labelCompact?: string;
  description: string;
  /** Related node ids (for highlight / connected nodes) */
  relatedIds: string[];
  anchor: HeroNodeAnchor;
  status?: HeroNodeStatus;
  /** 0–100, influences glow/pulse intensity */
  energy: number;
  services: string[];
};

export const HERO_NODES: HeroNode[] = [
  {
    id: "leads",
    title: "Лиды и маркетинг",
    labelCompact: "Лиды",
    description: "Сбор лидов, сегментация, триггеры и быстрые гипотезы.",
    relatedIds: ["sales", "comms"],
    anchor: "sites",
    energy: 85,
    services: ["Сайты", "Боты", "n8n"],
  },
  {
    id: "sales",
    title: "Продажи и CRM",
    labelCompact: "CRM",
    description: "Квалификация, скрипты, статусы и авто-задачи для менеджера.",
    relatedIds: ["leads", "support", "docs"],
    anchor: "n8n",
    energy: 90,
    services: ["n8n", "Боты"],
  },
  {
    id: "support",
    title: "Поддержка 24/7",
    labelCompact: "Поддержка",
    description: "FAQ, статус-боты, авто-ответы и маршрутизация тикетов.",
    relatedIds: ["sales", "comms"],
    anchor: "bots",
    energy: 88,
    services: ["Боты"],
  },
  {
    id: "operations",
    title: "Операции",
    labelCompact: "Операции",
    description: "Передачи, постановка задач, напоминания и SLA без ручного труда.",
    relatedIds: ["docs"],
    anchor: "n8n",
    energy: 82,
    services: ["n8n"],
  },
  {
    id: "analytics",
    title: "Аналитика",
    labelCompact: "Аналитика",
    description: "Сводки, дашборды, weekly-репорты и контроль показателей.",
    relatedIds: ["content", "operations"],
    anchor: "n8n",
    energy: 78,
    services: ["n8n", "Сайты"],
  },
  {
    id: "content",
    title: "Контент/продукт",
    labelCompact: "Контент",
    description: "Каталоги, карточки, анкеты и обновления ассортимента.",
    relatedIds: ["analytics", "docs"],
    anchor: "miniapps",
    energy: 75,
    services: ["MiniApps", "Сайты"],
  },
  {
    id: "comms",
    title: "Коммуникации",
    labelCompact: "Коммуникации",
    description: "Telegram/WhatsApp, рассылки и единый диалог с клиентом.",
    relatedIds: ["leads", "support"],
    anchor: "bots",
    energy: 92,
    services: ["Боты", "n8n"],
  },
  {
    id: "docs",
    title: "Документы и КП",
    labelCompact: "КП/Документы",
    description: "Генерация КП, согласования и автосборки документов.",
    relatedIds: ["operations", "content", "sales"],
    anchor: "n8n",
    energy: 80,
    services: ["n8n", "MiniApps"],
  },
];

export const HERO_EDGES: { from: string; to: string }[] = [
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
