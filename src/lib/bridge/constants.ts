import type { Scenario } from "./types";

export const SCENARIOS: Scenario[] = [
  {
    id: "steady",
    title: "Steady bridger",
    badge: "Leaderboard",
    narrative:
      "User bridges 1,200 USDC from Arbitrum to Solana and keeps balance above the 100 minimum. Ideal for a consistency streak campaign: each qualifying day emits snapshot events for Torque to rank.",
    wallet: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    minHold: 100,
    amount: 1200,
    sourceChain: "Arbitrum",
    destChain: "Solana",
    decay: 0,
  },
  {
    id: "bleed",
    title: "Slow bleed + recovery",
    badge: "Raffle / tiers",
    narrative:
      "Same bridge, but 2% daily decay simulates fees or partial exits. After a few days balance slips under min; streak resets. Good demo for raffles where smaller holders still win on qualifying days only.",
    wallet: "EHpLH4E9bBRvbVFAqMnBc7J5LLE26Ap6RXh76EzpTWqw",
    minHold: 100,
    amount: 600,
    sourceChain: "Base",
    destChain: "Solana",
    decay: 2,
  },
  {
    id: "whale",
    title: "High-ticket bridge",
    badge: "VIP tier",
    narrative:
      "Large 8,000 USDC bridge from Ethereum with a 500 min-hold. Use for a separate VIP leaderboard or distributor tier so retail holders still have parallel prizes.",
    wallet: "9WzDXwBbmkg8ZTbNMqUxvHBRAbtXtd11vf7jikQTyrtD",
    minHold: 500,
    amount: 8000,
    sourceChain: "Ethereum",
    destChain: "Solana",
    decay: 0,
  },
  {
    id: "l2-runner",
    title: "L2 power user",
    badge: "Optimism -> Solana",
    narrative:
      "Roll-up native bridges 950 USDC from Optimism with a 120 min-hold. Great story for teams routing L2 liquidity into a Solana venue while rewarding wallets that do not immediately dump.",
    wallet: "CpMahFkKMEwWddNfkXLPDSHDCPzaGyNTMfL8koBACtEC",
    minHold: 120,
    amount: 950,
    sourceChain: "Optimism",
    destChain: "Solana",
    decay: 0,
  },
  {
    id: "stable-runway",
    title: "Stablecoin runway",
    badge: "Treasury / DAO",
    narrative:
      "DAO bridges 2,000 USDC from Polygon for a 150 min-hold program - longer runway, fewer false churn signals. Snapshot events emphasize meetsThreshold for governance-aligned rebates.",
    wallet: "DrNvhBPLYr3gydvsvEgLYHqq3j7nM4n7pK3kYhYvYwXf",
    minHold: 150,
    amount: 2000,
    sourceChain: "Polygon",
    destChain: "Solana",
    decay: 1,
  },
  {
    id: "micro-retail",
    title: "Micro retail path",
    badge: "Inclusive raffle",
    narrative:
      "Only 180 USDC Base → Solana with a 40 min-hold: proves the loop works for small wallets. Pair with Torque raffles so ticket weight comes from streaks, not notional alone.",
    wallet: "EsNvhBPLYr3gydvsvEgLYHqq3j7nM4n7pK3kYhYvYwXg",
    minHold: 40,
    amount: 180,
    sourceChain: "Base",
    destChain: "Solana",
    decay: 0,
  },
  {
    id: "avax-tourism",
    title: "Avalanche lane",
    badge: "Subnet story",
    narrative:
      "One-way 1,400 USDC Avalanche C-Chain → Solana with a 90 min-hold. Fits subnet or gaming liquidity that lands on Solana but originates in the Avalanche ecosystem.",
    wallet: "HpMahFkKMEwWddNfkXLPDSHDCPzaGyNTMfL8koBACtED",
    minHold: 90,
    amount: 1400,
    sourceChain: "Avalanche",
    destChain: "Solana",
    decay: 1,
  },
  {
    id: "sui-sprint",
    title: "Sui parallel lane",
    badge: "Move VM",
    narrative:
      "720 USDC from Sui with a 75 min-hold - useful when messaging fast finality and object-centric wallets. 3% decay models fee-heavy trading venues.",
    wallet: "JqNvhBPLYr3gydvsvEgLYHqq3j7nM4n7pK3kYhYvYwXk",
    minHold: 75,
    amount: 720,
    sourceChain: "Sui",
    destChain: "Solana",
    decay: 3,
  },
  {
    id: "bnb-club",
    title: "BNB retail club",
    badge: "Off-CEX",
    narrative:
      "340 USDC BNB Chain → Solana with a 55 min-hold: mirrors users exiting centralized venues into self-custody. Useful for first-bridge nurture drips in Torque.",
    wallet: "LrNvhBPLYr3gydvsvEgLYHqq3j7nM4n7pK3kYhYvYwXl",
    minHold: 55,
    amount: 340,
    sourceChain: "BNB Chain",
    destChain: "Solana",
    decay: 0,
  },
];

/** Primary wallet for Classic streak + Decay week scripts (shared in-memory demo store). */
export const DEMO_WALLET = "SimAutoDemo7VFJsSjSnF7xvqZJoWqVGRDgL9MxXYWHkp";
/** Whale side of Twin script - separate from DEMO_WALLET so Twin never clashes with Classic/Decay. */
export const DEMO_WALLET_TWIN_WHALE = "UmNvhBPLYr3gydvsvEgLYHqq3j7nM4n7pK3kYhYvYwXT";
/** Retail side of Twin script */
export const DEMO_WALLET_TWIN_RETAIL = "VmNvhBPLYr3gydvsvEgLYHqq3j7nM4n7pK3kYhYvYwXT";

export const field =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-[inset_0_1px_2px_rgba(15,23,42,0.06)] outline-none placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20";
export const fieldMono = `${field} font-mono`;
export const fieldCompact = field.replace("px-3 py-2 text-sm", "px-2 py-2 text-xs");

export const cardSurface =
  "rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_-16px_rgba(15,23,42,0.25)]";

export function shortAddr(s: string) {
  if (s.length <= 12) return s;
  return `${s.slice(0, 4)}...${s.slice(-4)}`;
}

export function getScenarioById(id: string | null): Scenario | undefined {
  if (!id) return undefined;
  return SCENARIOS.find((s) => s.id === id);
}

