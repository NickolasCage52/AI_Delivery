import type { LeadPayload, NormalizedLead } from "./schema";

/**
 * Преобразует payload (от сайта или бота) в нормализованный формат для Telegram.
 */
export function normalizeLead(payload: LeadPayload, telegramUser?: string): NormalizedLead {
  const now = new Date().toISOString();

  return {
    name: payload.name?.trim() || "",
    contact: payload.contact.trim(),
    message: payload.message?.trim() || "",
    goal: payload.goal,
    service: payload.service,
    deadline: payload.deadline,
    sphere: payload.sphere || payload.niche || undefined,
    timeline: payload.timeline,
    improve: payload.improve,
    chaos: payload.chaos,
    source: payload.source,
    sourcePage: payload.sourcePage || "/",
    utm: payload.utm,
    createdAt: payload.createdAt || now,
    telegramUser,
  };
}
