"use client";

export function DataStreamsBg() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-20"
      aria-hidden
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="stream-cyan" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="stream-violet" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0" />
            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </linearGradient>
          <filter id="blur-stream">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
          </filter>
        </defs>
        <line x1="0" y1="20" x2="100" y2="20" stroke="url(#stream-cyan)" strokeWidth="0.3" filter="url(#blur-stream)" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="url(#stream-cyan)" strokeWidth="0.3" filter="url(#blur-stream)" />
        <line x1="0" y1="80" x2="100" y2="80" stroke="url(#stream-cyan)" strokeWidth="0.3" filter="url(#blur-stream)" />
        <line x1="70" y1="0" x2="70" y2="100" stroke="url(#stream-violet)" strokeWidth="0.3" filter="url(#blur-stream)" />
      </svg>
    </div>
  );
}
