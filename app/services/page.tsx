import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { HeroCTA, SectionCTA, EstimateBlock } from "@/components/cta";
import { SpecularCard } from "@/components/fx/SpecularCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, siteConfig } from "@/lib/seo/metadata";
import { getBreadcrumbSchema, getFaqSchema, getServiceSchema } from "@/lib/seo/schema";
import { getAllCases } from "@/lib/content/cases";
import { getAllInsights } from "@/lib/content/insights";

export const metadata = buildMetadata({
  title: "Услуги AI Delivery — боты, сайты, n8n и MiniApps",
  description:
    "4 направления под ключ: ИИ‑боты, лендинги под трафик, n8n‑автоматизации и Telegram MiniApps. Сроки 48–72 часа или 3–7 дней, интеграции включены.",
  path: "/services",
});

const SERVICES = [
  {
    id: "sites",
    title: "Сайты и лендинги под трафик",
    solves: ["Быстрый запуск рекламы", "Сбор заявок и аналитика", "Проверка спроса"],
    deliverables: ["Лендинг/сайт", "Интеграции с CRM", "События аналитики и заявки"],
    excluded: ["Нет ведения рекламы (можем подключить отдельно)", "Нет сложной CMS без задачи"],
    timeline: "48–72 часа",
    integrations: ["CRM", "Telegram", "Аналитика", "Email"],
    faq: ["Можно сделать редизайн текущего сайта? Да, если это ускоряет запуск.", "Можно добавить A/B? Да, в пакете Pro."],
  },
  {
    id: "bots",
    title: "ИИ‑боты для лидов и поддержки",
    solves: ["Квалификация лидов", "Ответы 24/7", "Снижение нагрузки команды"],
    deliverables: ["Сценарии диалога", "Интеграции с CRM", "Уведомления менеджерам"],
    excluded: ["Нет обучения на закрытых данных без доступа", "Нет сложных голосовых сценариев без ТЗ"],
    timeline: "5–7 дней",
    integrations: ["Telegram", "WhatsApp", "CRM", "Google Sheets"],
    faq: ["Нужны скрипты? Мы подготовим черновик.", "Можно обучить на базе знаний? Да."],
  },
  {
    id: "n8n",
    title: "n8n‑автоматизации и пайплайны",
    solves: ["Рутина в обработке лидов", "Сбор отчётов", "Синхронизация каналов"],
    deliverables: ["n8n‑пайплайн", "Документация", "Уведомления и отчёты"],
    excluded: ["Нет полноценной разработки CRM", "Нет нестандартных коннекторов без API"],
    timeline: "5–7 дней",
    integrations: ["CRM", "Telegram", "Sheets", "Email/API"],
    faq: ["Можно подключить 3+ интеграции? Да, в Enterprise.", "Работаете с существующим n8n? Да."],
  },
  {
    id: "miniapps",
    title: "Telegram MiniApps MVP",
    solves: ["Быстрый MVP", "Каталоги/анкеты", "Проверка гипотез"],
    deliverables: ["MiniApp интерфейс", "Форма/анкета", "Интеграции"],
    excluded: ["Нет сложного маркетплейса без этапа MVP", "Нет большого back‑office без отдельного спринта"],
    timeline: "3–5 дней",
    integrations: ["Telegram", "CRM", "Sheets", "Платёжные формы"],
    faq: ["Можно подключить оплату? Да, по запросу.", "Поддерживаете кастомный UI? Да."],
  },
];

const PACKAGES = [
  {
    title: "Start",
    subtitle: "Быстрый запуск",
    price: "от 48–72 часов",
    points: ["1 направление", "Базовые интеграции", "Запуск и handoff"],
    accent: "violet" as const,
  },
  {
    title: "Pro",
    subtitle: "MVP за 3–7 дней",
    price: "от 3–7 дней",
    points: ["Сценарии и аналитика", "1–2 интеграции", "Подготовка отчётов"],
    accent: "pink" as const,
  },
  {
    title: "Enterprise",
    subtitle: "Комплекс",
    price: "от 7–10 дней",
    points: ["Несколько каналов", "3+ интеграции", "SLA и поддержка"],
    accent: "soft" as const,
  },
];

const SERVICE_LINKS: Record<string, { cases: string[]; insights: string[] }> = {
  sites: {
    cases: ["miniapp-mvp-catalog"],
    insights: ["mvp-cost-guide", "leads-to-crm-checklist"],
  },
  bots: {
    cases: ["fintech-lead-bot"],
    insights: ["ai-implementation-7-days", "n8n-leads-pipeline"],
  },
  n8n: {
    cases: ["service-automation-pipeline"],
    insights: ["n8n-leads-pipeline", "leads-to-crm-checklist"],
  },
  miniapps: {
    cases: ["miniapp-mvp-catalog"],
    insights: ["telegram-miniapp-when", "mvp-cost-guide"],
  },
};

const isDefined = <T,>(value: T | null | undefined): value is T => Boolean(value);

const parseFaqItem = (text: string) => {
  const parts = text.split("?");
  if (parts.length === 1) {
    return { question: text, answer: "Ответим на детали на брифе." };
  }
  const question = `${parts[0]}?`;
  const answer = parts.slice(1).join("?").trim();
  return { question, answer };
};

