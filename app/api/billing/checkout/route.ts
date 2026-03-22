import { type BillingInterval, getStripe, getStripePriceId } from '@/src/lib/stripe';

function resolveBillingInterval(rawValue: unknown): BillingInterval {
  if (rawValue === 'weekly' || rawValue === 'annual') {
    return rawValue;
  }

  return 'monthly';
}

function resolveAppOrigin(req: Request) {
  const requestUrl = new URL(req.url);
  const forwardedHost = req.headers.get('x-forwarded-host');

  if (forwardedHost) {
    const forwardedProto = req.headers.get('x-forwarded-proto') || requestUrl.protocol.replace(':', '');
    return `${forwardedProto}://${forwardedHost}`;
  }

  if (requestUrl.origin && requestUrl.origin !== 'null') {
    return requestUrl.origin;
  }

  const configuredOrigin = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (configuredOrigin) {
    return configuredOrigin.replace(/\/$/, '');
  }

  return 'http://localhost:3000';
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || '').trim();
  const billingInterval = resolveBillingInterval(body.billingInterval);
  const priceId = getStripePriceId(billingInterval);

  if (!email || !email.includes('@')) {
    return Response.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }
  if (!priceId) {
    return Response.json({ ok: false, error: 'missing_price_id' }, { status: 500 });
  }

  const stripe = getStripe();
  const origin = resolveAppOrigin(req);

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: email,
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cancel`,
    metadata: { email, plan: 'PRO', billingInterval },
    subscription_data: { metadata: { email, plan: 'PRO', billingInterval } },
  });

  return Response.json({ ok: true, url: session.url });
}
