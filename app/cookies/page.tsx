import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { buildMetadata, siteConfig } from "@/lib/seo/metadata";
import { getBreadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = buildMetadata({
  title: "Политика cookies",
  description: "Политика использования cookies на сайте AI Delivery. Какие cookies мы используем и зачем.",
  path: "/cookies",
  noIndex: true,
});

export default function CookiesPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Главная", url: siteConfig.domain },
          { name: "Политика cookies", url: `${siteConfig.domain}/cookies` },
        ])}
      />
      <Header />
      <main className="pb-24 md:pb-28">
        <div id="sticky-cta-trigger" className="h-1" aria-hidden />
        <section className="pt-28 pb-20 md:pt-32 md:pb-24 bg-[var(--bg-primary)]">
          <Container className="max-w-3xl">
            <p className="text-sm text-[var(--accent)] uppercase tracking-widest">
              Политика cookies
            </p>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-[var(--text-primary)]">
              Политика использования cookies
            </h1>
            <p className="mt-4 text-[var(--text-secondary)]">
              Дата последнего обновления: {new Date().toLocaleDateString("ru-RU")}
            </p>
            <div className="mt-12 prose prose-invert max-w-none space-y-8 text-[var(--text-secondary)]">
              <section>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                  1. Что такое cookies
                </h2>
                <p className="mt-3">
                  Cookies — небольшие текстовые файлы, которые сайт сохраняет на вашем устройстве.
                  Они помогают запоминать настройки, обеспечивать работу функций и анализировать
                  посещаемость.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                  2. Какие cookies мы используем
                </h2>
                <ul className="mt-3 list-disc list-inside space-y-2">
                  <li>
                    <strong className="text-[var(--text-primary)]">Необходимые</strong> — для работы
                    сайта (например, сохранение закрытия cookie-уведомления).
                  </li>
                  <li>
                    <strong className="text-[var(--text-primary)]">Аналитические</strong> — для
                    понимания, как посетители используют сайт (если подключены).
                  </li>
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                  3. Уведомление о cookies
                </h2>
                <p className="mt-3">
                  При первом посещении показывается уведомление о cookies. Закрывая его или нажимая
                  «Понятно», вы соглашаетесь с использованием cookies в соответствии с данной
                  политикой. Согласие сохраняется в localStorage на срок до 365 дней.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                  4. Управление cookies
                </h2>
                <p className="mt-3">
                  Вы можете отключить cookies в настройках браузера. Это может повлиять на работу
                  некоторых функций сайта.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">5. Контакты</h2>
                <p className="mt-3">
                  По вопросам: {siteConfig.email}, Telegram: @ai_delivery. Подробнее о
                  персональных данных — в{" "}
                  <a href="/privacy" className="text-[var(--accent)] hover:underline">
                    политике конфиденциальности
                  </a>
                  .
                </p>
              </section>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
