import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, siteConfig } from "@/lib/seo/metadata";
import { getBreadcrumbSchema } from "@/lib/seo/schema";
import { CasesShowcase } from "@/components/cases-landing/CasesShowcase";
import { getAllCases } from "@/lib/cases/getCases";

export const metadata = buildMetadata({
  title: "Кейсы автоматизации бизнеса — реальные результаты",
  description:
    "Реальные кейсы: рост заявок +212, конверсия 6.2%, экономия 18 ч/нед. Автоматизация продаж и лидогенерации для SMB в Москве и СПб.",
  path: "/cases",
});

export default function CasesPage() {
  const cases = getAllCases();
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Главная", url: `${siteConfig.siteUrl}/` },
          { name: "Кейсы", url: `${siteConfig.siteUrl}/cases` },
        ])}
      />
      <Header />
      <main id="main-content">
        <CasesShowcase cases={cases} />
      </main>
      <Footer />
    </>
  );
}
