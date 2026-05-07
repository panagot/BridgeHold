export type Participant = {
  wallet: string;
  sourceChain: string;
  destChain: string;
  bridgedAmount: number;
  currentBalance: number;
  minHold: number;
  lastProcessedDay: number;
  snapshots: {
    dayIndex: number;
    meetsThreshold: boolean;
    balance: number;
    streakAfter: number;
    torque?: { ok: boolean; skipped?: boolean; reason?: string; body?: string };
  }[];
  bridgeTorque?: { ok: boolean; skipped?: boolean; reason?: string; body?: string };
};

export type BoardRow = { wallet: string; streak: number; qualifyingDays: number; balance: number };

/** Full row for leaderboard page (sorted like `leaderboard()`). */
export type LeaderboardOverviewRow = BoardRow & {
  rank: number;
  bridgedAmount: number;
  minHold: number;
  sourceChain: string;
  destChain: string;
  snapshotCount: number;
  meetsThreshold: boolean;
};

/** Aggregate stats over all participants who have completed a bridge. */
export type LeaderboardStats = {
  participantCount: number;
  totalBridgedVolume: number;
  totalBalanceOnDest: number;
  sumQualifyingSnapshots: number;
  avgStreak: number;
  maxStreak: number;
  uniqueRoutes: number;
  topRoute: string | null;
  topRouteCount: number;
  /** Wallets whose current simulated balance meets min-hold. */
  walletsMeetingMin: number;
  /** Share of bridged wallets currently at or above min-hold (0–100, one decimal). */
  pctMeetingMin: number;
  /** Sum of all snapshot rows stored (one per advanced day per wallet). */
  totalSnapshotTicks: number;
  /** Mean bridged notional per bridged wallet (rounded sim USDC). */
  avgBridgedPerWallet: number;
  /** Mean qualifying snapshot days per wallet (one decimal). */
  avgQualifyingDaysPerWallet: number;
};

export type Scenario = {
  id: string;
  title: string;
  badge: string;
  narrative: string;
  wallet: string;
  minHold: number;
  amount: number;
  sourceChain: string;
  destChain: string;
  decay: number;
};
