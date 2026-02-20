import fs from "fs";
import path from "path";

export type CaseKpi = {
  label: string;
  value: string;
  tone: "main" | "secondary";
};

export type CaseProcess = {
  step: string;
  time: string;
  note: string;
};

/** Единый тип кейса. Источник: content/cases-landing/cases.json */
export type Case = {
  id: string;
  slug: string;
  category: string;
  filter: string;
  title: string;
  summary: string;
  goal: string;
  timeline: string;
  status: string;
  images: string[];
  caseUrl: string;
  projectUrl: string;
  contactUrl: string;
  sourceUrl?: string;
  kpis: CaseKpi[];
  problem: string;
  solution: string;
  result: string;
  stack: string[];
  process: CaseProcess[];
  workDone: string[];
  /** Показывать в блоке на главной (2–3 кейса) */
  featured?: boolean;
};

const CASES_PATH = path.join(process.cwd(), "content", "cases-landing", "cases.json");

let cached: Case[] | null = null;

function loadCases(): Case[] {
  if (cached) return cached;
  if (!fs.existsSync(CASES_PATH)) return [];
  const raw = fs.readFileSync(CASES_PATH, "utf8");
  cached = JSON.parse(raw) as Case[];
  return cached;
}

/** Все кейсы в порядке из cases.json. Используется на /cases и в sitemap. */
export function getAllCases(): Case[] {
  return loadCases();
}

/** До limit кейсов для главной: сначала с featured=true, затем добираем первыми по списку. */
export function getFeaturedCases(limit: number): Case[] {
  const all = loadCases();
  const featured = all.filter((c) => c.featured === true);
  const rest = all.filter((c) => !c.featured);
  const combined = [...featured, ...rest];
  return combined.slice(0, Math.max(0, limit));
}

/** Один кейс по slug. Для /cases/[slug] и ссылок из карточек. */
export function getCaseBySlug(slug: string): Case | null {
  const cases = loadCases();
  return cases.find((c) => c.slug === slug) ?? null;
}

/** Слаги всех кейсов (для generateStaticParams, sitemap). */
export function getLandingSlugs(): string[] {
  return loadCases().map((c) => c.slug);
}
