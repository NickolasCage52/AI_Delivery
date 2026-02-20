"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/motion";

export type Phase = "typing" | "build" | "deploying" | "live";

export type UseTypewriterSequenceOptions = {
  inView: boolean;
  snippets: string[][];
  typeSpeed?: number;
  pauseBetweenSnippets?: number;
  buildDuration?: number;
  deployDuration?: number;
};

export function useTypewriterSequence({
  inView,
  snippets,
  typeSpeed = 42,
  pauseBetweenSnippets = 600,
  buildDuration = 1200,
  deployDuration = 1800,
}: UseTypewriterSequenceOptions) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(reduced ? "live" : "typing");
  const [display, setDisplay] = useState("");
  const [statusLine, setStatusLine] = useState<string | null>(null);

  const snippetIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastInViewRef = useRef(false);

  const clearTimeoutRef = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Reset when re-entering viewport
  useEffect(() => {
    if (!inView) {
      clearTimeoutRef();
      lastInViewRef.current = false;
      return;
    }
    if (reduced) {
      setPhase("live");
      setDisplay(snippets[0]?.join("\n") ?? "");
      setStatusLine(null);
      lastInViewRef.current = true;
      return;
    }
    const wasOut = !lastInViewRef.current;
    lastInViewRef.current = true;
    if (wasOut) {
      snippetIndexRef.current = 0;
      charIndexRef.current = 0;
      setPhase("typing");
      setDisplay("");
      setStatusLine(null);
    }
  }, [inView, reduced, snippets, clearTimeoutRef]);

  // Typing phase only
  useEffect(() => {
    if (!inView || reduced || phase !== "typing") {
      return;
    }

    const fullSnippet = snippets[snippetIndexRef.current] ?? [];
    const fullText = fullSnippet.join("\n");

    if (charIndexRef.current < fullText.length) {
      timeoutRef.current = setTimeout(() => {
        charIndexRef.current += 1;
        setDisplay(fullText.slice(0, charIndexRef.current));
      }, typeSpeed);
    } else {
      snippetIndexRef.current += 1;
      if (snippetIndexRef.current >= snippets.length) {
        setPhase("build");
        setStatusLine("Build complete");
      } else {
        timeoutRef.current = setTimeout(() => {
          charIndexRef.current = 0;
          setDisplay("");
        }, pauseBetweenSnippets);
      }
    }

    return clearTimeoutRef;
  }, [inView, reduced, phase, display, snippets, typeSpeed, pauseBetweenSnippets, clearTimeoutRef]);

  // Build phase → Deploying
  useEffect(() => {
    if (!inView || reduced || phase !== "build") return;
    const t = setTimeout(() => {
      setPhase("deploying");
      setStatusLine("Deploying...");
    }, buildDuration);
    return () => clearTimeout(t);
  }, [inView, reduced, phase, buildDuration]);

  // Deploying phase → Live
  useEffect(() => {
    if (!inView || reduced || phase !== "deploying") return;
    const t = setTimeout(() => {
      setPhase("live");
      setStatusLine("Live");
    }, deployDuration);
    return () => clearTimeout(t);
  }, [inView, reduced, phase, deployDuration]);

  return { phase, display, statusLine, hasCursor: phase === "typing" };
}
