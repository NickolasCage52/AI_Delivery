import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { HeroCTA, SectionCTA } from "@/components/cta";
import { getAllCases, getCaseBySlug } from "@/lib/content/cases";
import { CaseArtifactPreview } from "@/components/cases/CaseArtifact";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, siteConfig } from "@/lib/seo/metadata";
import { getBreadcrumbSchema } from "@/lib/seo/schema";

const CASE_SERVICE_MAP: Record<string, { label: string; href: string }> = {
  "fintech-lead-bot": { label: "ИИ‑боты для лидов и поддержки", href: "/services#bots" },
  "miniapp-mvp-catalog": { label: "Telegram MiniApps MVP", href: "/services#miniapps" },
  "service-automation-pipeline": { label: "n8n‑автоматизации и пайплайны", href: "/services#n8n" },
};

export function generateStaticParams() {
  return getAllCases().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getCaseBySlug(slug);
  if (!data) {
    return buildMetadata({
      title: "Кейс AI Delivery",
      description: "Кейс внедрения: цель, решение, сроки и результат.",
      path: `/cases/${slug}`,
    });
  }
  return buildMetadata({
    title: data.title,
    description: `${data.context} ${data.goal}`,
    path: `/cases/${data.slug}`,
  });
}

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getCaseBySlug(slug);
  if (!data) notFound();
  const relatedService = CASE_SERVICE_MAP[data.slug];

  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Главная", url: siteConfig.domain },
          { name: "Кейсы", url: `${siteConfig.domain}/cases` },
          { name: data.title, url: `${siteConfig.domain}/cases/${data.slug}` },
        ])}
      />
      <Header />
      <main className="pb-24 md:pb-28">
        <div id="sticky-cta-trigger" className="h-1" aria-hidden />
        <section className="pt-28 pb-16 md:pt-32 md:pb-20 bg-[var(--bg-primary)]">
          <Container>
            <Link href="/cases" className="text-sm text-[var(--accent)] hover:underline">
              ← Все кейсы
            </Link>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-[var(--text-primary)]">{data.title}</h1>
            <p className="mt-4 max-w-2xl text-[var(--text-secondary)]">{data.context}</p>
            <HeroCTA secondary="Смотреть услуги" secondaryHref="/services" location="case-hero" />
          </Container>
        </section>

        <section className="py-20 bg-[var(--bg-secondary)]/40">
          <Container className="grid gap-12 lg:grid-cols-[1.2fr,0.8fr]">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Цель</h2>
              <p className="mt-3 text-[var(--text-secondary)]">{data.goal}</p>

              <h2 className="mt-10 text-2xl font-semibold text-[var(--text-primary)]">Что сделали</h2>
              <p className="mt-3 text-[var(--text-secondary)]">{data.build}</p>

              <h2 className="mt-10 text-2xl font-semibold text-[var(--text-primary)]">Результат</h2>
              <ul className="mt-3 list-disc list-inside text-[var(--text-secondary)]">
                {data.results.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/80 p-6">
              <p className="text-sm text-[var(--text-muted)]">Срок</p>
              <p className="mt-1 text-[var(--text-primary)] font-semibold">{data.timeline}</p>

              <p className="mt-6 text-sm text-[var(--text-muted)]">Стек</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.stack.map((s) => (
                  <span key={s} className="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--text-secondary)]">
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-6">
                <CaseArtifactPreview artifact={data.artifact} />
              </div>
            </div>
          </Container>
          <Container className="mt-12">
            {relatedService && (
              <div className="mb-8 rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent)]/5 p-6">
                <p className="text-sm text-[var(--text-muted)]">Подходит для вашей задачи?</p>
                <p className="mt-2 text-[var(--text-secondary)]">
                  Посмотрите услугу:{" "}
                  <Link href={relatedService.href} className="text-[var(--accent)] hover:underline">
                    {relatedService.label}
                  </Link>
                </p>
              </div>
            )}
            <SectionCTA primary="Запросить демо и план" />
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
