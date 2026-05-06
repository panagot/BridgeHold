import Link from "next/link";

const points = [
  {
    title: "Built-in growth loop",
    body: "Bridge + daily hold snapshots map directly to Torque leaderboards, raffles, and rebates — retention, not one-off airdrops.",
  },
  {
    title: "Live custom events",
    body: "Every bridge and indexer tick can POST to Torque’s ingester so participation is measurable, not mocked.",
  },
  {
    title: "Nine ready-made scenarios",
    body: "Load L2, stablecoin, micro-retail, whale, decay, Avalanche, Sui, BNB, or steady paths — then run the live demo’s seed script for an instant crowded board.",
  },
] as const;

export function JudgeStrip() {
  return (
    <section className="border-t border-zinc-800/90 bg-[#080d16] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-lg font-semibold text-white">Why this fits the Torque track</h2>
        <p className="mt-2 max-w-3xl text-sm text-zinc-400">
          Most hackathon apps ship code without distribution. BridgeHold is a{" "}
          <strong className="font-medium text-zinc-200">retention primitive</strong>: liquidity that stays is liquidity
          you can reward — the same problem space Torque solves for Raydium-class teams with sybil-aware campaigns and ROI
          analytics.
        </p>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {points.map((p) => (
            <li
              key={p.title}
              className="rounded-2xl border border-zinc-700/80 bg-slate-900/60 p-5 ring-1 ring-white/[0.04]"
            >
              <h3 className="font-semibold text-teal-300">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{p.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-sm text-zinc-500">
          <Link href="/examples" className="font-medium text-teal-400 hover:underline">
            Browse all examples →
          </Link>
          {" · "}
          <Link href="/demo" className="font-medium text-teal-400 hover:underline">
            Run live demo →
          </Link>
        </p>
      </div>
    </section>
  );
}
