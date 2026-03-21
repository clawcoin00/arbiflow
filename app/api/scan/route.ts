import { detectOpportunities } from '@/src/lib/arbitrage';
import { sendOpportunityAlert } from '@/src/lib/alerts';
import { getAppUserByEmail } from '@/src/lib/app-users';
import { config } from '@/src/lib/config';
import { countAlertsForUserInLast24h, saveAlert } from '@/src/lib/db';
import { planLimits } from '@/src/lib/plans';
import { fetchAllQuotes } from '@/src/lib/sources';
import type { Plan } from '@/src/lib/user-types';

export async function POST(req: Request) {
  const quotesByPlatform = await fetchAllQuotes();
  const opportunities = detectOpportunities(quotesByPlatform, config.alertEdgeMin);

  // MVP auth: user is identified by header (to be replaced by real auth/session in next phase)
  const headerEmail = req.headers.get('x-user-email')?.trim();
  const email = headerEmail || 'owner@arbsflow.online';
  const storedUser = await getAppUserByEmail(email);
  const user = storedUser ?? { id: email.toLowerCase(), email, plan: 'FREE' as Plan };

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
