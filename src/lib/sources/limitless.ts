import type { MarketQuote } from '../types';
import { genericMockQuote, normalizeBaseUrl, parseGenericMarkets } from './utils';

const mock: MarketQuote[] = [
  genericMockQuote('limitless', 'us-election-2028-winner', 'U.S. Election 2028 Winner', 0.414, 79000, 'lm_us_election_2028_yes'),
  genericMockQuote('limitless', 'fed-rate-cut-june', 'Fed Rate Cut June', 0.351, 71000, 'lm_fed_cut_june_yes'),
  genericMockQuote('limitless', 'btc-above-100k-year-end', 'BTC Above 100k By Year End', 0.532, 114000, 'lm_btc_100k_yes'),
];

export async function fetchLimitless(baseUrl?: string, apiKey?: string): Promise<MarketQuote[]> {
  const resolvedBaseUrl = normalizeBaseUrl(baseUrl);
  const resolvedApiKey = (apiKey ?? '').trim();

  if (!resolvedBaseUrl || !resolvedApiKey) return mock;

  try {
    const res = await fetch(`${resolvedBaseUrl}/markets`, {
      cache: 'no-store',
      headers: {
        'X-API-Key': resolvedApiKey,
        Accept: 'application/json',
      },
    });

    if (!res.ok) throw new Error(`limitless http ${res.status}`);
    const payload = await res.json();
    const parsed = parseGenericMarkets('limitless', payload);
    return parsed.length ? parsed : mock;
  } catch {
    return mock;
  }
}
