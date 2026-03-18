import { STRIPE_PRICE_PRO_MONTHLY, getStripe } from '@/src/lib/stripe';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || '').trim();

  if (!email || !email.includes('@')) {
    return Response.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }
  if (!STRIPE_PRICE_PRO_MONTHLY) {
    return Response.json({ ok: false, error: 'missing_price_id' }, { status: 500 });
  }

  const stripe = getStripe();
  const origin = process.env.NEXT_PUBLIC_BASE_URL || 'https://arbiflow.online';

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: STRIPE_PRICE_PRO_MONTHLY, quantity: 1 }],
    customer_email: email,
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cancel`,
    metadata: { email, plan: 'PRO' },
    subscription_data: { metadata: { email, plan: 'PRO' } },
  });

  return Response.json({ ok: true, url: session.url });
}
