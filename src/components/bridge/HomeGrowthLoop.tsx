import { ArrowDown, ArrowRight, CircleDot, Radio, Trophy } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: CircleDot,
    title: "Bridge in",
    body: "Record a bridge_hold_completed-style event with route, notional, and wallet - same payload you will use with Torque ingest.",
  },
  {
    icon: Radio,
    title: "Prove the hold",
    body: "Post daily bridge_hold_daily_snapshot events with balance, meetsThreshold, and streakDays so campaigns grade real behavior.",
  },
  {
    icon: Trophy,
    title: "Run incentives",
    body: "Use Torque primitives - leaderboards, raffles, rebates, gifts - driven by MCP or API so rewards follow live custom_events.",
  },
] as const;

export function HomeGrowthLoop() {
  return (
    <section className="border-b border-slate-200 bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-800/90">Flow</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Built-in growth loop</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              BridgeHold is intentionally narrow: it emits the custom events your Torque SQL expects, then gets out of the
              way. Wire your keys once and every simulator tick behaves like production traffic.
            </p>
          </div>
          <Link
            href="/how-it-works"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-900 transition hover:border-teal-300 hover:bg-teal-100/80"
          >
            Read the full flow
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <ol className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch lg:gap-x-2">
          {steps.flatMap((step, i) => {
            const stepNode = (
              <li key={step.title} className="min-w-0">
                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-900/[0.04]">
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600"
                    aria-hidden
                  />
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-900/15">
                      <step.icon className="h-6 w-6" strokeWidth={2} aria-hidden />
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-[11px] font-bold tabular-nums text-slate-600">
                      STEP {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{step.body}</p>
                </div>
                {i < steps.length - 1 ? (
                  <div
                    className="flex justify-center py-3 text-teal-600 lg:hidden"
                    aria-hidden
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-teal-200 bg-teal-50">
                      <ArrowDown className="h-5 w-5" strokeWidth={2.5} />
                    </span>
                  </div>
                ) : null}
              </li>
            );

            if (i < steps.length - 1) {
              return [
                stepNode,
                <li
                  key={`connector-${i}`}
                  className="hidden min-h-[4rem] items-center justify-center self-center lg:flex"
                  aria-hidden
                >
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-teal-100 bg-white text-teal-700 shadow-sm">
                    <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
                  </span>
                </li>,
              ];
            }
            return [stepNode];
          })}
        </ol>
      </div>
    </section>
  );
}
