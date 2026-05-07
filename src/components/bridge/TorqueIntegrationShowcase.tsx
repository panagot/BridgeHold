import { ArrowRight, Radio, Workflow, Zap } from "lucide-react";
import Link from "next/link";

const bridgeFields = [
  "userPubkey",
  "timestamp",
  "amount",
  "sourceChain",
  "destChain",
  "txHash (mock in demo)",
];

const snapshotFields = [
  "userPubkey",
  "timestamp",
  "dayIndex",
  "balance",
  "meetsThreshold",
  "streakDays",
  "bridgedAmount",
  "sourceChain",
  "destChain",
];

export function TorqueIntegrationShowcase() {
  return (
    <section className="border-b border-slate-200 bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-700">
              <Zap className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              Torque in production
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              How we use Torque - not generic, not hand-wavy
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              BridgeHold&apos;s Next.js API routes call the same ingest URL your production worker would. When{' '}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800">TORQUE_INGEST_API_KEY</code>{' '}
              is set, every <strong className="font-medium text-slate-800">bridge</strong> and{' '}
              <strong className="font-medium text-slate-800">daily tick</strong> attempts a real{' '}
              <code className="rounded bg-slate-100 px-1 font-mono text-xs">POST …/events</code> with your Torque custom
              event names. The simulator, live demo, and leaderboard all exercise that path so you can verify live
              custom_events end-to-end.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/simulator"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Fire events from simulator
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-400"
            >
              Run scripted demo
            </Link>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Workflow className="h-5 w-5 text-teal-600" strokeWidth={2} aria-hidden />
            Data flow
          </div>
          <ol className="mt-4 flex flex-col gap-3 text-sm text-slate-700 md:flex-row md:flex-wrap md:items-center md:gap-1">
            <li className="rounded-lg bg-white px-3 py-2 font-medium shadow-sm ring-1 ring-slate-200">User / indexer</li>
            <li className="hidden md:block text-slate-400" aria-hidden>
              &rarr;
            </li>
            <li className="rounded-lg bg-white px-3 py-2 font-medium shadow-sm ring-1 ring-slate-200">BridgeHold APIs</li>
            <li className="hidden md:block text-slate-400" aria-hidden>
              &rarr;
            </li>
            <li className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-3 py-2 font-semibold text-white shadow-sm">
              <Radio className="h-4 w-4" aria-hidden />
              Torque ingest
            </li>
            <li className="hidden md:block text-slate-400" aria-hidden>
              &rarr;
            </li>
            <li className="rounded-lg bg-white px-3 py-2 font-medium shadow-sm ring-1 ring-slate-200">
              Leaderboards · Raffles · Rebates · Gifts · Distributors
            </li>
          </ol>
          <p className="mt-4 text-xs text-slate-500">
            Configure campaigns and SQL with the{' '}
            <a
              href="https://platform.torque.so/docs/mcp/quickstart"
              className="font-medium text-teal-700 underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Torque MCP
            </a>
            - BridgeHold focuses on emitting consistent custom_events your rules can trust.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-slate-900">Bridge completed</h3>
              <code className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-800">bridge_hold_completed</code>
            </div>
            <p className="mt-2 text-xs text-slate-600">
              Env override: <span className="font-mono text-slate-700">TORQUE_EVENT_BRIDGE</span>
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {bridgeFields.map((f) => (
                <li
                  key={f}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[10px] text-slate-700"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-slate-900">Daily snapshot</h3>
              <code className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-800">bridge_hold_daily_snapshot</code>
            </div>
            <p className="mt-2 text-xs text-slate-600">
              Env override: <span className="font-mono text-slate-700">TORQUE_EVENT_SNAPSHOT</span>
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {snapshotFields.map((f) => (
                <li
                  key={f}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[10px] text-slate-700"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
