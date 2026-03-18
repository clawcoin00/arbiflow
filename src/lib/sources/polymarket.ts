import type { MarketQuote } from '../types';

const mock: MarketQuote[] = [
  {
    platform: 'polymarket',
    eventKey: 'us-election-2028-winner',
    marketKey: 'pm_us_election_2028_yes',
    title: 'US Election 2028 winner (YES)',
    outcome: 'YES',
    price: 0.42,
    volume24h: 125000,
    updatedAt: new Date().toISOString(),
    url: 'https://polymarket.com',
  },
  {
    platform: 'polymarket',
    eventKey: 'fed-rate-cut-june',
    marketKey: 'pm_fed_cut_june_yes',
    title: 'Fed cuts in June (YES)',
    outcome: 'YES',
    price: 0.37,
    volume24h: 98000,
    updatedAt: new Date().toISOString(),
    url: 'https://polymarket.com',
  },
  {
    platform: 'polymarket',
    eventKey: 'btc-above-100k-year-end',
    marketKey: 'pm_btc_100k_yes',
    title: 'BTC above 100k by year-end (YES)',
    outcome: 'YES',
    price: 0.48,
    volume24h: 210000,
    updatedAt: new Date().toISOString(),
    url: 'https://polymarket.com',
  },
];

export async function fetchPolymarket(baseUrl?: string): Promise<MarketQuote[]> {
  // MVP note: real API schema can vary. We attempt a generic endpoint and fallback to mock.
  if (!baseUrl) return mock;

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/markets`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`polymarket http ${res.status}`);
    const data = (await res.json()) as any[];

    const parsed = (Array.isArray(data) ? data : []).flatMap((m) => {
      if (!m) return [] as MarketQuote[];
      const eventKey = String(m.eventKey || m.slug || m.title || 'unknown-event');
      const title = String(m.title || eventKey);
      const yesPrice = Number(m.yesPrice ?? m.priceYes ?? m.yes ?? m.price ?? NaN);
      if (!Number.isFinite(yesPrice)) return [] as MarketQuote[];
      return [
        {
          platform: 'polymarket' as const,
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
