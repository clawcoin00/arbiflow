"use client";

import { useEffect, useState } from 'react';

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
  fallbackApplied?: boolean;
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
      return `${min}%–${max}%`;
    }
    return `${min}%+`;
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
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0b]/90 backdrop-blur-xl">
        <div className="container-editorial flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <span className="text-mono text-xs font-bold text-black">AF</span>
            </div>
            <span className="heading-display text-xl tracking-tight">ArbiFlow</span>
          </a>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-mono text-xs text-zinc-400 hover:text-white transition-colors">Dashboard</a>
            <a href="/pricing" className="text-mono text-xs text-zinc-400 hover:text-white transition-colors">Pricing</a>
            <a href="/admin" className="text-mono text-xs text-zinc-400 hover:text-white transition-colors">Admin</a>
            <a 
              href="https://t.me/ArbiFlowAnnouncements" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-secondary text-xs py-2 px-4"
            >
              Telegram
            </a>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-zinc-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container-editorial">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-mono text-[10px] font-bold tracking-widest text-emerald-400 uppercase">Live Monitoring</span>
            </div>

            {/* Main Heading */}
            <h1 className="heading-display text-5xl md:text-7xl lg:text-8xl leading-[0.9]">
              <span className="text-white">Arbitrage</span>
              <br />
              <span className="gradient-text">Intelligence</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
              Real-time opportunity detection across{' '}
              <span className="text-white font-medium">Polymarket</span> and{' '}
              <span className="text-white font-medium">Kalshi</span>. 
              <br className="hidden md:block" />
              Zero execution. Pure signals.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a href="/pricing" className="btn-primary">
                Get Started
              </a>
              <a 
                href="https://t.me/ArbiFlowAnnouncements" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-secondary"
              >
                Join Telegram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {data && (
        <section className="py-8">
          <div className="container-editorial">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="stat-card animate-fade-in-up stagger-1">
                <div className="stat-value gradient-text">{data.opportunities.length}</div>
                <div className="stat-label">Opportunities</div>
              </div>
              <div className="stat-card animate-fade-in-up stagger-2">
                <div className="stat-value text-white">{edgeWindowLabel(data.edgeWindow)}</div>
                <div className="stat-label">Edge Range</div>
              </div>
              <div className="stat-card animate-fade-in-up stagger-3">
                <div className="stat-value text-white">2</div>
                <div className="stat-label">Markets</div>
              </div>
              <div className="stat-card animate-fade-in-up stagger-4">
                <div className={`stat-value ${data.sources.usingMock ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {data.sources.usingMock ? 'Demo' : 'Live'}
                </div>
                <div className="stat-label">Status</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Opportunities Table */}
      <section className="py-8">
        <div className="container-editorial">
          <div className="card-elevated">
            {/* Table Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
              <div>
                <h2 className="heading-display text-2xl text-white">Current Opportunities</h2>
                <p className="text-mono text-xs text-zinc-500 mt-1">
                  Updated {data ? new Date(data.generatedAt).toLocaleTimeString() : '—'}
                </p>
              </div>
              {data?.plan === 'PRO' ? (
                <div className="plan-badge-pro">PRO</div>
              ) : (
                <div className="plan-badge-free">FREE</div>
              )}
            </div>

            {/* Table */}
            {loading ? (
              <div className="py-20 text-center">
                <div className="inline-block w-6 h-6 border-2 border-zinc-700 border-t-emerald-400 rounded-full animate-spin" />
                <p className="text-mono text-xs text-zinc-500 mt-4">Loading opportunities...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-editorial">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Outcome</th>
                      <th className="text-right">Polymarket</th>
                      <th className="text-right">Kalshi</th>
                      <th className="text-right">Edge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!data || data.opportunities.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-16">
                          <div className="text-mono text-xs text-zinc-500">
                            No opportunities in current range
                          </div>
                        </td>
                      </tr>
                    ) : (
                      data.opportunities.map((op, i) => (
                        <tr key={`${op.eventKey}-${op.outcome}-${i}`}>
                          <td>
                            <span className="text-white font-medium">{op.eventKey}</span>
                          </td>
                          <td>
                            <span className="text-mono text-xs text-zinc-400">{op.outcome}</span>
                          </td>
                          <td className="text-right">
                            <span className="text-mono text-sm">{op.polymarket.price.toFixed(3)}</span>
                          </td>
                          <td className="text-right">
                            <span className="text-mono text-sm">{op.kalshi.price.toFixed(3)}</span>
                          </td>
                          <td className="text-right">
                            <span className="edge-badge">+{op.percentEdge.toFixed(2)}%</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container-editorial">
          <div className="text-center mb-12">
            <h2 className="heading-mono text-xs text-zinc-500 mb-4">How It Works</h2>
            <p className="heading-display text-3xl md:text-4xl text-white">The Signal Pipeline</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card-elevated group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="heading-display text-xl text-white mb-2">Detect</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Continuous price monitoring across prediction markets with sub-second latency.
              </p>
            </div>

            <div className="card-elevated group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="heading-display text-xl text-white mb-2">Alert</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Instant Telegram notifications when edge thresholds are breached.
              </p>
            </div>

            <div className="card-elevated group">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="heading-display text-xl text-white mb-2">Track</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Historical analytics to identify patterns and optimize your strategy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Status / Login Section */}
      <section className="py-8 pb-16">
        <div className="container-editorial">
          <div className="max-w-lg mx-auto">
            <div className="card-glass">
              {data?.plan === 'PRO' ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">Pro Active</div>
                      <div className="text-mono text-[10px] text-zinc-500 mt-0.5">
                        Range: {edgeWindowLabel(data.edgeWindow)}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={onLogout} 
                    className="text-mono text-[10px] text-zinc-500 hover:text-white transition-colors uppercase tracking-wider"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-mono text-xs text-zinc-400">
                      Free tier: <span className="text-white">{edgeWindowLabel(data?.edgeWindow)}</span>
                    </p>
                    <p className="text-mono text-[10px] text-zinc-500 mt-1">
                      <a href="/pricing" className="text-emerald-400 hover:underline">Upgrade to Pro</a> for {data?.edgeWindow?.maxEdge ? '5%+ edges' : 'premium signals'}
                    </p>
                  </div>
                  
                  {data?.fallbackApplied && (
                    <div className="text-center text-mono text-[10px] text-amber-400">
                      Showing extended range (no opportunities in primary tier)
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="email"
                      className="input-refined flex-1"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && onLogin()}
                    />
                    <button onClick={onLogin} className="btn-secondary py-2 px-4">
                      Check
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="container-editorial">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <span className="text-mono text-[8px] font-bold text-black">AF</span>
              </div>
              <span className="heading-display text-sm">ArbiFlow</span>
            </div>
            <p className="text-mono text-[10px] text-zinc-600">
              © 2026 ArbiFlow. Real-time arbitrage signals.
            </p>
            <div className="flex items-center gap-6">
              <a 
                href="https://t.me/ArbiFlowAnnouncements" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-mono text-[10px] text-zinc-500 hover:text-white transition-colors uppercase tracking-wider"
              >
                Telegram
              </a>
              <a 
                href="https://github.com/clawcoin00/arbiflow" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-mono text-[10px] text-zinc-500 hover:text-white transition-colors uppercase tracking-wider"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}