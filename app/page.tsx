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
    if (!window) return '—';
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

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Navigation */}
      <nav className="nav-container">
        <div className="nav-inner">
          <a href="/" className="nav-logo">
            <div className="nav-logo-icon">AF</div>
            <span className="nav-logo-text">ArbiFlow</span>
          </a>
          
          <div className="nav-links">
            <a href="/" className="nav-link">Dashboard</a>
            <a href="/pricing" className="nav-link">Pricing</a>
            <a href="/admin" className="nav-link">Admin</a>
          </div>
          
          <a 
            href="https://t.me/ArbiFlowAnnouncements" 
            target="_blank" 
            rel="noopener noreferrer"
            className="nav-cta"
          >
            Join Telegram
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container-main">
          {/* Live Badge */}
          <div className="hero-badge animate-fade-in">
            <span className="badge badge-live">LIVE MONITORING ACTIVE</span>
          </div>

          {/* Title */}
          <h1 className="hero-title animate-fade-in animate-delay-1">
            Stop Guessing.
            <br />
            <span className="text-gradient">Start Arbitraging.</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle animate-fade-in animate-delay-2">
            Real-time arbitrage detection across <strong>Polymarket</strong> and <strong>Kalshi</strong>.
            <br />
            Zero execution. Pure signals. Profit regardless of the outcome.
          </p>

          {/* Actions */}
          <div className="hero-actions animate-fade-in animate-delay-3">
            <a href="/pricing" className="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              Get Started Free
            </a>
            <a 
              href="https://t.me/ArbiFlowAnnouncements" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-secondary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
              Join Telegram
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {data && (
        <section style={{ padding: '20px 0' }}>
          <div className="container-main">
            <div className="stats-grid">
              <div className="stat-card animate-fade-in animate-delay-1">
                <div className="stat-value text-gradient">{data.opportunities.length}</div>
                <div className="stat-label">Active Opportunities</div>
              </div>
              <div className="stat-card animate-fade-in animate-delay-2">
                <div className="stat-value">{edgeWindowLabel(data.edgeWindow)}</div>
                <div className="stat-label">Edge Range</div>
              </div>
              <div className="stat-card animate-fade-in animate-delay-3">
                <div className="stat-value">2</div>
                <div className="stat-label">Markets Monitored</div>
              </div>
              <div className="stat-card animate-fade-in animate-delay-4">
                <div className="stat-value" style={{ color: data.sources.usingMock ? '#f97316' : '#22c55e' }}>
                  {data.sources.usingMock ? 'Demo' : 'Live'}
                </div>
                <div className="stat-label">Data Status</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Opportunities Section */}
      <section style={{ padding: '40px 0' }}>
        <div className="container-main">
          <div className="card card-glow">
            {/* Card Header */}
            <div className="card-header">
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '4px' }}>
                  Current Opportunities
                </h2>
                <p style={{ fontSize: '13px', color: '#71717a' }}>
                  Last updated: {data ? new Date(data.generatedAt).toLocaleTimeString() : '—'}
                </p>
              </div>
              {data && (
                <div className={`badge ${data.plan === 'PRO' ? 'badge-pro' : 'badge-free'}`}>
                  {data.plan}
                </div>
              )}
            </div>

            {/* Table */}
            <div className="table-container">
              {loading ? (
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    border: '3px solid #27272a', 
                    borderTopColor: '#22c55e',
                    borderRadius: '50%',
                    animation: 'pulse 1s linear infinite',
                    margin: '0 auto 16px'
                  }} />
                  <p style={{ color: '#71717a', fontSize: '14px' }}>Loading opportunities...</p>
                </div>
              ) : (
                <table className="table-main">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Outcome</th>
                      <th style={{ textAlign: 'right' }}>Polymarket</th>
                      <th style={{ textAlign: 'right' }}>Kalshi</th>
                      <th style={{ textAlign: 'right' }}>Edge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!data || data.opportunities.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '60px 20px' }}>
                          <p style={{ color: '#71717a', fontSize: '14px', margin: 0 }}>
                            No opportunities in current range
                          </p>
                        </td>
                      </tr>
                    ) : (
                      data.opportunities.map((op, i) => (
                        <tr key={`${op.eventKey}-${op.outcome}-${i}`}>
                          <td>
                            <span style={{ fontWeight: 500 }}>{op.eventKey}</span>
                          </td>
                          <td>
                            <span style={{ 
                              color: '#a1a1aa', 
                              fontSize: '13px',
                              fontFamily: "'JetBrains Mono', monospace"
                            }}>
                              {op.outcome}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span className="font-mono" style={{ fontSize: '14px' }}>
                              {op.polymarket.price.toFixed(3)}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span className="font-mono" style={{ fontSize: '14px' }}>
                              {op.kalshi.price.toFixed(3)}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span className="badge-edge">
                              +{op.percentEdge.toFixed(2)}%
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '60px 0' }}>
        <div className="container-main">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="section-label">THE PROTOCOL</span>
            <h2 className="section-title">How It Works</h2>
            <p style={{ color: '#a1a1aa', maxWidth: '500px', margin: '0 auto' }}>
              Our system monitors prediction markets 24/7 to find profitable arbitrage opportunities.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon feature-icon-green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
              </div>
              <h3 className="feature-title">Detect</h3>
              <p className="feature-desc">
                Real-time price monitoring across Polymarket, Kalshi, and more prediction markets.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon-blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h3 className="feature-title">Analyze</h3>
              <p className="feature-desc">
                Calculate exact edge percentages and potential profit for every opportunity.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon-purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <h3 className="feature-title">Alert</h3>
              <p className="feature-desc">
                Instant Telegram notifications when high-edge opportunities are detected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Status */}
      <section style={{ padding: '40px 0' }}>
        <div className="container-main">
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div className="card">
              <div className="card-body">
                {data?.plan === 'PRO' ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '50%',
                      background: 'rgba(34, 197, 94, 0.1)',
                      border: '2px solid rgba(34, 197, 94, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px'
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Pro Plan Active</h3>
                    <p style={{ color: '#a1a1aa', fontSize: '14px', marginBottom: '16px' }}>
                      Viewing opportunities {edgeWindowLabel(data.edgeWindow)}
                    </p>
                    <button 
                      onClick={() => { setEmail(''); loadData(); }}
                      style={{ 
                        background: 'transparent',
                        border: 'none',
                        color: '#71717a',
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <p style={{ color: '#a1a1aa', fontSize: '14px', margin: '0 0 8px' }}>
                        Free plan: <span style={{ color: '#fafafa' }}>{edgeWindowLabel(data?.edgeWindow)}</span>
                      </p>
                      <p style={{ color: '#71717a', fontSize: '13px', margin: 0 }}>
                        <a href="/pricing" style={{ color: '#22c55e' }}>Upgrade to Pro</a> for premium edge signals
                      </p>
                    </div>
                    
                    {data?.fallbackApplied && (
                      <p style={{ 
                        textAlign: 'center', 
                        color: '#f97316', 
                        fontSize: '12px',
                        marginBottom: '16px'
                      }}>
                        Showing extended range (no opportunities in primary tier)
                      </p>
                    )}

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="email"
                        className="input-main"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onLogin()}
                        style={{ flex: 1 }}
                      />
                      <button className="btn-secondary" onClick={onLogin}>
                        Check
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container-main">
          <div className="footer-inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                background: 'var(--gradient-green)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 700,
                color: '#000'
              }}>
                AF
              </div>
              <span style={{ fontWeight: 600, fontSize: '14px' }}>ArbiFlow</span>
            </div>
            
            <div className="footer-links">
              <a href="/" className="footer-link">Dashboard</a>
              <a 
                href="https://t.me/ArbiFlowAnnouncements" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-link"
              >
                Telegram
              </a>
              <a 
                href="https://github.com/clawcoin00/arbiflow" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-link"
              >
                GitHub
              </a>
            </div>
            
            <p className="footer-copy">© 2026 ArbiFlow</p>
          </div>
        </div>
      </footer>
    </div>
  );
}