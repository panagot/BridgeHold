import { BookOpen, ExternalLink, ServerCog, Share2 } from "lucide-react";

export function TorqueBuilderCallout() {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-b from-slate-900 to-slate-950 px-4 py-14 text-slate-200 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-teal-300/90">
                Build with Torque
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">Wire Torque the same way in demo and prod</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                BridgeHold connects the simulator, live demo scripts, and leaderboard to the{' '}
                <strong className="font-medium text-slate-200">same ingest path</strong> your production worker uses. With{" "}
                <code className="rounded bg-black/30 px-1.5 py-0.5 text-xs text-cyan-300">TORQUE_INGEST_API_KEY</code> in{" "}
                <code className="rounded bg-black/30 px-1.5 py-0.5 text-xs text-cyan-300">.env.local</code>, bridges and daily
                ticks send real <strong className="font-medium text-slate-200">custom_events</strong> so campaigns in Torque see
                live hold depth, streaks, and routes - not UI-only demos.
              </p>
            </div>
            <ul className="flex flex-col gap-3 text-sm lg:min-w-[260px]">
              <li>
                <a
                  href="https://platform.torque.so/docs/mcp/quickstart"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-teal-500/40 hover:bg-white/10"
                >
                  <BookOpen className="h-5 w-5 shrink-0 text-teal-400" aria-hidden />
                  <span className="flex-1 font-medium text-white group-hover:text-teal-200">MCP quickstart</span>
                  <ExternalLink className="h-4 w-4 shrink-0 text-slate-500 group-hover:text-teal-300" aria-hidden />
                </a>
              </li>
              <li>
                <a
                  href="https://www.torque.so/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-teal-500/40 hover:bg-white/10"
                >
                  <ServerCog className="h-5 w-5 shrink-0 text-teal-400" aria-hidden />
                  <span className="flex-1 font-medium text-white group-hover:text-teal-200">torque.so</span>
                  <ExternalLink className="h-4 w-4 shrink-0 text-slate-500 group-hover:text-teal-300" aria-hidden />
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/torqueprotocol"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-teal-500/40 hover:bg-white/10"
                >
                  <Share2 className="h-5 w-5 shrink-0 text-teal-400" aria-hidden />
                  <span className="flex-1 font-medium text-white group-hover:text-teal-200">@torqueprotocol on X</span>
                  <ExternalLink className="h-4 w-4 shrink-0 text-slate-500 group-hover:text-teal-300" aria-hidden />
                </a>
              </li>
            </ul>
          </div>
          <p className="mt-8 border-t border-white/10 pt-6 text-xs leading-relaxed text-slate-500">
            Use the MCP quickstart to configure projects and campaigns; follow{" "}
            <span className="text-slate-400">@torqueprotocol</span> on X for Torque product updates.
          </p>
        </div>
      </div>
    </section>
  );
}
