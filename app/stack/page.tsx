import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { HeroCTA, SectionCTA } from "@/components/cta";
import { TechStackBlock } from "@/components/stack/TechStackBlock";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, siteConfig } from "@/lib/seo/metadata";
import { getBreadcrumbSchema } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title: "Стек и интеграции AI Delivery",
  description:
    "Работаем с n8n, Telegram/MiniApps, CRM, аналитикой и вебом. Подбираем стек под задачу, интегрируемся с вашими системами.",
  path: "/stack",
});

export default function StackPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Главная", url: siteConfig.domain },
          { name: "Стек", url: `${siteConfig.domain}/stack` },
        ])}
      />
      <Header />
      <main className="pb-24 md:pb-28">
        <div id="sticky-cta-trigger" className="h-1" aria-hidden />
        <section className="pt-28 pb-16 md:pt-32 md:pb-20 bg-[var(--bg-primary)]">
          <Container>
            <p className="text-sm text-[var(--accent)] uppercase tracking-widest">Стек</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-[var(--text-primary)]">
              Инструменты и интеграции, с которыми мы работаем
            </h1>
            <p className="mt-4 max-w-2xl text-[var(--text-secondary)]">
              Выбираем стек под задачу и сроки, без избыточной сложности. Если у вас уже есть инструменты — интегрируемся.
            </p>
            <HeroCTA secondary="Смотреть кейсы" secondaryHref="/cases" location="stack-hero" />
          </Container>
        </section>

        <section className="py-20 bg-[var(--bg-secondary)]/40">
          <Container>
            <TechStackBlock />
            <div className="mt-14 rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/80 p-6">
              <p className="text-sm text-[var(--text-muted)]">Пример пайплайна</p>
              <p className="mt-2 text-[var(--text-secondary)]">
                Лид → бот → квалификация → CRM → задача менеджеру → отчёт в Telegram.
              </p>
            </div>
            <SectionCTA />
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
