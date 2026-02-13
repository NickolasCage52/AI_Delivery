import { HeroScene } from "@/components/sections/HeroScene";
import { Header } from "@/components/layout/Header";
import { NumbersProof } from "@/components/sections/NumbersProof";
import { PainSolution } from "@/components/sections/PainSolution";
import { AILeveragePanel } from "@/components/sections/AILeveragePanel";
import { Tasks } from "@/components/sections/Tasks";
import { Products } from "@/components/sections/Products";
import { Cases } from "@/components/sections/Cases";
import { ProcessPanel } from "@/components/sections/ProcessPanel";
import { Integrations } from "@/components/sections/Integrations";
import { WhyUs } from "@/components/sections/WhyUs";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";
import { getAllCases } from "@/lib/content/cases";
import { getAllInsights } from "@/lib/content/insights";
import { Insights } from "@/components/sections/Insights";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { getFaqSchema } from "@/lib/seo/schema";
import { FAQ_ITEMS } from "@/lib/content/faq";

export const metadata = buildMetadata({
  title: "AI Delivery — ИИ‑боты, сайты и автоматизация под ключ",
  description:
    "Быстро внедряем ИИ‑ботов, лендинги, Telegram MiniApps и n8n‑автоматизации. Пилот за 48–72 часа или MVP за 3–7 дней с измеримым результатом.",
  path: "/",
});

export default function Home() {
  const cases = getAllCases();
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
        <NumbersProof />
        <PainSolution />
        <AILeveragePanel />
        <Tasks />
        <Products />
        <Cases cases={cases.slice(0, 3)} />
        <Insights items={insights} />
        <ProcessPanel />
        <Integrations />
        <WhyUs />
        <FAQ />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
