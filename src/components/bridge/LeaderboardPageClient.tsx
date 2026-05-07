"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { TorqueStatusBanner } from "@/components/bridge/TorqueStatusBanner";
import { cardSurface, shortAddr } from "@/lib/bridge/constants";
import type { LeaderboardOverviewRow, LeaderboardStats } from "@/lib/bridge/types";

type ApiPayload = {
  leaderboard: { wallet: string; streak: number; qualifyingDays: number; balance: number }[];
  stats: LeaderboardStats;
  rows: LeaderboardOverviewRow[];
};

const fmt = (n: number) => new Intl.NumberFormat("en-US").format(n);

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-700/80 bg-slate-900/70 px-4 py-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-white">{value}</p>
      {sub ? <p className="mt-0.5 text-[11px] text-zinc-500">{sub}</p> : null}
    </div>
  );
}

export function LeaderboardPageClient() {
  const [data, setData] = useState<ApiPayload | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    try {
      const r = await fetch("/api/leaderboard");
      if (!r.ok) throw new Error("Failed to load leaderboard");
      const j = (await r.json()) as ApiPayload;
      setData(j);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
      setData(null);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const stats = data?.stats;

  return (
    <>
      <div className="mb-8">
        <TorqueStatusBanner />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Leaderboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Live view of the in-memory demo store: everyone who has recorded a bridge, ranked by current streak then
            qualifying snapshot days. Totals below are simulated USDC notionals for this environment.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="shrink-0 rounded-lg border-2 border-zinc-600 bg-slate-900 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:border-teal-500/50 hover:bg-slate-800"
        >
          Refresh
        </button>
      </div>

      {err ? (
        <p className="mt-6 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-200">{err}</p>
      ) : null}

      {stats ? (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Participants (bridged)" value={fmt(stats.participantCount)} />
          <StatCard
            label="Total bridged (sim USDC)"
            value={fmt(stats.totalBridgedVolume)}
            sub="Sum of last bridge notionals"
          />
          <StatCard
            label="Total balance on dest (sim)"
            value={fmt(stats.totalBalanceOnDest)}
            sub="Current simulated balances"
          />
          <StatCard
            label="Qualifying snapshots"
            value={fmt(stats.sumQualifyingSnapshots)}
            sub="Across all wallets"
          />
          <StatCard label="Avg streak" value={String(stats.avgStreak)} sub="Current snapshot streak" />
          <StatCard label="Longest streak" value={fmt(stats.maxStreak)} />
          <StatCard label="Unique routes" value={fmt(stats.uniqueRoutes)} sub="Distinct source → dest pairs" />
          <StatCard
            label="Top route"
            value={stats.topRoute ? stats.topRoute : "—"}
            sub={stats.topRoute ? `${fmt(stats.topRouteCount)} wallet(s)` : "No bridges yet"}
          />
        </div>
      ) : !err ? (
        <p className="mt-8 text-sm text-zinc-500">Loading…</p>
      ) : null}

      <div className={`mt-10 ${cardSurface}`}>
        <h2 className="text-lg font-medium text-white">Rankings</h2>
        {!data || data.rows.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-400">
            No bridged wallets yet. Open the{" "}
            <Link href="/simulator" className="font-medium text-teal-400 underline-offset-2 hover:underline">
              simulator
            </Link>{" "}
            or run the{" "}
            <Link href="/demo" className="font-medium text-teal-400 underline-offset-2 hover:underline">
              live demo
            </Link>{" "}
            to populate this board.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-700/80 text-zinc-500">
                  <th className="pb-2 pr-2 font-semibold">#</th>
                  <th className="pb-2 pr-2 font-semibold">Wallet</th>
                  <th className="pb-2 pr-2 font-semibold">Route</th>
                  <th className="pb-2 pr-2 font-semibold text-right">Bridged</th>
                  <th className="pb-2 pr-2 font-semibold text-right">Balance</th>
                  <th className="pb-2 pr-2 font-semibold text-right">Min</th>
                  <th className="pb-2 pr-2 font-semibold text-center">Meets</th>
                  <th className="pb-2 pr-2 font-semibold text-right">Streak</th>
                  <th className="pb-2 pr-2 font-semibold text-right">Qual days</th>
                  <th className="pb-2 font-semibold text-right">Snapshots</th>
                </tr>
              </thead>
              <tbody className="font-mono text-zinc-200">
                {data.rows.map((r) => (
                  <tr key={r.wallet} className="border-t border-zinc-800/90">
                    <td className="py-2.5 pr-2 text-zinc-500">{r.rank}</td>
                    <td className="max-w-[8rem] truncate py-2.5 pr-2 text-cyan-300" title={r.wallet}>
                      {shortAddr(r.wallet)}
                    </td>
                    <td className="py-2.5 pr-2 text-zinc-400">
                      {r.sourceChain} → {r.destChain}
                    </td>
                    <td className="py-2.5 pr-2 text-right tabular-nums">{fmt(r.bridgedAmount)}</td>
                    <td className="py-2.5 pr-2 text-right tabular-nums">{fmt(r.balance)}</td>
                    <td className="py-2.5 pr-2 text-right tabular-nums text-zinc-400">{fmt(r.minHold)}</td>
                    <td className="py-2.5 pr-2 text-center">
                      <span
                        className={
                          r.meetsThreshold ? "text-teal-400" : "text-amber-400/90"
                        }
                      >
                        {r.meetsThreshold ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="py-2.5 pr-2 text-right font-semibold text-cyan-300 tabular-nums">{r.streak}</td>
                    <td className="py-2.5 pr-2 text-right tabular-nums">{r.qualifyingDays}</td>
                    <td className="py-2.5 text-right tabular-nums text-zinc-400">{r.snapshotCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
