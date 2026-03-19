"use client";

import { useState } from 'react';

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
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0b]/90 backdrop-blur-xl">
        <div className="container-editorial flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <span className="text-mono text-xs font-bold text-black">AF</span>
            </div>
            <span className="heading-display text-xl tracking-tight">ArbiFlow</span>
          </a>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-mono text-xs text-zinc-400 hover:text-white transition-colors">Dashboard</a>
            <a href="/pricing" className="text-mono text-xs text-white">Pricing</a>
            <a href="/admin" className="text-mono text-xs text-zinc-400 hover:text-white transition-colors">Admin</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="heading-mono text-xs text-zinc-500 mb-4">Pricing</h1>
            <p className="heading-display text-4xl md:text-5xl text-white">
              Simple, Transparent
            </p>
            <p className="text-lg text-zinc-400 font-light">
              Start free. Upgrade when you need more signals.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-8">
        <div className="container-editorial">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="card-elevated">
              <div className="mb-6">
                <div className="plan-badge-free mb-4 inline-block">FREE</div>
                <h2 className="heading-display text-2xl text-white mb-2">Explorer</h2>
                <div className="flex items-baseline gap-1">
                  <span className="heading-display text-4xl text-white">$0</span>
                  <span className="text-mono text-xs text-zinc-500">/month</span>
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
                    <svg className="w-4 h-4 text-zinc-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className="btn-secondary w-full" disabled>
                Current Plan
              </button>
            </div>

            {/* Pro Plan */}
            <div className="card-elevated relative border-emerald-500/20 animate-pulse-glow">
              <div className="absolute top-4 right-4">
                <div className="plan-badge-pro">POPULAR</div>
              </div>
              
              <div className="mb-6">
                <div className="plan-badge-pro mb-4 inline-block">PRO</div>
                <h2 className="heading-display text-2xl text-white mb-2">Professional</h2>
                <div className="flex items-baseline gap-1">
                  <span className="heading-display text-4xl gradient-text">$99</span>
                  <span className="text-mono text-xs text-zinc-500">/month</span>
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
                    <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-white">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="space-y-3">
                <input
                  type="email"
                  className="input-refined"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  className="btn-primary w-full"
                  onClick={onUpgrade}
                  disabled={loading || !email}
                >
                  {loading ? 'Processing...' : 'Upgrade to Pro'}
                </button>
                {error && (
                  <p className="text-mono text-[10px] text-red-400 text-center">{error}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container-editorial">
          <div className="max-w-2xl mx-auto">
            <h2 className="heading-mono text-xs text-zinc-500 text-center mb-8">FAQ</h2>
            
            <div className="space-y-4">
              {[
                { q: 'What payment methods do you accept?', a: 'We accept all major credit cards through Stripe.' },
                { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. No questions asked.' },
                { q: 'How are alerts delivered?', a: 'Alerts are sent instantly to your Telegram when opportunities are detected.' },
              ].map((faq, i) => (
                <div key={i} className="card-elevated">
                  <h3 className="heading-display text-lg text-white mb-2">{faq.q}</h3>
                  <p className="text-sm text-zinc-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-auto">
        <div className="container-editorial">
          <div className="flex items-center justify-center gap-6">
            <a href="/" className="text-mono text-[10px] text-zinc-500 hover:text-white transition-colors uppercase tracking-wider">
              Dashboard
            </a>
            <a 
              href="https://t.me/+zWZEAjCoUjM0YTk5" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-mono text-[10px] text-zinc-500 hover:text-white transition-colors uppercase tracking-wider"
            >
              Telegram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}