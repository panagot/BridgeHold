import type { Metadata } from "next";

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
    </PageContainer>
  );
}
