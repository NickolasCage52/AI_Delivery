import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { HeroCTA } from "@/components/cta";
import { ContactForm } from "@/components/sections/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, siteConfig } from "@/lib/seo/metadata";
import { getBreadcrumbSchema } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title: "Контакты — разобрать задачу за 15 минут",
  description:
    "Оставьте заявку: разберём задачу, пришлём MVP за 24 часа и предложим план внедрения. Минимум полей и быстрый ответ в течение рабочего дня.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Главная", url: siteConfig.domain },
          { name: "Контакты", url: `${siteConfig.domain}/contact` },
        ])}
      />
      <Header />
      <main className="pb-24 md:pb-28">
        <div id="sticky-cta-trigger" className="h-1" aria-hidden />
        <section className="pt-28 pb-16 md:pt-32 md:pb-20 bg-[var(--bg-primary)]">
          <Container>
            <p className="text-sm text-[var(--accent)] uppercase tracking-widest">Контакты</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-[var(--text-primary)]">
              Разберём задачу за 15 минут
            </h1>
            <p className="mt-4 max-w-2xl text-[var(--text-secondary)]">
              Заполните форму — ответим в течение рабочего дня и пришлём план внедрения. Без лишних созвонов, только по делу.
            </p>
            <HeroCTA
              primary="Получить бесплатное демо"
              secondary="Перейти к форме"
              secondaryHref="/contact#contact-form"
              location="contact-hero"
              sourcePage="contact"
            />
          </Container>
        </section>

        <section id="contact-form" className="py-20 bg-[var(--bg-secondary)]/40">
          <Container className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/80 p-8">
              <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Форма заявки</h2>
              <p className="mt-3 text-[var(--text-secondary)]">
                Минимум полей: имя, контакт и короткая задача. Дополнительные детали помогут точнее оценить сроки.
              </p>
              <div className="mt-6">
                <ContactForm sourcePage="contact" />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/80 p-8">
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">Что будет дальше</h3>
              <ul className="mt-4 space-y-3 text-sm text-[var(--text-secondary)]">
                <li>• Уточним цель и канал</li>
                <li>• Согласуем scope и сроки</li>
                <li>• Отправим MVP (прототип), план внедрения и ориентир по стоимости</li>
              </ul>
              <div className="mt-8">
                <p className="text-sm text-[var(--text-muted)]">Альтернативные каналы</p>
                <div className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
                  <p>Telegram-бот: @ai_delivery_bot</p>
                  <p>Telegram: @ai_delivery</p>
                  <p>Email: hello@ai-delivery.studio</p>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
