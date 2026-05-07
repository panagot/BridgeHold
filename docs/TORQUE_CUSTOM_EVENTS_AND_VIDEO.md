# Torque custom events + recorded demo checklist

BridgeHold sends **two** ingested custom events. Names must match what Torque has registered for your project **and** what you put in `.env.local` (or use the defaults below).

## 1. Event names (defaults)

| Purpose        | Env var                  | Default `eventName`            |
|----------------|--------------------------|--------------------------------|
| Bridge completed | `TORQUE_EVENT_BRIDGE`  | `bridge_hold_completed`        |
| Daily hold tick  | `TORQUE_EVENT_SNAPSHOT`| `bridge_hold_daily_snapshot`   |

In Torque (project that owns your **ingest** API key), create **two custom events** with these **exact** identifiers so ingest accepts them.

## 2. Payload fields (define compatible properties in Torque)

The app POSTs to the ingester with `userPubkey`, `timestamp`, `eventName`, and `data`:

### `bridge_hold_completed` — `data`

| Field          | Type    | Notes                                      |
|----------------|---------|--------------------------------------------|
| `amount`       | number  | Bridged notional (sim USDC in demo)        |
| `sourceChain`  | string  | e.g. `Arbitrum`, `Base`                    |
| `destChain`    | string  | e.g. `Solana`                              |
| `txHash`       | string  | Demo uses `mock_<id>`                      |

### `bridge_hold_daily_snapshot` — `data`

| Field             | Type    | Notes                          |
|-------------------|---------|--------------------------------|
| `dayIndex`        | number  | 1-based simulated day counter  |
| `meetsThreshold`  | boolean | `currentBalance >= minHold`    |
| `balance`         | number  | Simulated balance on dest      |
| `streakDays`      | number  | Streak after this snapshot     |
| `sourceChain`     | string  | From registration/bridge       |
| `destChain`       | string  | From registration/bridge       |
| `bridgedAmount`   | number  | Last recorded bridge amount    |

Torque’s UI may call these “properties”, “attributes”, or “schema fields”. Add them with types as close as possible (string/number/boolean) so downstream SQL/rules work.

## 3. Local env

From repo root, `.env.local` should include at least:

```env
TORQUE_INGEST_API_KEY=<key from this same Torque project>
# Optional — only if your Torque event names differ:
# TORQUE_EVENT_BRIDGE=bridge_hold_completed
# TORQUE_EVENT_SNAPSHOT=bridge_hold_daily_snapshot
```

Restart `npm run dev` after changes.

**Sanity check:** open `http://127.0.0.1:3000/api/torque-status` — `ingestConfigured` should be `true`, and the event names shown should match Torque.

## 4. Verify before you record

1. **Simulator** (`/simulator`): Register → Bridge → Advance day once.
2. Success copy should look like: **Torque: bridge event accepted** and **Torque: snapshot event accepted** (not `Event not found`).
3. In Torque, open your project’s **events / activity** (or equivalent) and confirm rows for both event names with the wallet pubkey and `data` fields.

## 5. Suggested video demo flow (3–5 minutes)

**A. Context (30–45 s)**  
- Show the site home or `/how-it-works` and say: bridge + daily snapshots → same events in prod and demo.  
- Optional: show `/api/torque-status` in browser (proves key + event names, redacts secret).

**B. Torque (30–60 s)**  
- Show the two custom events and their field lists (or one event + list).  
- Show one recent ingest row if the UI exposes it.

**C. App (90–120 s)**  
- `/simulator`: load a preset from `/examples` (or type a wallet), **Register** → **Bridge** → **Advance day** (or **Run preset flow**).  
- Zoom the status message: Torque **accepted**.  
- Optional: `/demo` → run **Leaderboard seed**; show `demo.log` lines with `POST /api/bridge` and Torque accepted.  
- `/leaderboard`: show rankings (proves local state; mention events already fired).

**D. Close (15 s)**  
- One line: campaigns in Torque can rank on `streakDays`, `meetsThreshold`, `bridgedAmount`, routes, etc.

**Recording tips:** use a **fresh** wallet in the simulator if you want a clean Torque event stream; blur `.env.local` and any API key in Torque.

## 6. MCP / API path

If the program requires “through MCP or API”: creating the API key and custom events via **Torque MCP** (see [Torque MCP quickstart](https://platform.torque.so/docs/mcp/quickstart)) satisfies that; ingest from BridgeHold is the **runtime API** side. Keep the **same project** for key + events.
