import type { MarketQuote, Opportunity, Outcome, Platform } from './types';
import { dashboardPairs } from './venues';

function normalizeKey(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function indexByEventAndOutcome(quotes: MarketQuote[]) {
  const map = new Map<string, MarketQuote>();
  for (const q of quotes) {
    const key = `${normalizeKey(q.eventKey)}::${q.outcome}`;
    // keep latest quote if duplicated
    const prev = map.get(key);
    if (!prev || prev.updatedAt < q.updatedAt) map.set(key, q);
  }
  return map;
}

export function detectOpportunities(
  quotesByPlatform: Partial<Record<Platform, MarketQuote[]>>,
  minEdge = 0.05,
): Opportunity[] {
  const maps = new Map<Platform, Map<string, MarketQuote>>();
  const allEventKeys = new Set<string>();

  for (const pair of dashboardPairs) {
    const leftQuotes = quotesByPlatform[pair.left] ?? [];
    const rightQuotes = quotesByPlatform[pair.right] ?? [];

    if (!maps.has(pair.left)) maps.set(pair.left, indexByEventAndOutcome(leftQuotes));
    if (!maps.has(pair.right)) maps.set(pair.right, indexByEventAndOutcome(rightQuotes));

    for (const quote of leftQuotes) allEventKeys.add(normalizeKey(quote.eventKey));
    for (const quote of rightQuotes) allEventKeys.add(normalizeKey(quote.eventKey));
  }

  const results: Opportunity[] = [];
  const outcomes: Outcome[] = ['YES', 'NO'];

  for (const eventKey of allEventKeys) {
    for (const outcome of outcomes) {
      for (const pair of dashboardPairs) {
        const leftQuote = maps.get(pair.left)?.get(`${eventKey}::${outcome}`);
        const rightQuote = maps.get(pair.right)?.get(`${eventKey}::${outcome}`);
        if (!leftQuote || !rightQuote) continue;

        const edge = Math.abs(leftQuote.price - rightQuote.price);
        if (edge < minEdge) continue;

        results.push({
          eventKey,
          outcome,
          pairKey: pair.key,
          sourceA: leftQuote,
          sourceB: rightQuote,
          edge,
          percentEdge: Number((edge * 100).toFixed(2)),
          detectedAt: new Date().toISOString(),
        });
      }
    }
  }

  return results.sort((a, b) => b.edge - a.edge);
}
