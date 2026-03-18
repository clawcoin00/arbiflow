import type { MarketQuote, Opportunity, Outcome } from './types';

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
  polymarketQuotes: MarketQuote[],
  kalshiQuotes: MarketQuote[],
  minEdge = 0.05,
): Opportunity[] {
  const pMap = indexByEventAndOutcome(polymarketQuotes);
  const kMap = indexByEventAndOutcome(kalshiQuotes);

  const results: Opportunity[] = [];
  const outcomes: Outcome[] = ['YES', 'NO'];

  const allEventKeys = new Set<string>();
  for (const q of polymarketQuotes) allEventKeys.add(normalizeKey(q.eventKey));
  for (const q of kalshiQuotes) allEventKeys.add(normalizeKey(q.eventKey));

  for (const eventKey of allEventKeys) {
    for (const outcome of outcomes) {
      const p = pMap.get(`${eventKey}::${outcome}`);
      const k = kMap.get(`${eventKey}::${outcome}`);
      if (!p || !k) continue;

      const edge = Math.abs(p.price - k.price);
      if (edge < minEdge) continue;

      results.push({
        eventKey,
        outcome,
        polymarket: p,
        kalshi: k,
        edge,
        percentEdge: Number((edge * 100).toFixed(2)),
        detectedAt: new Date().toISOString(),
      });
    }
  }

  return results.sort((a, b) => b.edge - a.edge);
}
