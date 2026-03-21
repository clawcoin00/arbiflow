"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AUTH_SIGNUP_HREF, USER_EMAIL_STORAGE_KEY } from '@/src/lib/routes';
import { CaptureNetworkSection } from './components/CaptureNetworkSection';
import { EngineModulesSection } from './components/EngineModulesSection';
import { FaqSection } from './components/FaqSection';
import { GuaranteeSection } from './components/GuaranteeSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { MarketReplay } from './components/MarketReplay';
import { RealArbitragesSection } from './components/RealArbitragesSection';
import type { Platform } from '@/src/lib/types';
import { getPlatformLabel } from '@/src/lib/venues';

type Opportunity = {
  eventKey: string;
  outcome: string;
  pairKey: string;
  sourceA: { platform: Platform; price: number };
  sourceB: { platform: Platform; price: number };
  edge: number;
  percentEdge: number;
};

type DataResponse = {
  plan: 'FREE' | 'PRO';
  edgeWindow: { minEdge: number; maxEdge?: number };
  fallbackApplied?: boolean;
  opportunities: Opportunity[];
  sources: {
    platforms: Array<{
      platform: Platform;
      label: string;
      count: number;
      usingMock: boolean;
    }>;
    pairs: Array<{
      pairKey: string;
      label: string;
      navLabel: string;
      count: number;
    }>;
    usingMock: boolean;
  };
  generatedAt: string;
};

export default function HomePage() {
  const [data, setData] = useState<DataResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const edgeWindowLabel = (window?: { minEdge: number; maxEdge?: number }) => {
    if (!window) return '--';
    const min = (window.minEdge * 100).toFixed(0);
    if (typeof window.maxEdge === 'number') {
      const max = (window.maxEdge * 100).toFixed(0);
      return `${min}%-${max}%`;
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
    const storedEmail =
      typeof window !== 'undefined' ? window.localStorage.getItem(USER_EMAIL_STORAGE_KEY)?.trim() || undefined : undefined;
    loadData(storedEmail);
  }, []);

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'rgba(9, 9, 11, 0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '56px',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 16px',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '10px',
                  color: '#000',
                }}
              >
                AF
              </span>
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: '16px',
                letterSpacing: '-0.02em',
              }}
            >
              ArbiFlow
            </span>
          </Link>

          <Link
            href={AUTH_SIGNUP_HREF}
            style={{
              background: '#e4e4e7',
              color: '#09090b',
              fontWeight: 600,
              fontSize: '11px',
              padding: '8px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'all 0.2s',
              border: 'none',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            GET ACCESS
          </Link>
        </div>
      </nav>

      <section className="hero-section">
        <div className="container-main">
          <div className="hero-badge animate-fade-in">
            <span className="badge badge-live">LIVE MONITORING ACTIVE</span>
          </div>

          <h1 className="hero-title animate-fade-in animate-delay-1">
            Stop Guessing.
            <br />
            <span className="text-gradient">Start Arbitraging.</span>
          </h1>

          <p className="hero-subtitle animate-fade-in animate-delay-2">
            Real-time arbitrage detection across <strong>Polymarket</strong>, <strong>Opinion</strong>,{' '}
            <strong>Kalshi</strong>, <strong>Predict.fun</strong> and more.
            <br />
            Zero execution. Pure signals. Profit regardless of the outcome.
          </p>

          <div className="hero-actions animate-fade-in animate-delay-3">
            <Link href={AUTH_SIGNUP_HREF} className="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              Get Started Free
            </Link>
            <a
              href="https://t.me/+zWZEAjCoUjM0YTk5"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
              Join Telegram
            </a>
          </div>
        </div>
      </section>

      <MarketReplay />

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
                <div className="stat-value">{data.sources.platforms.length}</div>
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

      <section style={{ padding: '40px 0' }}>
        <div className="container-main">
          <div className="card card-glow">
            <div className="card-header">
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '4px' }}>Current Opportunities</h2>
                <p style={{ fontSize: '13px', color: '#71717a' }}>
                  Last updated: {data ? new Date(data.generatedAt).toLocaleTimeString() : '--'}
                </p>
              </div>
              {data && <div className={`badge ${data.plan === 'PRO' ? 'badge-pro' : 'badge-free'}`}>{data.plan}</div>}
            </div>

            <div className="table-container">
              {loading ? (
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      border: '3px solid #27272a',
                      borderTopColor: '#22c55e',
                      borderRadius: '50%',
                      animation: 'pulse 1s linear infinite',
                      margin: '0 auto 16px',
                    }}
                  />
                  <p style={{ color: '#71717a', fontSize: '14px' }}>Loading opportunities...</p>
                </div>
              ) : (
                <table className="table-main">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Pair</th>
                      <th>Outcome</th>
                      <th style={{ textAlign: 'right' }}>Source A</th>
                      <th style={{ textAlign: 'right' }}>Source B</th>
                      <th style={{ textAlign: 'right' }}>Edge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!data || data.opportunities.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '60px 20px' }}>
                          <p style={{ color: '#71717a', fontSize: '14px', margin: 0 }}>No opportunities in current range</p>
                        </td>
                      </tr>
                    ) : (
                      data.opportunities.map((op, i) => (
                        <tr key={`${op.eventKey}-${op.outcome}-${i}`}>
                          <td>
                            <span style={{ fontWeight: 500 }}>{op.eventKey}</span>
                          </td>
                          <td>
                            <span style={{ color: '#a1a1aa', fontSize: '13px' }}>
                              {getPlatformLabel(op.sourceA.platform)} / {getPlatformLabel(op.sourceB.platform)}
                            </span>
                          </td>
                          <td>
                            <span
                              style={{
                                color: '#a1a1aa',
                                fontSize: '13px',
                                fontFamily: "'JetBrains Mono', monospace",
                              }}
                            >
                              {op.outcome}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span className="font-mono" style={{ fontSize: '14px' }}>
                              {getPlatformLabel(op.sourceA.platform)} {op.sourceA.price.toFixed(3)}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span className="font-mono" style={{ fontSize: '14px' }}>
                              {getPlatformLabel(op.sourceB.platform)} {op.sourceB.price.toFixed(3)}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span className="badge-edge">+{op.percentEdge.toFixed(2)}%</span>
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

      <HowItWorksSection />
      <RealArbitragesSection />
      <CaptureNetworkSection />
      <EngineModulesSection />
      <GuaranteeSection />
      <FaqSection />
    </div>
  );
}
