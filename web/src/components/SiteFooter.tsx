export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#050810]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-semibold text-white">BridgeHold</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Frontier × Torque: bridge-and-hold retention with measurable custom events, leaderboards, and raffles.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">App</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a className="text-zinc-300 hover:text-cyan-300 hover:underline" href="/how-it-works">
                  How it works
                </a>
              </li>
              <li>
                <a className="text-zinc-300 hover:text-cyan-300 hover:underline" href="/examples">
                  Examples
                </a>
              </li>
              <li>
                <a className="text-zinc-300 hover:text-cyan-300 hover:underline" href="/demo">
                  Live demo
                </a>
              </li>
              <li>
                <a className="text-zinc-300 hover:text-cyan-300 hover:underline" href="/simulator">
                  Simulator
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Torque</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  className="text-zinc-300 underline-offset-2 hover:text-cyan-300 hover:underline"
                  href="https://www.torque.so/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  torque.so
                </a>
              </li>
              <li>
                <a
                  className="text-zinc-300 underline-offset-2 hover:text-cyan-300 hover:underline"
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
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Env</p>
            <ul className="mt-3 space-y-1.5 font-mono text-[11px] text-zinc-400">
              <li>.env.local</li>
              <li>TORQUE_INGEST_API_KEY</li>
              <li>TORQUE_EVENT_BRIDGE</li>
              <li>TORQUE_EVENT_SNAPSHOT</li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-white/5 pt-8 text-center text-xs text-zinc-500">
          Demo for Torque integration — not affiliated with Torque Labs.
        </p>
      </div>
    </footer>
  );
}
