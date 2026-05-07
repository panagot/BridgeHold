import Link from "next/link";

const items = [
  {
    href: "/use-cases",
    title: "Use cases",
    desc: "Five growth narratives: depth, cooling-off, cohorts, seasons, referrals.",
  },
  {
    href: "/how-it-works",
    title: "How it works",
    desc: "Bridge events, daily snapshots, and how they feed Torque primitives.",
  },
  {
    href: "/examples",
    title: "Examples",
    desc: "Nine preset scenarios - L2s, stables, retail, whale, decay, Avalanche, Sui, BNB, and more.",
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
    <section className="w-full border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-lg font-semibold text-slate-900">Explore</h2>
        <p className="mt-1 text-sm text-slate-600">Each section has its own page.</p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:bg-slate-50"
              >
                <span className="font-semibold text-slate-900">{item.title}</span>
                <span className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</span>
                <span className="mt-4 text-sm font-medium text-teal-700">Open -&gt;</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

