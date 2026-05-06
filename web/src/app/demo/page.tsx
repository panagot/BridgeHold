import type { Metadata } from "next";
import Link from "next/link";

import { DemoClient } from "@/components/bridge/DemoClient";
import { PageContainer } from "@/components/bridge/PageContainer";
import { TorqueStatusBanner } from "@/components/bridge/TorqueStatusBanner";

export const metadata: Metadata = {
  title: "Live demo · Bridge & Hold",
  description: "Automated bridge and hold simulation with event log.",
};

export default function DemoPage() {
  return (
    <PageContainer>
      <div className="mb-8">
        <TorqueStatusBanner />
      </div>
      <DemoClient />
      <p className="mt-8 text-sm text-zinc-500">
        After a run, open the{" "}
        <Link href="/simulator" className="font-medium text-teal-400 underline-offset-2 hover:underline">
          simulator
        </Link>{" "}
        and hit <strong className="text-zinc-400">Refresh state</strong> on the demo wallets (shown under the log) to
        inspect snapshots and the leaderboard.
      </p>
      <p className="mt-4 text-sm text-zinc-500">
        Recording a walkthrough? Show Torque ingest or campaign UI and mention{" "}
        <a
          href="https://twitter.com/torqueprotocol"
          className="font-medium text-teal-400 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          @torqueprotocol
        </a>{" "}
        if you post on X.
      </p>
    </PageContainer>
  );
}
