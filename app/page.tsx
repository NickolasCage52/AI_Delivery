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
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";
import { getFeaturedCases } from "@/lib/cases/getCases";
import { getAllInsights } from "@/lib/content/insights";
import { Insights } from "@/components/sections/Insights";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { getFaqSchema } from "@/lib/seo/schema";
import { FAQ_ITEMS } from "@/lib/content/faq";

export const metadata = buildMetadata({
  title: "AI Delivery — ИИ‑боты, сайты и автоматизация под ключ",
  description:
    "Бесплатный MVP за 24 часа (1 сценарий). Боевой запуск за 3–10 дней. Боты, лендинги, Telegram MiniApps и n8n‑автоматизации с измеримым результатом.",
  path: "/",
});

export default function Home() {
  const featuredCases = getFeaturedCases(3);
  const insights = getAllInsights().slice(0, 3);
  return (
    <>
      <JsonLd
        data={getFaqSchema(
          FAQ_ITEMS.map((item) => ({
            question: item.question,
            answer: item.answer,
          })),
        )}
      />
      <Header />
      <main className="pb-24 md:pb-28">
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
        <FAQ />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
