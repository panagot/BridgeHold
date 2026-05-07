import { BarChart3, Rocket, Sparkles, ShieldCheck } from "lucide-react";

const stats = [
  {
    icon: BarChart3,
    headline: "$5B+",
    detail: "Volume routed through Torque-powered incentives",
  },
  {
    icon: Rocket,
    headline: "1,400+",
    detail: "Campaigns launched on the platform",
  },
  {
    icon: Sparkles,
    headline: "$10M+",
    detail: "Rewards distributed to participants",
  },
  {
    icon: ShieldCheck,
    headline: "Sybil-aware",
    detail: "Primitives designed for real retention, not bot farms",
  },
] as const;

export function TorqueCredibilityStrip() {
  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-center font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-teal-800/80">
          Programmable retention layer
        </p>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm leading-relaxed text-slate-700">
          Torque gives teams leaderboards, rebates, raffles, and gifts on top of live activity - so growth loops are
          measurable, not theoretical.
        </p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ icon: Icon, headline, detail }) => (
            <li
              key={headline}
              className="flex gap-3 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/40 px-4 py-4 shadow-[0_1px_0_0_rgba(255,255,255,0.8)_inset,0_8px_24px_-12px_rgba(15,23,42,0.12)]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
                <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
              </span>
              <span>
                <span className="block font-mono text-lg font-semibold tabular-nums text-slate-900">{headline}</span>
                <span className="mt-0.5 block text-xs leading-snug text-slate-600">{detail}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-xs text-slate-500">
          Teams like Raydium, Axiom, and WLFI use Torque to tie acquisition, retention, and velocity to real participation.
        </p>
      </div>
    </section>
  );
}
