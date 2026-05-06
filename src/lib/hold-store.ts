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
  return allParticipants()
    .filter((p) => p.bridgedAmount > 0)
    .map((p) => {
      const qualifyingDays = p.snapshots.filter((s) => s.meetsThreshold).length;
      const streak =
        p.snapshots.length > 0 ? p.snapshots[p.snapshots.length - 1].streakAfter : 0;
      return {
        wallet: p.wallet,
        streak,
        qualifyingDays,
        balance: p.currentBalance,
      };
    })
    .sort((a, b) => b.streak - a.streak || b.qualifyingDays - a.qualifyingDays);
}
