import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type InsightMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  tags: string[];
  faqs: { question: string; answer: string }[];
};

export type Insight = InsightMeta & {
  content: string;
};

const insightsDir = path.join(process.cwd(), "content", "insights");

function readInsightFile(slug: string) {
  const fullPath = path.join(insightsDir, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const faqs =
    Array.isArray(data.faqs) && data.faqs.length > 0
      ? data.faqs.map((item: { q?: string; a?: string; question?: string; answer?: string }) => ({
          question: String(item.question ?? item.q ?? ""),
          answer: String(item.answer ?? item.a ?? ""),
        }))
      : [];

  const meta = {
    slug,
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    readingTime: String(data.readingTime ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    faqs,
  };
  return { meta, content };
}

export function getAllInsights(): InsightMeta[] {
  if (!fs.existsSync(insightsDir)) return [];
  const files = fs.readdirSync(insightsDir).filter((f) => f.endsWith(".mdx"));
  const items = files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const entry = readInsightFile(slug);
      return entry?.meta ?? null;
    })
    .filter((item): item is InsightMeta => Boolean(item));

  return items.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getInsightBySlug(slug: string): Insight | null {
  const entry = readInsightFile(slug);
  if (!entry) return null;
  return { ...entry.meta, content: entry.content };
}
