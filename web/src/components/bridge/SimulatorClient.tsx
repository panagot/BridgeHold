"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { TorqueStatusBanner } from "@/components/bridge/TorqueStatusBanner";
import { Hint } from "@/components/Tooltip";
import { apiAdvance, apiBalance, apiBridge, apiRegister, apiResetWallet } from "@/lib/bridge/api";
import {
  SCENARIOS,
  cardSurface,
  field,
  fieldCompact,
  fieldMono,
  getScenarioById,
  shortAddr,
} from "@/lib/bridge/constants";
import type { BoardRow, Participant } from "@/lib/bridge/types";

export function SimulatorClient() {
  const searchParams = useSearchParams();
  const presetId = searchParams.get("preset");

  const [wallet, setWallet] = useState("");
  const [minHold, setMinHold] = useState(100);
  const [amount, setAmount] = useState(500);
  const [sourceChain, setSourceChain] = useState("Ethereum");
  const [destChain, setDestChain] = useState("Solana");
  const [balanceEdit, setBalanceEdit] = useState(500);
  const [decay, setDecay] = useState(0);
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [board, setBoard] = useState<BoardRow[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [batchDays, setBatchDays] = useState(5);

  const refreshBoard = useCallback(async () => {
    const r = await fetch("/api/leaderboard");
    const j = (await r.json()) as { leaderboard: BoardRow[] };
    setBoard(j.leaderboard);
  }, []);

  const loadParticipant = useCallback(async (w: string) => {
    if (!w.trim()) return;
    const r = await fetch(`/api/participant?wallet=${encodeURIComponent(w.trim())}`);
    if (!r.ok) {
      setParticipant(null);
      return;
    }
    const j = (await r.json()) as { participant: Participant };
    setParticipant(j.participant);
    setBalanceEdit(j.participant.currentBalance);
  }, []);

  useEffect(() => {
    void refreshBoard();
  }, [refreshBoard]);

  useEffect(() => {
    const s = getScenarioById(presetId);
    if (!s) return;
    setWallet(s.wallet);
    setMinHold(s.minHold);
    setAmount(s.amount);
    setSourceChain(s.sourceChain);
    setDestChain(s.destChain);
    setDecay(s.decay);
    setBalanceEdit(s.amount);
    setMsg(`Loaded preset “${s.title}” — register, then bridge.`);
  }, [presetId]);

  async function onRegister() {
    setBusy(true);
    setMsg(null);
    try {
      const p = await apiRegister(wallet, minHold);
      setParticipant(p);
      setBalanceEdit(p.currentBalance);
      setMsg("Registered — use a wallet that matches your Torque test user when ingesting live.");
      await refreshBoard();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "error");
    } finally {
      setBusy(false);
    }
  }

  async function onBridge() {
    setBusy(true);
    setMsg(null);
    try {
      const j = await apiBridge(wallet, amount, sourceChain, destChain, minHold);
      setParticipant(j.participant);
      setBalanceEdit(j.participant.currentBalance);
      const t = j.participant.bridgeTorque;
      if (t?.skipped) setMsg(`Bridge saved locally. Torque: skipped (${t.reason}).`);
      else if (t?.ok) setMsg("Bridge recorded — ingester accepted the event.");
      else setMsg(`Bridge saved — Torque: ${JSON.stringify(t)}`);
      await refreshBoard();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "error");
    } finally {
      setBusy(false);
    }
  }

  async function onSetBalance() {
    setBusy(true);
    setMsg(null);
    try {
      const p = await apiBalance(wallet, balanceEdit);
      setParticipant(p);
      setMsg("Destination balance updated (off-chain simulation).");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "error");
    } finally {
      setBusy(false);
    }
  }

  async function onAdvanceDay() {
    setBusy(true);
    setMsg(null);
    try {
      const j = await apiAdvance(wallet, decay);
      setParticipant(j.participant);
      const snap = j.snapshot;
      const tr = snap?.torque;
      if (tr?.skipped)
        setMsg(`Day ${snap.dayIndex} snapshot stored. Torque skipped (${tr.reason}).`);
      else if (tr?.ok) setMsg(`Day ${snap.dayIndex} sent — streak now ${snap.streakAfter}.`);
      else setMsg(`Snapshot issue: ${JSON.stringify(tr)}`);
      await refreshBoard();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "error");
    } finally {
      setBusy(false);
    }
  }

  async function onBatchAdvance() {
    if (!wallet.trim()) return;
    const n = Math.min(30, Math.max(1, Math.floor(batchDays)));
    setBusy(true);
    setMsg(null);
    try {
      let last: Awaited<ReturnType<typeof apiAdvance>> | null = null;
      for (let i = 0; i < n; i++) {
        last = await apiAdvance(wallet, decay);
        setParticipant(last.participant);
      }
      if (last) {
        const snap = last.snapshot;
        setMsg(`Batch complete: ${n} ticks · last day ${snap.dayIndex}, streak ${snap.streakAfter}.`);
      }
      await refreshBoard();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "error");
    } finally {
      setBusy(false);
    }
  }

  async function onRunPresetFlow() {
    if (!wallet.trim()) return;
    setBusy(true);
    setMsg(null);
    try {
      await apiRegister(wallet, minHold);
      const j = await apiBridge(wallet, amount, sourceChain, destChain, minHold);
      setParticipant(j.participant);
      setBalanceEdit(j.participant.currentBalance);
      let last: Awaited<ReturnType<typeof apiAdvance>> | null = null;
      for (let i = 0; i < 3; i++) {
        last = await apiAdvance(wallet, decay);
        setParticipant(last.participant);
      }
      if (last) {
        const snap = last.snapshot;
        setMsg(
          `Preset flow done: register → bridge → 3 ticks. Latest day ${snap.dayIndex}, streak ${snap.streakAfter}.`,
        );
      }
      await refreshBoard();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "error");
    } finally {
      setBusy(false);
    }
  }

  async function onResetSession() {
    if (!wallet.trim()) return;
    setBusy(true);
    setMsg(null);
    try {
      await apiResetWallet(wallet);
      setParticipant(null);
      setMsg("Cleared this wallet from the server demo store. Register again to start fresh.");
      await refreshBoard();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "error");
    } finally {
      setBusy(false);
    }
  }

  function copyWallet() {
    if (!wallet.trim()) return;
    void navigator.clipboard.writeText(wallet);
    setMsg("Wallet copied to clipboard.");
  }

  return (
    <>
      <div className="mb-8">
        <TorqueStatusBanner />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight text-white">Interactive simulator</h1>
      <p className="mt-3 max-w-2xl text-sm text-zinc-400 sm:text-base">
        Tune parameters and send events to the Torque ingester when{" "}
        <code className="rounded bg-zinc-900 px-1.5 py-0.5 text-zinc-100 ring-1 ring-zinc-700">
          TORQUE_INGEST_API_KEY
        </code>{" "}
        is set in{" "}
        <code className="rounded bg-zinc-900 px-1.5 py-0.5 text-zinc-100 ring-1 ring-zinc-700">.env.local</code>.
      </p>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Quick load ({SCENARIOS.length} presets)
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {SCENARIOS.map((s) => (
            <Link
              key={s.id}
              href={`/simulator?preset=${encodeURIComponent(s.id)}`}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                presetId === s.id
                  ? "border-teal-500 bg-teal-950/50 text-teal-200"
                  : "border-zinc-600 bg-slate-900/80 text-zinc-300 hover:border-zinc-500"
              }`}
            >
              {s.title}
            </Link>
          ))}
        </div>
      </div>

      <details className="mt-6 rounded-xl border border-zinc-700/80 bg-slate-900/40 p-4 text-sm text-zinc-400">
        <summary className="cursor-pointer font-medium text-zinc-200">Ingest payload cheat sheet</summary>
        <p className="mt-3 text-xs leading-relaxed">
          Every event is <span className="font-mono text-cyan-300">POST …/events</span> with{" "}
          <span className="font-mono">userPubkey</span>, <span className="font-mono">timestamp</span>,{" "}
          <span className="font-mono">eventName</span>, <span className="font-mono">data</span>. Bridge uses{" "}
          <span className="font-mono">amount</span>, <span className="font-mono">sourceChain</span>,{" "}
          <span className="font-mono">destChain</span>, <span className="font-mono">txHash</span>. Snapshot adds{" "}
          <span className="font-mono">dayIndex</span>, <span className="font-mono">meetsThreshold</span>,{" "}
          <span className="font-mono">balance</span>, <span className="font-mono">streakDays</span>,{" "}
          <span className="font-mono">bridgedAmount</span>.
        </p>
        <p className="mt-3 text-xs font-medium text-zinc-300">Example snapshot body (shape only):</p>
        <pre className="mt-2 overflow-x-auto rounded-lg border border-zinc-700/80 bg-zinc-950 p-3 text-[10px] leading-relaxed text-cyan-100/90">
          {`{
  "userPubkey": "7xKX…gAsU",
  "timestamp": 1717123456789,
  "eventName": "bridge_hold_snapshot",
  "data": {
    "dayIndex": 3,
    "meetsThreshold": true,
    "balance": 1180,
    "streakDays": 3,
    "bridgedAmount": 1200,
    "sourceChain": "Arbitrum",
    "destChain": "Solana"
  }
}`}
        </pre>
      </details>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className={cardSurface}>
          <h2 className="text-lg font-medium text-white">Participant</h2>
          <p className="mt-1 text-xs text-zinc-400">
            Solana-style address recommended so it matches your Torque wallet column.
          </p>
          <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
            <span className="inline-flex items-center normal-case">
              Wallet
              <Hint title="Wallet hint">
                Must match the wallet you use in Torque campaigns. Custom events always include top-level{" "}
                <code className="text-cyan-300">userPubkey</code>.
              </Hint>
            </span>
            <div className="mt-1 flex gap-2">
              <input
                className={`${fieldMono} flex-1`}
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                placeholder="Solana public key"
                autoComplete="off"
              />
              <button
                type="button"
                disabled={!wallet.trim()}
                onClick={copyWallet}
                className="shrink-0 rounded-lg border-2 border-zinc-600 bg-zinc-900 px-3 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 disabled:opacity-40"
              >
                Copy
              </button>
            </div>
          </label>
          <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
            <span className="inline-flex items-center normal-case">
              Min hold (simulated)
              <Hint title="Minimum hold">
                If daily balance falls below this after bridge,{" "}
                <code className="text-cyan-300">meetsThreshold</code> is false and the streak resets in the snapshot
                event.
              </Hint>
            </span>
            <input
              type="number"
              className={field}
              value={minHold}
              onChange={(e) => setMinHold(Number(e.target.value))}
            />
          </label>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy || !wallet.trim()}
              onClick={() => void onRegister()}
              className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-white disabled:opacity-45"
            >
              Register
            </button>
            <button
              type="button"
              disabled={busy || !wallet.trim()}
              onClick={() => void loadParticipant(wallet)}
              className="rounded-lg border-2 border-zinc-500 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800 disabled:opacity-45"
            >
              Refresh state
            </button>
            <button
              type="button"
              disabled={busy || !wallet.trim()}
              onClick={() => void onResetSession()}
              className="rounded-lg border-2 border-red-900/60 bg-red-950/30 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-950/50 disabled:opacity-45"
            >
              Reset wallet
            </button>
            <button
              type="button"
              disabled={busy || !wallet.trim()}
              onClick={() => void onRunPresetFlow()}
              className="rounded-lg border-2 border-teal-600/70 bg-teal-950/40 px-4 py-2 text-sm font-semibold text-teal-100 hover:bg-teal-950/60 disabled:opacity-45"
            >
              Run preset flow
            </button>
          </div>
          <p className="mt-2 text-[11px] text-zinc-500">
            Preset flow: register → bridge with fields above → three indexer ticks using the decay % (handy right after
            loading a quick preset).
          </p>

          <hr className="my-6 border-zinc-700/80" />

          <h3 className="inline-flex items-center text-sm font-semibold text-white">
            Simulate bridge
            <Hint title="Bridge event">
              Fires <code className="text-cyan-300">TORQUE_EVENT_BRIDGE</code> (default{" "}
              <code className="text-cyan-300">bridge_hold_completed</code>) with amount, chains, and a mock tx hash.
            </Hint>
          </h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-medium text-zinc-400">
              Amount
              <input
                type="number"
                className={field}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </label>
            <label className="text-xs font-medium text-zinc-400">
              Source → Dest
              <div className="mt-1 flex gap-2">
                <input
                  className={`w-1/2 ${fieldCompact}`}
                  value={sourceChain}
                  onChange={(e) => setSourceChain(e.target.value)}
                />
                <input
                  className={`w-1/2 ${fieldCompact}`}
                  value={destChain}
                  onChange={(e) => setDestChain(e.target.value)}
                />
              </div>
            </label>
          </div>
          <button
            type="button"
            disabled={busy || !wallet.trim()}
            onClick={() => void onBridge()}
            className="mt-4 w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-teal-500 disabled:opacity-45"
          >
            Record bridge + emit Torque event
          </button>

          <hr className="my-6 border-zinc-700/80" />

          <h3 className="inline-flex items-center text-sm font-semibold text-white">
            Indexer tick
            <Hint title="Daily snapshot">
              Sends <code className="text-cyan-300">TORQUE_EVENT_SNAPSHOT</code> with streak, balance, and booleans your
              Torque SQL can filter on.
            </Hint>
          </h3>
          <label className="mt-2 block text-xs font-medium text-zinc-400">
            <span className="inline-flex items-center">
              Decay % / day
              <Hint title="Decay">Applied before the snapshot to mimic slow outflows. Set 0 for a perfect holder.</Hint>
            </span>
            <input
              type="number"
              className={field}
              value={decay}
              min={0}
              max={50}
              onChange={(e) => setDecay(Number(e.target.value))}
            />
          </label>
          <button
            type="button"
            disabled={busy || !wallet.trim()}
            onClick={() => void onAdvanceDay()}
            className="mt-4 w-full rounded-lg border-2 border-cyan-500 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-cyan-50 shadow-[inset_0_1px_0_0_rgba(34,211,238,0.12)] transition hover:border-cyan-400 hover:bg-slate-900 disabled:opacity-45"
          >
            Advance one day &amp; POST /events
          </button>

          <div className="mt-4 flex flex-wrap items-end gap-2">
            <label className="text-xs font-medium text-zinc-400">
              Batch ticks (1–30)
              <input
                type="number"
                min={1}
                max={30}
                className={`${field} mt-1 w-24`}
                value={batchDays}
                onChange={(e) => setBatchDays(Number(e.target.value))}
              />
            </label>
            <button
              type="button"
              disabled={busy || !wallet.trim()}
              onClick={() => void onBatchAdvance()}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white ring-1 ring-zinc-600 hover:bg-slate-700 disabled:opacity-45"
            >
              Run batch
            </button>
          </div>

          <hr className="my-6 border-zinc-700/80" />

          <h3 className="text-sm font-semibold text-white">Adjust simulated balance</h3>
          <p className="mt-1 text-xs text-zinc-400">Use this to fake sells or top-ups between indexer ticks.</p>
          <div className="mt-2 flex gap-2">
            <input
              type="number"
              className={`flex-1 ${field}`}
              value={balanceEdit}
              onChange={(e) => setBalanceEdit(Number(e.target.value))}
            />
            <button
              type="button"
              disabled={busy || !wallet.trim()}
              onClick={() => void onSetBalance()}
              className="rounded-lg border-2 border-zinc-500 bg-zinc-800 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-45"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className={cardSurface}>
            <h2 className="text-lg font-medium text-white">Live state</h2>
            {!participant ? (
              <p className="mt-3 text-sm text-zinc-400">Register a wallet to see state.</p>
            ) : (
              <>
                {(() => {
                  const snaps = participant.snapshots;
                  const last = snaps.length ? snaps[snaps.length - 1] : null;
                  const streak = last?.streakAfter ?? 0;
                  const meets = participant.currentBalance >= participant.minHold;
                  const qualDays = snaps.filter((s) => s.meetsThreshold).length;
                  return (
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-xl border border-zinc-700/80 bg-zinc-950/80 px-2 py-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Streak</p>
                        <p className="mt-1 text-xl font-bold text-cyan-300">{streak}</p>
                      </div>
                      <div className="rounded-xl border border-zinc-700/80 bg-zinc-950/80 px-2 py-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Meets min</p>
                        <p className={`mt-1 text-sm font-bold ${meets ? "text-teal-300" : "text-amber-300"}`}>
                          {meets ? "Yes" : "No"}
                        </p>
                      </div>
                      <div className="rounded-xl border border-zinc-700/80 bg-zinc-950/80 px-2 py-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Qual days</p>
                        <p className="mt-1 text-xl font-bold text-zinc-100">{qualDays}</p>
                      </div>
                    </div>
                  );
                })()}
              <dl className="mt-4 space-y-2 font-mono text-xs text-zinc-200">
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-500">Wallet</dt>
                  <dd className="truncate text-cyan-300">{participant.wallet}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Bridged</dt>
                  <dd className="text-white">{participant.bridgedAmount}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Balance</dt>
                  <dd className="text-white">{participant.currentBalance}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Min hold</dt>
                  <dd className="text-white">{participant.minHold}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Last day index</dt>
                  <dd className="text-white">{participant.lastProcessedDay}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Bridge → Torque</dt>
                  <dd className="max-w-[55%] break-all text-right text-[10px] text-zinc-400">
                    {participant.bridgeTorque ? JSON.stringify(participant.bridgeTorque) : "—"}
                  </dd>
                </div>
              </dl>
              </>
            )}
            {msg ? (
              <p className="mt-4 rounded-lg border border-amber-600/50 bg-amber-950/50 px-3 py-2 text-xs font-medium text-amber-100">
                {msg}
              </p>
            ) : null}
          </div>

          <div className={cardSurface}>
            <h2 className="text-lg font-medium text-white">Snapshot log</h2>
            {!participant || participant.snapshots.length === 0 ? (
              <p className="mt-3 text-sm text-zinc-400">No indexer ticks yet.</p>
            ) : (
              <ul className="mt-3 max-h-56 space-y-2 overflow-auto text-xs">
                {[...participant.snapshots].reverse().map((s) => (
                  <li
                    key={s.dayIndex}
                    className="flex flex-col rounded-lg border border-zinc-700/60 bg-zinc-950/80 px-3 py-2"
                  >
                    <span className="font-mono font-medium text-cyan-300">Day {s.dayIndex}</span>
                    <span className="text-zinc-300">
                      balance {s.balance} · meets {String(s.meetsThreshold)} · streak {s.streakAfter}
                    </span>
                    {s.torque?.skipped ? (
                      <span className="font-medium text-amber-300">Torque skipped: {s.torque.reason}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={cardSurface}>
            <h2 className="inline-flex items-center gap-1 text-lg font-medium text-white">
              Local consistency board
              <Hint title="Leaderboard preview">
                Sorted by current streak, then qualifying days. Torque can mirror this with SQL on your custom events.
              </Hint>
            </h2>
            {board.length === 0 ? (
              <p className="mt-3 text-sm text-zinc-400">Nobody has bridged yet.</p>
            ) : (
              <table className="mt-4 w-full text-left text-xs">
                <thead>
                  <tr className="text-zinc-400">
                    <th className="pb-2 font-semibold">Wallet</th>
                    <th className="pb-2 font-semibold">Streak</th>
                    <th className="pb-2 font-semibold">Qual days</th>
                    <th className="pb-2 font-semibold">Bal</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-zinc-100">
                  {board.map((r) => (
                    <tr
                      key={r.wallet}
                      className={`border-t border-zinc-700/60 ${
                        wallet.trim() && r.wallet === wallet.trim() ? "bg-teal-950/25" : ""
                      }`}
                    >
                      <td className="py-2 text-zinc-300">{shortAddr(r.wallet)}</td>
                      <td className="py-2 font-semibold text-cyan-300">{r.streak}</td>
                      <td className="py-2">{r.qualifyingDays}</td>
                      <td className="py-2">{r.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
