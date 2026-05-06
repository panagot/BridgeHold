"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { DEMO_WALLET, DEMO_WALLET_B, SCENARIOS, shortAddr } from "@/lib/bridge/constants";
import { apiAdvance, apiBalance, apiBridge, apiRegister } from "@/lib/bridge/api";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type ScriptId = "classic" | "decay" | "twin" | "seed";

const SCRIPTS: { id: ScriptId; label: string; blurb: string }[] = [
  {
    id: "classic",
    label: "Classic streak",
    blurb: "Bridge → 4 good days → dump below min → streak break → recover (original narrative).",
  },
  {
    id: "decay",
    label: "Decay week",
    blurb: "7 indexer ticks with 4% daily decay from a 500 balance; watch streak fight gravity.",
  },
  {
    id: "twin",
    label: "Twin wallets",
    blurb: "Two actors bridge different sizes; both run parallel day ticks — great for a populated leaderboard.",
  },
  {
    id: "seed",
    label: "Leaderboard seed",
    blurb:
      "Three preset personas (steady bridger, L2 power user, micro retail) register, bridge, and each get one indexer tick — instant board for screen recordings.",
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
    pushSimLog(`Register ${shortAddr(w)} (min ${mh})`);
    await apiRegister(w, mh);
    await sleep(350);

    await tick();
    pushSimLog(`Bridge ${amt} ${src} → ${dst}`);
    await apiBridge(w, amt, src, dst, mh);
    await sleep(400);

    for (let i = 0; i < 4; i++) {
      await tick();
      pushSimLog(`Tick ${i + 1}/4 (no decay)`);
      const adv = await apiAdvance(w, 0);
      pushSimLog(`  → bal ${adv.snapshot.balance}, streak ${adv.snapshot.streakAfter}`);
      await sleep(320);
    }

    await tick();
    pushSimLog("Sell down → balance 70 (below min)");
    await apiBalance(w, 70);
    await sleep(300);

    await tick();
    pushSimLog("Tick after dump (streak should reset)");
    const br = await apiAdvance(w, 0);
    pushSimLog(`  → streak ${br.snapshot.streakAfter}, meets ${br.snapshot.meetsThreshold}`);
    await sleep(350);

    await tick();
    pushSimLog("Top up → 450");
    await apiBalance(w, 450);
    await sleep(280);

    for (let j = 0; j < 2; j++) {
      await tick();
      pushSimLog(`Recovery ${j + 1}/2`);
      const adv2 = await apiAdvance(w, 0);
      pushSimLog(`  → streak ${adv2.snapshot.streakAfter}`);
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
    await apiRegister(w, mh);
    pushSimLog(`Register ${shortAddr(w)}, min ${mh}`);
    await sleep(300);

    await tick();
    await apiBridge(w, amt, "Base", "Solana", mh);
    pushSimLog(`Bridge ${amt} Base → Solana`);
    await sleep(350);

    for (let d = 0; d < 7; d++) {
      await tick();
      pushSimLog(`Day ${d + 1}/7 + 4% decay`);
      const adv = await apiAdvance(w, 4);
      pushSimLog(
        `  → bal ${adv.snapshot.balance}, meets ${adv.snapshot.meetsThreshold}, streak ${adv.snapshot.streakAfter}`,
      );
      await sleep(340);
    }
    await tick();
  };

  const runTwin = async () => {
    const a = DEMO_WALLET;
    const b = DEMO_WALLET_B;
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
    await apiRegister(a, minA);
    await apiRegister(b, minB);
    pushSimLog(`Register A ${shortAddr(a)} & B ${shortAddr(b)}`);
    await sleep(350);

    await tick();
    await apiBridge(a, 5000, "Ethereum", "Solana", minA);
    await apiBridge(b, 220, "Base", "Solana", minB);
    pushSimLog("Bridge A: 5k Eth→Sol · Bridge B: 220 Base→Sol");
    await sleep(400);

    for (let d = 0; d < 3; d++) {
      await tick();
      pushSimLog(`Parallel tick ${d + 1}/3`);
      const [ra, rb] = await Promise.all([apiAdvance(a, 0), apiAdvance(b, 0)]);
      pushSimLog(`  A: streak ${ra.snapshot.streakAfter} · B: streak ${rb.snapshot.streakAfter}`);
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
      pushSimLog(`▸ ${s.title} — register ${shortAddr(s.wallet)}`);
      await apiRegister(s.wallet, s.minHold);
      await sleep(280);

      await tick();
      pushSimLog(`  Bridge ${s.amount} ${s.sourceChain} → ${s.destChain}`);
      await apiBridge(s.wallet, s.amount, s.sourceChain, s.destChain, s.minHold);
      await sleep(300);

      await tick();
      pushSimLog(`  Tick + ${s.decay}% decay`);
      const adv = await apiAdvance(s.wallet, s.decay);
      pushSimLog(
        `  → bal ${adv.snapshot.balance}, streak ${adv.snapshot.streakAfter}, meets ${String(adv.snapshot.meetsThreshold)}`,
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

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight text-white">Live demo simulation</h1>
      <p className="mt-3 max-w-3xl text-sm text-zinc-400 sm:text-base">
        Pick a script below. Each run hits the same API routes as the simulator (register, bridge, advance-day, balance)
        so Torque ingest sees identical payloads when your API key is set.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SCRIPTS.map((s) => (
          <button
            key={s.id}
            type="button"
            disabled={simRunning}
            onClick={() => setScript(s.id)}
            className={`rounded-xl border-2 p-4 text-left transition ${
              script === s.id
                ? "border-teal-500 bg-teal-950/40 ring-1 ring-teal-500/30"
                : "border-zinc-700 bg-slate-900/60 hover:border-zinc-600"
            } disabled:opacity-50`}
          >
            <span className="font-semibold text-white">{s.label}</span>
            <span className="mt-2 block text-xs leading-relaxed text-zinc-400">{s.blurb}</span>
          </button>
        ))}
      </div>

      {progress.total > 0 ? (
        <div className="mt-6">
          <div className="mb-1 flex justify-between text-xs text-zinc-500">
            <span>Progress</span>
            <span>
              {progress.step} / {progress.total} ({pct}%)
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-600 to-cyan-500 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      ) : null}

      <div className="mt-6 rounded-2xl border border-zinc-700/80 bg-zinc-950 p-4 font-mono text-xs shadow-inner">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-700/80 pb-3">
          <span className="font-medium text-zinc-400">demo.log</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={simRunning}
              onClick={() => void runLiveDemo()}
              className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-45"
            >
              {simRunning ? "Running…" : `Run “${SCRIPTS.find((x) => x.id === script)?.label}”`}
            </button>
            <button
              type="button"
              disabled={!simRunning}
              onClick={stopSimulation}
              className="rounded-lg border-2 border-zinc-500 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-100 disabled:opacity-40"
            >
              Stop
            </button>
            <button
              type="button"
              disabled={simRunning}
              onClick={clearLog}
              className="rounded-lg border border-zinc-600 bg-zinc-900/80 px-3 py-1.5 text-xs text-zinc-300 disabled:opacity-40"
            >
              Clear log
            </button>
          </div>
        </div>
        <div className="max-h-[min(28rem,55vh)] overflow-y-auto text-zinc-300">
          {simLog.length === 0 ? (
            <p className="text-zinc-500">Choose a script and hit Run — or switch scripts before running.</p>
          ) : (
            simLog.map((line, i) => (
              <p
                key={`${i}-${line.slice(0, 28)}`}
                className={`whitespace-pre-wrap break-all py-0.5 ${
                  line.includes("✓") ? "text-teal-400" : line.includes("━━") ? "text-cyan-500/90" : ""
                }`}
              >
                {line}
              </p>
            ))
          )}
          <div ref={logEndRef} />
        </div>
      </div>

      <p className="mt-6 text-xs text-zinc-500">
        Wallets: primary <span className="font-mono text-zinc-400">{shortAddr(DEMO_WALLET)}</span>
        {script === "twin" ? (
          <>
            {" "}
            · secondary <span className="font-mono text-zinc-400">{shortAddr(DEMO_WALLET_B)}</span>
          </>
        ) : null}
        {script === "seed" ? (
          <>
            {" "}
            · preset wallets{" "}
            <span className="font-mono text-zinc-400">
              {shortAddr(SCENARIOS[0].wallet)}, {shortAddr(SCENARIOS[3].wallet)}, {shortAddr(SCENARIOS[5].wallet)}
            </span>
          </>
        ) : null}
      </p>
    </>
  );
}
