"use client";

import type { ReactNode } from "react";

type HintProps = {
  children: ReactNode;
  /** Accessible name for the hint button */
  title?: string;
};

/**
 * Small “?” control with hover + keyboard focus tooltip (no dependencies).
 */
export function Hint({ children, title = "Show hint" }: HintProps) {
  return (
    <span className="group/hint relative ml-1 inline-flex align-middle">
      <button
        type="button"
        title={title}
        className="h-5 w-5 shrink-0 rounded-full border-2 border-cyan-500/60 bg-cyan-950 text-[10px] font-bold leading-none text-cyan-200 outline-none transition-colors hover:bg-cyan-900 focus-visible:ring-2 focus-visible:ring-cyan-400"
        aria-label={title}
      >
        ?
      </button>
      <span
        role="tooltip"
        className="pointer-events-none invisible absolute bottom-[calc(100%+10px)] left-1/2 z-50 w-64 -translate-x-1/2 rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2 text-left text-xs leading-relaxed text-zinc-100 opacity-0 shadow-xl transition-opacity group-hover/hint:visible group-hover/hint:opacity-100 group-focus-within/hint:visible group-focus-within/hint:opacity-100 md:w-72"
      >
        {children}
        <span className="absolute left-1/2 top-full -mt-px -translate-x-1/2 border-8 border-transparent border-t-zinc-900" />
      </span>
    </span>
  );
}

