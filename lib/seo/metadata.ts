import type { Metadata } from "next";

export const siteConfig = {
  name: "AI Delivery",
  title: "AI Delivery — ИИ-решения под ключ за 3–10 дней",
  description:
    "Боты, сайты, Telegram MiniApps и n8n-автоматизации под ключ. Запуск за 48–72 часа или MVP за 3–7 дней с интеграциями и измеримым результатом.",
  domain: "https://ai-delivery.studio",
  ogImage: "/og",
  logo: "/logo.svg",
  locale: "ru_RU",
  email: "hello@ai-delivery.studio",
  telegram: "https://t.me/ai_delivery",
};

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  ogTitle?: string;
  ogDescription?: string;
};

export function buildMetadata({
  title,
  description,
  path,
  noIndex = false,
  ogTitle,
  ogDescription,
}: MetadataInput): Metadata {
  const url = new URL(path, siteConfig.domain).toString();
  const resolvedTitle = title;
  const resolvedDescription = description;

  return {
    metadataBase: new URL(siteConfig.domain),
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      title: ogTitle ?? resolvedTitle,
      description: ogDescription ?? resolvedDescription,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — ${resolvedTitle}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle ?? resolvedTitle,
      description: ogDescription ?? resolvedDescription,
      images: [siteConfig.ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : { index: true, follow: true },
  };
}

export function buildPageTitle(pageTitle: string) {
  return `${pageTitle} — ${siteConfig.name}`;
}
