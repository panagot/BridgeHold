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
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
        Checking Torque ingest configuration…
      </div>
    );
  }

  if (s.ingestConfigured) {
    return (
      <div className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm">
        <p className="font-semibold text-teal-800">Live ingest ready</p>
        <p className="mt-1 text-slate-600">
          Events post to <span className="font-mono text-cyan-700">{s.ingesterHost}</span> with{" "}
          <span className="font-mono text-slate-700">{s.bridgeEventName}</span> and{" "}
          <span className="font-mono text-slate-700">{s.snapshotEventName}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
      <p className="font-semibold text-amber-800">Local-only mode</p>
      <p className="mt-1 text-slate-600">
        Set <span className="font-mono text-slate-700">TORQUE_INGEST_API_KEY</span> in{" "}
        <span className="font-mono text-slate-700">.env.local</span> so bridges and indexer ticks post live{" "}
        <span className="text-slate-700">custom_events</span> to your Torque project.
      </p>
    </div>
  );
}
