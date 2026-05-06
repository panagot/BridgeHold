/**
 * Torque event ingestion — same contract as MCP docs:
 * POST {TORQUE_INGESTER_URL}/events
 * Headers: Content-Type, x-api-key
 * Body: { userPubkey, timestamp, eventName, data }
 *
 * @see https://platform.torque.so/docs/mcp/quickstart
 */

export type IngestResult =
  | { ok: true; skipped?: false; status: number }
  | { ok: false; skipped: true; reason: string }
  | { ok: false; skipped?: false; status: number; body: string };

export async function sendTorqueEvent(input: {
  userPubkey: string;
  eventName: string;
  data: Record<string, string | number | boolean>;
}): Promise<IngestResult> {
  const apiKey = process.env.TORQUE_INGEST_API_KEY;
  const base = (process.env.TORQUE_INGESTER_URL ?? "https://ingest.torque.so").replace(
    /\/$/,
    "",
  );

  if (!apiKey) {
    return { ok: false, skipped: true, reason: "TORQUE_INGEST_API_KEY not set" };
  }

  const payload = {
    userPubkey: input.userPubkey,
    timestamp: Date.now(),
    eventName: input.eventName,
    data: input.data,
  };

  const res = await fetch(`${base}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    return { ok: true, status: res.status };
  }

  const body = await res.text();
  return { ok: false, status: res.status, body: body.slice(0, 500) };
}
