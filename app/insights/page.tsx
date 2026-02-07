import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { HeroCTA, SectionCTA } from "@/components/cta";
import { SpecularCard } from "@/components/fx/SpecularCard";
import { getAllInsights } from "@/lib/content/insights";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, siteConfig } from "@/lib/seo/metadata";
import { getBreadcrumbSchema } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title: "Insights — база знаний AI Delivery",
  description:
    "Гайды и чеклисты по внедрению ИИ, автоматизации лидов, n8n и Telegram MiniApps. Практика, сроки и советы без воды.",
  path: "/insights",
});

export default function InsightsPage() {
  const insights = getAllInsights();
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Главная", url: siteConfig.domain },
          { name: "Insights", url: `${siteConfig.domain}/insights` },
        ])}
      />
      <Header />
      <main className="pb-24 md:pb-28">
        <div id="sticky-cta-trigger" className="h-1" aria-hidden />
        <section className="pt-28 pb-16 md:pt-32 md:pb-20 bg-[var(--bg-primary)]">
          <Container>
            <p className="text-sm text-[var(--accent)] uppercase tracking-widest">Insights</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-[var(--text-primary)]">
              Практические материалы по ИИ и автоматизации
            </h1>
            <p className="mt-4 max-w-2xl text-[var(--text-secondary)]">
              Делаем разборы, чеклисты и сценарии внедрения. Всё — на основе практики и реальных запусков.
            </p>
            <HeroCTA secondary="Смотреть услуги" secondaryHref="/services" location="insights-hero" />
          </Container>
        </section>

        <section className="py-20 bg-[var(--bg-secondary)]/40">
          <Container>
            <div className="grid gap-6 md:grid-cols-2">
              {insights.map((item) => (
                <SpecularCard key={item.slug} accent="violet">
                  <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">{item.readingTime}</p>
                  <h2 className="mt-3 text-xl font-semibold text-[var(--text-primary)]">{item.title}</h2>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">{item.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--text-secondary)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/insights/${item.slug}`} className="mt-4 inline-flex text-sm text-[var(--accent)] hover:underline">
                    Читать материал →
                  </Link>
                </SpecularCard>
              ))}
            </div>
            <SectionCTA primary="Запросить демо и план" />
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
