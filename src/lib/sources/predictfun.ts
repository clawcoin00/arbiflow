import type { MarketQuote } from '../types';
import { getPlatformWebsite } from '../venues';
import { clampPrice, genericMockQuote, normalizeBaseUrl, toIsoTimestamp } from './utils';

const mock: MarketQuote[] = [
  genericMockQuote('predictfun', 'us-election-2028-winner', 'U.S. Election 2028 Winner', 0.447, 87000, 'pf_us_election_2028_yes'),
  genericMockQuote('predictfun', 'fed-rate-cut-june', 'Fed Rate Cut June', 0.392, 68000, 'pf_fed_cut_june_yes'),
  genericMockQuote('predictfun', 'btc-above-100k-year-end', 'BTC Above 100k By Year End', 0.471, 99000, 'pf_btc_100k_yes'),
];

export async function fetchPredictFun(baseUrl?: string, apiKey?: string): Promise<MarketQuote[]> {
  const resolvedBaseUrl = normalizeBaseUrl(baseUrl);
  const resolvedApiKey = (apiKey ?? '').trim();
  const requiresApiKey = Boolean(resolvedBaseUrl && !resolvedBaseUrl.includes('api-testnet.predict.fun'));

  if (!resolvedBaseUrl || (requiresApiKey && !resolvedApiKey)) return mock;

  try {
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };

    if (resolvedApiKey) {
      headers['x-api-key'] = resolvedApiKey;
    }

    const marketsResponse = await fetch(`${resolvedBaseUrl}/markets?first=8&status=REGISTERED`, {
      headers,
      cache: 'no-store',
    });
    if (!marketsResponse.ok) throw new Error(`predictfun http ${marketsResponse.status}`);

    const marketsPayload = (await marketsResponse.json()) as {
      data?: Array<Record<string, unknown>>;
    };
    const markets = Array.isArray(marketsPayload.data) ? marketsPayload.data : [];

    const pricedMarkets = await Promise.all(
      markets.map(async (market) => {
        const marketId = String(market.id ?? '');
        if (!marketId) return null;

        const lastSaleResponse = await fetch(`${resolvedBaseUrl}/markets/${encodeURIComponent(marketId)}/last-sale`, {
          headers,
          cache: 'no-store',
        });
        if (!lastSaleResponse.ok) return null;

        const lastSalePayload = (await lastSaleResponse.json()) as {
          data?: { outcome?: string; priceInCurrency?: string | number };
        };
        const outcome = String(lastSalePayload.data?.outcome ?? 'Yes').toUpperCase();
        const rawPrice = Number(lastSalePayload.data?.priceInCurrency ?? Number.NaN);
        if (!Number.isFinite(rawPrice)) return null;

        const yesPrice = outcome === 'NO' ? 1 - rawPrice : rawPrice;
        const title = String(market.question ?? market.title ?? 'Predict.fun market');
        const polymarketConditionId = Array.isArray(market.polymarketConditionIds)
          ? String(market.polymarketConditionIds[0] ?? '')
          : '';
        const primaryEventKey =
          typeof market.conditionId === 'string' && market.conditionId ? market.conditionId : polymarketConditionId || title;
        const eventKey = String(primaryEventKey);

        return {
          platform: 'predictfun' as const,
          eventKey,
          marketKey: marketId,
          title,
          outcome: 'YES' as const,
          price: clampPrice(yesPrice),
          volume24h: Number(market.volume24hUsd ?? market.volumeTotalUsd ?? 0),
          updatedAt: toIsoTimestamp(market.createdAt),
          url: `${getPlatformWebsite('predictfun')}/markets/${marketId}`,
        } satisfies MarketQuote;
      }),
    );

    const parsed = pricedMarkets.filter(Boolean) as MarketQuote[];
    return parsed.length ? parsed : mock;
  } catch {
    return mock;
  }
}
