"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startTransition, useEffect, useState } from 'react';
import { BrandLogo } from '@/src/components/BrandLogo';
import { AUTH_LOGIN_HREF, USER_EMAIL_STORAGE_KEY } from '@/src/lib/routes';
import { getSupabaseBrowserClient } from '@/src/lib/supabase/client';
import { isSupabaseConfigured } from '@/src/lib/supabase/env';
import type { Platform } from '@/src/lib/types';
import { dashboardPairs, getPairMeta, getPlatformLabel, platformMeta } from '@/src/lib/venues';

type Quote = {
  platform: Platform;
  price: number;
  url?: string;
};

type Opportunity = {
  eventKey: string;
  outcome: 'YES' | 'NO';
  pairKey: string;
  sourceA: Quote;
  sourceB: Quote;
  edge: number;
  percentEdge: number;
};

type DashboardResponse = {
  plan: 'FREE' | 'PRO';
  edgeWindow: { minEdge: number; maxEdge?: number };
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
      left: Platform;
      right: Platform;
      count: number;
    }>;
    usingMock: boolean;
  };
  generatedAt: string;
};

type DashboardUser = {
  email: string;
  plan: 'FREE' | 'PRO';
};

type SortMode = 'SPREAD' | 'PROFIT' | 'VOL' | 'END DATE' | 'FAV';

type DashboardClientProps = {
  initialAuth: DashboardUser | null;
};

const resourceLinks = [
  { label: 'Positions', href: '', disabled: true },
  { label: 'Strategy Guide', href: '/pricing', disabled: false },
  { label: 'Telegram Bot', href: 'https://t.me/+zWZEAjCoUjM0YTk5', disabled: false, external: true },
  { label: 'Discord', href: '', disabled: true },
];

function hashString(input: string) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) % 2147483647;
  }
  return Math.abs(hash);
}

function humanizeSlug(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => {
      const upper = part.toUpperCase();
      if (upper === 'US') return 'U.S.';
      if (upper === 'FDV') return 'FDV';
      if (/^\d+$/.test(part)) return part;
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(' ');
}

function deriveOpportunity(opportunity: Opportunity, index: number) {
  const hash = hashString(`${opportunity.pairKey}-${opportunity.eventKey}-${opportunity.outcome}-${index}`);
  const title = humanizeSlug(opportunity.eventKey);
  const daysLeft = 22 + (hash % 340);
  const volumeValue = 2.6 + ((hash % 1200) / 100);
  const evBase = 84500 + (hash % 18000);
  const estimatedMaxEv = opportunity.edge * evBase;
  const spreadFill = Math.min(100, Math.max(12, opportunity.percentEdge * 18));
  const dominantSource = opportunity.sourceA.price >= opportunity.sourceB.price ? opportunity.sourceA : opportunity.sourceB;
  const pair = getPairMeta(opportunity.pairKey);
  const outcomeTone = opportunity.outcome === 'YES' ? 'dashboard-pill-yes' : 'dashboard-pill-no';
  const avatarLabel = title
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const avatarTone = ['emerald', 'blue', 'amber', 'slate'][hash % 4];

  return {
    ...opportunity,
    title,
    daysLeft,
    volumeValue,
    volumeLabel: `$${volumeValue.toFixed(2)}M`,
    estimatedMaxEv,
    spreadFill,
    dominantLabel: getPlatformLabel(dominantSource.platform).toUpperCase(),
    pairLabel: pair?.label ?? `${getPlatformLabel(opportunity.sourceA.platform)} / ${getPlatformLabel(opportunity.sourceB.platform)}`,
    pairNavLabel:
      pair?.navLabel ??
      `${getPlatformLabel(opportunity.sourceA.platform)} ↔ ${getPlatformLabel(opportunity.sourceB.platform)}`,
    pairAccentClass: pair?.accentClass ?? platformMeta[opportunity.sourceB.platform].accentClass,
    pairIconGlyph: pair?.iconGlyph ?? platformMeta[opportunity.sourceB.platform].iconGlyph,
    outcomeTone,
    avatarLabel,
    avatarTone,
    marketLine: `${opportunity.outcome} ${title} / ${getPlatformLabel(opportunity.sourceA.platform)} vs ${getPlatformLabel(
      opportunity.sourceB.platform,
    )}`,
    tickerSpread: `+${opportunity.percentEdge.toFixed(2)}%`,
    tickerEv: `+$${estimatedMaxEv.toFixed(2)}`,
    sourceALabel: getPlatformLabel(opportunity.sourceA.platform),
    sourceBLabel: getPlatformLabel(opportunity.sourceB.platform),
  };
}

function formatMoney(value: number) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatPrice(value: number) {
  return value.toFixed(3);
}

async function resolveSupabaseEmail() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.email?.trim().toLowerCase() || null;
}

