import type { MarketQuote } from '../types';
import { genericMockQuote, normalizeBaseUrl, parseGenericMarkets } from './utils';

const mock: MarketQuote[] = [
  genericMockQuote('kalshi', 'us-election-2028-winner', 'U.S. Election 2028 Winner', 0.43, 132000, 'ka_us_election_2028_yes'),
  genericMockQuote('kalshi', 'fed-rate-cut-june', 'Fed Rate Cut June', 0.385, 75000, 'ka_fed_cut_june_yes'),
  genericMockQuote('kalshi', 'btc-above-100k-year-end', 'BTC Above 100k By Year End', 0.54, 155000, 'ka_btc_100k_yes'),
];

export async function fetchKalshi(baseUrl?: string): Promise<MarketQuote[]> {
  const resolvedBaseUrl = normalizeBaseUrl(baseUrl);
  if (!resolvedBaseUrl) return mock;

  try {
    const res = await fetch(`${resolvedBaseUrl}/markets`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`kalshi http ${res.status}`);
    const data = await res.json();
    const parsed = parseGenericMarkets('kalshi', data);

    return parsed.length ? parsed : mock;
  } catch {
    return mock;
  }
}
