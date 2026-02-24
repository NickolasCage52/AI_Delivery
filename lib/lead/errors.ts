/**
 * Типизированные коды ошибок отправки заявок.
 * Используются для единого UX и диагностики.
 */
export type LeadErrorCode =
  | "VALIDATION_ERROR"
  | "RATE_LIMIT"
  | "TELEGRAM_FAILED"
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "UNKNOWN";

export const ERROR_MESSAGES: Record<LeadErrorCode, string> = {
  VALIDATION_ERROR: "Проверьте заполнение полей. Контакт обязателен, сообщение — минимум 10 символов.",
  RATE_LIMIT: "Слишком много попыток. Подождите 10 минут или напишите в Telegram.",
  TELEGRAM_FAILED: "Не удалось отправить. Попробуйте ещё раз или напишите в Telegram.",
  NETWORK_ERROR: "Нет соединения. Проверьте интернет и попробуйте снова.",
  TIMEOUT: "Превышено время ожидания. Попробуйте ещё раз или напишите в Telegram.",
  UNKNOWN: "Не удалось отправить. Попробуйте ещё раз или напишите в Telegram.",
};

/** Человекопонятное сообщение для пользователя */
export function getUserMessage(code: LeadErrorCode): string {
  return ERROR_MESSAGES[code] ?? ERROR_MESSAGES.UNKNOWN;
}
