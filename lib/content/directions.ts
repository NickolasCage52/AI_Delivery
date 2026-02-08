import fs from "fs";
import path from "path";

export type DirectionFaq = { q: string; a: string };

export type Direction = {
  slug: "bots" | "sites" | "n8n" | "miniapps";
  title: string;
  subtitle: string;
  summary: string;
  hero: {
    lead: string;
    who: string;
    timeline: string;
  };
  deliverables: string[];
  scenarios: string[];
  process: string[];
  stack: string[];
  faq: DirectionFaq[];
  cta: {
    title: string;
    text: string;
    button: string;
  };
};

const directionsDir = path.join(process.cwd(), "content", "directions");

export function getAllDirections(): Direction[] {
  if (!fs.existsSync(directionsDir)) return [];
  const files = fs.readdirSync(directionsDir).filter((f) => f.endsWith(".json"));
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(directionsDir, file), "utf8");
      return JSON.parse(raw) as Direction;
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getDirectionBySlug(slug: string): Direction | null {
  const directions = getAllDirections();
  return directions.find((item) => item.slug === slug) ?? null;
}
