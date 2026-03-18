import { detectOpportunities } from '@/src/lib/arbitrage';
import { config } from '@/src/lib/config';
import { fetchAllQuotes } from '@/src/lib/sources';
import { getRecentOpportunities, getUserByEmail, saveOpportunities } from '@/src/lib/db';
import { filterOpportunitiesForPlan, getEdgeWindowForPlan } from '@/src/lib/plans';

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

  const edgeWindow = getEdgeWindowForPlan(plan);

  const { polymarket, kalshi } = await fetchAllQuotes();
  const allPositive = detectOpportunities(polymarket, kalshi, 0);
  let opportunities = filterOpportunitiesForPlan(plan, allPositive);

  // UX fallback: avoid empty FREE dashboard when there are no edges <= 2%.
  // In this case, show up to 5% so the table keeps useful signal.
  let fallbackApplied = false;
  if (plan === 'FREE' && opportunities.length === 0) {
    opportunities = allPositive.filter((op) => op.edge <= 0.05);
    fallbackApplied = true;
  }

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
    edgeWindow,
    fallbackApplied,
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
