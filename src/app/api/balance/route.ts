import { NextResponse } from "next/server";

import { setSimulatedBalance } from "@/lib/hold-store";

export async function POST(req: Request) {
  const body = (await req.json()) as { wallet?: string; balance?: number };
  const wallet = body.wallet?.trim();
  if (!wallet) {
    return NextResponse.json({ error: "wallet required" }, { status: 400 });
  }
  if (typeof body.balance !== "number" || body.balance < 0) {
    return NextResponse.json({ error: "balance must be a non-negative number" }, { status: 400 });
  }
  const p = setSimulatedBalance(wallet, body.balance);
  if (!p) {
    return NextResponse.json({ error: "unknown wallet" }, { status: 404 });
  }
  return NextResponse.json({ participant: p });
}
