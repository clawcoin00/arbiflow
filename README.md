# ArbiFlow (Alerts-only MVP)

Arbitrage opportunity monitor for **Polymarket vs Kalshi**.

> This MVP is informational only: it detects opportunities and sends alerts.
> It does **not** execute trades.

## Quick start

```bash
npm install
npm run dev
```

Open: http://localhost:3000

## Environment

`npm run dev` now refreshes `.env.local` from the linked Vercel project's `production` environment before starting Next.js. If Vercel is unavailable, the app keeps using the last synced `.env.local`.

Useful commands:

```bash
# Pull production env into .env.local on demand
npm run env:sync

# Regenerate .env.example after changing the env manifest
npm run env:example

# Skip the sync if you explicitly want to run against the current local file
npm run dev:raw
```

Use `.env.local.override` only for deliberate local-only deviations. Anything in that file wins over the synced production values.
Vercel runtime-managed variables such as `VERCEL_*` stay managed by the platform and are not written into `.env.local`.

`.env.example` documents the environment surface:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
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

DATABASE_URL="file:./dev.db"

STRIPE_SECRET_KEY=
STRIPE_PRICE_PRO_WEEKLY=
STRIPE_PRICE_PRO_MONTHLY=
STRIPE_PRICE_PRO_ANNUAL=
STRIPE_WEBHOOK_SECRET=

TWITTER_API_KEY=
TWITTER_API_SECRET=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_TOKEN_SECRET=
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
