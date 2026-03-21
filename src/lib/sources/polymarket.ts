import type { MarketQuote } from '../types';
import { genericMockQuote, normalizeBaseUrl, parseGenericMarkets } from './utils';

const mock: MarketQuote[] = [
  genericMockQuote('polymarket', 'us-election-2028-winner', 'U.S. Election 2028 Winner', 0.42, 125000, 'pm_us_election_2028_yes'),
  genericMockQuote('polymarket', 'fed-rate-cut-june', 'Fed Rate Cut June', 0.37, 98000, 'pm_fed_cut_june_yes'),
  genericMockQuote('polymarket', 'btc-above-100k-year-end', 'BTC Above 100k By Year End', 0.48, 210000, 'pm_btc_100k_yes'),
];

export async function fetchPolymarket(baseUrl?: string): Promise<MarketQuote[]> {
  const resolvedBaseUrl = normalizeBaseUrl(baseUrl);
  if (!resolvedBaseUrl) return mock;

  try {
    const res = await fetch(`${resolvedBaseUrl}/markets`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`polymarket http ${res.status}`);
    const data = await res.json();
    const parsed = parseGenericMarkets('polymarket', data);

    return parsed.length ? parsed : mock;
  } catch {
    return mock;
  }
}
