import { detectOpportunities } from '@/src/lib/arbitrage';
import { config } from '@/src/lib/config';
import { fetchAllQuotes } from '@/src/lib/sources';

export async function GET() {
  const { polymarket, kalshi } = await fetchAllQuotes();
  const opportunities = detectOpportunities(polymarket, kalshi, config.alertEdgeMin);

  return Response.json({
    ok: true,
    threshold: config.alertEdgeMin,
    sources: {
      polymarketCount: polymarket.length,
      kalshiCount: kalshi.length,
      usingMock: !config.sources.polymarketApiBase || !config.sources.kalshiApiBase,
    },
    opportunities,
    generatedAt: new Date().toISOString(),
  });
}
