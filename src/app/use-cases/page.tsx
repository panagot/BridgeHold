import type { Metadata } from "next";

import { PageContainer } from "@/components/bridge/PageContainer";
import { UseCasesPageContent } from "@/components/bridge/UseCasesPageContent";

export const metadata: Metadata = {
  title: "Use cases",
  description:
    "Five growth narratives for sticky TVL, anti-dump rules, cohort campaigns, consumer seasons, and distributor loops - powered by Torque custom events.",
};

export default function UseCasesPage() {
  return (
    <PageContainer>
      <UseCasesPageContent />
    </PageContainer>
  );
}
