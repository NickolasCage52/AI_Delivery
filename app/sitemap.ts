import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/metadata";
import { getAllCases } from "@/lib/content/cases";
import { getAllInsights } from "@/lib/content/insights";
import { getAllDirections } from "@/lib/content/directions";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    "",
    "/services",
    "/directions",
    "/cases",
    "/about",
    "/contact",
    "/stack",
    "/insights",
  ];

  const caseRoutes = getAllCases().map((item) => `/cases/${item.slug}`);
  const insightRoutes = getAllInsights().map((item) => `/insights/${item.slug}`);
  const directionRoutes = getAllDirections().map((item) => `/directions/${item.slug}`);

  const urls = [...staticRoutes, ...caseRoutes, ...insightRoutes, ...directionRoutes];

  return urls.map((path) => ({
    url: `${siteConfig.siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
