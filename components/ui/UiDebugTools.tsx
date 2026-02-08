"use client";

import { useEffect, useState } from "react";

const UI_DEBUG_ENABLED =
  process.env.NODE_ENV === "development" &&
  (process.env.NEXT_PUBLIC_UI_DEBUG === "1" ||
    process.env.NEXT_PUBLIC_UI_DEBUG === "true" ||
    process.env.NEXT_PUBLIC_UI_DEBUG === "on");

export function UiDebugTools() {
  const [grid, setGrid] = useState(false);
  const [outline, setOutline] = useState(false);

  useEffect(() => {
    if (!UI_DEBUG_ENABLED || typeof document === "undefined") return;
    if (outline) {
      document.documentElement.dataset.uiDebugOutline = "true";
    } else {
      delete document.documentElement.dataset.uiDebugOutline;
    }
  }, [outline]);

  useEffect(() => {
    if (!UI_DEBUG_ENABLED || typeof document === "undefined") return;

    let raf = 0;
    const checkOverflow = () => {
      raf = 0;
      const scrollWidth = document.body.scrollWidth;
      const innerWidth = window.innerWidth;
      if (scrollWidth > innerWidth + 1) {
        console.warn("[UI DEBUG] Horizontal overflow detected", {
          scrollWidth,
          innerWidth,
          diff: scrollWidth - innerWidth,
        });
      }
    };

    const scheduleCheck = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(checkOverflow);
    };

    scheduleCheck();
    window.addEventListener("resize", scheduleCheck);
    window.addEventListener("scroll", scheduleCheck, { passive: true });
    const observer = new MutationObserver(scheduleCheck);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", scheduleCheck);
      window.removeEventListener("scroll", scheduleCheck);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!UI_DEBUG_ENABLED || typeof document === "undefined") return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.shiftKey) return;
      if (e.code === "KeyG") {
        e.preventDefault();
        setGrid((v) => !v);
      }
      if (e.code === "KeyO") {
        e.preventDefault();
        setOutline((v) => !v);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!UI_DEBUG_ENABLED) return null;

  return (
    <>
      {grid && (
        <div className="ui-debug-grid" aria-hidden>
          <div className="ui-debug-grid__container" />
        </div>
      )}
      <div className="ui-debug-panel">
        <div className="mb-1 text-[10px] uppercase tracking-widest text-white/60">UI Debug</div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setGrid((v) => !v)} aria-pressed={grid}>
            Grid {grid ? "on" : "off"}
          </button>
          <button type="button" onClick={() => setOutline((v) => !v)} aria-pressed={outline}>
            Outline {outline ? "on" : "off"}
          </button>
        </div>
        <div className="mt-1 text-[10px] text-white/50">Shift+G / Shift+O</div>
      </div>
    </>
  );
}
