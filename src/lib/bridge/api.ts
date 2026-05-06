import type { Participant } from "./types";

export async function apiRegister(wallet: string, minHold: number) {
  const r = await fetch("/api/participant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wallet, minHold }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "register failed");
  return j.participant as Participant;
}

export async function apiBridge(
  wallet: string,
  amount: number,
  sourceChain: string,
  destChain: string,
  minHold: number,
) {
  const r = await fetch("/api/bridge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wallet, amount, sourceChain, destChain, minHold }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "bridge failed");
  return j as { participant: Participant };
}

export async function apiBalance(wallet: string, balance: number) {
  const r = await fetch("/api/balance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wallet, balance }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "balance failed");
  return j.participant as Participant;
}

export async function apiResetWallet(wallet: string) {
  const r = await fetch("/api/participant/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wallet }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "reset failed");
  return j as { ok: boolean; cleared: boolean };
}

export async function apiAdvance(wallet: string, decayPercent: number) {
  const r = await fetch("/api/advance-day", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wallet, decayPercent }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "advance failed");
  return j as { participant: Participant; snapshot: Participant["snapshots"][0] };
}
