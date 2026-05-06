import type { Metadata } from "next";

import { HowItWorksContent } from "@/components/bridge/HowItWorksContent";
import { PageContainer } from "@/components/bridge/PageContainer";

export const metadata: Metadata = {
  title: "How it works · Bridge & Hold",
  description: "Bridge events, daily snapshots, and Torque incentive campaigns.",
};

export default function HowItWorksPage() {
  return (
    <PageContainer>
      <HowItWorksContent />
    </PageContainer>
  );
}
