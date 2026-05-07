"use client";

import type { ReactNode } from "react";

type HintProps = {
  children: ReactNode;
  /** Accessible name for the hint button */
  title?: string;
};

/** Circular "i" glyph (outline) â€” scales with text line height. */
function InfoCircleGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle
        cx="8"
        cy="8"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeOpacity="0.5"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx="8" cy="5.15" r="0.9" fill="currentColor" fillOpacity="0.75" />
      <path
        d="M8 7.35v4.25"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />
    </svg>
  );
}

/**
 * Lightweight inline help: circular outline trigger + soft floating panel.
 */
export function Hint({ children, title = "Show hint" }: HintProps) {
  return (
    <span className="group/hint relative ml-1 inline-flex translate-y-px align-middle">
      <button
        type="button"
        title={title}
        onClick={(e) => e.stopPropagation()}
        className="inline-flex size-[15px] shrink-0 items-center justify-center rounded-full text-zinc-500/85 outline-none transition-colors hover:bg-white/[0.06] hover:text-teal-400/95 focus-visible:ring-1 focus-visible:ring-teal-500/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1730] active:scale-95 sm:size-4"
        aria-label={title}
      >
        <InfoCircleGlyph className="size-[13px] sm:size-3.5" />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none invisible absolute bottom-[calc(100%+7px)] left-1/2 z-50 w-max max-w-[min(17.5rem,calc(100vw-2rem))] -translate-x-1/2 rounded-lg border border-white/[0.07] bg-zinc-950/90 px-2.5 py-1.5 text-left text-[11px] leading-relaxed text-zinc-300/95 opacity-0 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.65),inset_0_1px_0_0_rgba(255,255,255,0.04)] backdrop-blur-md transition-[opacity,visibility] duration-200 ease-out [&_code]:rounded [&_code]:bg-black/30 [&_code]:px-0.5 [&_code]:text-[10px] [&_code]:text-cyan-300 [&_strong]:font-medium [&_strong]:text-zinc-100 group-hover/hint:visible group-hover/hint:opacity-100 group-focus-within/hint:visible group-focus-within/hint:opacity-100"
      >
        {children}
        <span
          className="absolute left-1/2 top-full -mt-px -translate-x-1/2 border-[5px] border-transparent border-t-zinc-950/92"
          aria-hidden
        />
      </span>
    </span>
  );
}

