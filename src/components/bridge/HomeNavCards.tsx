import Link from "next/link";

const items = [
  {
    href: "/how-it-works",
    title: "How it works",
    desc: "Bridge events, daily snapshots, and how they feed Torque primitives.",
  },
  {
    href: "/examples",
    title: "Examples",
    desc: "Nine preset scenarios — L2s, stables, retail, whale, decay, Avalanche, Sui, BNB, and more.",
  },
  {
    href: "/demo",
    title: "Live demo",
    desc: "Four scripts: classic streak, decay week, twin wallets, leaderboard seed.",
  },
  {
    href: "/simulator",
    title: "Simulator",
    desc: "Presets, batch days, reset session, full ingest controls.",
  },
  {
    href: "/leaderboard",
    title: "Leaderboard",
    desc: "Rankings plus volume, streaks, routes, and qualifying snapshot totals.",
  },
] as const;

export function HomeNavCards() {
  return (
    <div className="mx-auto max-w-6xl border-t border-zinc-800/80 bg-[#070b12] px-4 py-14 sm:px-6 lg:px-8">
      <h2 className="text-lg font-semibold text-white">Explore</h2>
      <p className="mt-1 text-sm text-zinc-400">Each section has its own page.</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex h-full flex-col rounded-2xl border border-zinc-700/80 bg-slate-900/70 p-5 transition hover:border-teal-500/50 hover:bg-slate-900"
            >
              <span className="font-semibold text-white">{item.title}</span>
              <span className="mt-2 text-sm leading-relaxed text-zinc-400">{item.desc}</span>
              <span className="mt-4 text-sm font-medium text-teal-400">Open →</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
