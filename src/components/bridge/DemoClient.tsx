"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Hint } from "@/components/Tooltip";
import {
  DEMO_WALLET,
  DEMO_WALLET_TWIN_RETAIL,
  DEMO_WALLET_TWIN_WHALE,
  SCENARIOS,
  shortAddr,
} from "@/lib/bridge/constants";
import { apiAdvance, apiBalance, apiBridge, apiRegister } from "@/lib/bridge/api";
import { torqueOutcomeSummary } from "@/lib/torque-messages";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type ScriptId = "classic" | "decay" | "twin" | "seed";

const SCRIPTS: { id: ScriptId; label: string; blurb: string; hint: string }[] = [
  {
    id: "classic",
    label: "Classic streak",
    blurb: "Bridge 1.2k → four clean days → dump under min → streak resets → top up and recover.",
    hint: "Full streak lifecycle on one wallet. Uses the primary demo address only — use Reset wallet in the simulator between runs if you need a clean state.",
  },
  {
    id: "decay",
    label: "Decay week",
    blurb: "500 USDC, min-hold 80, then seven ticks with 4% balance decay before each snapshot.",
    hint: "Shows how fee drag or slow exits compress streaks. Same primary wallet as Classic; run Seed or Reset if order matters.",
  },
  {
    id: "twin",
    label: "Twin wallets",
    blurb: "Whale vs retail bridges in parallel; three shared day ticks — two streaks on the board at once.",
    hint: "Uses two wallets that are not the Classic/Decay wallet, so you can run Twin after other scripts without overwriting their state.",
  },
  {
    id: "seed",
    label: "Leaderboard seed",
    blurb:
      "Steady bridger, L2 power user, micro retail: each registers, bridges, gets one tick — fills a multi-wallet leaderboard quickly.",
    hint: "Uses the same three wallets as the Examples presets (steady, L2 power user, micro retail).",
  },
];

