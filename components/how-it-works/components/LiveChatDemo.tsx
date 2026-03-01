"use client";

import { memo, useRef, useState, useCallback } from "react";
import { useInViewport } from "@/hooks/useInViewport";
import { useReducedMotion } from "@/lib/motion";
import { useAnimationCycle } from "../hooks/useAnimationCycle";
import s from "../how-it-works.module.css";

const MESSAGES = [
  { text: "Сколько стоит?", side: "user", type: "chat" as const },
  {
    text: "Добрый день! Чтобы назвать точную цену, уточните...",
    side: "ai",
    type: "chat" as const,
  },
  {
    text: "Лид квалифицирован → задача создана → менеджер уведомлён",
    side: "system",
    type: "system" as const,
  },
];

/** Timing: typing 800 + user 300 + pause 600 + typing 800 + bot 300 + system 400 + hold 2000 = 5200ms */
const CYCLE_MS = 5200;
const RESET_FADE_MS = 400;
const PAUSE_MS = RESET_FADE_MS;

function LiveChatDemoInner({ enabled = true }: { enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref, { rootMargin: "120px", threshold: 0.5 });
  const active = enabled && inView;
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [resetting, setResetting] = useState(false);

  useAnimationCycle({
    enabled: active,
    pauseMs: PAUSE_MS,
    cycleDurationMs: CYCLE_MS,
    onStart: useCallback(() => {
      setResetting(false);
      setPlaying(true);
    }, []),
    onReset: useCallback(() => {
      setPlaying(false);
      setResetting(true);
    }, []),
  });

  const show = active || reduced;
  const runAnimation = show && !reduced && playing && !resetting;

  return (
    <div
      ref={ref}
      className="rounded-xl border border-white/[0.08] bg-[rgba(8,5,24,0.6)] p-5 md:p-6 max-w-lg"
    >
      <div className="flex items-center gap-2 mb-4">
        <span
          className={`h-2 w-2 rounded-full bg-emerald-500 ${runAnimation ? "animate-pulse" : ""}`}
          aria-hidden
        />
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Живой чат
        </span>
      </div>
      <div className="space-y-3">
        {/* Typing indicator: 800ms before bot reply */}
        {runAnimation && (
          <div
            className={`flex justify-start opacity-0 ${s.liveChatTyping}`}
            style={{ animationDelay: "600ms" }}
          >
            <span className="rounded-lg bg-white/5 border border-white/5 px-4 py-2.5 text-sm text-[var(--text-muted)]">
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "0.15s" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "0.3s" }} />
              </span>
            </span>
          </div>
        )}
        {MESSAGES.map((msg, i) => {
          const delay =
            msg.type === "system"
              ? 600 + 600 + 400
              : msg.side === "ai"
                ? 600 + 600 + 800
                : i * 600;
          return (
            <div
              key={i}
              className={`flex ${msg.side === "user" ? "justify-end" : "justify-start"} ${s.liveChatMsg} ${
                msg.side === "user" ? s.liveChatMsgUser : s.liveChatMsgAi
              } ${runAnimation ? s.liveChatMsgActive : ""} ${reduced ? s.liveChatMsgReduced : ""}`}
              style={{
                animationDelay: runAnimation ? `${delay}ms` : undefined,
                opacity: reduced ? 1 : resetting ? 0 : undefined,
                transition: resetting ? `opacity ${RESET_FADE_MS}ms ease-out` : undefined,
              }}
            >
              <span
                className={`rounded-lg px-4 py-2.5 text-sm max-w-[85%] ${
                  msg.type === "system"
                    ? "bg-[rgba(34,197,94,0.15)] text-emerald-400 border border-emerald-500/30"
                    : msg.side === "user"
                      ? "bg-[var(--accent)]/20 text-[var(--text-primary)] border border-[var(--accent)]/30"
                      : "bg-white/5 text-[var(--text-secondary)] border border-white/5"
                }`}
              >
                {msg.side === "user" && "👤 "}
                {msg.side === "ai" && "🤖 "}
                {msg.type === "system" && "✅ "}
                {msg.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const LiveChatDemo = memo(LiveChatDemoInner);
