import { detectOpportunities } from '@/src/lib/arbitrage';
import { sendOpportunityAlert } from '@/src/lib/alerts';
import { config } from '@/src/lib/config';
import { countAlertsForUserInLast24h, saveAlert, upsertUser } from '@/src/lib/db';
import { planLimits } from '@/src/lib/plans';
import { fetchAllQuotes } from '@/src/lib/sources';

export async function POST(req: Request) {
  const { polymarket, kalshi } = await fetchAllQuotes();
  const opportunities = detectOpportunities(polymarket, kalshi, config.alertEdgeMin);

  // MVP auth: user is identified by header (to be replaced by real auth/session in next phase)
  const headerEmail = req.headers.get('x-user-email')?.trim();
  const email = headerEmail || 'owner@arbiflow.online';
  const user = upsertUser(email, 'FREE');

  const dailyCount = countAlertsForUserInLast24h(user.id);
  const limit = planLimits[user.plan].alertsPerDay;

  const sent: string[] = [];
  const skipped: string[] = [];

  for (const op of opportunities.slice(0, 10)) {
    if (dailyCount + sent.length >= limit) {
      skipped.push(`${op.eventKey}::${op.outcome} (plan_limit_reached)`);
      continue;
    }

    const result = await sendOpportunityAlert(op);
    const key = `${op.eventKey}::${op.outcome}`;

    if (result.sent) {
      sent.push(key);
      saveAlert({
        userId: user.id,
        eventKey: op.eventKey,
        outcome: op.outcome,
        edge: op.edge,
        message: `${op.eventKey} ${op.outcome} edge ${op.percentEdge}%`,
        delivered: true,
      });
    } else {
      skipped.push(`${key} (${result.reason})`);
    }
  }

  return Response.json({
    ok: true,
    threshold: config.alertEdgeMin,
    user: { email: user.email, plan: user.plan, dailyLimit: limit, usedToday: dailyCount + sent.length },
    opportunitiesFound: opportunities.length,
    alertsSent: sent.length,
    alertsSkipped: skipped.length,
    sent,
    skipped,
    generatedAt: new Date().toISOString(),
  });
}
