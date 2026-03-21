"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AUTH_LOGIN_HREF, AUTH_SIGNUP_HREF, DASHBOARD_HREF, USER_EMAIL_STORAGE_KEY } from '@/src/lib/routes';
import styles from './pricing.module.css';

type BillingInterval = 'weekly' | 'monthly' | 'annual';

type CheckoutResponse = {
  ok?: boolean;
  url?: string;
  error?: string;
};

type PricingPlan = {
  billingInterval: BillingInterval;
  name: string;
  badge: string;
  badgeClassName: string;
  stateLabel?: string;
  price: string;
  priceSuffix: string;
  priceMeta: string;
  description: string;
  features: string[];
  ctaLabel: string;
  featured?: boolean;
};

const plans: PricingPlan[] = [
  {
    billingInterval: 'weekly',
    name: 'Weekly',
    badge: 'Starter',
    badgeClassName: 'weeklyBadge',
    stateLabel: 'Fast Start',
    price: '$19.99',
    priceSuffix: '/week',
    priceMeta: 'Short commitment to validate the live board before settling into a longer plan.',
    description: 'A fast way to get into the signal flow if you want live access without a longer commitment.',
    features: ['Quickest paid entry', 'Live scanner access', 'Telegram-ready workflow'],
    ctaLabel: 'Start Weekly',
  },
  {
    billingInterval: 'monthly',
    name: 'Monthly',
    badge: 'Pro',
    badgeClassName: 'proBadge',
    stateLabel: 'Most Popular',
    price: '$99',
    priceSuffix: '/month',
    priceMeta: 'Built for active traders who want the full ArbsFlow signal lane at normal operating cadence.',
    description: 'The main plan for traders who want faster alerts, deeper edges, and the cleanest daily workflow.',
    features: ['500 alerts per day', 'Priority delivery', 'Premium 5%+ edge feed'],
    ctaLabel: 'Start Monthly',
    featured: true,
  },
  {
    billingInterval: 'annual',
    name: 'Annual',
    badge: 'Desk',
    badgeClassName: 'annualBadge',
    stateLabel: 'Best Value',
    price: '$1197',
    priceSuffix: '/year',
    priceMeta: 'Best for desks that want locked pricing and uninterrupted access through the full trading year.',
    description: 'The longer-term lane for teams who want pricing stability and a steadier operating setup.',
    features: ['Locked annual pricing', 'Lower effective monthly cost', 'Best fit for desk usage'],
    ctaLabel: 'Lock Annual',
  },
];

const paidPlanFeatures = [
  {
    title: 'Spread scanner',
    copy: 'Track live mispricing across supported prediction venues before the market closes the gap.',
  },
  {
    title: 'Filtered opportunity feed',
    copy: 'Work from a clean dashboard instead of manually flipping between contracts and books.',
  },
  {
    title: 'Secure account sync',
    copy: 'Use the same email across auth, checkout, and plan gating without adding friction to onboarding.',
  },
  {
    title: 'Priority signal routing',
    copy: 'The paid lanes are tuned for traders who want faster visibility once the board starts moving.',
  },
  {
    title: 'Telegram-ready workflow',
    copy: 'Keep the alert feed close to execution so you can react before pricing compresses.',
  },
  {
    title: 'Cancel-anytime billing',
    copy: 'Subscriptions stay simple through Stripe while ArbsFlow keeps the workflow itself focused on signals.',
  },
];

const faqs = [
  {
    question: 'Do all three billing lanes open checkout now?',
    answer: 'Yes. Weekly, Monthly, and Annual now point into Stripe checkout using the same account email.',
  },
  {
    question: 'Can I still start free first?',
    answer: 'Yes. The free account path remains available if you want to test the dashboard before paying.',
  },
  {
    question: 'Which plan should most traders choose?',
    answer: 'Monthly is the default lane for active users. Weekly is for testing speed, and Annual is for lower churn and locked pricing.',
  },
];

function resolveCheckoutError(error: unknown) {
  const code = error instanceof Error ? error.message : 'checkout_failed';

  if (code === 'invalid_email') {
    return 'Enter a valid account email before opening checkout.';
  }

  if (code === 'missing_price_id') {
    return 'One of the Stripe price IDs is still missing in the environment.';
  }

  return 'Unable to open checkout right now. Try again in a moment.';
}

