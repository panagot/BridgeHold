import { LayoutGrid, Link2, Repeat } from "lucide-react";
import Link from "next/link";

const points = [
  {
    icon: Repeat,
    title: "Built-in growth loop",
    body: "Bridge plus daily hold snapshots map directly to Torque leaderboards, raffles, and rebates - retention, not one-off airdrops.",
  },
  {
    icon: Link2,
    title: "Live custom events",
    body: "Every bridge and indexer tick can POST to Torque's ingester so participation is measurable end to end.",
  },
  {
    icon: LayoutGrid,
    title: "Nine ready-made scenarios",
    body: "Load L2, stablecoin, micro-retail, whale, decay, Avalanche, Sui, BNB, or steady paths - then use the live demo seed script to populate a multi-wallet board quickly.",
  },
] as const;

export function ProductHighlights() {
  return (
    <section className="border-t border-slate-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-lg font-semibold text-slate-900">Why teams use Torque here</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          BridgeHold is a <strong className="font-medium text-slate-800">retention primitive</strong>: liquidity that
          stays is liquidity you can reward. Torque supplies sybil-aware campaigns, leaderboards, and analytics on top of
          consistent custom events from your bridge and indexer.
        </p>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {points.map((p) => (
            <li
              key={p.title}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-teal-200 hover:shadow-md"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-teal-100 transition group-hover:bg-teal-100">
                <p.icon className="h-5 w-5" strokeWidth={2} aria-hidden />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-sm text-slate-500">
          <Link href="/examples" className="inline-flex items-center gap-1 font-medium text-teal-700 hover:underline">
            Browse all examples
            <span aria-hidden>-&gt;</span>
          </Link>
          {" | "}
          <Link href="/demo" className="inline-flex items-center gap-1 font-medium text-teal-700 hover:underline">
            Run live demo
            <span aria-hidden>-&gt;</span>
          </Link>
          {" | "}
          <Link href="/leaderboard" className="inline-flex items-center gap-1 font-medium text-teal-700 hover:underline">
            Open leaderboard
            <span aria-hidden>-&gt;</span>
          </Link>
        </p>
      </div>
    </section>
  );
}
