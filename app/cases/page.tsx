import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { HeroCTA, SectionCTA } from "@/components/cta";
import { getAllCases } from "@/lib/content/cases";
import { CaseArtifactPreview } from "@/components/cases/CaseArtifact";
import { SpecularCard } from "@/components/fx/SpecularCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, siteConfig } from "@/lib/seo/metadata";
import { getBreadcrumbSchema } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title: "Кейсы AI Delivery — результаты и артефакты",
  description:
    "Кейсы внедрения: контекст, цель, решение и измеримый результат. Показываем сроки, стек и цифры по пилотам и MVP.",
  path: "/cases",
});

export default function CasesPage() {
  const cases = getAllCases();
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Главная", url: siteConfig.domain },
          { name: "Кейсы", url: `${siteConfig.domain}/cases` },
        ])}
      />
      <Header />
      <main className="pb-24 md:pb-28">
        <div id="sticky-cta-trigger" className="h-1" aria-hidden />
        <section className="pt-28 pb-16 md:pt-32 md:pb-20 bg-[var(--bg-primary)]">
          <Container>
            <p className="text-sm text-[var(--accent)] uppercase tracking-widest">Кейсы</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-[var(--text-primary)]">
              Реальные сценарии, цифры и артефакты
            </h1>
            <p className="mt-4 max-w-2xl text-[var(--text-secondary)]">
              Показываем, что сделали, сколько заняло времени и какой результат получили. Все кейсы обезличены.
            </p>
            <HeroCTA secondary="Смотреть услуги" secondaryHref="/services" location="cases-hero" />
          </Container>
        </section>

        <section className="py-20 bg-[var(--bg-secondary)]/40">
          <Container>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {cases.map((c) => (
                <SpecularCard key={c.slug} accent="violet">
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">{c.title}</h2>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">{c.context}</p>
                  <p className="mt-3 text-xs text-[var(--text-muted)]">Цель</p>
                  <p className="text-sm text-[var(--text-secondary)]">{c.goal}</p>
                  <p className="mt-3 text-xs text-[var(--text-muted)]">Срок</p>
                  <p className="text-sm text-[var(--text-secondary)]">{c.timeline}</p>
                  <div className="mt-4">
                    <CaseArtifactPreview artifact={c.artifact} />
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-[var(--text-secondary)]">
                    {c.metrics.map((m) => (
                      <div key={m.label} className="rounded-lg border border-white/10 px-2 py-2 text-center">
                        <p className="text-[var(--text-muted)]">{m.label}</p>
                        <p className="text-[var(--text-primary)] font-semibold">{m.value}</p>
                      </div>
                    ))}
                  </div>
                  <Link href={`/cases/${c.slug}`} className="mt-4 inline-flex text-sm text-[var(--accent)] hover:underline">
                    Открыть кейс →
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
