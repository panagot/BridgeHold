import { NextResponse } from "next/server";

import { clearParticipant, getParticipant } from "@/lib/hold-store";

export async function POST(req: Request) {
  const body = (await req.json()) as { wallet?: string };
  const wallet = body.wallet?.trim();
  if (!wallet) {
    return NextResponse.json({ error: "wallet required" }, { status: 400 });
  }
  const existed = getParticipant(wallet) !== undefined;
  clearParticipant(wallet);
  return NextResponse.json({ ok: true, cleared: existed });
}
