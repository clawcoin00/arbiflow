import { headers } from 'next/headers';
import { getStripe } from '@/src/lib/stripe';
import { activateProByEmail, downgradeToFreeByEmail } from '@/src/lib/subscriptions';

export async function POST(req: Request) {
  const sig = (await headers()).get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return Response.json({ ok: false, error: 'missing_signature_or_secret' }, { status: 400 });
  }

  const stripe = getStripe();
  const payload = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err: any) {
    return Response.json({ ok: false, error: `invalid_signature: ${err?.message || 'unknown'}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const email = session?.customer_details?.email || session?.customer_email || session?.metadata?.email;
        if (email) await activateProByEmail(String(email));
        break;
      }
      case 'customer.subscription.deleted':
      case 'customer.subscription.paused': {
        const sub = event.data.object as any;
        const email = sub?.metadata?.email;
        if (email) await downgradeToFreeByEmail(String(email));
        break;
      }
      default:
        break;
    }
  } catch (err: any) {
    return Response.json({ ok: false, error: err?.message || 'handler_error' }, { status: 500 });
  }

  return Response.json({ ok: true, received: true, type: event.type });
}
