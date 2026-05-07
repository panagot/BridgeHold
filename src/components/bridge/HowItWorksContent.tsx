"use client";

import Link from "next/link";

import { Hint } from "@/components/Tooltip";

const steps = [
  {
    step: "01",
    title: "Bridge event",
    body: "When assets land on the destination chain, call the ingester with a bridge_completed-style event (amount, route, mock tx hash).",
  },
  {
    step: "02",
    title: "Daily snapshot",
    body: "Each day your worker POSTs meetsThreshold, balance, streakDays, etc. That is what leaderboards and raffles consume.",
  },
  {
    step: "03",
    title: "Torque campaigns",
    body: "Attach those custom events in Torque, build SQL in MCP, ship rebates or raffles for wallets that stay above your min.",
  },
] as const;

const primitives = [
  {
    title: "Leaderboard",
    tone: "amber",
    detail:
      "Rank by streakDays or qualifying snapshot count to keep weekly competitions tied to actual holding behavior.",
    field: "streakDays, qualifyingDays",
  },
  {
    title: "Raffle",
    tone: "orange",
    detail:
      "Issue tickets from meetsThreshold snapshots so consistent smaller wallets still have fair odds.",
    field: "meetsThreshold, dayIndex",
  },
  {
    title: "Rebate / gift",
    tone: "cyan",
    detail:
      "Reward bridge size and long streak milestones with deterministic payout logic in Torque SQL.",
    field: "bridgedAmount, streakDays",
  },
  {
    title: "Retention analytics",
    tone: "slate",
    detail:
      "Track conversion after bridge and monitor drop-off windows to tune campaigns and epoch cadence.",
    field: "sourceChain, destChain, balance",
  },
] as const;

export function HowItWorksContent() {
  return (
    <>
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
        <p className="font-mono text-xs tracking-[0.16em] text-slate-500">SYSTEM OVERVIEW</p>
        <h1 className="mt-3 inline-flex flex-wrap items-center gap-1 text-3xl font-semibold tracking-tight text-slate-900">
          How it works
          <Hint title="End-to-end loop">
            BridgeHold emits bridge and snapshot events; Torque consumes those events to power incentives with SQL.
          </Hint>
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Your app records the bridge, your worker posts daily hold snapshots, and Torque campaign logic decides rewards.
          Same payload shape in demo and production.
        </p>
        <p className="mt-4 text-sm text-slate-600">
          <Link href="/use-cases" className="font-semibold text-teal-700 hover:underline">
            Five strategic use cases
          </Link>{" "}
          - sticky TVL, anti-dump rules, cohort &amp; route growth, consumer seasons, and distributor loops - all map to these
          same events.
        </p>
        <div className="mt-6 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 font-medium text-amber-800">
            Bridge event
          </span>
          <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 font-medium text-orange-800">
            Daily snapshot
          </span>
          <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 font-medium text-cyan-800">
            Torque campaigns
          </span>
        </div>
      </section>

      <ol className="mt-8 grid gap-4 lg:grid-cols-3">
        {steps.map((item) => (
          <li key={item.step} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-semibold text-slate-600">
              STEP {item.step}
            </span>
            <h2 className="mt-3 text-lg font-semibold text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
          </li>
        ))}
      </ol>

      <section className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
        <h2 className="inline-flex items-center gap-1 text-xl font-semibold text-slate-900">
          Mapped to Torque primitives
          <Hint title="Why this mapping">
            Reliable recurring fields let you build fair leaderboards, raffles, and reward logic without contract changes.
          </Hint>
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Use the same stream of custom events to run multiple campaign types by changing only SQL selection logic.
        </p>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {primitives.map((p) => (
            <li key={p.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-slate-900">{p.title}</h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    p.tone === "amber"
                      ? "bg-amber-50 text-amber-800 ring-1 ring-amber-300"
                      : p.tone === "orange"
                        ? "bg-orange-50 text-orange-800 ring-1 ring-orange-300"
                        : p.tone === "cyan"
                          ? "bg-cyan-50 text-cyan-800 ring-1 ring-cyan-300"
                          : "bg-slate-100 text-slate-700 ring-1 ring-slate-300"
                  }`}
                >
                  {p.field}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.detail}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
