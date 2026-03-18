import { detectOpportunities } from '@/src/lib/arbitrage';
import { config } from '@/src/lib/config';
import { fetchAllQuotes } from '@/src/lib/sources';
import { getRecentOpportunities, getUserByEmail, saveOpportunities } from '@/src/lib/db';
import { getMinEdgeForPlan } from '@/src/lib/plans';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get('email');
  const planParam = url.searchParams.get('plan') as 'FREE' | 'PRO' | null;

  // Determine plan: from email lookup, or param, or default FREE
  let plan: 'FREE' | 'PRO' = 'FREE';
  if (email) {
    const user = getUserByEmail(email);
    if (user) plan = user.plan;
  } else if (planParam && (planParam === 'FREE' || planParam === 'PRO')) {
    plan = planParam;
  }

  const minEdge = getMinEdgeForPlan(plan);

  const { polymarket, kalshi } = await fetchAllQuotes();
  const opportunities = detectOpportunities(polymarket, kalshi, minEdge);

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
    plan,
    threshold: minEdge,
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
