import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";
const isStaticExport = (process.env.NEXT_OUTPUT ?? "").toLowerCase() === "export";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Default: run as a normal Next server (`npm run start` must work).
  // Set NEXT_OUTPUT=export for static export builds.
  output: isStaticExport ? "export" : undefined,
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: isStaticExport,
  images: {
    unoptimized: isStaticExport,
  },
};

export default nextConfig;
