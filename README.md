# BridgeHold × Torque

**BridgeHold** is a cross-chain **bridge-and-hold** retention loop: users bridge in, your indexer emits **daily snapshot custom events** to [Torque](https://www.torque.so/), and you run **leaderboards, raffles, or rebates** on real hold streaks.

## Features

- **Nine preset scenarios** (Arbitrum, Base, Ethereum, Optimism, Polygon, Avalanche, Sui, BNB Chain, micro-retail, etc.) — each opens the simulator with fields filled.
- **Three live demo scripts** — classic streak, decay week, twin wallets (parallel leaderboard).
- **Simulator** — quick-load chips, batch indexer ticks (1–30), copy wallet, reset session, ingest status banner.
- **Six extra playbooks** on the Examples page for campaign ideas (SQL / incentive design).

## Quick start

**Node.js 20+**

```bash
cd web
cp .env.example .env.local
# Add TORQUE_INGEST_API_KEY from Torque (developer tools or MCP create_api_key)
npm install
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

| Route | Purpose |
|-------|---------|
| `/` | Overview + links |
| `/how-it-works` | Flow + Torque primitives + pitch ideas |
| `/examples` | Nine presets + ten mix-and-match playbooks |
| `/demo` | Automated multi-script demo + log |
| `/simulator` | Full manual control + batch ticks |

## Environment

| Variable | Purpose |
|----------|---------|
| `TORQUE_INGEST_API_KEY` | `x-api-key` for `POST …/events` |
| `TORQUE_INGESTER_URL` | Optional; default `https://ingest.torque.so` |
| `TORQUE_EVENT_BRIDGE` | Default `bridge_hold_completed` |
| `TORQUE_EVENT_SNAPSHOT` | Default `bridge_hold_daily_snapshot` |

Create matching **custom events** in Torque and attach them to your project; align `eventName` and `data` fields with what this app sends.

## Resources

- [Torque MCP quickstart](https://platform.torque.so/docs/mcp/quickstart)
- [torque.so](https://www.torque.so/)

## License

MIT (adjust as needed).
