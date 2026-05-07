import { ArrowRight, BookOpen, PlayCircle, Sparkles, Wrench } from "lucide-react";
import Link from "next/link";

const primitiveChips = ["Leaderboards", "Raffles", "Rebates", "Gifts", "Distributors"] as const;

export function HomeHero() {
  return (
    <div className="relative overflow-hidden border-b border-slate-200 bg-white">
      <div
        className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-amber-100/50 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 top-24 h-64 w-64 rounded-full bg-teal-100/40 blur-[90px]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-20 lg:pt-16">
        <p className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-slate-600">
          <Wrench className="h-3.5 w-3.5 text-teal-600" strokeWidth={2} aria-hidden />
          BRIDGEHOLD x TORQUE
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl sm:leading-[1.08]">
          Prove liquidity{' '}
          <span className="bg-gradient-to-r from-amber-700 via-orange-600 to-teal-700 bg-clip-text text-transparent">
            sticks after the bridge
          </span>
          . Let Torque run the incentives.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-700 sm:text-lg">
          BridgeHold is a <strong className="font-medium text-slate-900">reference growth loop</strong>: your product emits
          two Torque custom events (bridge + daily hold snapshot). Torque turns those streams into{' '}
          <strong className="font-medium text-slate-900">leaderboards, raffles, rebates, gifts, and distributor payouts</strong>
          - with sybil-aware, measurable participation instead of one-off airdrops.
        </p>
        <p className="mt-3 max-w-3xl text-sm text-slate-600">
          We showcase{' '}
          <Link href="/use-cases" className="font-semibold text-teal-700 underline-offset-2 hover:underline">
            five concrete narratives
          </Link>{' '}
          - sticky TVL, anti-dump rules, cohort campaigns, consumer seasons, and referral economics - all fed by the same
          integration you can demo in the simulator with live ingest.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {primitiveChips.map((label) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-600" strokeWidth={2} aria-hidden />
              {label}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/use-cases"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-amber-400 bg-amber-50 px-5 py-2.5 text-sm font-semibold text-amber-950 hover:bg-amber-100"
          >
            View use cases
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
          </Link>
          <Link
            href="/simulator"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500"
          >
            Open simulator
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            <PlayCircle className="h-4 w-4 text-slate-500" strokeWidth={2} aria-hidden />
            Run auto demo
          </Link>
          <Link
            href="/how-it-works"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-transparent px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            <BookOpen className="h-4 w-4 text-slate-500" strokeWidth={2} aria-hidden />
            How it works
          </Link>
        </div>
      </div>
    </div>
  );
}
