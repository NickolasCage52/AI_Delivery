import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { HeroCTA, SectionCTA } from "@/components/cta";
import { IntegrationGraph } from "@/components/stack/IntegrationGraph";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, siteConfig } from "@/lib/seo/metadata";
import { getBreadcrumbSchema } from "@/lib/seo/schema";
import { getAllDirections, getDirectionBySlug } from "@/lib/content/directions";

export function generateStaticParams() {
  return getAllDirections().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getDirectionBySlug(slug);
  if (!data) {
    return buildMetadata({
      title: "Направление AI Delivery",
      description: "Подробное направление: сроки, процесс, стек и примеры.",
      path: `/directions/${slug}`,
    });
  }
  return buildMetadata({
    title: data.title,
    description: data.summary,
    path: `/directions/${data.slug}`,
  });
}

export default async function DirectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getDirectionBySlug(slug);
  if (!data) notFound();

  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Главная", url: siteConfig.domain },
          { name: "Направления", url: `${siteConfig.domain}/directions` },
          { name: data.title, url: `${siteConfig.domain}/directions/${data.slug}` },
        ])}
      />
      <Header />
      <main className="pb-24 md:pb-28">
        <div id="sticky-cta-trigger" className="h-1" aria-hidden />
        <section className="pt-28 pb-16 md:pt-32 md:pb-20 bg-[var(--bg-primary)]">
          <Container>
            <Link href="/directions" className="text-sm text-[var(--accent)] hover:underline">
              ← Все направления
            </Link>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-[var(--text-primary)]">{data.title}</h1>
            <p className="mt-3 text-lg text-[var(--text-secondary)]">{data.subtitle}</p>
            <p className="mt-4 max-w-2xl text-[var(--text-secondary)]">{data.summary}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/80 p-5">
                <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">Что это</p>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{data.hero.lead}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/80 p-5">
                <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">Кому подходит</p>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{data.hero.who}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/80 p-5">
                <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">Сроки</p>
                <p className="mt-2 text-sm font-semibold text-[var(--accent)]">{data.hero.timeline}</p>
              </div>
            </div>
            <HeroCTA secondary="Смотреть услуги" secondaryHref="/services" location={`direction-${data.slug}-hero`} />
          </Container>
        </section>

        <section className="py-20 bg-[var(--bg-secondary)]/40">
          <Container className="grid gap-12 lg:grid-cols-[1.2fr,0.8fr]">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Что вы получаете</h2>
              <ul className="mt-4 list-disc list-inside text-[var(--text-secondary)]">
                {data.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h2 className="mt-10 text-2xl font-semibold text-[var(--text-primary)]">Примеры сценариев</h2>
              <ul className="mt-4 list-disc list-inside text-[var(--text-secondary)]">
                {data.scenarios.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h2 className="mt-10 text-2xl font-semibold text-[var(--text-primary)]">Как внедряем</h2>
              <ol className="mt-4 space-y-2 text-[var(--text-secondary)]">
                {data.process.map((item, idx) => (
                  <li key={item}>
                    <span className="text-[var(--accent)]">{idx + 1}.</span> {item}
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/80 p-6">
              <p className="text-sm text-[var(--text-muted)]">Стек и интеграции</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {data.stack.map((item) => (
                  <span key={item} className="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--text-secondary)]">
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-6">
                <IntegrationGraph />
              </div>
            </div>
          </Container>
        </section>

        <section className="py-20 bg-[var(--bg-primary)]">
          <Container className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)]">FAQ</h2>
              <div className="mt-6 space-y-4">
                {data.faq.map((item) => (
                  <div key={item.q} className="rounded-xl border border-white/10 bg-[var(--bg-elevated)]/70 p-5">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{item.q}</p>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent)]/5 p-6">
              <p className="text-sm text-[var(--text-muted)]">{data.cta.title}</p>
              <p className="mt-2 text-[var(--text-secondary)]">{data.cta.text}</p>
              <div className="mt-4">
                <SectionCTA primary={data.cta.button} sourcePage={`direction-${data.slug}`} />
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
