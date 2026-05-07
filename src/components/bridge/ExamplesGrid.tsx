"use client";

import Link from "next/link";

import { Hint } from "@/components/Tooltip";
import { SCENARIOS, shortAddr } from "@/lib/bridge/constants";

export function ExamplesGrid() {
  return (
    <>
      <h1 className="inline-flex flex-wrap items-center gap-1 text-3xl font-semibold tracking-tight text-white">
        Example scenarios
        <Hint title="Why nine presets">
          Each row is a believable persona: chain route, notional, min-hold, and optional decay. Unique wallets mean you
          can load several into the simulator back-to-back and show a real multi-wallet board — no manual re-typing.
        </Hint>
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-zinc-400 sm:text-base">
        Each preset opens the simulator with matching fields so you can exercise the same custom-event shape your
        production Torque campaigns expect — without re-entering parameters by hand.
      </p>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {SCENARIOS.map((s) => (
          <article
            key={s.id}
            className="flex flex-col rounded-2xl border border-zinc-700/80 bg-slate-900/80 p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
          >
            <span className="w-fit rounded-full bg-teal-950 px-2.5 py-0.5 text-xs font-semibold text-teal-300 ring-1 ring-teal-600/50">
              {s.badge}
            </span>
            <h2 className="mt-3 text-lg font-medium text-white">{s.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">{s.narrative}</p>
            <dl className="mt-4 space-y-1 font-mono text-[11px] text-zinc-300">
              <div className="flex justify-between gap-2 border-t border-zinc-700/80 pt-3">
                <dt className="text-zinc-500">Route</dt>
                <dd className="font-medium text-cyan-300">
                  {s.sourceChain} → {s.destChain}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="inline-flex items-center gap-0.5 text-zinc-500">
                  Bridge / min
                  <Hint title="Units">
                    Simulated USDC notionals. <span className="font-mono text-cyan-200">min</span> is the hold threshold
                    for <span className="font-mono text-cyan-200">meetsThreshold</span> on each snapshot.
                  </Hint>
                </dt>
                <dd>
                  {s.amount} / {s.minHold}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="inline-flex items-center gap-0.5 text-zinc-500">
                  Decay
                  <Hint title="Daily decay">
                    Percent trimmed from balance before each indexer tick. 0% = perfect holder; higher % simulates fees
                    or gradual exits.
                  </Hint>
                </dt>
                <dd>{s.decay}% / day</dd>
              </div>
              <div className="truncate text-zinc-500" title={s.wallet}>
                Wallet {shortAddr(s.wallet)}
              </div>
            </dl>
            <Link
              href={`/simulator?preset=${encodeURIComponent(s.id)}`}
              className="mt-4 flex w-full items-center justify-center rounded-xl border-2 border-zinc-600 bg-slate-800 py-2.5 text-sm font-semibold text-zinc-100 transition hover:border-teal-500/70 hover:bg-slate-700"
            >
              Open in simulator
            </Link>
          </article>
        ))}
      </div>

      <section className="mt-16 rounded-2xl border border-zinc-700/80 bg-slate-900/50 p-6 sm:p-8">
        <h2 className="inline-flex flex-wrap items-center gap-1 text-xl font-semibold text-white">
          More playbooks (mix &amp; match)
          <Hint title="Torque-side ideas">
            These are campaign designs on top of the same two event types (bridge + daily snapshot). Your SQL in Torque
            chooses winners; this app only emits consistent fields.
          </Hint>
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Pair with the {SCENARIOS.length} presets above — same events, different incentive logic in Torque.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            {
              t: "Epoch flip bonus",
              d: "First snapshot after each Monday 00:00 UTC that has meetsThreshold=true earns a gift drop — use Torque gifts + time window in SQL.",
            },
            {
              t: "Bridge + 10-day cliff",
              d: "Require streakDays ≥ 10 before raffle tickets count; stops hit-and-run bridgers from farming draws.",
            },
            {
              t: "Route-specific rebates",
              d: "Filter bridge_hold_completed where sourceChain = Arbitrum for a partner co-marketing rebate pool.",
            },
            {
              t: "Anti-dump signal",
              d: "If meetsThreshold goes false within 3 days of bridge, slash raffle weight — complements Torque sybil tooling.",
            },
            {
              t: "Liquidity league tiers",
              d: "Leaderboard tier A if bridgedAmount > 2000, tier B otherwise — parallel prizes so retail still competes.",
            },
            {
              t: "Recovery bonus",
              d: "Users who lose streak then regain meetsThreshold for 5 straight days get a one-time rebate — encourages re-entry.",
            },
            {
              t: "Decay ladder",
              d: "Campaign SQL grants 1× tickets at 0% decay days, 0.5× when balance dropped <5% — rewards honest fee drag without zeroing retail.",
            },
            {
              t: "Wallet cohort A/B",
              d: "Tag users by first sourceChain in Torque; run parallel leaderboards (e.g. Base vs Ethereum arrivals) from the same events.",
            },
            {
              t: "Hold-to-mint gate",
              d: "NFT or allowlist mint unlocks only if streakDays ≥ N and meetsThreshold on snapshot — bridge event supplies bridgedAmount for rarity tiers.",
            },
            {
              t: "Oracle blackout",
              d: "Ignore snapshots where dayIndex jumps >1 (simulated indexer gap) so Torque campaigns don’t punish infra blips.",
            },
          ].map((item) => (
            <li key={item.t} className="rounded-xl border border-zinc-700/60 bg-zinc-950/40 p-4">
              <h3 className="font-semibold text-teal-300">{item.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.d}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
