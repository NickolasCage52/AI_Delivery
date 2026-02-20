"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLenisRef } from "@/lib/scroll/LenisContext";

const HASH_SCROLL_RETRIES = 5;

function scrollToHash(hash: string) {
  const id = hash.slice(1);
  if (!id) return;
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "auto", block: "start" });
    return;
  }
  let attempts = 0;
  function tryScroll() {
    attempts++;
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "auto", block: "start" });
      return;
    }
    if (attempts < HASH_SCROLL_RETRIES) requestAnimationFrame(tryScroll);
  }
  requestAnimationFrame(tryScroll);
}

export function ScrollToTopOnRouteChange() {
  const pathname = usePathname();
  const lenisRef = useLenisRef();

  useEffect(() => {
    if (typeof window === "undefined") return;
    history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash) {
      scrollToHash(hash);
      return;
    }
    const lenis = lenisRef?.current ?? null;
    if (lenis?.scrollTo) {
      try {
        lenis.scrollTo(0, { immediate: true });
      } catch {
        window.scrollTo(0, 0);
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname, lenisRef]);

  return null;
}
