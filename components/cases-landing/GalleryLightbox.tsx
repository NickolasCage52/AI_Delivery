"use client";

import { useState, useEffect, useCallback } from "react";
import s from "@/app/cases/cases-landing.module.css";

export function GalleryLightbox({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(Math.max(0, Math.min(startIndex, images.length - 1)));

  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i >= images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, goPrev, goNext]);

  return (
    <div
      className={`${s.lightbox} ${s.lightboxOpen}`}
      role="dialog"
      aria-modal="true"
      aria-label="Галерея фото кейса"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button type="button" className={`${s.lightboxBtn} ${s.lightboxClose}`} aria-label="Закрыть" onClick={onClose}>
        ×
      </button>
      <button type="button" className={`${s.lightboxBtn} ${s.lightboxPrev}`} aria-label="Предыдущее фото" onClick={goPrev}>
        ‹
      </button>
      <div className={s.lightboxContent}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[index]} alt={`Фото ${index + 1} из ${images.length}`} />
      </div>
      <button type="button" className={`${s.lightboxBtn} ${s.lightboxNext}`} aria-label="Следующее фото" onClick={goNext}>
        ›
      </button>
      <span className={s.lightboxCounter} aria-live="polite">
        {index + 1} / {images.length}
      </span>
    </div>
  );
}
