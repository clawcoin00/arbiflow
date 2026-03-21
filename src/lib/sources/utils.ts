import type { MarketQuote, Platform } from '../types';
import { getPlatformWebsite } from '../venues';

export function normalizeBaseUrl(baseUrl?: string) {
  return (baseUrl ?? '').trim().replace(/\/$/, '');
}

export function clampPrice(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function extractArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.data)) return record.data;
    if (record.result && typeof record.result === 'object') {
      const nested = record.result as Record<string, unknown>;
      if (Array.isArray(nested.list)) return nested.list;
      if (Array.isArray(nested.data)) return nested.data;
    }
    if (Array.isArray(record.markets)) return record.markets;
  }
  return [];
}

export function toIsoTimestamp(timestamp: unknown) {
  if (typeof timestamp === 'number' && Number.isFinite(timestamp)) {
    const ms = timestamp > 1_000_000_000_000 ? timestamp : timestamp * 1000;
    return new Date(ms).toISOString();
  }

  if (typeof timestamp === 'string' && timestamp.trim()) {
    const parsed = new Date(timestamp);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }

  return new Date().toISOString();
}

export function genericMockQuote(
  platform: Platform,
  eventKey: string,
  title: string,
  price: number,
  volume24h: number,
  marketKey: string,
): MarketQuote {
  return {
    platform,
    eventKey,
    marketKey,
    title,
    outcome: 'YES',
    price,
    volume24h,
    updatedAt: new Date().toISOString(),
    url: getPlatformWebsite(platform),
  };
}

export function parseGenericMarkets(platform: Platform, payload: unknown): MarketQuote[] {
  const items = extractArray(payload);

  return items.flatMap((item) => {
    if (!item || typeof item !== 'object') return [] as MarketQuote[];

    const market = item as Record<string, unknown>;
    const title = String(market.title ?? market.question ?? market.marketTitle ?? market.slug ?? 'unknown-market');
    const eventKey = String(
      market.eventKey ?? market.slug ?? market.conditionId ?? market.marketSlug ?? market.oracleQuestionId ?? title,
    );
    const marketKey = String(market.id ?? market.marketId ?? market.slug ?? `${eventKey}-yes`);
    const rawPrice = Number(
      market.yesPrice ??
        market.priceYes ??
        market.lastPriceYes ??
        market.probability ??
        market.price ??
        (market.prices && typeof market.prices === 'object' ? (market.prices as Record<string, unknown>).yes : NaN),
    );

    if (!Number.isFinite(rawPrice)) return [] as MarketQuote[];

    return [
      {
        platform,
        eventKey,
        marketKey,
        title,
        outcome: 'YES',
        price: clampPrice(rawPrice),
        volume24h: Number(market.volume24h ?? market.volume24hUsd ?? market.volume ?? market.volumeTotalUsd ?? 0),
        updatedAt: toIsoTimestamp(market.updatedAt ?? market.createdAt),
        url: typeof market.url === 'string' ? market.url : getPlatformWebsite(platform),
      },
    ];
  });
}
