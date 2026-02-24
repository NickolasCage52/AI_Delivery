"use client";

import { TELEGRAM_LEAD_BOT_URL } from "@/lib/constants/telegram";

type Variant = "success" | "error" | "idle";

export function FormStatus({
  variant,
  message,
  className = "",
}: {
  variant: Variant;
  message?: string;
  className?: string;
}) {
  if (variant === "idle") return null;

  const isSuccess = variant === "success";

  const defaultSuccess = "Заявка отправлена. Мы свяжемся в течение 24 часов.";
  const defaultError =
    "Не удалось отправить. Попробуйте ещё раз или напишите в Telegram.";

  const text = message ?? (isSuccess ? defaultSuccess : defaultError);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`rounded-lg px-4 py-3 text-sm ${
        isSuccess
          ? "bg-[var(--accent)]/10 text-[var(--accent-pink-strong)]"
          : "bg-red-500/10 text-[#f08c7a]"
      } ${className}`}
    >
      <p>{text}</p>
      {!isSuccess && (
        <p className="mt-2">
          <a
            href={TELEGRAM_LEAD_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] underline hover:no-underline"
          >
            Оставить заявку в Telegram
          </a>
        </p>
      )}
    </div>
  );
}
