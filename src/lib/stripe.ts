import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export type BillingInterval = 'weekly' | 'monthly' | 'annual';

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('Missing STRIPE_SECRET_KEY');
  if (!_stripe) _stripe = new Stripe(key);
  return _stripe;
}

export const STRIPE_PRICE_PRO_WEEKLY = process.env.STRIPE_PRICE_PRO_WEEKLY || '';
export const STRIPE_PRICE_PRO_MONTHLY = process.env.STRIPE_PRICE_PRO_MONTHLY || '';
export const STRIPE_PRICE_PRO_ANNUAL = process.env.STRIPE_PRICE_PRO_ANNUAL || '';

export function getStripePriceId(billingInterval: BillingInterval) {
  if (billingInterval === 'weekly') return STRIPE_PRICE_PRO_WEEKLY;
  if (billingInterval === 'annual') return STRIPE_PRICE_PRO_ANNUAL;
  return STRIPE_PRICE_PRO_MONTHLY;
}
