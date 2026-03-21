import { detectOpportunities } from '@/src/lib/arbitrage';
import { config } from '@/src/lib/config';
import { fetchAllQuotes } from '@/src/lib/sources';
import { getCurrentAppUser, getAppUserByEmail } from '@/src/lib/app-users';
import { getRecentOpportunities, saveOpportunities } from '@/src/lib/db';
import { filterOpportunitiesForPlan, getEdgeWindowForPlan } from '@/src/lib/plans';
import { dashboardPairs, getPlatformLabel } from '@/src/lib/venues';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get('email');
  const planParam = url.searchParams.get('plan') as 'FREE' | 'PRO' | null;

  // Determine plan: from email lookup, or param, or default FREE
  let plan: 'FREE' | 'PRO' = 'FREE';
  if (email) {
    const user = await getAppUserByEmail(email);
    if (user) plan = user.plan;
  } else if (planParam && (planParam === 'FREE' || planParam === 'PRO')) {
    plan = planParam;
  } else {
    const currentUser = await getCurrentAppUser();
    if (currentUser) plan = currentUser.plan;
  }

  const edgeWindow = getEdgeWindowForPlan(plan);

  const quotesByPlatform = await fetchAllQuotes();
  const allPositive = detectOpportunities(quotesByPlatform, 0);
  let opportunities = filterOpportunitiesForPlan(plan, allPositive);

  // UX fallback: avoid empty FREE dashboard when there are no edges <= 2%.
  // In this case, show up to 5% so the table keeps useful signal.
  let fallbackApplied = false;
  if (plan === 'FREE' && opportunities.length === 0) {
    opportunities = allPositive.filter((op) => op.edge <= 0.05);
    fallbackApplied = true;
  }

  // Store latest detection snapshots (best-effort on serverless envs).
  let recent: ReturnType<typeof getRecentOpportunities> = [];
  try {
    saveOpportunities(
      opportunities.slice(0, 50).map((op) => ({
        eventKey: op.eventKey,
        outcome: op.outcome,
        edge: op.edge,
        percentEdge: op.percentEdge,
        sourceA: op.sourceA.platform,
        sourceB: op.sourceB.platform,
        payload: JSON.stringify(op),
      })),
    );
    recent = getRecentOpportunities(100);
  } catch {
    recent = [];
  }

  const platformStatuses = [
    {
      platform: 'polymarket' as const,
      label: getPlatformLabel('polymarket'),
      count: quotesByPlatform.polymarket.length,
      usingMock: !config.sources.polymarketApiBase,
    },
    {
      platform: 'opinion' as const,
      label: getPlatformLabel('opinion'),
      count: quotesByPlatform.opinion.length,
      usingMock: !config.sources.opinionApiBase || !config.sources.opinionApiKey,
    },
    {
      platform: 'kalshi' as const,
      label: getPlatformLabel('kalshi'),
      count: quotesByPlatform.kalshi.length,
      usingMock: !config.sources.kalshiApiBase,
    },
    {
      platform: 'probo' as const,
      label: getPlatformLabel('probo'),
      count: quotesByPlatform.probo.length,
      usingMock: !config.sources.proboApiBase,
    },
    {
      platform: 'predictfun' as const,
      label: getPlatformLabel('predictfun'),
      count: quotesByPlatform.predictfun.length,
      usingMock:
        !config.sources.predictfunApiBase ||
        (!config.sources.predictfunApiKey && !config.sources.predictfunApiBase.includes('api-testnet.predict.fun')),
    },
    {
      platform: 'limitless' as const,
      label: getPlatformLabel('limitless'),
      count: quotesByPlatform.limitless.length,
      usingMock: !config.sources.limitlessApiBase || !config.sources.limitlessApiKey,
    },
  ];

  const pairSummaries = dashboardPairs.map((pair) => ({
    pairKey: pair.key,
    label: pair.label,
    navLabel: pair.navLabel,
    left: pair.left,
    right: pair.right,
    count: opportunities.filter((op) => op.pairKey === pair.key).length,
  }));

  return Response.json({
    ok: true,
    plan,
    edgeWindow,
    fallbackApplied,
    sources: {
      platforms: platformStatuses,
      pairs: pairSummaries,
      usingMock: platformStatuses.some((platform) => platform.usingMock),
    },
    opportunities,
    recent,
    generatedAt: new Date().toISOString(),
  });
}
