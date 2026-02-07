import type { CaseArtifact } from "@/lib/content/cases";

const BG_BY_TYPE: Record<CaseArtifact["type"], string> = {
  flow: "from-[var(--accent)]/20 via-transparent to-[var(--accent-pink)]/20",
  ui: "from-[var(--accent-pink)]/20 via-transparent to-[var(--accent)]/20",
  dashboard: "from-[var(--accent)]/15 via-transparent to-[var(--accent-pink)]/25",
};

export function CaseArtifactPreview({ artifact }: { artifact: CaseArtifact }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[var(--bg-surface)]/60 p-4">
      <div
        className={`h-28 w-full rounded-lg bg-gradient-to-br ${BG_BY_TYPE[artifact.type]} relative overflow-hidden`}
      >
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.2), transparent 55%)" }} />
        <div className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-1 text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
          {artifact.title}
        </div>
      </div>
    </div>
  );
}
