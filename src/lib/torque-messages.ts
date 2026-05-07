/**
 * User-facing copy for Torque ingest results (no secrets).
 */

export type TorqueResultShape = {
  ok?: boolean;
  skipped?: boolean;
  reason?: string;
  status?: number;
  body?: string;
};

function parseTorqueMessage(body?: string): string | null {
  if (!body?.trim()) return null;
  try {
    const j = JSON.parse(body) as { message?: string; status?: string };
    return j.message ?? null;
  } catch {
    return body.length > 180 ? `${body.slice(0, 177)}...` : body;
  }
}

/** Short line for logs and banners. */
export function torqueOutcomeSummary(
  t: TorqueResultShape | undefined,
  kind: "bridge" | "snapshot",
): string {
  if (!t) return "Torque: (no result)";
  if (t.skipped) return `Torque: skipped - ${t.reason ?? "unknown"}.`;
  if (t.ok) return `Torque: ${kind} event accepted (HTTP ${t.status ?? "ok"}).`;

  const msg = parseTorqueMessage(t.body);
  const base = `Torque: ${kind} failed HTTP ${t.status ?? "?"}${msg ? ` - ${msg}` : ""}.`;

  if (t.status === 400 && msg?.includes("Event not found")) {
    return `${base} In your Torque project, add custom events that match TORQUE_EVENT_BRIDGE and TORQUE_EVENT_SNAPSHOT (defaults: bridge_hold_completed, bridge_hold_daily_snapshot), then retry.`;
  }
  return base;
}
