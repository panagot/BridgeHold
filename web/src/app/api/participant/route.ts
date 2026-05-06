import { NextResponse } from "next/server";

import { getParticipant, registerParticipant } from "@/lib/hold-store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get("wallet")?.trim();
  if (!wallet) {
    return NextResponse.json({ error: "wallet query required" }, { status: 400 });
  }
  const p = getParticipant(wallet);
  if (!p) {
    return NextResponse.json({ error: "unknown wallet — register first" }, { status: 404 });
  }
  return NextResponse.json({ participant: p });
}

export async function POST(req: Request) {
  const body = (await req.json()) as { wallet?: string; minHold?: number };
  const wallet = body.wallet?.trim();
  if (!wallet) {
    return NextResponse.json({ error: "wallet required" }, { status: 400 });
  }
  const minHold = typeof body.minHold === "number" && body.minHold > 0 ? body.minHold : 100;
  const p = registerParticipant(wallet, minHold);
  return NextResponse.json({ participant: p });
}
