import type { Metadata } from "next";

import { HowItWorksContent } from "@/components/bridge/HowItWorksContent";
import { PageContainer } from "@/components/bridge/PageContainer";
import { TorqueIntegrationShowcase } from "@/components/bridge/TorqueIntegrationShowcase";

export const metadata: Metadata = {
  title: "How it works · Bridge & Hold",
  description: "Bridge events, daily snapshots, Torque ingest, and incentive primitives.",
};

export default function HowItWorksPage() {
  return (
    <>
      <PageContainer>
        <HowItWorksContent />
      </PageContainer>
      <TorqueIntegrationShowcase />
    </>
  );
}
