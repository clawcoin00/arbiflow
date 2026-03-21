import type { MarketQuote } from '../types';
import { getPlatformWebsite } from '../venues';
import { clampPrice, genericMockQuote, normalizeBaseUrl, toIsoTimestamp } from './utils';

const mock: MarketQuote[] = [
  genericMockQuote('opinion', 'us-election-2028-winner', 'U.S. Election 2028 Winner', 0.438, 92000, 'op_us_election_2028_yes'),
  genericMockQuote('opinion', 'fed-rate-cut-june', 'Fed Rate Cut June', 0.345, 81000, 'op_fed_cut_june_yes'),
  genericMockQuote('opinion', 'btc-above-100k-year-end', 'BTC Above 100k By Year End', 0.515, 104000, 'op_btc_100k_yes'),
];

export async function fetchOpinion(baseUrl?: string, apiKey?: string): Promise<MarketQuote[]> {
  const resolvedBaseUrl = normalizeBaseUrl(baseUrl);
  const resolvedApiKey = (apiKey ?? '').trim();

  if (!resolvedBaseUrl || !resolvedApiKey) return mock;

  try {
    const headers = {
      apikey: resolvedApiKey,
      Accept: 'application/json',
    };
    const listResponse = await fetch(
      `${resolvedBaseUrl}/market?page=1&limit=8&status=activated&marketType=0&sortBy=5`,
      { headers, cache: 'no-store' },
    );

    if (!listResponse.ok) throw new Error(`opinion http ${listResponse.status}`);

    const listPayload = (await listResponse.json()) as {
      result?: { list?: Array<Record<string, unknown>> };
    };
    const markets = Array.isArray(listPayload.result?.list) ? listPayload.result.list : [];

    const pricedMarkets = await Promise.all(
      markets.map(async (market) => {
        const tokenId = String(market.yesTokenId ?? '');
        if (!tokenId) return null;

        const priceResponse = await fetch(`${resolvedBaseUrl}/token/latest-price?token_id=${encodeURIComponent(tokenId)}`, {
          headers,
          cache: 'no-store',
        });

        if (!priceResponse.ok) return null;

        const pricePayload = (await priceResponse.json()) as {
          result?: { price?: string | number; timestamp?: number | string };
        };
        const rawPrice = Number(pricePayload.result?.price ?? Number.NaN);
        if (!Number.isFinite(rawPrice)) return null;

        const title = String(market.marketTitle ?? market.title ?? 'Opinion market');
        const eventKey = String(market.slug ?? title);
        const marketId = String(market.marketId ?? tokenId);

        return {
          platform: 'opinion' as const,
          eventKey,
          marketKey: marketId,
          title,
          outcome: 'YES' as const,
          price: clampPrice(rawPrice),
          volume24h: Number(market.volume24h ?? market.volume ?? 0),
          updatedAt: toIsoTimestamp(pricePayload.result?.timestamp ?? market.updatedAt ?? market.createdAt),
          url:
            typeof market.slug === 'string' && market.slug
              ? `${getPlatformWebsite('opinion')}/market/${market.slug}`
              : getPlatformWebsite('opinion'),
        } satisfies MarketQuote;
      }),
    );

    const parsed = pricedMarkets.filter(Boolean) as MarketQuote[];
    return parsed.length ? parsed : mock;
  } catch {
    return mock;
  }
}
