"use client";

import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/motion";

type TypewriterProps = {
  lines: string[];
  /** ms per character when typing */
  typeSpeed?: number;
  /** ms pause at end of line before erase */
  pauseAfter?: number;
  /** ms per character when erasing */
  eraseSpeed?: number;
  /** ms pause before next line */
  pauseBefore?: number;
  className?: string;
  /** class for the blinking caret */
  caretClassName?: string;
};

export function Typewriter({
  lines,
  typeSpeed = 60,
  pauseAfter = 1800,
  eraseSpeed = 35,
  pauseBefore = 400,
  className = "",
  caretClassName = "",
}: TypewriterProps) {
  const [display, setDisplay] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pause" | "erasing" | "next">("typing");
  const reduced = useReducedMotion();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fullLine = lines[lineIndex] ?? "";

  useEffect(() => {
    if (reduced || lines.length === 0) {
      setDisplay(lines[0] ?? "");
      return;
    }

    const clear = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    };

    if (phase === "typing") {
      if (display.length < fullLine.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplay(fullLine.slice(0, display.length + 1));
        }, typeSpeed);
      } else {
        timeoutRef.current = setTimeout(() => setPhase("pause"), pauseAfter);
      }
    } else if (phase === "pause") {
      timeoutRef.current = setTimeout(() => setPhase("erasing"), pauseAfter);
    } else if (phase === "erasing") {
      if (display.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplay(display.slice(0, -1));
        }, eraseSpeed);
      } else {
        timeoutRef.current = setTimeout(() => {
          setPhase("next");
        }, pauseBefore);
      }
    } else {
      setLineIndex((i) => (i + 1) % lines.length);
      setPhase("typing");
    }

    return clear;
  }, [display, phase, lineIndex, fullLine, lines, reduced, typeSpeed, pauseAfter, eraseSpeed, pauseBefore]);

  if (reduced || lines.length === 0) {
    return (
      <div className={className}>
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    );
  }

  return (
    <span className={`inline-block ${className}`}>
      <span>{display}</span>
      <span
        className={`inline-block w-0.5 h-[1em] ml-0.5 align-middle bg-[var(--accent)] animate-[caret-blink_1s_step-end_infinite] ${caretClassName}`}
        aria-hidden
      />
    </span>
  );
}
