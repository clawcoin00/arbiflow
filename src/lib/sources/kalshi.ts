import type { MarketQuote } from '../types';

const mock: MarketQuote[] = [
  {
    platform: 'kalshi',
    eventKey: 'us-election-2028-winner',
    marketKey: 'ka_us_election_2028_yes',
    title: 'US Election 2028 winner (YES)',
    outcome: 'YES',
    price: 0.49,
    volume24h: 132000,
    updatedAt: new Date().toISOString(),
    url: 'https://kalshi.com',
  },
  {
    platform: 'kalshi',
    eventKey: 'fed-rate-cut-june',
    marketKey: 'ka_fed_cut_june_yes',
    title: 'Fed cuts in June (YES)',
    outcome: 'YES',
    price: 0.31,
    volume24h: 75000,
    updatedAt: new Date().toISOString(),
    url: 'https://kalshi.com',
  },
  {
    platform: 'kalshi',
    eventKey: 'btc-above-100k-year-end',
    marketKey: 'ka_btc_100k_yes',
    title: 'BTC above 100k by year-end (YES)',
    outcome: 'YES',
    price: 0.54,
    volume24h: 155000,
    updatedAt: new Date().toISOString(),
    url: 'https://kalshi.com',
  },
];

export async function fetchKalshi(baseUrl?: string): Promise<MarketQuote[]> {
  // MVP note: real API schema can vary. We attempt a generic endpoint and fallback to mock.
  if (!baseUrl) return mock;

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/markets`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`kalshi http ${res.status}`);
    const data = (await res.json()) as any[];

    const parsed = (Array.isArray(data) ? data : []).flatMap((m) => {
      if (!m) return [] as MarketQuote[];
      const eventKey = String(m.eventKey || m.ticker || m.title || 'unknown-event');
      const title = String(m.title || eventKey);
      const yesPrice = Number(m.yesPrice ?? m.priceYes ?? m.yes ?? m.price ?? NaN);
      if (!Number.isFinite(yesPrice)) return [] as MarketQuote[];

      return [
        {
          platform: 'kalshi' as const,
          eventKey,
          marketKey: String(m.id ?? `${eventKey}-yes`),
          title,
          outcome: 'YES' as const,
          price: Math.max(0, Math.min(1, yesPrice)),
          volume24h: Number(m.volume24h ?? m.volume ?? 0),
          updatedAt: new Date().toISOString(),
          url: m.url,
        },
      ];
    });

    return parsed.length ? parsed : mock;
  } catch {
    return mock;
  }
}
