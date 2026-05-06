import type { Metadata } from "next";

import { ExamplesGrid } from "@/components/bridge/ExamplesGrid";
import { PageContainer } from "@/components/bridge/PageContainer";

export const metadata: Metadata = {
  title: "Examples · Bridge & Hold",
  description: "Example bridge-and-hold scenarios for Torque demos.",
};

export default function ExamplesPage() {
  return (
    <PageContainer>
      <ExamplesGrid />
    </PageContainer>
  );
}
