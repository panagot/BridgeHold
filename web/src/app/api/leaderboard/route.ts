import { NextResponse } from "next/server";

import { leaderboard } from "@/lib/hold-store";

export async function GET() {
  return NextResponse.json({ leaderboard: leaderboard() });
}
