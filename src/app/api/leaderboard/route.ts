import { NextResponse } from "next/server";

import { leaderboardOverview } from "@/lib/hold-store";

export async function GET() {
  return NextResponse.json(leaderboardOverview());
}
