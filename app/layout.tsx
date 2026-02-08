import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { GlowCursor } from "@/components/fx/GlowCursor";
import { EffectsDebugOverlay } from "@/components/fx/EffectsDebugOverlay";
import { NoiseOverlay } from "@/components/fx/NoiseOverlay";
import { LeadModalProvider, StickyCTA } from "@/components/cta";
import { ScrollVelocityBlur } from "@/components/fx/ScrollVelocityBlur";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/seo/metadata";
import { getOrganizationSchema, getWebSiteSchema } from "@/lib/seo/schema";
import { UiDebugTools } from "@/components/ui/UiDebugTools";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    url: siteConfig.domain,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="antialiased" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] noise" suppressHydrationWarning>
        <JsonLd data={[getOrganizationSchema(), getWebSiteSchema()]} />
        <LeadModalProvider>
          <GlowCursor />
          <NoiseOverlay />
          <ScrollVelocityBlur />
          <EffectsDebugOverlay />
          <UiDebugTools />
          <SmoothScroll>{children}</SmoothScroll>
          <StickyCTA />
        </LeadModalProvider>
      </body>
    </html>
  );
}
