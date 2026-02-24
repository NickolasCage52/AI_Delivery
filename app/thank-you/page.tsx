import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Спасибо — заявка принята",
  description: "Мы получили вашу заявку и свяжемся в течение рабочего дня.",
  path: "/thank-you",
  noIndex: true,
});

export default function ThankYouPage() {
  return (
    <>
      <Header />
      <main className="pb-24 md:pb-28">
        <div id="sticky-cta-trigger" className="h-1" aria-hidden />
        <section className="pt-28 pb-20 md:pt-32 md:pb-24 bg-[var(--bg-primary)]">
          <Container className="max-w-2xl">
            <p className="text-sm text-[var(--accent)] uppercase tracking-widest">Спасибо</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-[var(--text-primary)]">
              Мы получили вашу заявку
            </h1>
            <p className="mt-4 text-[var(--text-secondary)]">
              В течение рабочего дня свяжемся с вами, уточним детали и отправим MVP (рабочий прототип) и план внедрения.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/"
                className="rounded-lg bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[#09040F] hover:shadow-[0_0_24px_rgba(139,92,246,0.35)]"
              >
                Вернуться на главную
              </Link>
              <Link
                href="/cases"
                className="btn-glow rounded-lg border border-[var(--accent)]/50 px-6 py-3 text-sm font-semibold text-[var(--accent)] hover:bg-[var(--accent)]/10"
              >
                Смотреть кейсы
              </Link>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
