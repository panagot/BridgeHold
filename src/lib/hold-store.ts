import type { LeaderboardOverviewRow, LeaderboardStats } from "./bridge/types";

export type HoldSnapshot = {
  dayIndex: number;
  meetsThreshold: boolean;
  balance: number;
  streakAfter: number;
  torque?: { ok: boolean; skipped?: boolean; reason?: string; status?: number; body?: string };
};

export type Participant = {
  wallet: string;
  sourceChain: string;
  destChain: string;
  bridgedAmount: number;
  currentBalance: number;
  minHold: number;
  lastProcessedDay: number;
  snapshots: HoldSnapshot[];
  bridgeTorque?: { ok: boolean; skipped?: boolean; reason?: string; status?: number; body?: string };
};

const defaultChains = { source: "Ethereum", dest: "Solana" };

declare global {
  // eslint-disable-next-line no-var
  var __bridgeHoldStore: Map<string, Participant> | undefined;
}

const store: Map<string, Participant> =
  globalThis.__bridgeHoldStore ?? new Map<string, Participant>();
globalThis.__bridgeHoldStore = store;

export function getParticipant(wallet: string): Participant | undefined {
  return store.get(wallet);
}

export function registerParticipant(wallet: string, minHold: number): Participant {
  const existing = store.get(wallet);
  if (existing) {
    existing.minHold = minHold;
    return existing;
  }
  const p: Participant = {
    wallet,
    sourceChain: defaultChains.source,
    destChain: defaultChains.dest,
    bridgedAmount: 0,
    currentBalance: 0,
    minHold,
    lastProcessedDay: -1,
    snapshots: [],
  };
  store.set(wallet, p);
  return p;
}

export function recordBridge(
  wallet: string,
  amount: number,
  sourceChain: string,
  destChain: string,
): Participant {
  const p = store.get(wallet) ?? registerParticipant(wallet, 100);
  p.bridgedAmount = amount;
  p.currentBalance = amount;
  p.sourceChain = sourceChain;
  p.destChain = destChain;
  p.lastProcessedDay = -1;
  p.snapshots = [];
  return p;
}

export function setSimulatedBalance(wallet: string, balance: number): Participant | null {
  const p = store.get(wallet);
  if (!p) return null;
  p.currentBalance = balance;
  return p;
}

export function clearParticipant(wallet: string): boolean {
  return store.delete(wallet.trim());
}

export function allParticipants(): Participant[] {
  return [...store.values()];
}

export function leaderboard(): {
  wallet: string;
  streak: number;
  qualifyingDays: number;
  balance: number;
}[] {
  return leaderboardOverview().leaderboard;
}

function routeLabel(p: Participant): string {
  return `${p.sourceChain} → ${p.destChain}`;
}

/**
 * Leaderboard rows, minimal board slice, and aggregate stats for the leaderboard page / API.
 */
export function leaderboardOverview(): {
  leaderboard: { wallet: string; streak: number; qualifyingDays: number; balance: number }[];
  stats: LeaderboardStats;
  rows: LeaderboardOverviewRow[];
} {
  const eligible = allParticipants().filter((p) => p.bridgedAmount > 0);

  const unsorted: Omit<LeaderboardOverviewRow, "rank">[] = eligible.map((p) => {
    const qualifyingDays = p.snapshots.filter((s) => s.meetsThreshold).length;
    const streak = p.snapshots.length > 0 ? p.snapshots[p.snapshots.length - 1].streakAfter : 0;
    return {
      wallet: p.wallet,
      streak,
      qualifyingDays,
      balance: p.currentBalance,
      bridgedAmount: p.bridgedAmount,
      minHold: p.minHold,
      sourceChain: p.sourceChain,
      destChain: p.destChain,
      snapshotCount: p.snapshots.length,
      meetsThreshold: p.currentBalance >= p.minHold,
    };
  });

  unsorted.sort((a, b) => b.streak - a.streak || b.qualifyingDays - a.qualifyingDays || b.balance - a.balance);

  const rows: LeaderboardOverviewRow[] = unsorted.map((r, i) => ({ ...r, rank: i + 1 }));

  const leaderboard = rows.map(({ rank: _r, bridgedAmount: _b, minHold: _m, sourceChain: _s, destChain: _d, snapshotCount: _sn, meetsThreshold: _mt, ...rest }) => rest);

  const routeCounts = new Map<string, number>();
  for (const p of eligible) {
    const k = routeLabel(p);
    routeCounts.set(k, (routeCounts.get(k) ?? 0) + 1);
  }
  let topRoute: string | null = null;
  let topRouteCount = 0;
  for (const [label, count] of routeCounts) {
    if (count > topRouteCount) {
      topRouteCount = count;
      topRoute = label;
    }
  }

  const n = rows.length;
  const totalBridgedVolume = rows.reduce((s, r) => s + r.bridgedAmount, 0);
  const totalBalanceOnDest = rows.reduce((s, r) => s + r.balance, 0);
  const sumQualifyingSnapshots = rows.reduce((s, r) => s + r.qualifyingDays, 0);
  const sumStreak = rows.reduce((s, r) => s + r.streak, 0);
  const maxStreak = n ? Math.max(...rows.map((r) => r.streak)) : 0;

  const walletsMeetingMin = rows.filter((r) => r.meetsThreshold).length;
  const totalSnapshotTicks = rows.reduce((s, r) => s + r.snapshotCount, 0);

  const stats: LeaderboardStats = {
    participantCount: n,
    totalBridgedVolume,
    totalBalanceOnDest,
    sumQualifyingSnapshots,
    avgStreak: n ? Math.round((sumStreak / n) * 10) / 10 : 0,
    maxStreak,
    uniqueRoutes: routeCounts.size,
    topRoute,
    topRouteCount,
    walletsMeetingMin,
    pctMeetingMin: n ? Math.round((walletsMeetingMin / n) * 1000) / 10 : 0,
    totalSnapshotTicks,
    avgBridgedPerWallet: n ? Math.round(totalBridgedVolume / n) : 0,
    avgQualifyingDaysPerWallet: n ? Math.round((sumQualifyingSnapshots / n) * 10) / 10 : 0,
  };

  return { leaderboard, stats, rows };
}
