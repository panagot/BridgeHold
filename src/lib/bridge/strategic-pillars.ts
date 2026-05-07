/**
 * Five strategic narratives BridgeHold is designed to prove with Torque.
 * (Sticky TVL, anti-dump, cohorts/routes, consumer/gaming, distributor loops.)
 */
export type StrategicPillar = {
  id: string;
  title: string;
  hook: string;
  detail: string;
  torquePlay: string;
};

export const STRATEGIC_PILLARS: StrategicPillar[] = [
  {
    id: "sticky-tvl",
    title: "Sticky TVL & liquidity depth",
    hook: "Depth that survives after the bridge is what protocols actually monetize.",
    detail:
      "Snapshot events encode whether balances stay above your minimums across simulated or real indexer ticks. That turns one-time TVL spikes into a time series you can threshold, tier, and reward - aligned with MM pools, lending utilization, or LP health programs.",
    torquePlay:
      "Torque leaderboards and rebate tiers read streakDays, meetsThreshold, and balance so incentives track sustained depth, not a single deposit spike.",
  },
  {
    id: "cooling-off",
    title: "Anti-dump & cooling-off rules",
    hook: "Pay for patience, not for hit-and-run exits.",
    detail:
      "When balance drops below min or streak breaks, your SQL sees it on the next bridge_hold_daily_snapshot. You can require N qualifying days before raffle tickets count, slash weights after early dumps, or run recovery bonuses when users climb back - all from the same two custom events.",
    torquePlay:
      "Raffles, gifts, and gated rewards use meetsThreshold and streakDays so Torque only pays wallets that behaved through your cooling window.",
  },
  {
    id: "cohorts-routes",
    title: "Cohorts & route-specific growth",
    hook: "Same integration, different partner stories per chain.",
    detail:
      "bridge_hold_completed carries sourceChain, destChain, bridgedAmount, and wallet. Snapshot rows add daily truth. Segment Base arrivals vs Arbitrum whales, run parallel prize pools, or co-market with an L2 - without forking your stack.",
    torquePlay:
      "Torque SQL filters on route and amount so each cohort gets its own leaderboard, raffle pot, or distributor budget from one ingest stream.",
  },
  {
    id: "gaming-consumer",
    title: "Gaming & consumer surfaces",
    hook: "The loop works even when users never say DeFi out loud.",
    detail:
      "Treat a bridge (or deposit) as capital committed to the experience and snapshots as ongoing eligibility. Season passes, ranked seasons, and fair drops inherit the same meetsThreshold and streak signals - BridgeHold is the reference spine.",
    torquePlay:
      "Torque gifts and competitions consume the same custom_events: eligibility is provable, seasonal resets are just campaign epochs in Torque.",
  },
  {
    id: "distributor-referrals",
    title: "Referral & distributor loops",
    hook: "Pay partners when referred users actually stick.",
    detail:
      "First bridge attributes acquisition; snapshots prove retention. Distributor IDs or referral tags (in your production payload) combine with streaks so rev share or bounties unlock on qualifying days - not only on the first transfer.",
    torquePlay:
      "Torque distributors and incentive programs can key off referred-wallet snapshot streaks, aligning growth spend with measured hold behavior.",
  },
];
