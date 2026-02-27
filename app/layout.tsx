import type { Metadata } from "next";
import "./globals.css";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { ConditionalSmoothScroll } from "@/components/ui/ConditionalSmoothScroll";
import { PageTransition } from "@/components/ui/PageTransition";
import { GlowCursor } from "@/components/fx/GlowCursor";
import { EffectsDebugOverlay } from "@/components/fx/EffectsDebugOverlay";
import { NoiseOverlay } from "@/components/fx/NoiseOverlay";
import { LeadModalProvider, StickyCTA } from "@/components/cta";
import { CookieNotice } from "@/components/legal/CookieNotice";
import { ScrollVelocityBlur } from "@/components/fx/ScrollVelocityBlur";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/seo/metadata";
import { getOrganizationSchema, getWebSiteSchema } from "@/lib/seo/schema";
import { UiDebugTools } from "@/components/ui/UiDebugTools";
import { ScrollToTopOnRouteChange } from "@/components/behavior/ScrollToTopOnRouteChange";
import { UnhandledRejectionHandler } from "@/components/behavior/UnhandledRejectionHandler";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-sans", display: "swap" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
  display: "swap",
});

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
    <html
      lang="ru"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] aurora-bg" suppressHydrationWarning>
        <JsonLd data={[getOrganizationSchema(), getWebSiteSchema()]} />
        <LeadModalProvider>
          <UnhandledRejectionHandler />
          <GlowCursor />
          <NoiseOverlay />
          <ScrollVelocityBlur />
          <EffectsDebugOverlay />
          <UiDebugTools />
          <ConditionalSmoothScroll>
            <ScrollToTopOnRouteChange />
            <PageTransition>{children}</PageTransition>
          </ConditionalSmoothScroll>
          <StickyCTA />
          <CookieNotice />
        </LeadModalProvider>
      </body>
    </html>
  );
}
