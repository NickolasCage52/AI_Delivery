import { Header } from "@/components/layout/Header";
import { HowItWorksStory } from "@/components/how-it-works/HowItWorksStory";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Как работает ИИ-решение за 60 секунд",
  description:
    "От входящего запроса до результата: ИИ понимает контекст, квалифицирует лидов, интегрирует с CRM. Бесплатный MVP за 24 часа.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <HowItWorksStory />
      </main>
    </>
  );
}
