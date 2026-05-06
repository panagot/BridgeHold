"use client";

import { useEffect, useState } from "react";

type Status = {
  ingestConfigured: boolean;
  ingesterHost: string;
  bridgeEventName: string;
  snapshotEventName: string;
};

export function TorqueStatusBanner() {
  const [s, setS] = useState<Status | null>(null);

  useEffect(() => {
    void fetch("/api/torque-status")
      .then((r) => r.json() as Promise<Status>)
      .then(setS)
      .catch(() => setS(null));
  }, []);

  if (!s) {
    return (
      <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-500">
        Checking Torque ingest configuration…
      </div>
    );
  }

  if (s.ingestConfigured) {
    return (
      <div className="rounded-xl border border-teal-600/50 bg-teal-950/40 px-4 py-3 text-sm">
        <p className="font-semibold text-teal-200">Live ingest ready</p>
        <p className="mt-1 text-zinc-300">
          Events post to <span className="font-mono text-cyan-300">{s.ingesterHost}</span> with{" "}
          <span className="font-mono text-zinc-200">{s.bridgeEventName}</span> and{" "}
          <span className="font-mono text-zinc-200">{s.snapshotEventName}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-600/40 bg-amber-950/30 px-4 py-3 text-sm">
      <p className="font-semibold text-amber-200">Local-only mode</p>
      <p className="mt-1 text-zinc-400">
        Set <span className="font-mono text-zinc-300">TORQUE_INGEST_API_KEY</span> in{" "}
        <span className="font-mono text-zinc-300">.env.local</span> so bridges and indexer ticks hit
        Torque — required for judges to verify live <span className="text-zinc-300">custom_events</span>.
      </p>
    </div>
  );
}
