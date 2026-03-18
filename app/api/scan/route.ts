import { detectOpportunities } from '@/src/lib/arbitrage';
import { sendOpportunityAlert } from '@/src/lib/alerts';
import { config } from '@/src/lib/config';
import { fetchAllQuotes } from '@/src/lib/sources';

export async function POST() {
  const { polymarket, kalshi } = await fetchAllQuotes();
  const opportunities = detectOpportunities(polymarket, kalshi, config.alertEdgeMin);

  const sent: string[] = [];
  const skipped: string[] = [];

  for (const op of opportunities.slice(0, 5)) {
    const result = await sendOpportunityAlert(op);
    const key = `${op.eventKey}::${op.outcome}`;
    if (result.sent) sent.push(key);
    else skipped.push(`${key} (${result.reason})`);
  }

  return Response.json({
    ok: true,
    threshold: config.alertEdgeMin,
    opportunitiesFound: opportunities.length,
    alertsSent: sent.length,
    alertsSkipped: skipped.length,
    sent,
    skipped,
    generatedAt: new Date().toISOString(),
  });
}