export default function PricingPage() {
  const [email, setEmail] = useState('');
  const [loadingPlan, setLoadingPlan] = useState<BillingInterval | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedEmail = window.localStorage.getItem(USER_EMAIL_STORAGE_KEY)?.trim();
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const normalizedEmail = email.trim().toLowerCase();
  const hasAccountEmail = normalizedEmail.includes('@');
  const dashboardLink = hasAccountEmail ? DASHBOARD_HREF : AUTH_LOGIN_HREF;
  const dashboardLabel = hasAccountEmail ? 'Dashboard' : 'Sign In';

  const onUpgrade = async (billingInterval: BillingInterval) => {
    if (!hasAccountEmail) {
      setError('Enter a valid account email before opening checkout.');
      return;
    }

    setError('');
    setLoadingPlan(billingInterval);

    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(USER_EMAIL_STORAGE_KEY, normalizedEmail);
      }

      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, billingInterval }),
      });

      const payload = (await response.json().catch(() => ({}))) as CheckoutResponse;
      if (!response.ok) {
        throw new Error(payload.error || 'checkout_failed');
      }

      if (payload.url) {
        window.location.href = payload.url;
        return;
      }

      throw new Error('checkout_failed');
    } catch (caughtError) {
      setError(resolveCheckoutError(caughtError));
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <div className={styles.topbarLeft}>
            <Link href="/" className={styles.backLink}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Back
            </Link>

            <Link href="/" className={styles.brand}>
              <span className={styles.brandMark}>AF</span>
              <span className={styles.brandText}>ArbsFlow</span>
            </Link>
          </div>

          <div className={styles.topbarRight}>
            {hasAccountEmail ? <span className={styles.emailPill}>{normalizedEmail}</span> : null}
            <Link href={dashboardLink} className={styles.topbarAction}>
              {dashboardLabel}
            </Link>
          </div>
        </div>
      </header>

      <div className={styles.shell}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>Pricing</span>
          <h1 className={styles.heroTitle}>Pick your plan.</h1>
          <p className={styles.heroSubtitle}>
            Weekly for fast entry, Monthly for full-speed trading, Annual for the lowest-friction long-term lane.
          </p>

          <div className={styles.liveNote}>
            <div className={styles.liveNoteCopy}>
              <strong>Checkout Email</strong>
              <span>Use the same email from your account before choosing Weekly, Monthly, or Annual.</span>
            </div>

            <div className={styles.liveNoteForm}>
              <label htmlFor="pricing-email">Account Email</label>
              <input
                id="pricing-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="trader@arbsflow.online"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <div className={styles.liveNoteMeta}>
                <span>Need to test first?</span>
                <Link href={AUTH_SIGNUP_HREF}>Create a free account</Link>
              </div>
            </div>
          </div>

          {error ? <p className={styles.bannerError}>{error}</p> : null}
        </section>

        <section className={styles.planGrid}>
          {plans.map((plan) => {
            const isLoading = loadingPlan === plan.billingInterval;
            const cardClassNames = [
              styles.planCard,
              plan.featured ? styles.featuredPlan : '',
              plan.billingInterval === 'weekly' ? styles.weeklyPlan : '',
              plan.billingInterval === 'annual' ? styles.annualPlan : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <article key={plan.billingInterval} className={cardClassNames}>
                {plan.featured ? <div className={styles.featuredRibbon}>Most Popular</div> : null}

                <div className={styles.planLabelRow}>
                  <span className={`${styles.planBadge} ${styles[plan.badgeClassName]}`}>{plan.badge}</span>
                  {plan.stateLabel ? <span className={styles.planState}>{plan.stateLabel}</span> : null}
                </div>

                <div className={styles.planHeader}>
                  <h2>{plan.name}</h2>
                  <p>{plan.description}</p>
                </div>

                <div className={styles.priceBlock}>
                  <strong>{plan.price}</strong>
                  <span>{plan.priceSuffix}</span>
                </div>
                <p className={styles.priceMeta}>{plan.priceMeta}</p>

                <ul className={styles.featureList}>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={`${styles.cardButton} ${plan.featured ? styles.primaryButton : styles.secondaryButton}`}
                  onClick={() => onUpgrade(plan.billingInterval)}
                  disabled={Boolean(loadingPlan) || !hasAccountEmail}
                >
                  {isLoading ? 'Opening Checkout...' : plan.ctaLabel}
                </button>
              </article>
            );
          })}
        </section>

        <section className={styles.detailSection}>
          <div className={styles.sectionHeading}>
            <h2>All paid plans include</h2>
            <p>
              Different billing cadence, same goal: surface mispricing faster and keep the trading workflow as clean as
              possible.
            </p>
          </div>

          <div className={styles.detailGrid}>
            {paidPlanFeatures.map((feature) => (
              <article key={feature.title} className={styles.detailCard}>
                <span className={styles.detailMarker} />
                <h3>{feature.title}</h3>
                <p>{feature.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.guaranteeBlock}>
          <strong>Need a lower-risk entry? Start Weekly. Need steady usage? Go Monthly or lock Annual.</strong>
          <p>All three paid lanes now route through Stripe with the same account email you already use in ArbsFlow.</p>
        </section>

        <section className={styles.faqSection}>
          <div className={styles.sectionHeading}>
            <h2>FAQ</h2>
            <p>Short answers around the new billing setup.</p>
          </div>

          <div className={styles.faqGrid}>
            {faqs.map((faq) => (
              <article key={faq.question} className={styles.faqCard}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