export function DemoClient() {
  const [script, setScript] = useState<ScriptId>("classic");
  const [simRunning, setSimRunning] = useState(false);
  const [simLog, setSimLog] = useState<string[]>([]);
  const [progress, setProgress] = useState({ step: 0, total: 0 });
  const simAbortRef = useRef(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const pushSimLog = useCallback((line: string) => {
    setSimLog((prev) => [...prev.slice(-120), `[${new Date().toLocaleTimeString()}] ${line}`]);
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [simLog]);

  const stopSimulation = () => {
    simAbortRef.current = true;
    pushSimLog("Stop requested — finishing current step…");
  };

  const clearLog = () => {
    if (simRunning) return;
    setSimLog([]);
    setProgress({ step: 0, total: 0 });
  };

  const runClassic = async () => {
    const w = DEMO_WALLET;
    const mh = 100;
    const amt = 1200;
    const src = "Arbitrum";
    const dst = "Solana";
    const steps = 13;
    let n = 0;
    const tick = async () => {
      n++;
      setProgress({ step: n, total: steps });
      await sleep(50);
      if (simAbortRef.current) throw new Error("aborted");
    };

    pushSimLog("━━ Classic: bridge → hold → break streak → recover ━━");
    await tick();
    pushSimLog(`POST /api/participant minHold=${mh} wallet=${shortAddr(w)}`);
    const reg = await apiRegister(w, mh);
    pushSimLog(
      `  → registered lastProcessedDay=${reg.lastProcessedDay} snapshots=${reg.snapshots.length} balance=${reg.currentBalance}`,
    );
    await sleep(350);

    await tick();
    pushSimLog(`POST /api/bridge amount=${amt} ${src}→${dst} wallet=${shortAddr(w)}`);
    const br0 = await apiBridge(w, amt, src, dst, mh);
    pushSimLog(
      `  → balance=${br0.participant.currentBalance} bridged=${br0.participant.bridgedAmount} · ${torqueOutcomeSummary(br0.participant.bridgeTorque, "bridge")}`,
    );
    await sleep(400);

    for (let i = 0; i < 4; i++) {
      await tick();
      pushSimLog(`POST /api/advance-day decayPercent=0 (${i + 1}/4)`);
      const adv = await apiAdvance(w, 0);
      pushSimLog(
        `  → day=${adv.snapshot.dayIndex} bal=${adv.snapshot.balance} meets=${adv.snapshot.meetsThreshold} streak=${adv.snapshot.streakAfter} · ${torqueOutcomeSummary(adv.snapshot.torque, "snapshot")}`,
      );
      await sleep(320);
    }

    await tick();
    pushSimLog("POST /api/balance 70 (simulate sell / withdraw below min)");
    const balDump = await apiBalance(w, 70);
    pushSimLog(`  → balance=${balDump.currentBalance} minHold=${balDump.minHold}`);
    await sleep(300);

    await tick();
    pushSimLog("POST /api/advance-day decayPercent=0 (expect streak reset)");
    const br = await apiAdvance(w, 0);
    pushSimLog(
      `  → day=${br.snapshot.dayIndex} streak=${br.snapshot.streakAfter} meets=${br.snapshot.meetsThreshold} · ${torqueOutcomeSummary(br.snapshot.torque, "snapshot")}`,
    );
    await sleep(350);

    await tick();
    pushSimLog("POST /api/balance 450 (top up)");
    const top = await apiBalance(w, 450);
    pushSimLog(`  → balance=${top.currentBalance}`);
    await sleep(280);

    for (let j = 0; j < 2; j++) {
      await tick();
      pushSimLog(`POST /api/advance-day recovery ${j + 1}/2`);
      const adv2 = await apiAdvance(w, 0);
      pushSimLog(
        `  → streak=${adv2.snapshot.streakAfter} · ${torqueOutcomeSummary(adv2.snapshot.torque, "snapshot")}`,
      );
      await sleep(300);
    }
    await tick();
  };

  const runDecay = async () => {
    const w = DEMO_WALLET;
    const mh = 80;
    const amt = 500;
    const steps = 10;
    let n = 0;
    const tick = async () => {
      n++;
      setProgress({ step: n, total: steps });
      await sleep(50);
      if (simAbortRef.current) throw new Error("aborted");
    };

    pushSimLog("━━ Decay week: 7 days @ 4% balance decay before each snapshot ━━");
    await tick();
    pushSimLog(`POST /api/participant minHold=${mh} wallet=${shortAddr(w)}`);
    await apiRegister(w, mh);
    await sleep(300);

    await tick();
    pushSimLog(`POST /api/bridge amount=${amt} Base→Solana`);
    const brd = await apiBridge(w, amt, "Base", "Solana", mh);
    pushSimLog(
      `  → balance=${brd.participant.currentBalance} · ${torqueOutcomeSummary(brd.participant.bridgeTorque, "bridge")}`,
    );
    await sleep(350);

    for (let d = 0; d < 7; d++) {
      await tick();
      pushSimLog(`POST /api/advance-day decayPercent=4 day ${d + 1}/7`);
      const adv = await apiAdvance(w, 4);
      pushSimLog(
        `  → day=${adv.snapshot.dayIndex} bal=${adv.snapshot.balance} meets=${adv.snapshot.meetsThreshold} streak=${adv.snapshot.streakAfter} · ${torqueOutcomeSummary(adv.snapshot.torque, "snapshot")}`,
      );
      await sleep(340);
    }
    await tick();
  };

  const runTwin = async () => {
    const a = DEMO_WALLET_TWIN_WHALE;
    const b = DEMO_WALLET_TWIN_RETAIL;
    const steps = 7;
    let n = 0;
    const tick = async () => {
      n++;
      setProgress({ step: n, total: steps });
      await sleep(50);
      if (simAbortRef.current) throw new Error("aborted");
    };

    const minA = 100;
    const minB = 50;
    pushSimLog("━━ Twin wallets: whale-ish vs retail-ish parallel paths ━━");
    await tick();
    pushSimLog(`POST /api/participant ×2 (A ${shortAddr(a)}, B ${shortAddr(b)})`);
    await apiRegister(a, minA);
    await apiRegister(b, minB);
    await sleep(350);

    await tick();
    pushSimLog("POST /api/bridge A: 5000 Eth→Sol · B: 220 Base→Sol");
    const [ba, bb] = await Promise.all([
      apiBridge(a, 5000, "Ethereum", "Solana", minA),
      apiBridge(b, 220, "Base", "Solana", minB),
    ]);
    pushSimLog(`  A: ${torqueOutcomeSummary(ba.participant.bridgeTorque, "bridge")}`);
    pushSimLog(`  B: ${torqueOutcomeSummary(bb.participant.bridgeTorque, "bridge")}`);
    await sleep(400);

    for (let d = 0; d < 3; d++) {
      await tick();
      pushSimLog(`POST /api/advance-day ×2 in parallel (${d + 1}/3)`);
      const [ra, rb] = await Promise.all([apiAdvance(a, 0), apiAdvance(b, 0)]);
      pushSimLog(
        `  A day=${ra.snapshot.dayIndex} streak=${ra.snapshot.streakAfter} · ${torqueOutcomeSummary(ra.snapshot.torque, "snapshot")}`,
      );
      pushSimLog(
        `  B day=${rb.snapshot.dayIndex} streak=${rb.snapshot.streakAfter} · ${torqueOutcomeSummary(rb.snapshot.torque, "snapshot")}`,
      );
      await sleep(380);
    }
    await tick();
  };

  const runSeed = async () => {
    const trio = [SCENARIOS[0], SCENARIOS[3], SCENARIOS[5]];
    const steps = 1 + trio.length * 3;
    let n = 0;
    const tick = async () => {
      n++;
      setProgress({ step: n, total: steps });
      await sleep(50);
      if (simAbortRef.current) throw new Error("aborted");
    };

    pushSimLog("━━ Leaderboard seed: three personas → one day of snapshots each ━━");
    await tick();

    for (const s of trio) {
      await tick();
      pushSimLog(`▸ ${s.title} POST /api/participant wallet=${shortAddr(s.wallet)} minHold=${s.minHold}`);
      await apiRegister(s.wallet, s.minHold);
      await sleep(280);

      await tick();
      pushSimLog(`  POST /api/bridge ${s.amount} ${s.sourceChain}→${s.destChain}`);
      const brs = await apiBridge(s.wallet, s.amount, s.sourceChain, s.destChain, s.minHold);
      pushSimLog(`  ${torqueOutcomeSummary(brs.participant.bridgeTorque, "bridge")}`);
      await sleep(300);

      await tick();
      pushSimLog(`  POST /api/advance-day decayPercent=${s.decay}`);
      const adv = await apiAdvance(s.wallet, s.decay);
      pushSimLog(
        `  → day=${adv.snapshot.dayIndex} bal=${adv.snapshot.balance} streak=${adv.snapshot.streakAfter} meets=${String(adv.snapshot.meetsThreshold)} · ${torqueOutcomeSummary(adv.snapshot.torque, "snapshot")}`,
      );
      await sleep(320);
    }
  };

  const runLiveDemo = async () => {
    if (simRunning) return;
    simAbortRef.current = false;
    setSimRunning(true);
    setSimLog([]);
    setProgress({ step: 0, total: 0 });

    try {
      if (script === "classic") await runClassic();
      else if (script === "decay") await runDecay();
      else if (script === "twin") await runTwin();
      else await runSeed();

      pushSimLog("✓ Script complete. Open Simulator to inspect state, snapshots, and leaderboard.");
      setProgress((p) => ({ step: p.total, total: p.total }));
    } catch (e) {
      if (e instanceof Error && e.message === "aborted") {
        pushSimLog("— Aborted by user.");
      } else {
        pushSimLog(`Error: ${e instanceof Error ? e.message : "unknown"}`);
      }
    } finally {
      setSimRunning(false);
      simAbortRef.current = false;
    }
  };

  const pct = progress.total > 0 ? Math.round((progress.step / progress.total) * 100) : 0;
  const activeScript = SCRIPTS.find((x) => x.id === script);

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <h1 className="inline-flex items-center gap-1 text-3xl font-semibold tracking-tight text-slate-900">
          Live demo simulation
          <Hint title="What this is">
            Fully automated calls to the same Next.js API routes as the simulator. With{" "}
            <code className="text-cyan-700">TORQUE_INGEST_API_KEY</code> set, each step emits the same Torque custom
            events as production.
          </Hint>
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">
          Pick a script, then run. This flow is deterministic and suitable for repeatable demos, QA checks, and
          regression passes.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs text-slate-600">
            Active script: <span className="font-semibold text-slate-900">{activeScript?.label}</span>
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs text-slate-600">
            Steps: <span className="font-mono text-slate-900">{progress.total || "—"}</span>
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs text-slate-600">
            Status:{" "}
            <span className={simRunning ? "font-semibold text-cyan-700" : "font-semibold text-emerald-700"}>
              {simRunning ? "Running" : "Idle"}
            </span>
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {SCRIPTS.map((s) => (
          <button
            key={s.id}
            type="button"
            disabled={simRunning}
            onClick={() => setScript(s.id)}
            className={`rounded-xl border p-4 text-left transition ${
              script === s.id
                ? "border-teal-400 bg-teal-50 ring-1 ring-teal-200"
                : "border-slate-200 bg-white hover:border-slate-300"
            } disabled:opacity-50`}
          >
            <span className="flex items-start justify-between gap-1">
              <span className="font-semibold text-slate-900">{s.label}</span>
              <Hint title={`${s.label} script`}>
                <span className="font-normal">{s.hint}</span>
              </Hint>
            </span>
            <span className="mt-2 block text-xs leading-relaxed text-slate-600">{s.blurb}</span>
          </button>
        ))}
      </div>

      {progress.total > 0 ? (
        <div className="mt-6">
          <div className="mb-1 flex justify-between text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              Progress
              <Hint title="Progress bar">Steps mirror API calls (register, bridge, tick, balance edits). Abort finishes the current step safely.</Hint>
            </span>
            <span>
              {progress.step} / {progress.total} ({pct}%)
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-600 to-cyan-500 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      ) : null}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 font-mono text-xs shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <span className="inline-flex items-center gap-1 font-medium text-slate-500">
            demo.log
            <Hint title="Event log">Timestamped API steps for auditing what ran in order.</Hint>
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={simRunning}
              onClick={() => void runLiveDemo()}
              className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-500 disabled:opacity-45"
            >
              {simRunning ? "Running…" : `Run “${activeScript?.label}”`}
            </button>
            <button
              type="button"
              disabled={!simRunning}
              onClick={stopSimulation}
              className="rounded-lg border-2 border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-40"
            >
              Stop
            </button>
            <button
              type="button"
              disabled={simRunning}
              onClick={clearLog}
              className="rounded-lg border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs text-slate-600 disabled:opacity-40"
            >
              Clear log
            </button>
          </div>
        </div>
        <div className="max-h-[min(28rem,55vh)] overflow-y-auto text-slate-700">
          {simLog.length === 0 ? (
            <p className="text-slate-500">Choose a script and hit Run — or switch scripts before running.</p>
          ) : (
            simLog.map((line, i) => (
              <p
                key={`${i}-${line.slice(0, 28)}`}
                className={`whitespace-pre-wrap break-all py-0.5 ${
                  line.includes("✓") ? "text-teal-700" : line.includes("━━") ? "text-cyan-700" : ""
                }`}
              >
                {line}
              </p>
            ))
          )}
          <div ref={logEndRef} />
        </div>
      </div>

      <p className="mt-6 text-xs text-slate-500">
        Wallets: primary <span className="font-mono text-slate-600">{shortAddr(DEMO_WALLET)}</span>
        {script === "twin" ? (
          <>
            {" "}
            · whale <span className="font-mono text-slate-600">{shortAddr(DEMO_WALLET_TWIN_WHALE)}</span>
            {" · retail "}
            <span className="font-mono text-slate-600">{shortAddr(DEMO_WALLET_TWIN_RETAIL)}</span>
          </>
        ) : null}
        {script === "seed" ? (
          <>
            {" "}
            · preset wallets{" "}
            <span className="font-mono text-slate-600">
              {shortAddr(SCENARIOS[0].wallet)}, {shortAddr(SCENARIOS[3].wallet)}, {shortAddr(SCENARIOS[5].wallet)}
            </span>
          </>
        ) : null}
      </p>
    </>
  );
}
