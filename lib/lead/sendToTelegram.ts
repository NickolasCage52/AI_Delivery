import type { NormalizedLead } from "./schema";
import { formatLeadForTelegram } from "./formatTelegram";

export type SendResult = { ok: true } | { ok: false; status: number; errorCode?: number; description?: string };

/**
 * Отправляет заявку в Telegram-чат.
 * Используется API route и ботом.
 */
export async function sendLeadToTelegram(
  lead: NormalizedLead,
  token?: string,
  chatId?: string
): Promise<SendResult> {
  const t = token || process.env.TELEGRAM_BOT_TOKEN;
  const c = chatId || process.env.TELEGRAM_CHAT_ID;
  if (!t || !c) {
    console.error("[lead] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set");
    return { ok: false, status: 500, description: "Missing env" };
  }

  const text = formatLeadForTelegram(lead);

  const res = await fetch(`https://api.telegram.org/bot${t}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: c,
      text,
      disable_web_page_preview: true,
    }),
  });

  if (!res.ok) {
    let errBody: { description?: string; error_code?: number } = {};
    try {
      errBody = await res.json();
    } catch {
      errBody = { description: await res.text() };
    }
    console.error("[lead] Telegram API error:", res.status, errBody);
    return {
      ok: false,
      status: res.status,
      errorCode: errBody.error_code,
      description: errBody.description,
    };
  }
  return { ok: true };
}
