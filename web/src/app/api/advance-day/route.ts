import { NextResponse } from "next/server";

import { allParticipants, getParticipant, type HoldSnapshot } from "@/lib/hold-store";
import { sendTorqueEvent } from "@/lib/torque-ingest";

function summarizeTorque(
  r: Awaited<ReturnType<typeof sendTorqueEvent>>,
): HoldSnapshot["torque"] {
  if ("skipped" in r && r.skipped) {
    return { ok: false, skipped: true, reason: r.reason };
  }
  if (r.ok) {
    return { ok: true, status: r.status };
  }
  return { ok: false, status: r.status, body: r.body };
}

async function processParticipant(wallet: string, decayPercent: number) {
  const p = getParticipant(wallet);
  if (!p || p.bridgedAmount <= 0) {
    return { error: "wallet has not completed a bridge yet" as const };
  }

  if (decayPercent > 0 && decayPercent <= 50) {
    p.currentBalance = Math.max(
      0,
      Math.round(p.currentBalance * (1 - decayPercent / 100) * 1e6) / 1e6,
    );
  }

  p.lastProcessedDay += 1;
  const dayIndex = p.lastProcessedDay;
  const meetsThreshold = p.currentBalance >= p.minHold;
  const prevStreak =
    p.snapshots.length > 0 ? p.snapshots[p.snapshots.length - 1].streakAfter : 0;
  const streakAfter = meetsThreshold ? prevStreak + 1 : 0;

  const snapshotEvent =
    process.env.TORQUE_EVENT_SNAPSHOT ?? "bridge_hold_daily_snapshot";
  const torqueResult = await sendTorqueEvent({
    userPubkey: wallet,
    eventName: snapshotEvent,
    data: {
      dayIndex,
      meetsThreshold,
      balance: p.currentBalance,
      streakDays: streakAfter,
      sourceChain: p.sourceChain,
      destChain: p.destChain,
      bridgedAmount: p.bridgedAmount,
    },
  });

  const snap: HoldSnapshot = {
    dayIndex,
    meetsThreshold,
    balance: p.currentBalance,
    streakAfter,
    torque: summarizeTorque(torqueResult),
  };
  p.snapshots.push(snap);

  return { participant: p, snapshot: snap };
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    wallet?: string;
    all?: boolean;
    decayPercent?: number;
  };

  const decay =
    typeof body.decayPercent === "number" && body.decayPercent >= 0
      ? body.decayPercent
      : 0;

  if (body.all) {
    const rows = [];
    for (const p of allParticipants()) {
      if (p.bridgedAmount <= 0) continue;
      const out = await processParticipant(p.wallet, decay);
      if ("error" in out) continue;
      rows.push(out);
    }
    return NextResponse.json({ results: rows });
  }

  const wallet = body.wallet?.trim();
  if (!wallet) {
    return NextResponse.json({ error: "wallet required (or all: true)" }, { status: 400 });
  }

  const out = await processParticipant(wallet, decay);
  if ("error" in out) {
    return NextResponse.json({ error: out.error }, { status: 400 });
  }
  return NextResponse.json(out);
}
