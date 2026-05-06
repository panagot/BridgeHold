import { NextResponse } from "next/server";

/**
 * Public readiness signal for demos (no secrets exposed).
 */
export async function GET() {
  const key = process.env.TORQUE_INGEST_API_KEY;
  const rawUrl = process.env.TORQUE_INGESTER_URL ?? "https://ingest.torque.so";
  let ingesterHost = "ingest.torque.so";
  try {
    ingesterHost = new URL(rawUrl).host;
  } catch {
    /* keep default */
  }

  return NextResponse.json({
    ingestConfigured: Boolean(key && key.trim().length > 0),
    ingesterHost,
    bridgeEventName: process.env.TORQUE_EVENT_BRIDGE ?? "bridge_hold_completed",
    snapshotEventName: process.env.TORQUE_EVENT_SNAPSHOT ?? "bridge_hold_daily_snapshot",
  });
}
