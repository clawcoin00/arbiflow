import type { Opportunity } from './types';
import { sendTelegram } from './telegram';
import { config } from './config';

// In-memory anti-spam store (resets on process restart in MVP).
const lastAlertAt = new Map<string, number>();

function keyFor(op: Opportunity) {
  return `${op.eventKey}::${op.outcome}`;
}

export function shouldAlert(op: Opportunity, now = Date.now()) {
  const key = keyFor(op);
  const last = lastAlertAt.get(key) ?? 0;
  return now - last >= config.alertCooldownMs;
}

export async function sendOpportunityAlert(op: Opportunity) {
  const key = keyFor(op);
  const now = Date.now();

  if (!shouldAlert(op, now)) {
    return { sent: false, reason: 'cooldown' as const };
  }

  const text = [
    '🚨 Arbitrage Opportunity',
    `Event: ${op.eventKey}`,
    `Outcome: ${op.outcome}`,
    `Edge: ${op.percentEdge}%`,
    `Polymarket: ${op.polymarket.price.toFixed(3)}`,
    `Kalshi: ${op.kalshi.price.toFixed(3)}`,
    op.polymarket.url ? `Polymarket URL: ${op.polymarket.url}` : '',
    op.kalshi.url ? `Kalshi URL: ${op.kalshi.url}` : '',
    `Detected: ${op.detectedAt}`,
  ]
    .filter(Boolean)
    .join('\n');

  await sendTelegram(text);
  lastAlertAt.set(key, now);
  return { sent: true as const };
}
