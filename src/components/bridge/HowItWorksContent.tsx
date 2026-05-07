"use client";

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

export function HowItWorksContent() {
  return (
    <>
      <h1 className="inline-flex flex-wrap items-center gap-1 text-3xl font-semibold tracking-tight text-white">
        How it works
        <Hint title="End-to-end loop">
          BridgeHold is the <strong className="text-zinc-200">event spine</strong>: bridge in, prove holds with daily
          snapshots, let Torque campaigns read the same custom events you emit from this app or your production worker.
        </Hint>
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-zinc-400 sm:text-base">
        Three moving parts: your product records bridges, a cron or indexer snapshots balances, and Torque scores
        participants for incentives.
      </p>
      <ol className="mt-10 grid gap-4 sm:grid-cols-3">
        {steps.map((item) => (
          <li
            key={item.step}
            className="relative rounded-2xl border border-zinc-700/80 bg-slate-900/70 p-5 pt-8"
          >
            <span className="absolute left-5 top-4 font-mono text-xs font-medium text-cyan-400">
              {item.step}
            </span>
            <h2 className="text-base font-medium text-white">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.body}</p>
          </li>
        ))}
      </ol>

      <section className="mt-14 rounded-2xl border border-teal-900/40 bg-teal-950/15 p-6 sm:p-8">
        <h2 className="inline-flex flex-wrap items-center gap-1 text-xl font-semibold text-teal-200">
          Mapped to Torque primitives
          <Hint title="Why this mapping">
            Each primitive in Torque (leaderboard, raffle, rebate) needs trustworthy signals. Snapshot events carry
            booleans and counters your SQL can filter — no new on-chain contracts required for the integration.
          </Hint>
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Torque is the programmable retention layer: leaderboards, rebates, raffles, and gifts. BridgeHold gives each
          primitive <strong className="text-zinc-200">clean, recurring signals</strong> so campaigns optimize on real
          hold behavior instead of one-off transfers.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          <li className="rounded-xl border border-zinc-700/60 bg-slate-900/50 p-4">
            <h3 className="font-semibold text-white">Leaderboard</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Rank on <span className="font-mono text-cyan-300">streakDays</span> or count of qualifying snapshots —
              aligns with Torque competition primitives and sybil-aware scoring.
            </p>
          </li>
          <li className="rounded-xl border border-zinc-700/60 bg-slate-900/50 p-4">
            <h3 className="font-semibold text-white">Raffle</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Tickets from daily <span className="font-mono text-cyan-300">meetsThreshold</span> so smaller holders who
              stay consistent still earn odds — not just whales.
            </p>
          </li>
          <li className="rounded-xl border border-zinc-700/60 bg-slate-900/50 p-4">
            <h3 className="font-semibold text-white">Rebate / gift</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Payout on bridge size or streak milestones using <span className="font-mono text-cyan-300">bridgedAmount</span>{" "}
              and snapshot streak fields.
            </p>
          </li>
          <li className="rounded-xl border border-zinc-700/60 bg-slate-900/50 p-4">
            <h3 className="font-semibold text-white">Velocity &amp; ROI</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Torque’s analytics stack (built for teams moving billions in volume) lets you tune epochs as retention data
              flows in — BridgeHold is the event spine for that loop.
            </p>
          </li>
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-semibold text-white">Example campaign concepts</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Pair these patterns with Torque incentives — each line is a concise campaign concept you can implement in SQL.
        </p>
        <ul className="mt-6 space-y-3 text-sm text-zinc-300">
          <li>
            <strong className="text-white">“Sticky SOL” week</strong> — Bridge from any preset route (nine chains in the
            examples grid); daily snapshots mint raffle tickets only when balance stays above your protocol’s min.
          </li>
          <li>
            <strong className="text-white">VIP vs community rails</strong> — High bridgedAmount opens leaderboard tier A;
            micro bridges stay in tier B with separate prize pools (inclusive growth story).
          </li>
          <li>
            <strong className="text-white">Decay-aware rebates</strong> — Users with slow balance bleed still get partial
            credit until they fall below min — mirrors real fee drag without harsh binary loss.
          </li>
          <li>
            <strong className="text-white">Twin-wallet comparison</strong> — Run the live demo twin script to register
            two participants, bridge different notionals, and advance days in parallel so the board shows two streaks.
          </li>
          <li>
            <strong className="text-white">Leaderboard seed</strong> — The fourth live-demo script registers three
            personas and advances one day each to populate a multi-wallet board in one pass.
          </li>
          <li>
            <strong className="text-white">Preset flow shortcut</strong> — In the simulator, “Run preset flow” chains
            register → bridge → three ticks without stepping through each control manually.
          </li>
        </ul>
      </section>
    </>
  );
}
