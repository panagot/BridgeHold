import { Gamepad2, GitBranch, Layers, ShieldCheck, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

import { STRATEGIC_PILLARS } from "@/lib/bridge/strategic-pillars";

const icons = [Layers, ShieldCheck, GitBranch, Gamepad2, Users] as const;

export function HomeStrategicPillars() {
  return (
    <section
      id="use-cases"
      className="scroll-mt-24 border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700/90">
            Why BridgeHold stands out
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Five growth stories, one Torque integration
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            BridgeHold makes explicit <strong className="font-medium text-slate-800">what you measure</strong> (hold depth,
            patience, cohorts, seasons, partner outcomes) and <strong className="font-medium text-slate-800">how Torque consumes it</strong>
            - custom_events in, incentives and distributors out.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STRATEGIC_PILLARS.map((pillar, i) => {
            const Icon = icons[i] ?? Layers;
            return (
              <li
                key={pillar.id}
                className="group flex flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm ring-1 ring-black/[0.03] transition hover:border-amber-200/80 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-50 text-amber-900 shadow-sm ring-1 ring-amber-200/60">
                    <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-400">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="mt-4 font-semibold leading-snug text-slate-900">{pillar.title}</h3>
                <p className="mt-2 text-sm font-medium text-slate-700">{pillar.hook}</p>
                <p className="mt-3 flex-1 text-xs leading-relaxed text-slate-600">{pillar.torquePlay}</p>
                <Link
                  href={`/use-cases#${pillar.id}`}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-900"
                >
                  Deep dive
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 text-center text-sm text-slate-500">
          <Link href="/use-cases" className="font-semibold text-teal-700 hover:underline">
            Read the full use-case playbook -&gt;
          </Link>
        </p>
      </div>
    </section>
  );
}
