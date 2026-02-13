import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { DemoForm } from "@/components/sections/DemoForm";
import { buildMetadata, siteConfig } from "@/lib/seo/metadata";
import { getBreadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = buildMetadata({
  title: "Запросить демо — бесплатный MVP за 24 часа",
  description:
    "Бесплатный MVP или прототип за 24 часа. Заявка → уточнение → демо через 24ч → созвон и план. Без лишних полей.",
  path: "/demo",
});

const DEMO_STEPS = [
  { num: 1, title: "Заявка", desc: "Оставьте контакт и краткое описание задачи" },
  { num: 2, title: "Уточнение", desc: "Уточним детали в течение рабочего дня" },
  { num: 3, title: "Демо через 24ч", desc: "Отправим рабочий демо/MVP" },
  {
    num: 4,
    title: "Созвон и план",
    desc: "Обсудим, договор, доработка или запуск",
  },
];

export default function DemoPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Главная", url: siteConfig.domain },
          { name: "Запросить демо", url: `${siteConfig.domain}/demo` },
        ])}
      />
      <Header />
      <main className="pb-24 md:pb-28">
        <div id="sticky-cta-trigger" className="h-1" aria-hidden />
        <section className="pt-28 pb-12 md:pt-32 md:pb-16 bg-[var(--bg-primary)]">
          <Container>
            <p className="text-sm text-[var(--accent)] uppercase tracking-widest">Демо</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-[var(--text-primary)]">
              Бесплатный MVP/прототип за 24 часа
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[var(--text-secondary)]">
              Короткая заявка → уточнение → демо в течение 24 часов с момента получения вводных →
              созвон, договор и план доработки или запуска.
            </p>
          </Container>
        </section>

        <section className="py-12 md:py-16 bg-[var(--bg-secondary)]/40">
          <Container>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
              4 шага до демо
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {DEMO_STEPS.map((s) => (
                <div
                  key={s.num}
                  className="rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/80 p-6"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]/20 text-lg font-bold text-[var(--accent)]">
                    {s.num}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">{s.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-12 md:py-16 bg-[var(--bg-primary)]">
          <Container>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Условия</h2>
            <ul className="mt-4 space-y-2 text-[var(--text-secondary)]">
              <li>• 24 часа — с момента получения вводных до отправки демо</li>
              <li>• Демо/MVP — рабочий прототип для проверки гипотезы</li>
              <li>• Ограничение по объёму — простые сценарии, без глубокой интеграции</li>
              <li>• Бесплатно — для первичной оценки и доверия</li>
            </ul>
          </Container>
        </section>

        <section className="py-16 md:py-20 bg-[var(--bg-secondary)]/40">
          <Container className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/80 p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
                Оставить заявку
              </h2>
              <p className="mt-3 text-[var(--text-secondary)]">
                Имя, контакт и краткое описание задачи. Остальное уточним.
              </p>
              <div className="mt-6">
                <DemoForm />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/80 p-6 md:p-8">
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                Что будет дальше
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-[var(--text-secondary)]">
                <li>• Ответим в течение рабочего дня</li>
                <li>• Уточним scope и канал связи</li>
                <li>• Отправим демо в течение 24 часов</li>
                <li>• Согласуем созвон, договор и план</li>
              </ul>
              <div className="mt-8">
                <p className="text-sm text-[var(--text-muted)]">Альтернативные каналы</p>
                <div className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
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
