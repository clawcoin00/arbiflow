# ArbiFlow (Alerts-only MVP)

Arbitrage opportunity monitor for **Polymarket vs Kalshi**.

> This MVP is informational only: it detects opportunities and sends alerts.
> It does **not** execute trades.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open: http://localhost:3000

## Environment

Set in `.env.local`:

```bash
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=-100...
ALERT_EDGE_MIN=0.05
ALERT_COOLDOWN_MS=1800000

# Optional (if omitted, app falls back to mock data)
POLYMARKET_API_BASE=
KALSHI_API_BASE=
```

## API Routes

- `GET /api/opportunities`
  - Fetches quotes from both sources (or mock fallback)
  - Detects opportunities where edge >= `ALERT_EDGE_MIN`

- `POST /api/scan`
  - Runs detection and sends Telegram alerts
  - Anti-spam cooldown per `eventKey+outcome` (in-memory)

- `POST /api/test-telegram`
  - Sends a simple test message to Telegram

- `POST /api/auth/upsert-user`
  - Body: `{ "email": "user@example.com", "plan": "FREE|PRO" }`
  - Creates/updates a user plan for SaaS limits

- `GET /api/auth/me?email=user@example.com`
  - Fetches user profile/plan

## Notes / limitations

- Matching is heuristic (`eventKey + outcome`) in this MVP.
- Alert cooldown is in-memory (resets on deploy/restart).
- Real APIs may require auth/rate limit handling; fallback mock data keeps the dashboard working.
