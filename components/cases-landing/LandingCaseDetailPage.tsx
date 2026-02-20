"use client";

import { useState, useCallback } from "react";
import { CaseDetailView } from "./CasesShowcase";
import { GalleryLightbox } from "./GalleryLightbox";
import { getDisplayImages } from "./cases-data";
import type { CaseItem } from "./cases-data";

export function LandingCaseDetailPage({
  caseItem,
  allCases,
}: {
  caseItem: CaseItem;
  allCases: CaseItem[];
}) {
  const [lightbox, setLightbox] = useState<{ images: string[]; startIndex: number } | null>(null);

  const onOpenGallery = useCallback((slug: string, idx: number) => {
    const item = allCases.find((c) => c.slug === slug);
    if (!item) return;
    const images = getDisplayImages(item);
    if (images.length) setLightbox({ images, startIndex: idx });
  }, [allCases]);

  return (
    <>
      <CaseDetailView caseItem={caseItem} onOpenGallery={onOpenGallery} cases={allCases} />
      {lightbox && (
        <GalleryLightbox
          images={lightbox.images}
          startIndex={lightbox.startIndex}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
