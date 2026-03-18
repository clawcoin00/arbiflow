import type { Plan } from './db';

export const planLimits: Record<Plan, { alertsPerDay: number }> = {
  FREE: { alertsPerDay: 20 },
  PRO: { alertsPerDay: 500 },
};
