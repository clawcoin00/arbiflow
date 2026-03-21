import type { MarketQuote } from '../types';
import { genericMockQuote, normalizeBaseUrl, parseGenericMarkets } from './utils';

const mock: MarketQuote[] = [
  genericMockQuote('probo', 'us-election-2028-winner', 'U.S. Election 2028 Winner', 0.401, 64000, 'pb_us_election_2028_yes'),
  genericMockQuote('probo', 'fed-rate-cut-june', 'Fed Rate Cut June', 0.362, 52000, 'pb_fed_cut_june_yes'),
  genericMockQuote('probo', 'btc-above-100k-year-end', 'BTC Above 100k By Year End', 0.505, 88000, 'pb_btc_100k_yes'),
];

export async function fetchProbo(baseUrl?: string): Promise<MarketQuote[]> {
  const resolvedBaseUrl = normalizeBaseUrl(baseUrl);
  if (!resolvedBaseUrl) return mock;

  try {
    const res = await fetch(`${resolvedBaseUrl}/markets`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) throw new Error(`probo http ${res.status}`);
    const payload = await res.json();
    const parsed = parseGenericMarkets('probo', payload);
    return parsed.length ? parsed : mock;
  } catch {
    return mock;
  }
}
