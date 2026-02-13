import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { buildMetadata, siteConfig } from "@/lib/seo/metadata";
import { getBreadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = buildMetadata({
  title: "Политика конфиденциальности",
  description:
    "Политика конфиденциальности AI Delivery. Как мы собираем, используем и защищаем персональные данные.",
  path: "/privacy",
  noIndex: true,
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Главная", url: siteConfig.domain },
          { name: "Политика конфиденциальности", url: `${siteConfig.domain}/privacy` },
        ])}
      />
      <Header />
      <main className="pb-24 md:pb-28">
        <div id="sticky-cta-trigger" className="h-1" aria-hidden />
        <section className="pt-28 pb-20 md:pt-32 md:pb-24 bg-[var(--bg-primary)]">
          <Container className="max-w-3xl">
            <p className="text-sm text-[var(--accent)] uppercase tracking-widest">
              Политика конфиденциальности
            </p>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-[var(--text-primary)]">
              Политика конфиденциальности
            </h1>
            <p className="mt-4 text-[var(--text-secondary)]">
              Дата последнего обновления: {new Date().toLocaleDateString("ru-RU")}
            </p>
            <div className="mt-12 prose prose-invert max-w-none space-y-8 text-[var(--text-secondary)]">
              <section>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                  1. Общие положения
                </h2>
                <p className="mt-3">
                  AI Delivery («мы», «наш») уважает вашу конфиденциальность и обязуется защищать
                  персональные данные. Настоящая политика описывает, как мы собираем, используем,
                  храним и защищаем информацию при использовании сайта ai-delivery.studio.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                  2. Какие данные собираем
                </h2>
                <p className="mt-3">
                  При обращении через форму заявки, Telegram или email мы можем получать: имя,
                  контакт (email, телефон, Telegram), описание задачи, сферу и сроки. Технические
                  данные: IP-адрес, тип браузера, cookies — см. нашу{" "}
                  <a href="/cookies" className="text-[var(--accent)] hover:underline">
                    политику cookies
                  </a>
                  .
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                  3. Цели использования
                </h2>
                <p className="mt-3">
                  Данные используются для ответа на заявки, подготовки демо и планов внедрения,
                  общения по проектам, улучшения работы сайта и аналитики.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                  4. Хранение и защита
                </h2>
                <p className="mt-3">
                  Мы храним данные в течение срока, необходимого для выполнения обязательств и
                  ведения переписки. Применяем разумные меры защиты: шифрование, ограничение
                  доступа.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                  5. Передача третьим лицам
                </h2>
                <p className="mt-3">
                  Не передаём персональные данные третьим лицам, за исключением случаев,
                  предусмотренных законодательством или необходимым для исполнения договора
                  (хостинг, CRM, мессенджеры).
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                  6. Ваши права
                </h2>
                <p className="mt-3">
                  Вы вправе запросить доступ к своим данным, их исправление или удаление. Свяжитесь
                  с нами: {siteConfig.email} или {siteConfig.telegram}.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                  7. Cookies
                </h2>
                <p className="mt-3">
                  Подробнее о cookies — в нашей{" "}
                  <a href="/cookies" className="text-[var(--accent)] hover:underline">
                    политике cookies
                  </a>
                  .
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">8. Контакты</h2>
                <p className="mt-3">
                  По вопросам конфиденциальности: {siteConfig.email}, Telegram: @ai_delivery.
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
