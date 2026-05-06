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
