import { siteConfig } from "./metadata";

type BreadcrumbItem = {
  name: string;
  url: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type ServiceSchemaInput = {
  name: string;
  description: string;
  url: string;
};

type ArticleSchemaInput = {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
};

export function getOrganizationSchema() {
  const base = siteConfig.siteUrl || siteConfig.domain;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: `${base}/`,
    description:
      "Автоматизация бизнеса под ключ: чат-боты, n8n, CRM-интеграции, Telegram MiniApps. Москва и Санкт-Петербург.",
    logo: base.startsWith("http") ? `${base}${siteConfig.logo}` : `${siteConfig.domain}${siteConfig.logo}`,
    email: siteConfig.email,
    areaServed: [
      { "@type": "City", name: "Москва" },
      { "@type": "City", name: "Санкт-Петербург" },
      { "@type": "Country", name: "Россия" },
    ],
    serviceType: "Автоматизация бизнеса",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: siteConfig.email,
      availableLanguage: "Russian",
      areaServed: ["Москва", "Санкт-Петербург", "Россия"],
    },
    sameAs: [siteConfig.telegram],
  };
}

export function getWebSiteSchema() {
  const base = siteConfig.siteUrl || siteConfig.domain;
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: `${base}/`,
    inLanguage: "ru-RU",
    description: "Автоматизация бизнеса под ключ в Москве и Санкт-Петербурге",
  };
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getFaqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function getServiceSchema(service: ServiceSchemaInput) {
  const base = siteConfig.siteUrl || siteConfig.domain;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: service.url.startsWith("http") ? service.url : `${base}${service.url}`,
    areaServed: ["Москва", "Санкт-Петербург", "Россия"],
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: `${base}/`,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "RUB",
      description: "Бесплатный MVP за 24 часа — 1 сценарий",
    },
  };
}

export function getArticleSchema(article: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
    mainEntityOfPage: article.url,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: `${siteConfig.siteUrl || siteConfig.domain}/`,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: `${siteConfig.siteUrl || siteConfig.domain}/`,
    },
  };
}
