import type React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { SectionCTA } from "@/components/cta";
import { getAllInsights, getInsightBySlug } from "@/lib/content/insights";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, siteConfig } from "@/lib/seo/metadata";
import { getArticleSchema, getBreadcrumbSchema, getFaqSchema } from "@/lib/seo/schema";

export function generateStaticParams() {
  return getAllInsights().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insight = getInsightBySlug(slug);
  if (!insight) {
    return buildMetadata({
      title: "Материал AI Delivery",
      description: "Практический материал по внедрению ИИ и автоматизации.",
      path: `/insights/${slug}`,
    });
  }
  return buildMetadata({
    title: insight.title,
    description: insight.description,
    path: `/insights/${insight.slug}`,
  });
}

const markdownComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-10 text-2xl font-semibold text-[var(--text-primary)]" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-8 text-xl font-semibold text-[var(--text-primary)]" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mt-4 text-[var(--text-secondary)] leading-relaxed" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mt-4 list-disc list-inside space-y-2 text-[var(--text-secondary)]" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mt-4 list-decimal list-inside space-y-2 text-[var(--text-secondary)]" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-[var(--accent)] hover:underline" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="text-[var(--text-primary)] font-semibold" {...props} />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <table className="mt-6 w-full border-collapse text-sm text-[var(--text-secondary)]" {...props} />
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="border border-white/10 px-3 py-2 text-left text-[var(--text-primary)]" {...props} />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border border-white/10 px-3 py-2" {...props} />
  ),
};

export default async function InsightDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insight = getInsightBySlug(slug);
  if (!insight) notFound();

  const schema = [
    getBreadcrumbSchema([
      { name: "Главная", url: siteConfig.domain },
      { name: "Insights", url: `${siteConfig.domain}/insights` },
      { name: insight.title, url: `${siteConfig.domain}/insights/${insight.slug}` },
    ]),
    getArticleSchema({
      headline: insight.title,
      description: insight.description,
      url: `${siteConfig.domain}/insights/${insight.slug}`,
      datePublished: insight.date,
    }),
    ...(insight.faqs.length > 0 ? [getFaqSchema(insight.faqs)] : []),
  ];

  return (
    <>
      <JsonLd data={schema} />
      <Header />
      <main className="pb-24 md:pb-28">
        <div id="sticky-cta-trigger" className="h-1" aria-hidden />
        <section className="pt-28 pb-16 md:pt-32 md:pb-20 bg-[var(--bg-primary)]">
          <Container className="max-w-3xl">
            <Link href="/insights" className="text-sm text-[var(--accent)] hover:underline">
              ← Все материалы
            </Link>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-[var(--text-primary)]">{insight.title}</h1>
            <p className="mt-4 text-[var(--text-secondary)]">{insight.description}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--text-muted)]">
              <span>{insight.date}</span>
              <span>•</span>
              <span>{insight.readingTime}</span>
            </div>
          </Container>
        </section>

        <section className="py-20 bg-[var(--bg-secondary)]/40">
          <Container className="max-w-3xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {insight.content}
            </ReactMarkdown>
          </Container>
          <Container className="max-w-3xl">
            <div className="mt-12 rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent)]/5 p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Подходит вам?</h2>
              <p className="mt-3 text-[var(--text-secondary)]">
                Если хотите внедрить аналогичный сценарий под свой бизнес — пришлём MVP за 24 часа и соберём план внедрения.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/services"
                  className="btn-glow rounded-lg border border-[var(--accent)]/40 px-5 py-2.5 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent)]/10"
                >
                  Посмотреть услуги
                </Link>
                <Link
                  href="/contact"
                  className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[#09040F] hover:shadow-[0_0_20px_rgba(139,92,246,0.35)]"
                >
                  Получить бесплатное демо
                </Link>
              </div>
            </div>
            <SectionCTA />
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
