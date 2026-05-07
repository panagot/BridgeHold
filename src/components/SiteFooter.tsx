import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-900 text-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 font-semibold tracking-tight text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 text-sm font-bold text-black">
                B
              </span>
              <span>
                Bridge<span className="text-cyan-300">Hold</span>
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
              Bridge-and-hold retention with measurable custom events, streaks, leaderboards, and campaign automation in
              Torque.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Product</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="text-slate-200 hover:text-cyan-300" href="/use-cases">Use cases</Link></li>
              <li><Link className="text-slate-200 hover:text-cyan-300" href="/how-it-works">How it works</Link></li>
              <li><Link className="text-slate-200 hover:text-cyan-300" href="/examples">Examples</Link></li>
              <li><Link className="text-slate-200 hover:text-cyan-300" href="/demo">Live demo</Link></li>
              <li><Link className="text-slate-200 hover:text-cyan-300" href="/simulator">Simulator</Link></li>
              <li><Link className="text-slate-200 hover:text-cyan-300" href="/leaderboard">Leaderboard</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Torque</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a className="text-slate-200 hover:text-cyan-300" href="https://www.torque.so/" target="_blank" rel="noopener noreferrer">
                  torque.so
                </a>
              </li>
              <li>
                <a
                  className="text-slate-200 hover:text-cyan-300"
                  href="https://platform.torque.so/docs/mcp/quickstart"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MCP quickstart
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Environment keys</p>
            <ul className="mt-3 space-y-1.5 font-mono text-[11px] text-slate-400">
              <li>.env.local</li>
              <li>TORQUE_INGEST_API_KEY</li>
              <li>TORQUE_EVENT_BRIDGE</li>
              <li>TORQUE_EVENT_SNAPSHOT</li>
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          Built as a reference integration for Torque campaigns.
        </p>
      </div>
    </footer>
  );
}
