import { HeroScene } from "@/components/sections/HeroScene";
import { Header } from "@/components/layout/Header";
import { GrowthStory } from "@/components/sections/GrowthStory";
import { PainSolution } from "@/components/sections/PainSolution";
import { AILeveragePanel } from "@/components/sections/AILeveragePanel";
import { Products } from "@/components/sections/Products";
import { WhoFits } from "@/components/sections/WhoFits";
import { FeaturedCases } from "@/components/sections/FeaturedCases";
import { ProcessPanel } from "@/components/sections/ProcessPanel";
import { Integrations } from "@/components/sections/Integrations";
import { WhyUs } from "@/components/sections/WhyUs";
import { LocalSEO } from "@/components/sections/LocalSEO";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";
import { getFeaturedCases } from "@/lib/cases/getCases";
import { getAllInsights } from "@/lib/content/insights";
import { Insights } from "@/components/sections/Insights";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, siteConfig } from "@/lib/seo/metadata";
import { getFaqSchema, getServiceSchema } from "@/lib/seo/schema";
import { FAQ_ITEMS } from "@/lib/content/faq";

export const metadata = buildMetadata({
  title: "Автоматизация бизнеса под ключ — Москва и СПб",
  description:
    "Внедряем автоматизацию продаж, лидогенерации и CRM-интеграций за 24 часа. Чат-боты, n8n, MiniApps. Бесплатный MVP. Работаем с бизнесом в Москве и Санкт-Петербурге.",
  path: "/",
});

export default function Home() {
  const featuredCases = getFeaturedCases(3);
  const insights = getAllInsights().slice(0, 3);
  return (
    <>
      <JsonLd
        data={[
          getFaqSchema(
            FAQ_ITEMS.map((item) => ({
              question: item.question,
              answer: item.answer,
            })),
          ),
          getServiceSchema({
            name: "Автоматизация бизнеса под ключ",
            description:
              "Внедрение чат-ботов, n8n-автоматизаций, CRM-интеграций и Telegram MiniApps для малого и среднего бизнеса в Москве и Санкт-Петербурге",
            url: `${siteConfig.siteUrl}/`,
          }),
        ]}
      />
      <Header />
      <main id="main-content" className="pb-24 md:pb-28">
        <div id="sticky-cta-trigger" className="h-1" aria-hidden />
        <HeroScene />
        <GrowthStory />
        <PainSolution />
        <AILeveragePanel />
        <Products />
        <WhoFits />
        <FeaturedCases cases={featuredCases} />
        <ProcessPanel />
        <Integrations />
        <WhyUs />
        <Insights items={insights} />
        <LocalSEO />
        <FAQ />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
