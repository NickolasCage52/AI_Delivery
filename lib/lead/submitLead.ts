"use client";

export type LeadPayload = {
  name: string;
  contact: string;
  task?: string;
  need?: string;
  message?: string;
  sphere?: string;
  niche?: string;
  timeline?: string;
  deadline?: string;
  improve?: string;
  chaos?: string;
  sourcePage: string;
  utm?: Record<string, string>;
  honeypot?: string;
  _hp?: string;
  company?: string;
};

export type SubmitLeadResult = { ok: true } | { ok: false; error: string };

export async function submitLead(payload: LeadPayload): Promise<SubmitLeadResult> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (!res.ok) {
      return { ok: false, error: data.error ?? "Ошибка отправки" };
    }
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Сетевая ошибка";
    return { ok: false, error: msg };
  }
}

export function collectUtm(): Record<string, string> {
  if (typeof window === "undefined" || !window.location?.search) return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const [k, v] of params) {
    if (k.startsWith("utm_") && v) utm[k] = v;
  }
  return utm;
}
