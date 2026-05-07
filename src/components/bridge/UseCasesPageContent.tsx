import Link from "next/link";

import { STRATEGIC_PILLARS } from "@/lib/bridge/strategic-pillars";

export function UseCasesPageContent() {
  return (
    <>
      <div className="max-w-3xl">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-800">Use cases</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Where BridgeHold + Torque win together
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
          Each block ties a <strong className="font-medium text-slate-800">concrete growth problem</strong> to{" "}
          <strong className="font-medium text-slate-800">Torque primitives</strong> fed by the same two custom events
          BridgeHold emits. Every story maps to fields you can filter and score in Torque.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/simulator"
            className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-500"
          >
            Open simulator
          </Link>
          <Link
            href="/how-it-works"
            className="rounded-xl border-2 border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Technical flow
          </Link>
        </div>
      </div>

      <ul className="mt-14 space-y-12">
        {STRATEGIC_PILLARS.map((pillar, i) => (
          <li
            key={pillar.id}
            id={pillar.id}
            className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="font-mono text-xs font-semibold text-amber-700">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">{pillar.title}</h2>
              </div>
              <p className="max-w-md text-sm font-medium text-slate-700">{pillar.hook}</p>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-slate-600">{pillar.detail}</p>
            <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">How Torque uses it</p>
              <p className="mt-2 text-sm leading-relaxed text-teal-950/90">{pillar.torquePlay}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