export default function ServicesPage() {
  const cases = getAllCases();
  const insights = getAllInsights();
  const caseMap = new Map(cases.map((item) => [item.slug, item]));
  const insightMap = new Map(insights.map((item) => [item.slug, item]));

  const faqItems = SERVICES.flatMap((service) => service.faq.map(parseFaqItem));
  const serviceSchemas = SERVICES.map((service) =>
    getServiceSchema({
      name: service.title,
      description: `${service.solves.join(", ")}. ${service.deliverables.join(", ")}.`,
      url: `${siteConfig.domain}/services#${service.id}`,
    }),
  );

  return (
    <>
      <JsonLd
        data={[
          getBreadcrumbSchema([
            { name: "Главная", url: siteConfig.domain },
            { name: "Услуги", url: `${siteConfig.domain}/services` },
          ]),
          getFaqSchema(faqItems),
          ...serviceSchemas,
        ]}
      />
      <Header />
      <main className="pb-24 md:pb-28">
        <div id="sticky-cta-trigger" className="h-1" aria-hidden />
        <section className="pt-28 pb-16 md:pt-32 md:pb-20 bg-[var(--bg-primary)]">
          <Container>
            <p className="text-sm text-[var(--accent)] uppercase tracking-widest">Услуги</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-[var(--text-primary)]">
              4 направления под ключ: быстро, прозрачно, с измеримым результатом
            </h1>
            <p className="mt-4 max-w-2xl text-[var(--text-secondary)]">
              Лендинг, бот, MiniApp или n8n‑автоматизация — запускаем с интеграциями, отчётами и handoff. Демо и план за 15 минут.
            </p>
            <HeroCTA secondary="Смотреть кейсы" secondaryHref="/cases" location="services-hero" sourcePage="services" />
          </Container>
        </section>

        <section className="py-20 bg-[var(--bg-secondary)]/40">
          <Container className="space-y-16">
            {SERVICES.map((s) => (
              <div key={s.id} id={s.id} className="scroll-mt-24">
                {(() => {
                  const links = SERVICE_LINKS[s.id] ?? { cases: [], insights: [] };
                  const relatedCases = links.cases.map((slug) => caseMap.get(slug)).filter(isDefined);
                  const relatedInsights = links.insights.map((slug) => insightMap.get(slug)).filter(isDefined);

                  return (
                    <div className="grid gap-8 lg:grid-cols-[1.1fr,1fr]">
                      <div>
                        <h2 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)]">{s.title}</h2>
                        <p className="mt-3 text-[var(--text-secondary)]">
                          Срок реализации: <span className="text-[var(--accent)]">{s.timeline}</span>
                        </p>
                        <div className="mt-6 grid gap-3">
                          <div>
                            <p className="text-sm text-[var(--text-muted)]">Что решаем</p>
                            <ul className="mt-2 list-disc list-inside text-[var(--text-secondary)]">
                              {s.solves.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-sm text-[var(--text-muted)]">Что входит</p>
                            <ul className="mt-2 list-disc list-inside text-[var(--text-secondary)]">
                              {s.deliverables.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/80 p-6">
                        <p className="text-sm text-[var(--text-muted)]">Интеграции</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {s.integrations.map((i) => (
                            <span key={i} className="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--text-secondary)]">
                              {i}
                            </span>
                          ))}
                        </div>
                        <div className="mt-6">
                          <p className="text-sm text-[var(--text-muted)]">FAQ</p>
                          <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
                            {s.faq.map((f) => (
                              <li key={f}>• {f}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-6">
                          <p className="text-sm text-[var(--text-muted)]">Что не входит</p>
                          <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
                            {s.excluded.map((item) => (
                              <li key={item}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                        {(relatedCases.length > 0 || relatedInsights.length > 0) && (
                          <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
                            <p className="text-sm text-[var(--text-muted)]">Связанные материалы</p>
                            <div className="mt-3 grid gap-4 md:grid-cols-2">
                              {relatedCases.length > 0 && (
                                <div>
                                  <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">Кейсы</p>
                                  <ul className="mt-2 space-y-2 text-sm text-[var(--text-secondary)]">
                                    {relatedCases.map((item) => (
                                      <li key={item.slug}>
                                        <Link href={`/cases/${item.slug}`} className="text-[var(--accent)] hover:underline">
                                          {item.title}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {relatedInsights.length > 0 && (
                                <div>
                                  <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">Статьи</p>
                                  <ul className="mt-2 space-y-2 text-sm text-[var(--text-secondary)]">
                                    {relatedInsights.map((item) => (
                                      <li key={item.slug}>
                                        <Link href={`/insights/${item.slug}`} className="text-[var(--accent)] hover:underline">
                                          {item.title}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
                <SectionCTA sourcePage="services" service={s.id} />
              </div>
            ))}
          </Container>
        </section>

        <section className="py-20 bg-[var(--bg-primary)]">
          <Container>
            <h2 className="text-3xl font-semibold text-[var(--text-primary)]">Пакеты</h2>
            <p className="mt-3 text-[var(--text-secondary)] max-w-2xl">
              Стоимость зависит от сложности и интеграций. Покажем ориентир и дадим точный план после брифа.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {PACKAGES.map((p) => (
                <SpecularCard key={p.title} accent={p.accent}>
                  <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">{p.subtitle}</p>
                  <h3 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">{p.title}</h3>
                  <p className="mt-2 text-[var(--accent)]">{p.price}</p>
                  <ul className="mt-4 list-disc list-inside text-sm text-[var(--text-secondary)]">
                    {p.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </SpecularCard>
              ))}
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-[1.2fr,1fr]">
              <EstimateBlock />
              <div className="rounded-2xl border border-white/10 bg-[var(--bg-elevated)]/80 p-6">
                <p className="text-sm text-[var(--text-muted)]">Как считаем стоимость</p>
                <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
                  <li>• Количество сценариев и интеграций</li>
                  <li>• Требования к UI/аналитике</li>
                  <li>• Срочность (48–72ч / 3–5 / 5–7 / 7–10)</li>
                </ul>
              </div>
            </div>
            <SectionCTA sourcePage="services" />
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
