import fs from "fs";
import path from "path";

export type CaseArtifact = {
  type: "flow" | "ui" | "dashboard";
  title: string;
};

export type CaseMetric = {
  label: string;
  value: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  context: string;
  goal: string;
  build: string;
  timeline: string;
  stack: string[];
  results: string[];
  metrics: CaseMetric[];
  artifact: CaseArtifact;
};

const casesDir = path.join(process.cwd(), "content", "cases");

export function getAllCases(): CaseStudy[] {
  if (!fs.existsSync(casesDir)) return [];
  const files = fs.readdirSync(casesDir).filter((f) => f.endsWith(".json"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(casesDir, file), "utf8");
    return JSON.parse(raw) as CaseStudy;
  });
}

export function getCaseBySlug(slug: string): CaseStudy | null {
  const cases = getAllCases();
  return cases.find((c) => c.slug === slug) ?? null;
}
