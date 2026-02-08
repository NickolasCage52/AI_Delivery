import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { HeroCTA, SectionCTA } from "@/components/cta";
import { SpecularCard } from "@/components/fx/SpecularCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, siteConfig } from "@/lib/seo/metadata";
import { getBreadcrumbSchema } from "@/lib/seo/schema";
import { getAllDirections } from "@/lib/content/directions";

export const metadata = buildMetadata({
  title: "Направления AI Delivery — боты, сайты, n8n и MiniApps",
  description:
    "Подробные страницы по направлениям: кому подходит, сроки, что входит, примеры сценариев и стек интеграций.",
  path: "/directions",
});

export default function DirectionsPage() {
  const directions = getAllDirections();
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Главная", url: siteConfig.domain },
          { name: "Направления", url: `${siteConfig.domain}/directions` },
        ])}
      />
      <Header />
      <main className="pb-24 md:pb-28">
        <div id="sticky-cta-trigger" className="h-1" aria-hidden />
        <section className="pt-28 pb-16 md:pt-32 md:pb-20 bg-[var(--bg-primary)]">
          <Container>
            <p className="text-sm text-[var(--accent)] uppercase tracking-widest">Направления</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-[var(--text-primary)]">
              Подробно о каждом направлении
            </h1>
            <p className="mt-4 max-w-2xl text-[var(--text-secondary)]">
              Кому подходит, что входит, реальные сценарии, стек и процесс внедрения — без воды.
            </p>
            <HeroCTA secondary="Смотреть услуги" secondaryHref="/services" location="directions-hero" />
          </Container>
        </section>

        <section className="py-20 bg-[var(--bg-secondary)]/40">
          <Container>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {directions.map((direction) => (
                <SpecularCard key={direction.slug} accent="violet" className="min-h-[260px]">
                  <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">{direction.hero.timeline}</p>
                  <h2 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{direction.title}</h2>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">{direction.summary}</p>
                  <div className="mt-4 text-xs text-[var(--text-muted)]">{direction.subtitle}</div>
                  <Link href={`/directions/${direction.slug}`} className="mt-4 inline-flex text-sm text-[var(--accent)] hover:underline">
                    Подробнее →
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
