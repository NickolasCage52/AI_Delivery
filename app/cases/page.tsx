import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, siteConfig } from "@/lib/seo/metadata";
import { getBreadcrumbSchema } from "@/lib/seo/schema";
import { CasesShowcase } from "@/components/cases-landing/CasesShowcase";
import { getAllCases } from "@/lib/cases/getCases";

export const metadata = buildMetadata({
  title: "Кейсы AI Delivery — результаты, метрики и артефакты",
  description:
    "Портфолио AI-агентства: сайты, MiniApp, автоматизации и боты с измеримым бизнес-результатом. Смотрите кейсы, KPI и стек.",
  path: "/cases",
});

export default function CasesPage() {
  const cases = getAllCases();
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Главная", url: siteConfig.domain },
          { name: "Кейсы", url: `${siteConfig.domain}/cases` },
        ])}
      />
      <Header />
      <main>
        <CasesShowcase cases={cases} />
      </main>
      <Footer />
    </>
  );
}
