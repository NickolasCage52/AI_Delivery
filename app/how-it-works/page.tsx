import { Header } from "@/components/layout/Header";
import { HowItWorksStory } from "@/components/how-it-works/HowItWorksStory";
import { buildMetadata, siteConfig } from "@/lib/seo/metadata";
import { getBreadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = buildMetadata({
  title: "Как мы внедряем автоматизацию — процесс за 24 часа",
  description:
    "Пошаговый процесс внедрения: от задачи до рабочего прототипа за 24 часа. Автоматизация заявок, CRM, чат-боты для малого и среднего бизнеса.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Главная", url: `${siteConfig.siteUrl}/` },
          { name: "Как это работает", url: `${siteConfig.siteUrl}/how-it-works` },
        ])}
      />
      <Header />
      <main className="pt-16" id="main-content">
        <h1 className="sr-only">
          Как мы внедряем автоматизацию бизнеса — от заявки до результата за 24 часа
        </h1>
        <HowItWorksStory />
      </main>
    </>
  );
}
