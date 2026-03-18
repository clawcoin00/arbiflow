"use client";

import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

type Opportunity = {
  eventKey: string;
  outcome: string;
  polymarket: { price: number };
  kalshi: { price: number };
  edge: number;
  percentEdge: number;
};

type DataResponse = {
  plan: 'FREE' | 'PRO';
  edgeWindow: { minEdge: number; maxEdge?: number };
  opportunities: Opportunity[];
  sources: {
    polymarketCount: number;
    kalshiCount: number;
    usingMock: boolean;
  };
  generatedAt: string;
};

export default function HomePage() {
  const [data, setData] = useState<DataResponse | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  const edgeWindowLabel = (window?: { minEdge: number; maxEdge?: number }) => {
    if (!window) return '-';
    const min = (window.minEdge * 100).toFixed(0);
    if (typeof window.maxEdge === 'number') {
      const max = (window.maxEdge * 100).toFixed(0);
      return `${min}% até ${max}%`;
    }
    return `acima de ${min}%`;
  };

  const loadData = async (userEmail?: string) => {
    setLoading(true);
    try {
      const url = userEmail
        ? `/api/opportunities?email=${encodeURIComponent(userEmail)}`
        : '/api/opportunities';
      const res = await fetch(url);
      const json = await res.json();
      setData(json);
    } catch {
      // fallback to FREE plan
      const res = await fetch('/api/opportunities?plan=FREE');
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onLogin = () => {
    if (email.trim()) {
      loadData(email.trim());
    }
  };

  const onLogout = () => {
    setEmail('');
    loadData();
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Monitoring Active
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              <span className="gradient-text">ArbiFlow</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Real-time arbitrage opportunity detection between{' '}
              <span className="text-zinc-100 font-medium">Polymarket</span> and{' '}
              <span className="text-zinc-100 font-medium">Kalshi</span>
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <a href="/pricing" className="btn-primary">
                Get Started
              </a>
              <a href="https://t.me/ArbiFlowAnnouncements" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Join Telegram
              </a>
            </div>
          </div>

          {/* Login / Plan Status */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="card">
              {data?.plan === 'PRO' ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-emerald-400">Pro Plan Active</div>
                      <div className="text-sm text-zinc-400">Viewing opportunities {edgeWindowLabel(data.edgeWindow)}</div>
                    </div>
                  </div>
                  <button onClick={onLogout} className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Free plan: viewing oportunidades até 2%. <a href="/pricing" className="text-emerald-400 hover:underline">Upgrade to Pro</a> para ver as melhores acima de 5%.</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      className="input flex-1"
                      placeholder="Enter your email to check Pro status"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && onLogin()}
                    />
                    <button onClick={onLogin} className="btn-secondary whitespace-nowrap">
                      Check
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          {data && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="card text-center">
                <div className="text-3xl font-bold gradient-text">{data.opportunities.length}</div>
                <div className="text-zinc-400 text-sm mt-1">Active Opportunities</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-zinc-100">{edgeWindowLabel(data.edgeWindow)}</div>
                <div className="text-zinc-400 text-sm mt-1">Faixa de Edge</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-zinc-100">2</div>
                <div className="text-zinc-400 text-sm mt-1">Markets Monitored</div>
              </div>
              <div className="card text-center">
                <div className={`text-3xl font-bold ${data.sources.usingMock ? 'text-yellow-400' : 'text-emerald-400'}`}>
                  {data.sources.usingMock ? 'Demo' : 'Live'}
                </div>
                <div className="text-zinc-400 text-sm mt-1">Data Source</div>
              </div>
            </div>
          )}
        </section>

        {/* Opportunities Table */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="card glow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Current Opportunities</h2>
              {data && (
                <span className="text-zinc-500 text-sm">
                  Updated: {new Date(data.generatedAt).toLocaleTimeString()}
                </span>
              )}
            </div>
            {loading ? (
              <div className="py-12 text-center text-zinc-500">
                <div className="inline-block w-8 h-8 border-2 border-zinc-600 border-t-emerald-400 rounded-full animate-spin mb-4"></div>
                <div>Loading opportunities...</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left py-3 px-4 text-zinc-400 font-medium">Event</th>
                      <th className="text-left py-3 px-4 text-zinc-400 font-medium">Outcome</th>
                      <th className="text-right py-3 px-4 text-zinc-400 font-medium">Polymarket</th>
                      <th className="text-right py-3 px-4 text-zinc-400 font-medium">Kalshi</th>
                      <th className="text-right py-3 px-4 text-zinc-400 font-medium">Edge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!data || data.opportunities.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-zinc-500">
                          <div className="flex flex-col items-center gap-2">
                            <svg className="w-12 h-12 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>No opportunities above threshold</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      data.opportunities.map((op, i) => (
                        <tr key={`${op.eventKey}-${op.outcome}-${i}`} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                          <td className="py-4 px-4">
                            <span className="font-medium">{op.eventKey}</span>
                          </td>
                          <td className="py-4 px-4 text-zinc-400">{op.outcome}</td>
                          <td className="py-4 px-4 text-right font-mono">{op.polymarket.price.toFixed(3)}</td>
                          <td className="py-4 px-4 text-right font-mono">{op.kalshi.price.toFixed(3)}</td>
                          <td className="py-4 px-4 text-right">
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">
                              +{op.percentEdge.toFixed(2)}%
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Detection</h3>
              <p className="text-zinc-400">Continuously monitors Polymarket and Kalshi for price discrepancies above your threshold.</p>
            </div>
            <div className="card">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Alerts</h3>
              <p className="text-zinc-400">Get notified instantly via Telegram when profitable opportunities are detected.</p>
            </div>
            <div className="card">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-zinc-400">Track historical opportunities and analyze market efficiency over time.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}