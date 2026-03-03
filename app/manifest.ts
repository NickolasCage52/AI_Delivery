import type { MetadataRoute } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";
const startUrl = basePath ? `${basePath}/` : "/";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AI Delivery",
    short_name: "AI Delivery",
    description: "Автоматизация бизнеса под ключ",
    start_url: startUrl,
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    lang: "ru",
    icons: [
      {
        src: basePath ? `${basePath}/favicon.svg` : "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: basePath ? `${basePath}/logo.svg` : "/logo.svg",
        sizes: "256x256",
        type: "image/svg+xml",
        purpose: "any",
      },
      // TODO: добавить favicon-32x32.png, apple-touch-icon.png 180×180 для PWA/домашний экран
    ],
  };
}
