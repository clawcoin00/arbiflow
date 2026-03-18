"use client";

import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function PricingPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onUpgrade = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'checkout_failed');
      if (data.url) window.location.href = data.url;
    } catch (e: any) {
      setError(e.message || 'Erro no checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <section className="max-w-5xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-4xl md:text-5xl font-bold">
              Simple, <span className="gradient-text">Transparent</span> Pricing
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Start free and upgrade when you need more alerts.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="card">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Free</h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-zinc-500">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  '20 alerts per day',
                  'Basic dashboard access',
                  'Telegram notifications',
                  'Opportunities até 2% de edge',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="btn-secondary w-full" disabled>
                Current Plan
              </button>
            </div>

            {/* Pro Plan */}
            <div className="card-highlight glow">
              <div className="absolute top-0 right-0 bg-emerald-500 text-zinc-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAR
              </div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Pro</h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold gradient-text">$99</span>
                  <span className="text-zinc-500">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  '500 alerts per day',
                  'Priority alert delivery',
                  'Melhores oportunidades acima de 5%',
                  'Historical opportunity data',
                  'Email support',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="space-y-3">
                <input
                  type="email"
                  className="input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  className="btn-primary w-full"
                  onClick={onUpgrade}
                  disabled={loading || !email}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Upgrade to Pro'
                  )}
                </button>
                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: 'What payment methods do you accept?', a: 'We accept all major credit cards through Stripe.' },
                { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. No questions asked.' },
                { q: 'How are alerts delivered?', a: 'Alerts are sent instantly to your Telegram when opportunities are detected.' },
              ].map((faq, i) => (
                <div key={i} className="card">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-zinc-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}