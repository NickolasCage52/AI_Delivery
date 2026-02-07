import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { HeroCTA, SectionCTA } from "@/components/cta";
import { SpecularCard } from "@/components/fx/SpecularCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, siteConfig } from "@/lib/seo/metadata";
import { getBreadcrumbSchema } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title: "О нас — команда AI Delivery",
  description:
    "Сфокусированная команда, которая быстро внедряет ИИ‑решения под ключ: боты, автоматизация, MiniApps и лендинги. Прозрачный процесс и понятные сроки.",
  path: "/about",
});

const VALUES = [
  {
    title: "Скорость с контролем",
    text: "Запускаем за дни, но фиксируем метрики и точки контроля, чтобы результат был измеримым.",
  },
  {
    title: "Под ключ и прозрачно",
    text: "План, сборка, интеграции, handoff — вы всегда понимаете, что сделано и что дальше.",
  },
  {
    title: "Практичный стек",
    text: "n8n, Telegram, CRM и веб — только то, что ускоряет запуск и не ломает бюджет.",
  },
];

const TEAM = [
  { role: "Product lead", focus: "собирает цели, метрики и roadmap" },
  { role: "Automation engineer", focus: "n8n‑пайплайны и интеграции" },
  { role: "AI engineer", focus: "LLM‑логика, промпты, оценка качества" },
  { role: "Frontend", focus: "лендинги, MiniApps и UI" },
];

const STATS = [
  { label: "Пилот", value: "48–72 часа" },
  { label: "MVP", value: "3–7 дней" },
  { label: "Интеграции", value: "CRM / Telegram / Sheets" },
  { label: "Сопровождение", value: "handoff + запуск" },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Главная", url: siteConfig.domain },
          { name: "О нас", url: `${siteConfig.domain}/about` },
        ])}
      />
      <Header />
      <main className="pb-24 md:pb-28">
        <div id="sticky-cta-trigger" className="h-1" aria-hidden />
        <section className="pt-28 pb-16 md:pt-32 md:pb-20 bg-[var(--bg-primary)]">
          <Container>
            <p className="text-sm text-[var(--accent)] uppercase tracking-widest">О нас</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-[var(--text-primary)]">
              Команда, которая ускоряет доставку ИИ‑решений
            </h1>
            <p className="mt-4 max-w-2xl text-[var(--text-secondary)]">
              Мы собираем решения из проверенных инструментов и быстро доводим их до результата: лиды, экономия времени, проверка гипотез.
            </p>
            <HeroCTA secondary="Смотреть кейсы" secondaryHref="/cases" location="about-hero" />
          </Container>
        </section>

        <section className="py-20 bg-[var(--bg-secondary)]/40">
          <Container>
            <h2 className="text-3xl font-semibold text-[var(--text-primary)]">Как мы работаем</h2>
            <p className="mt-3 text-[var(--text-secondary)] max-w-2xl">
              Минимум созвонов. Максимум ясности. Всё фиксируем в плане и сдаём под ключ.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {VALUES.map((v) => (
                <SpecularCard key={v.title} accent="violet">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">{v.title}</h3>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">{v.text}</p>
                </SpecularCard>
              ))}
            </div>
            <SectionCTA primary="Запросить демо и план" />
          </Container>
        </section>

        <section className="py-20 bg-[var(--bg-primary)]">
          <Container className="grid gap-10 lg:grid-cols-[1fr,1fr]">
            <div>
              <h2 className="text-3xl font-semibold text-[var(--text-primary)]">Команда</h2>
              <p className="mt-3 text-[var(--text-secondary)]">
                Небольшая, но сфокусированная команда. Делаем быстро и держим качество.
              </p>
              <div className="mt-6 grid gap-3">
                {TEAM.map((m) => (
                  <div key={m.role} className="rounded-xl border border-white/10 bg-[var(--bg-elevated)]/70 p-4">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{m.role}</p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">{m.focus}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-[var(--text-primary)]">Факты и подход</h2>
              <p className="mt-3 text-[var(--text-secondary)]">
                Упор на скорость и результат: фиксируем метрики и показываем эффект на пилоте.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {STATS.map((s) => (
                  <div key={s.label} className="rounded-xl border border-white/10 bg-[var(--bg-elevated)]/70 p-4">
                    <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">{s.label}</p>
                    <p className="mt-2 text-lg font-semibold text-[var(--accent)]">{s.value}</p>
                  </div>
                ))}
              </div>
              <SectionCTA primary="Запросить демо и план" />
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
