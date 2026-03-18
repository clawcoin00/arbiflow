import { detectOpportunities } from '@/src/lib/arbitrage';
import { config } from '@/src/lib/config';
import { fetchAllQuotes } from '@/src/lib/sources';
import { getRecentOpportunities, saveOpportunities } from '@/src/lib/db';

export async function GET() {
  const { polymarket, kalshi } = await fetchAllQuotes();
  const opportunities = detectOpportunities(polymarket, kalshi, config.alertEdgeMin);

  // Store latest detection snapshots (MVP persistence).
  saveOpportunities(
    opportunities.slice(0, 50).map((op) => ({
      eventKey: op.eventKey,
      outcome: op.outcome,
      edge: op.edge,
      percentEdge: op.percentEdge,
      sourceA: 'polymarket',
      sourceB: 'kalshi',
      payload: JSON.stringify(op),
    })),
  );

  const recent = getRecentOpportunities(100);

  return Response.json({
    ok: true,
    threshold: config.alertEdgeMin,
    sources: {
      polymarketCount: polymarket.length,
      kalshiCount: kalshi.length,
      usingMock: !config.sources.polymarketApiBase || !config.sources.kalshiApiBase,
    },
    opportunities,
    recent,
    generatedAt: new Date().toISOString(),
  });
}
