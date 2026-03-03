import type { Metadata } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH?.trim() || (isGitHubPages ? "/AI_Delivery" : "");
const domain =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (isGitHubPages ? "https://nickolascage52.github.io" : "https://ai-delivery.studio");
const siteUrl = basePath
  ? `${domain.replace(/\/$/, "")}${basePath.startsWith("/") ? basePath : `/${basePath}`}`.replace(/\/$/, "")
  : domain.replace(/\/$/, "");
const withBasePath = (path: string) => `${basePath}${path}`;

export const siteConfig = {
  name: "AI Delivery",
  title: "Автоматизация бизнеса под ключ — Москва и СПб",
  description:
    "Внедряем автоматизацию продаж, лидогенерации и CRM-интеграций за 24 часа. Чат-боты, n8n, MiniApps. Бесплатный MVP. Работаем с бизнесом в Москве и Санкт-Петербурге.",
  domain,
  siteUrl,
  basePath,
  ogImage: withBasePath("/og.svg"),
  logo: withBasePath("/logo.svg"),
  favicon: withBasePath("/favicon.svg"),
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
  const url = path === "/" ? `${siteConfig.siteUrl}/` : `${siteConfig.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const resolvedTitle = title;
  const resolvedDescription = description;

  return {
    metadataBase: new URL(siteConfig.siteUrl),
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
