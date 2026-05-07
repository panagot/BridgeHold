import Link from "next/link";

export function HomeHero() {
  return (
    <div className="relative overflow-hidden border-b border-cyan-500/15 bg-[#070b12]">
      <div
        className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 top-24 h-64 w-64 rounded-full bg-teal-600/15 blur-[90px]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-20 lg:pt-16">
        <p className="font-mono text-xs tracking-[0.2em] text-cyan-400/90">BRIDGEHOLD × TORQUE</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl sm:leading-[1.1]">
          Turn cross-chain holds into{" "}
          <span className="bg-gradient-to-r from-cyan-300 to-teal-400 bg-clip-text text-transparent">
            measurable retention
          </span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
          A <strong className="font-medium text-white">growth loop</strong> for protocols that care about sticky
          liquidity: bridge in, prove daily balance with indexer snapshots, and let{" "}
          <strong className="font-medium text-white">Torque</strong> run leaderboards, raffles, and rebates on real
          activity — the same retention patterns high-volume teams run with Torque, packaged as a focused reference app.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-zinc-500">
          Nine preset journeys, four live-demo scripts (including a leaderboard seed), and a simulator with batch ticks and
          one-click preset flow — all wired to the same Torque ingest paths your campaign will use in production.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/simulator"
            className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-900/40 transition hover:bg-teal-500"
          >
            Open simulator
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center justify-center rounded-xl border-2 border-zinc-500 bg-slate-900/90 px-5 py-2.5 text-sm font-semibold text-zinc-100 transition hover:border-zinc-400 hover:bg-slate-800"
          >
            Run auto demo
          </Link>
          <Link
            href="/how-it-works"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-600 bg-transparent px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white"
          >
            How it works
          </Link>
        </div>
      </div>
    </div>
  );
}
