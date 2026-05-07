import type { Metadata } from "next";

import { LeaderboardPageClient } from "@/components/bridge/LeaderboardPageClient";
import { PageContainer } from "@/components/bridge/PageContainer";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "Bridge and hold leaderboard with aggregate statistics for the demo store.",
};

export default function LeaderboardPage() {
  return (
    <PageContainer>
      <LeaderboardPageClient />
    </PageContainer>
  );
}
