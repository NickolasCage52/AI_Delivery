"use client";

import { memo, useRef } from "react";
import { motion } from "framer-motion";
import { useInViewport } from "@/hooks/useInViewport";
import { useTypewriterSequence } from "@/hooks/useTypewriterSequence";
import { CodeWindow } from "@/components/ui/CodeWindow";
import { NumbersProofLive } from "@/components/sections/NumbersProofLive";
import { HOME_COPY } from "@/content/site-copy";

const CODE_SNIPPETS: string[][] = [
  [
    "const score = await ai.classify(lead);",
    "if (score > 0.8) crm.create(lead);",
    "return score;",
  ],
  [
    "trigger: webhook → ai → crm",
    "if (lead.hot) notify();",
  ],
];

function CodeToMetricsDemoInner({ enabled = true }: { enabled?: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const inView = useInViewport(hostRef, { rootMargin: "120px", threshold: 0.1 });
  const active = enabled && inView;

  const { phase, display, statusLine, hasCursor } = useTypewriterSequence({
    inView: active,
    snippets: CODE_SNIPPETS,
    typeSpeed: 24,
    pauseBetweenSnippets: 220,
    buildDuration: 450,
    deployDuration: 600,
  });

  const copy = HOME_COPY.buildToMetrics;

  return (
    <div ref={hostRef} className="space-y-4">
      <div className="max-w-md md:max-w-lg">
        <CodeWindow
          phase={phase}
          display={display}
          statusLine={statusLine}
          hasCursor={hasCursor}
          tabLabel={copy?.codeTab ?? "workflow.ts"}
          statusDeploy={copy?.statusDeploy ?? "Deploying..."}
          statusLive={copy?.statusLive ?? "Live"}
          previewLabel={copy?.previewLabel ?? "Preview"}
          staticCode={CODE_SNIPPETS[0]?.join("\n")}
        />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={active && phase === "live" ? { opacity: 1 } : { opacity: 0.6 }}
        transition={{ duration: 0.35 }}
      >
        <NumbersProofLive enabled={phase === "live"} compact />
      </motion.div>
    </div>
  );
}

export const CodeToMetricsDemo = memo(CodeToMetricsDemoInner);
