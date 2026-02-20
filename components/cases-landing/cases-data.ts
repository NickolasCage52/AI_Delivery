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

export type CaseItem = {
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
};

/** Данные кейсов загружаются из content/cases-landing/cases.json через getCasesLanding() и передаются в CasesShowcase. */

export const FILTERS = [
  { id: "all", label: "Все" },
  { id: "edu", label: "Онлайн-образование" },
  { id: "b2b", label: "B2B" },
  { id: "ecom", label: "E-commerce" },
  { id: "logistics", label: "Логистика" },
];

export function getDisplayImages(item: CaseItem): string[] {
  const images = item.images || [];
  if (images.length >= 5) {
    return [images[0], images[3], images[4]];
  }
  return images.slice(0, 3);
}
