import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SpecularCard } from "@/components/fx/SpecularCard";
import type { InsightMeta } from "@/lib/content/insights";

export function Insights({ items }: { items: InsightMeta[] }) {
  return (
    <section id="insights" className="relative py-24 md:py-32 bg-[var(--bg-secondary)]/40">
      <Container>
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl text-[var(--text-primary)]">
          Insights и база знаний
        </h2>
        <p className="mt-4 text-[var(--text-secondary)] max-w-2xl">
          Практика, чеклисты и сценарии внедрения — без воды и без спама. Только то, что помогает запускать быстрее.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <SpecularCard key={item.slug} accent="soft">
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">{item.readingTime}</p>
              <h3 className="mt-3 text-lg font-semibold text-[var(--text-primary)]">{item.title}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{item.description}</p>
              <Link href={`/insights/${item.slug}`} className="link-trailing mt-4 inline-flex text-sm text-[var(--accent)]">
                Читать →
              </Link>
            </SpecularCard>
          ))}
        </div>
        <div className="mt-10">
          <Link
            href="/insights"
            className="btn-glow inline-flex rounded-lg border border-[var(--accent)]/40 px-5 py-2.5 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent)]/10"
          >
            Все материалы
          </Link>
        </div>
      </Container>
    </section>
  );
}
