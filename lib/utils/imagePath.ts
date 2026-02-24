/**
 * Prepends basePath to image paths for GitHub Pages / static export.
 * NEXT_PUBLIC_BASE_PATH должен быть задан при сборке для GitHub Pages.
 */
export function getImageSrc(path: string): string {
  if (!path) return "";
  const base = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";
  if (!base) return path;
  // Путь должен начинаться с /
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const baseNormalized = base.endsWith("/") ? base.slice(0, -1) : base;
  return `${baseNormalized}${normalized}`;
}
