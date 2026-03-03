import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";
const isStaticExport =
  (process.env.NEXT_OUTPUT ?? "").toLowerCase() === "export" ||
  process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Default: run as a normal Next server (`npm run start` must work).
  // Set NEXT_OUTPUT=export or GITHUB_PAGES=true for static export (e.g. GitHub Pages).
  output: isStaticExport ? "export" : undefined,
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: isStaticExport,
  images: {
    unoptimized: isStaticExport,
  },
  // Отключаем webpack cache — устраняет ENOENT pack.gz в OneDrive и при build && dev
  webpack: (config) => {
    config.cache = false;
    return config;
  },
};

export default nextConfig;
