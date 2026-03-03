/**
 * Единый клиентский API для отправки заявок.
 * Использует существующий /api/lead (токены остаются на сервере).
 */

import { submitLead as apiSubmitLead, collectUtm } from "./lead/submitLead";
import type { LeadErrorCode } from "./lead/errors";
import { getUserMessage } from "./lead/errors";

export interface LeadPayload {
  name: string;
  phone: string; // E.164: +79001234567
  source: string;
  sourcePage?: string;
  comment?: string;
  /** Доп. поля для обратной совместимости с API */
  task?: string;
  need?: string;
  sphere?: string;
  niche?: string;
  timeline?: string;
  improve?: string;
  chaos?: string;
  _hp?: string;
  company?: string;
}

export type SendLeadResult =
  | { ok: true }
  | { ok: false; error: string };

// Защита от двойной отправки
let _sending = false;

export async function sendLead(payload: LeadPayload): Promise<SendLeadResult> {
  if (_sending) return { ok: false, error: "Отправка уже выполняется" };

  _sending = true;
  try {
    const body = {
      name: payload.name.trim(),
      contact: payload.phone,
      sourcePage: payload.sourcePage ?? payload.source,
      formId: payload.source,
      task: payload.comment ?? payload.task ?? payload.need ?? "",
      need: payload.need,
      sphere: payload.sphere ?? payload.niche,
      timeline: payload.timeline,
      improve: payload.improve,
      chaos: payload.chaos,
      _hp: payload._hp,
      company: payload.company,
    };

    if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_LEAD_DEBUG === "1") {
      console.log("[sendLead] source:", payload.source);
    }

    const result = await apiSubmitLead({
      ...body,
      utm: collectUtm(),
    });

    if (result.ok) return { ok: true };

    const code = (result as { ok: false; code: LeadErrorCode }).code;
    const msg = (result as { ok: false; message: string }).message ?? getUserMessage(code ?? "UNKNOWN");
    return { ok: false, error: msg };
  } catch {
    return { ok: false, error: "Нет соединения. Попробуйте ещё раз." };
  } finally {
    _sending = false;
  }
}
