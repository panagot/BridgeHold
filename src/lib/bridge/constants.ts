import type { Scenario } from "./types";

export const SCENARIOS: Scenario[] = [
  {
    id: "steady",
    title: "Steady bridger",
    badge: "Leaderboard",
    narrative:
      "User bridges 1,200 USDC from Arbitrum to Solana and keeps balance above the 100 minimum. Ideal for a “consistency streak” campaign: each qualifying day emits snapshot events for Torque to rank.",
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
      "Same bridge, but 2% daily decay simulates fees or partial exits. After a few days balance slips under min — streak resets. Good demo for “non-whales still win” raffles on qualifying days only.",
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
      "Large 8,000 USDC bridge from Ethereum with a 500 min-hold. Use this when pitching a separate VIP leaderboard or distributor tier so retail holders still have parallel prizes.",
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
    badge: "Optimism → Solana",
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
      "DAO bridges 2,000 USDC from Polygon for a 150 min-hold program — longer runway, fewer false churn signals. Snapshot events emphasize meetsThreshold for governance-aligned rebates.",
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
      "Only 180 USDC from Base with a 40 min-hold — proves the loop works for small wallets. Pair with Torque raffles so ticket weight comes from streaks, not notional alone.",
    wallet: "EsNvhBPLYr3gydvsvEgLYHqq3j7nM4n7pK3kYhYvYwXg",
    minHold: 40,
    amount: 180,
    sourceChain: "Base",
    destChain: "Solana",
    decay: 0,
  },
  {
    id: "avax-tourism",
    title: "Avalanche round-trip",
    badge: "Subnet story",
    narrative:
      "1,400 USDC from Avalanche C-Chain with a 90 min-hold. Use when pitching subnet or gaming liquidity that lands on Solana but originates in the Avalanche ecosystem.",
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
      "720 USDC from Sui — shorter finality story for judges who care about object-centric wallets. 75 min-hold; 3% decay stresses fee-heavy trading venues.",
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
    badge: "CEX → chain",
    narrative:
      "340 USDC from BNB Chain with a 55 min-hold — mirrors users exiting centralized venues into self-custody on Solana. Great for ‘first bridge’ nurture drips in Torque.",
    wallet: "LrNvhBPLYr3gydvsvEgLYHqq3j7nM4n7pK3kYhYvYwXl",
    minHold: 55,
    amount: 340,
    sourceChain: "BNB Chain",
    destChain: "Solana",
    decay: 0,
  },
];

export const DEMO_WALLET = "SimAutoDemo7VFJsSjSnF7xvqZJoWqVGRDgL9MxXYWHkp";
/** Second wallet for multi-actor demo scripts */
export const DEMO_WALLET_B = "FsNvhBPLYr3gydvsvEgLYHqq3j7nM4n7pK3kYhYvYwXh";

export const field =
  "mt-1 w-full rounded-lg border border-zinc-600 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] outline-none placeholder:text-zinc-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30";
export const fieldMono = `${field} font-mono`;
export const fieldCompact = field.replace("px-3 py-2 text-sm", "px-2 py-2 text-xs");

export const cardSurface =
  "rounded-2xl border border-zinc-700/80 bg-slate-900/85 p-6 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.55)]";

export function shortAddr(s: string) {
  if (s.length <= 12) return s;
  return `${s.slice(0, 4)}…${s.slice(-4)}`;
}

export function getScenarioById(id: string | null): Scenario | undefined {
  if (!id) return undefined;
  return SCENARIOS.find((s) => s.id === id);
}
