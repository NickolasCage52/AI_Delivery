/**
 * Отправка заявки в чат заявок.
 */

import type { NormalizedLead } from "../../lib/lead/schema";
import { sendLeadToTelegram } from "../../lib/lead/sendToTelegram";

export async function sendLeadToChat(lead: NormalizedLead): Promise<boolean> {
  const result = await sendLeadToTelegram(lead);
  return result.ok;
}
