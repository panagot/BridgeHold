import { NextResponse } from "next/server";

import { getParticipant, recordBridge, registerParticipant } from "@/lib/hold-store";
import { sendTorqueEvent } from "@/lib/torque-ingest";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    wallet?: string;
    amount?: number;
    sourceChain?: string;
    destChain?: string;
    minHold?: number;
  };

  const wallet = body.wallet?.trim();
  if (!wallet) {
    return NextResponse.json({ error: "wallet required" }, { status: 400 });
  }
  const amount = typeof body.amount === "number" ? body.amount : 0;
  if (amount <= 0) {
    return NextResponse.json({ error: "amount must be positive" }, { status: 400 });
  }

  if (!getParticipant(wallet)) {
    const mh = typeof body.minHold === "number" && body.minHold > 0 ? body.minHold : 100;
    registerParticipant(wallet, mh);
  }

  const sourceChain = body.sourceChain?.trim() || "Ethereum";
  const destChain = body.destChain?.trim() || "Solana";
  const p = recordBridge(wallet, amount, sourceChain, destChain);

  const bridgeEvent =
    process.env.TORQUE_EVENT_BRIDGE ?? "bridge_hold_completed";
  const bridgeTorque = await sendTorqueEvent({
    userPubkey: wallet,
    eventName: bridgeEvent,
    data: {
      amount,
      sourceChain,
      destChain,
      txHash: `mock_${Date.now().toString(36)}`,
    },
  });

  const normalized =
    "skipped" in bridgeTorque && bridgeTorque.skipped
      ? { ok: false, skipped: true, reason: bridgeTorque.reason }
      : bridgeTorque.ok
        ? { ok: true, status: bridgeTorque.status }
        : { ok: false, status: bridgeTorque.status, body: bridgeTorque.body };

  p.bridgeTorque = normalized;

  return NextResponse.json({ participant: p, torque: normalized });
}
