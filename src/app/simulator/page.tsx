import type { Metadata } from "next";
import { Suspense } from "react";

import { PageContainer } from "@/components/bridge/PageContainer";
import { SimulatorClient } from "@/components/bridge/SimulatorClient";

export const metadata: Metadata = {
  title: "Simulator · Bridge & Hold",
  description: "Interactive bridge, hold, and Torque custom event simulator.",
};

function SimulatorFallback() {
  return (
    <div className="animate-pulse text-zinc-500" aria-busy="true">
      Loading simulator…
    </div>
  );
}

export default function SimulatorPage() {
  return (
    <PageContainer>
      <Suspense fallback={<SimulatorFallback />}>
        <SimulatorClient />
      </Suspense>
    </PageContainer>
  );
}
