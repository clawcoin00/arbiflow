import type { Opportunity } from './types';
import { config } from './config';
import { sendTelegram } from './telegram';
import { getPlatformLabel } from './venues';

// In-memory anti-spam store (resets on process restart in MVP).
const lastAlertAt = new Map<string, number>();

function keyFor(op: Opportunity) {
  return `${op.pairKey}::${op.eventKey}::${op.outcome}`;
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
    'Arbitrage Opportunity',
    `Event: ${op.eventKey}`,
    `Outcome: ${op.outcome}`,
    `Edge: ${op.percentEdge}%`,
    `${getPlatformLabel(op.sourceA.platform)}: ${op.sourceA.price.toFixed(3)}`,
    `${getPlatformLabel(op.sourceB.platform)}: ${op.sourceB.price.toFixed(3)}`,
    op.sourceA.url ? `${getPlatformLabel(op.sourceA.platform)} URL: ${op.sourceA.url}` : '',
    op.sourceB.url ? `${getPlatformLabel(op.sourceB.platform)} URL: ${op.sourceB.url}` : '',
    `Detected: ${op.detectedAt}`,
  ]
    .filter(Boolean)
    .join('\n');

  await sendTelegram(text);
  lastAlertAt.set(key, now);
  return { sent: true as const };
}
