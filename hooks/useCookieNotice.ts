"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "ai_cookie_notice_dismissed";
const EXPIRY_DAYS = 365;

function getStored(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw) as { dismissedAt?: number };
    const at = data?.dismissedAt;
    if (typeof at !== "number") return false;
    const expires = at + EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    return Date.now() < expires;
  } catch {
    return false;
  }
}

function setStored() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ dismissedAt: Date.now() })
    );
  } catch {
    // ignore
  }
}

export function useCookieNotice() {
  const [isDismissed, setIsDismissed] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDismissed(getStored());
  }, []);

  const dismiss = useCallback(() => {
    setStored();
    setIsDismissed(true);
  }, []);

  return {
    isDismissed,
    showNotice: mounted && !isDismissed,
    dismiss,
  };
}
