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
import { torqueOutcomeSummary } from "@/lib/torque-messages";

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
      const torqueLine = torqueOutcomeSummary(t, "bridge");
      if (t?.skipped) setMsg(`Bridge saved locally. ${torqueLine}`);
      else if (t?.ok) setMsg(`Bridge recorded. ${torqueLine}`);
      else setMsg(`Bridge saved locally (demo store). ${torqueLine}`);
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
      const torqueLine = torqueOutcomeSummary(tr, "snapshot");
      if (tr?.skipped) setMsg(`Day ${snap.dayIndex} snapshot stored. ${torqueLine}`);
      else if (tr?.ok) setMsg(`Day ${snap.dayIndex}: streak ${snap.streakAfter}. ${torqueLine}`);
      else setMsg(`Day ${snap.dayIndex} stored locally. ${torqueLine}`);
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
        const tr = snap.torque;
        setMsg(
          `Batch: ${n} ticks. Last day ${snap.dayIndex}, streak ${snap.streakAfter}. ${torqueOutcomeSummary(tr, "snapshot")}`,
        );
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
        const bridgeLine = torqueOutcomeSummary(last.participant.bridgeTorque, "bridge");
        const snapLine = torqueOutcomeSummary(snap.torque, "snapshot");
        setMsg(
          `Preset flow: register → bridge → 3 ticks. Day ${snap.dayIndex}, streak ${snap.streakAfter}. ${bridgeLine} | Last tick: ${snapLine}`,
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
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h1 className="inline-flex flex-wrap items-center gap-1 text-3xl font-semibold tracking-tight text-slate-900">
          Interactive simulator
          <Hint title="Hands-on mode">
            Step through register → bridge → daily ticks in any order. The in-memory store resets when you redeploy; use{" "}
            <strong className="text-slate-800">Reset wallet</strong> to clear one address between runs.
          </Hint>
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">
          Tune parameters and emit events to Torque when{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-800 ring-1 ring-slate-200">
            TORQUE_INGEST_API_KEY
          </code>{" "}
          is set in{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-800 ring-1 ring-slate-200">.env.local</code>.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <Link
            href="/leaderboard"
            className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-slate-700 hover:border-teal-400"
          >
            Open full leaderboard
          </Link>
          <Link
            href="/demo"
            className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-slate-700 hover:border-cyan-400"
          >
            Run automated demo
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Quick load ({SCENARIOS.length} presets)
          <Hint title="Presets">
            Jumps to the same wallets and numbers as the Examples page. URL{" "}
            <span className="font-mono text-cyan-700">?preset=…</span> is bookmarkable for sharing a configuration.
          </Hint>
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {SCENARIOS.map((s) => (
            <Link
              key={s.id}
              href={`/simulator?preset=${encodeURIComponent(s.id)}`}
              title={`${s.sourceChain} → ${s.destChain} · ${s.amount} USDC · min ${s.minHold} · decay ${s.decay}%`}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                presetId === s.id
                  ? "border-teal-400 bg-teal-50 text-teal-800"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
              }`}
            >
              {s.title}
            </Link>
          ))}
        </div>
      </div>

      <details className="mt-6 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
        <summary className="inline-flex cursor-pointer list-none items-center gap-1 font-medium text-slate-800 [&::-webkit-details-marker]:hidden">
          Ingest payload cheat sheet
          <Hint title="For Torque setup">
            Align <span className="font-mono text-cyan-700">eventName</span> and <span className="font-mono text-cyan-700">data</span> keys with
            the custom events you create in Torque; defaults are <span className="font-mono">bridge_hold_completed</span> and{" "}
            <span className="font-mono">bridge_hold_daily_snapshot</span>.
          </Hint>
        </summary>
        <p className="mt-3 text-xs leading-relaxed">
          Every event is <span className="font-mono text-cyan-700">POST …/events</span> with{" "}
          <span className="font-mono">userPubkey</span>, <span className="font-mono">timestamp</span>,{" "}
          <span className="font-mono">eventName</span>, <span className="font-mono">data</span>. Bridge uses{" "}
          <span className="font-mono">amount</span>, <span className="font-mono">sourceChain</span>,{" "}
          <span className="font-mono">destChain</span>, <span className="font-mono">txHash</span>. Snapshot adds{" "}
          <span className="font-mono">dayIndex</span>, <span className="font-mono">meetsThreshold</span>,{" "}
          <span className="font-mono">balance</span>, <span className="font-mono">streakDays</span>,{" "}
          <span className="font-mono">bridgedAmount</span>.
        </p>
        <p className="mt-3 text-xs font-medium text-slate-700">Example snapshot body (shape only):</p>
        <pre className="mt-2 overflow-x-auto rounded-lg border border-slate-200 bg-slate-950 p-3 text-[10px] leading-relaxed text-cyan-100/90">
          {`{
  "userPubkey": "7xKX…gAsU",
  "timestamp": 1717123456789,
  "eventName": "bridge_hold_daily_snapshot",
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

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className={cardSurface}>
          <h2 className="inline-flex items-center gap-1 text-lg font-medium text-slate-900">
            Participant
            <Hint title="Registration">
              <span className="font-normal">
                Register creates the row in the demo store. Re-register updates min-hold only;{" "}
                <strong className="text-slate-800">Reset wallet</strong> wipes the participant entirely.
              </span>
            </Hint>
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Solana-style address recommended so it matches your Torque wallet column.
          </p>
          <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span className="inline-flex items-center normal-case">
              Wallet
              <Hint title="Wallet hint">
                Must match the wallet you use in Torque campaigns. Custom events always include top-level{" "}
                <code className="text-cyan-700">userPubkey</code>.
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
                className="shrink-0 rounded-lg border-2 border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
              >
                Copy
              </button>
            </div>
          </label>
          <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span className="inline-flex items-center normal-case">
              Min hold (simulated)
              <Hint title="Minimum hold">
                If daily balance falls below this after bridge,{" "}
                <code className="text-cyan-700">meetsThreshold</code> is false and the streak resets in the snapshot
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
              title="Create or update participant row and min-hold"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-45"
            >
              Register
            </button>
            <button
              type="button"
              disabled={busy || !wallet.trim()}
              onClick={() => void loadParticipant(wallet)}
              title="GET latest participant from server (after Live demo or another tab)"
              className="rounded-lg border-2 border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-45"
            >
              Refresh state
            </button>
            <button
              type="button"
              disabled={busy || !wallet.trim()}
              onClick={() => void onResetSession()}
              title="Remove this wallet from the demo store"
              className="rounded-lg border-2 border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-45"
            >
              Reset wallet
            </button>
            <button
              type="button"
              disabled={busy || !wallet.trim()}
              onClick={() => void onRunPresetFlow()}
              title="Register → bridge → 3 indexer ticks using current form values"
              className="rounded-lg border-2 border-teal-300 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-100 disabled:opacity-45"
            >
              Run preset flow
            </button>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Preset flow: register → bridge with fields above → three indexer ticks using the decay % (handy right after
            loading a quick preset).
          </p>

          <hr className="my-6 border-slate-200" />

          <h3 className="inline-flex items-center text-sm font-semibold text-slate-900">
            Simulate bridge
            <Hint title="Bridge event">
              Fires <code className="text-cyan-700">TORQUE_EVENT_BRIDGE</code> (default{" "}
              <code className="text-cyan-700">bridge_hold_completed</code>) with amount, chains, and a mock tx hash.
            </Hint>
          </h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-medium text-slate-600">
              <span className="inline-flex items-center gap-1">
                Amount (simulated USDC)
                <Hint title="Bridge notional">Written to bridgedAmount and initial balance when you record the bridge.</Hint>
              </span>
              <input
                type="number"
                className={field}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </label>
            <label className="text-xs font-medium text-slate-600">
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

          <hr className="my-6 border-slate-200" />

          <h3 className="inline-flex items-center text-sm font-semibold text-slate-900">
            Indexer tick
            <Hint title="Daily snapshot">
              Sends <code className="text-cyan-700">TORQUE_EVENT_SNAPSHOT</code> with streak, balance, and booleans your
              Torque SQL can filter on.
            </Hint>
          </h3>
          <label className="mt-2 block text-xs font-medium text-slate-600">
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
            className="mt-4 w-full rounded-lg border-2 border-cyan-300 bg-cyan-50 px-4 py-2.5 text-sm font-semibold text-cyan-800 transition hover:bg-cyan-100 disabled:opacity-45"
          >
            Advance one day &amp; POST /events
          </button>

          <div className="mt-4 flex flex-wrap items-end gap-2">
            <label className="text-xs font-medium text-slate-600">
              <span className="inline-flex items-center gap-1">
                Batch ticks (1–30)
                <Hint title="Batch">
                  Runs N sequential indexer ticks with the same decay %. Faster than clicking “Advance one day” for long
                  simulations.
                </Hint>
              </span>
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
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-45"
            >
              Run batch
            </button>
          </div>

          <hr className="my-6 border-slate-200" />

          <h3 className="inline-flex items-center gap-1 text-sm font-semibold text-slate-900">
            Adjust simulated balance
            <Hint title="Why edit balance">
              Simulates a swap, withdrawal, or top-up on the destination chain without a new bridge event. Next snapshot
              reads this balance for meetsThreshold and streak logic.
            </Hint>
          </h3>
          <p className="mt-1 text-xs text-slate-600">Fake sells or top-ups between indexer ticks.</p>
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
              className="rounded-lg border-2 border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-45"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className={cardSurface}>
            <h2 className="inline-flex items-center gap-1 text-lg font-medium text-slate-900">
              Live state
              <Hint title="Metrics">
                <strong className="text-slate-800">Streak</strong> from the latest snapshot;{" "}
                <strong className="text-slate-800">Meets min</strong> compares live balance to min-hold;{" "}
                <strong className="text-slate-800">Qual days</strong> counts snapshots where meetsThreshold was true.
              </Hint>
            </h2>
            {!participant ? (
              <p className="mt-3 text-sm text-slate-600">Register a wallet to see state.</p>
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
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Streak</p>
                        <p className="mt-1 text-xl font-bold text-cyan-700">{streak}</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Meets min</p>
                        <p className={`mt-1 text-sm font-bold ${meets ? "text-teal-700" : "text-amber-700"}`}>
                          {meets ? "Yes" : "No"}
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Qual days</p>
                        <p className="mt-1 text-xl font-bold text-slate-900">{qualDays}</p>
                      </div>
                    </div>
                  );
                })()}
              <dl className="mt-4 space-y-2 font-mono text-xs text-slate-700">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Wallet</dt>
                  <dd className="truncate text-cyan-700">{participant.wallet}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Bridged</dt>
                  <dd className="text-slate-900">{participant.bridgedAmount}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Balance</dt>
                  <dd className="text-slate-900">{participant.currentBalance}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Min hold</dt>
                  <dd className="text-slate-900">{participant.minHold}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Last day index</dt>
                  <dd className="text-slate-900">{participant.lastProcessedDay}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Bridge → Torque</dt>
                  <dd className="max-w-[55%] break-all text-right text-[10px] text-slate-500">
                    {participant.bridgeTorque ? JSON.stringify(participant.bridgeTorque) : "—"}
                  </dd>
                </div>
              </dl>
              </>
            )}
            {msg ? (
              <p
                className={`mt-4 rounded-lg px-3 py-2 text-xs font-medium ${
                  msg.toLowerCase().includes("error") || msg.toLowerCase().includes("issue")
                    ? "border border-red-300 bg-red-50 text-red-700"
                    : "border border-amber-300 bg-amber-50 text-amber-700"
                }`}
              >
                {msg}
              </p>
            ) : null}
          </div>

          <div className={cardSurface}>
            <h2 className="inline-flex items-center gap-1 text-lg font-medium text-slate-900">
              Snapshot log
              <Hint title="History">Newest first. Each row is what was sent (or skipped) for Torque on that indexer tick.</Hint>
            </h2>
            {!participant || participant.snapshots.length === 0 ? (
              <p className="mt-3 text-sm text-slate-600">No indexer ticks yet.</p>
            ) : (
              <ul className="mt-3 max-h-56 space-y-2 overflow-auto text-xs">
                {[...participant.snapshots].reverse().map((s) => (
                  <li
                    key={s.dayIndex}
                    className="flex flex-col rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                  >
                    <span className="font-mono font-medium text-cyan-700">Day {s.dayIndex}</span>
                    <span className="text-slate-600">
                      balance {s.balance} · meets {String(s.meetsThreshold)} · streak {s.streakAfter}
                    </span>
                    {s.torque?.skipped ? (
                      <span className="font-medium text-amber-700">Torque skipped: {s.torque.reason}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={cardSurface}>
            <h2 className="inline-flex items-center gap-1 text-lg font-medium text-slate-900">
              Local consistency board
              <Hint title="Leaderboard preview">
                Sorted by current streak, then qualifying days. Torque can mirror this with SQL on your custom events.
              </Hint>
            </h2>
            {board.length === 0 ? (
              <p className="mt-3 text-sm text-slate-600">Nobody has bridged yet.</p>
            ) : (
              <table className="mt-4 w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-500">
                    <th className="pb-2 font-semibold">Wallet</th>
                    <th className="pb-2 font-semibold">Streak</th>
                    <th className="pb-2 font-semibold">Qual days</th>
                    <th className="pb-2 font-semibold">Bal</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-slate-800">
                  {board.map((r) => (
                    <tr
                      key={r.wallet}
                      className={`border-t border-slate-200 ${
                        wallet.trim() && r.wallet === wallet.trim() ? "bg-teal-50" : ""
                      }`}
                    >
                      <td className="py-2 text-slate-700">{shortAddr(r.wallet)}</td>
                      <td className="py-2 font-semibold text-cyan-700">{r.streak}</td>
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
