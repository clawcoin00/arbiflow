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
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=-100...
ALERT_EDGE_MIN=0.05
ALERT_COOLDOWN_MS=1800000

# Optional (if omitted, app falls back to mock data)
POLYMARKET_API_BASE=
OPINION_API_BASE=
OPINION_API_KEY=
KALSHI_API_BASE=
PROBO_API_BASE=
PREDICTFUN_API_BASE=
PREDICTFUN_API_KEY=
LIMITLESS_API_BASE=
LIMITLESS_API_KEY=

STRIPE_SECRET_KEY=
STRIPE_PRICE_PRO_WEEKLY=
STRIPE_PRICE_PRO_MONTHLY=
STRIPE_PRICE_PRO_ANNUAL=
STRIPE_WEBHOOK_SECRET=
```

`Opinion`, `Predict.fun`, and `Limitless` need API credentials for live data; without them, the dashboard keeps showing the multi-venue demo feed.

For real Supabase email signup/login:

- In `Authentication > URL Configuration`, set `Site URL` to `http://localhost:3000`
- Add `http://localhost:3000/auth/callback` to the redirect allow list
- Email auth / magic links are enabled by default in hosted Supabase projects
- `SUPABASE_SERVICE_ROLE_KEY` is only needed for server-side plan changes (Stripe webhook, admin upserts/listing)

## API Routes

- `GET /api/opportunities`
  - Fetches quotes from both sources (or mock fallback)
  - Detects opportunities where edge >= `ALERT_EDGE_MIN`

- `POST /api/scan`
  - Runs detection and sends Telegram alerts
  - Anti-spam cooldown per `eventKey+outcome` (in-memory)

- `POST /api/test-telegram`
  - Sends a simple test message to Telegram

- `POST /api/billing/webhook`
  - Stripe webhook endpoint (activates PRO on checkout.session.completed)

- `POST /api/auth/upsert-user`
  - Body: `{ "email": "user@example.com", "plan": "FREE|PRO" }`
  - Creates/updates a user plan for SaaS limits

- `GET /api/auth/me?email=user@example.com`
  - Fetches user profile/plan

## Notes / limitations

- Matching is heuristic (`eventKey + outcome`) in this MVP.
- Alert cooldown is in-memory (resets on deploy/restart).
- Real APIs may require auth/rate limit handling; fallback mock data keeps the dashboard working.