function resolveDefaultPairKey(data: DashboardResponse | null) {
  const withSignal = data?.sources.pairs.find((pair) => pair.count > 0)?.pairKey;
  return withSignal ?? dashboardPairs[1]?.key ?? dashboardPairs[0].key;
}

export default function DashboardClient({ initialAuth }: DashboardClientProps) {
  const router = useRouter();
  const [email, setEmail] = useState(initialAuth?.email ?? '');
  const [user, setUser] = useState<DashboardUser | null>(initialAuth);
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('PROFIT');
  const [activePairKey, setActivePairKey] = useState(resolveDefaultPairKey(null));

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      let resolvedEmail = initialAuth?.email?.trim().toLowerCase() || '';

      if (!resolvedEmail && isSupabaseConfigured()) {
        resolvedEmail = (await resolveSupabaseEmail()) || '';
      }

      if (!resolvedEmail && typeof window !== 'undefined') {
        resolvedEmail = window.localStorage.getItem(USER_EMAIL_STORAGE_KEY)?.trim().toLowerCase() || '';
      }

      if (!resolvedEmail) {
        startTransition(() => {
          router.replace(AUTH_LOGIN_HREF);
        });
        return;
      }

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(USER_EMAIL_STORAGE_KEY, resolvedEmail);
      }

      setEmail(resolvedEmail);
      setLoading(true);
      setError('');

      try {
        let resolvedUser = initialAuth;

        if (!resolvedUser) {
          const userResponse = await fetch(`/api/auth/me?email=${encodeURIComponent(resolvedEmail)}`);
          const userPayload = await userResponse.json();

          if (!userResponse.ok || !userPayload.user) {
            throw new Error('account_not_found');
          }

          resolvedUser = userPayload.user;
        }

        const dataResponse = await fetch(`/api/opportunities?email=${encodeURIComponent(resolvedEmail)}`);
        const dataPayload = await dataResponse.json();
        if (!dataResponse.ok || !dataPayload.ok) {
          throw new Error('opportunities_failed');
        }

        if (cancelled) return;

        setUser(resolvedUser);
        setData(dataPayload);
      } catch (caughtError) {
        if (cancelled) return;

        const message = caughtError instanceof Error ? caughtError.message : 'dashboard_failed';
        if (message === 'account_not_found') {
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem(USER_EMAIL_STORAGE_KEY);
          }
          startTransition(() => {
            router.replace(AUTH_LOGIN_HREF);
          });
          return;
        }

        setError('Unable to load opportunities right now.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [initialAuth, router]);

  useEffect(() => {
    if (!data?.sources.pairs.length) return;

    const currentPair = data.sources.pairs.find((pair) => pair.pairKey === activePairKey);
    if (!currentPair || (currentPair.count === 0 && data.sources.pairs.some((pair) => pair.count > 0))) {
      setActivePairKey(resolveDefaultPairKey(data));
    }
  }, [activePairKey, data]);

  const pairSummaries = data?.sources.pairs ?? dashboardPairs.map((pair) => ({
    pairKey: pair.key,
    label: pair.label,
    navLabel: pair.navLabel,
    left: pair.left,
    right: pair.right,
    count: 0,
  }));
  const activePairSummary =
    pairSummaries.find((pair) => pair.pairKey === activePairKey) ??
    pairSummaries.find((pair) => pair.count > 0) ??
    pairSummaries[0];

  const enriched = (data?.opportunities ?? []).map(deriveOpportunity);
  const scopedByPair = activePairSummary ? enriched.filter((item) => item.pairKey === activePairSummary.pairKey) : enriched;
  const filtered = scopedByPair.filter((item) => {
    const haystack = `${item.title} ${item.marketLine} ${item.outcome} ${item.pairLabel}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  const sorted = [...filtered].sort((left, right) => {
    if (sortMode === 'SPREAD') return right.percentEdge - left.percentEdge;
    if (sortMode === 'PROFIT') return right.estimatedMaxEv - left.estimatedMaxEv;
    if (sortMode === 'VOL') return right.volumeValue - left.volumeValue;
    if (sortMode === 'END DATE') return left.daysLeft - right.daysLeft;
    return left.title.localeCompare(right.title);
  });

  const tickerSource = sorted.length > 0 ? sorted : scopedByPair.length > 0 ? scopedByPair : enriched;
  const tickerItems = tickerSource.slice(0, 6);
  const resolvedPlan = user?.plan ?? data?.plan ?? null;
  const isFreePlan = resolvedPlan === 'FREE';

  const onLogout = async () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(USER_EMAIL_STORAGE_KEY);
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    }

    startTransition(() => {
      router.replace(AUTH_LOGIN_HREF);
    });
  };

  return (
    <main className="dashboard-page">
      <aside className="dashboard-sidebar">
        <Link href="/" className="dashboard-sidebar-logo">
          <BrandLogo variant="mark" height={36} alt="ArbsFlow mark" />
          <span className="dashboard-sidebar-logo-copy">
            <strong>ARBSFLOW</strong>
            <span>Real-Time Arbitrage</span>
          </span>
        </Link>

        <div className="dashboard-sidebar-section">
          <span className="dashboard-sidebar-label">Arbitrage</span>
          <nav className="dashboard-sidebar-list" aria-label="Arbitrage pairs">
            {pairSummaries.map((pair) => {
              const meta = getPairMeta(pair.pairKey);
              const isActive = activePairSummary?.pairKey === pair.pairKey;
              const hasSignal = pair.count > 0;

              return (
                <button
                  key={pair.pairKey}
                  type="button"
                  className={`dashboard-sidebar-link${isActive ? ' is-active' : ''}${!hasSignal ? ' is-dimmed' : ''}`}
                  onClick={() => setActivePairKey(pair.pairKey)}
                >
                  <span className={`dashboard-sidebar-link-icon ${meta?.accentClass ?? ''}`}>
                    {meta?.iconGlyph ?? platformMeta[pair.right].iconGlyph}
                  </span>
                  <span className="dashboard-sidebar-link-copy">
                    <strong>{pair.navLabel}</strong>
                    <span>{hasSignal ? `${pair.count} opportunities live` : 'Waiting for price overlap'}</span>
                  </span>
                  <span className="dashboard-sidebar-link-count">{pair.count}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="dashboard-sidebar-section">
          <span className="dashboard-sidebar-label">Resources</span>
          <div className="dashboard-sidebar-list">
            {resourceLinks.map((item) =>
              item.disabled ? (
                <span key={item.label} className="dashboard-sidebar-resource" data-disabled="true">
                  {item.label}
                </span>
              ) : item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="dashboard-sidebar-resource"
                >
                  {item.label}
                </a>
              ) : (
                <Link key={item.label} href={item.href} className="dashboard-sidebar-resource">
                  {item.label}
                </Link>
              ),
            )}
          </div>
        </div>

        <button type="button" className="dashboard-sidebar-logout" onClick={onLogout}>
          Log Out
        </button>
      </aside>

      <div className="dashboard-shell">
        <header className="dashboard-ticker">
          <div className="dashboard-brand">
            <BrandLogo variant="mark" height={28} alt="ArbsFlow mark" />
            <strong>ARBSFLOW</strong>
          </div>

          <div className="dashboard-ticker-strip">
            <div className="dashboard-ticker-track">
              {[...tickerItems, ...tickerItems].map((item, index) => (
                <div key={`${item.pairKey}-${item.eventKey}-${item.outcome}-${index}`} className="dashboard-ticker-item">
                  <span className="dashboard-ticker-status">SYSTEM_ONLINE</span>
                  <span className="dashboard-ticker-market">{item.title}</span>
                  <strong>{item.tickerSpread} spread</strong>
                  <b>{item.tickerEv} EV</b>
                  <span>{item.pairLabel}</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        <section className="dashboard-toolbar">
          <div className="dashboard-toolbar-left">
            <div className="dashboard-view-switch">
              <button type="button" className="is-active" aria-label="List view">
                LIST
              </button>
              <button type="button" aria-label="Grid view">
                GRID
              </button>
            </div>

            <div className="dashboard-filter-tabs">
              {(['SPREAD', 'PROFIT', 'VOL', 'END DATE', 'FAV'] as SortMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={sortMode === mode ? 'is-active' : ''}
                  onClick={() => setSortMode(mode)}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <label className="dashboard-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              placeholder="Search markets..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </section>

        <section className="dashboard-board">
          <div className="dashboard-board-head">
            <div>
              <h1>Best Arbitrage Opportunities</h1>
              <p>
                {loading
                  ? 'Syncing latest spreads...'
                  : `${activePairSummary?.navLabel ?? 'All pairs'} • ${sorted.length} opportunities for ${user?.email ?? email}`}
              </p>
            </div>

            <div className="dashboard-board-summary">
              <div className={`dashboard-summary-card dashboard-summary-card-plan${isFreePlan ? ' is-free' : ''}`}>
                <span>PLAN</span>
                <strong>{resolvedPlan ?? '--'}</strong>
                {isFreePlan ? (
                  <Link href="/pricing" className="dashboard-upgrade-button">
                    Upgrade Plan
                  </Link>
                ) : resolvedPlan === 'PRO' ? (
                  <span className="dashboard-plan-status">Pro Active</span>
                ) : null}
              </div>
              <div className="dashboard-summary-card">
                <span>TOP EV</span>
                <strong>{sorted[0] ? `$${formatMoney(sorted[0].estimatedMaxEv)}` : '--'}</strong>
              </div>
              <div className="dashboard-summary-card">
                <span>LIVE VENUES</span>
                <strong>{data?.sources.platforms.filter((platform) => !platform.usingMock).length ?? 0}</strong>
              </div>
            </div>
          </div>

          <div className="dashboard-list">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <article key={`dashboard-skeleton-${index}`} className="dashboard-row dashboard-row-skeleton" />
              ))
            ) : error ? (
              <div className="dashboard-empty">
                <strong>Dashboard unavailable</strong>
                <p>{error}</p>
              </div>
            ) : sorted.length === 0 ? (
              <div className="dashboard-empty">
                <strong>No matches found</strong>
                <p>Try another pair or wait for the next cross-market dislocation.</p>
              </div>
            ) : (
              sorted.map((item, index) => (
                <article key={`${item.pairKey}-${item.eventKey}-${item.outcome}-${index}`} className="dashboard-row">
                  <div className="dashboard-row-main">
                    <div className={`dashboard-row-avatar dashboard-row-avatar-${item.avatarTone}`}>
                      <span>{item.avatarLabel}</span>
                    </div>

                    <div className="dashboard-row-copy">
                      <div className="dashboard-row-title">
                        <span className={`dashboard-outcome-pill ${item.outcomeTone}`}>{item.outcome}</span>
                        <h2>{item.title}</h2>
                      </div>

                      <p>{item.marketLine}</p>

                      <div className="dashboard-row-meta">
                        <span>Ends in {item.daysLeft} days</span>
                        <span>Volume: {item.volumeLabel}</span>
                        <span>{item.pairLabel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="dashboard-row-prices">
                    <div>
                      <span>{item.sourceALabel}</span>
                      <strong>{formatPrice(item.sourceA.price)}</strong>
                    </div>
                    <div>
                      <span>{item.sourceBLabel}</span>
                      <strong>{formatPrice(item.sourceB.price)}</strong>
                    </div>
                  </div>

                  <div className="dashboard-row-metrics">
                    <div className="dashboard-spread-panel">
                      <div className="dashboard-spread-head">
                        <span>SPREAD</span>
                        <strong>+{item.percentEdge.toFixed(2)}%</strong>
                      </div>
                      <div className="dashboard-spread-track">
                        <span style={{ width: `${item.spreadFill}%` }} />
                      </div>
                    </div>

                    <div className="dashboard-ev-panel">
                      <span>EST. MAX EV</span>
                      <strong>+${formatMoney(item.estimatedMaxEv)}</strong>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
