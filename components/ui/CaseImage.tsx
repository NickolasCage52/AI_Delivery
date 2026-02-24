"use client";

import { useState } from "react";
import Image from "next/image";
import { getImageSrc } from "@/lib/utils/imagePath";

interface CaseImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  sizes?: string;
  loading?: "lazy" | "eager";
  fill?: boolean;
}

const PLACEHOLDER_SVG = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect fill="%2312082A" width="800" height="500"/><text x="400" y="250" text-anchor="middle" fill="%238B5CF6" font-size="18" font-family="system-ui,sans-serif">Скриншот проекта</text><text x="400" y="280" text-anchor="middle" fill="%237C7C96" font-size="14" font-family="system-ui,sans-serif">Добавьте изображение в public/cases-landing/</text></svg>'
)}`;

export function CaseImage({
  src,
  alt,
  width = 800,
  height = 500,
  className,
  style,
  sizes,
  loading = "lazy",
  fill = false,
}: CaseImageProps) {
  const [errored, setErrored] = useState(false);
  const fullSrc = getImageSrc(src);

  if (!fullSrc) {
    return (
      <div
        className={className}
        style={{
          ...style,
          background: "var(--bg-elevated)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span className="text-sm text-[var(--text-muted)]">Скриншот проекта</span>
      </div>
    );
  }

  if (errored) {
    return (
      <div
        className={className}
        style={{
          ...style,
          background: "var(--bg-elevated)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PLACEHOLDER_SVG}
          alt={alt}
          className="object-cover w-full h-full"
          style={fill ? { width: "100%", height: "100%" } : undefined}
        />
      </div>
    );
  }

  return (
    <Image
      src={fullSrc}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      style={style}
      sizes={sizes}
      loading={loading}
      fill={fill}
      onError={() => setErrored(true)}
      unoptimized
    />
  );
}
