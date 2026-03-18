import type { Plan } from './db';

export const planLimits: Record<Plan, { alertsPerDay: number; minEdge: number }> = {
  FREE: { alertsPerDay: 20, minEdge: 0.05 }, // 5%
  PRO: { alertsPerDay: 500, minEdge: 0.02 }, // 2%
};

export function getMinEdgeForPlan(plan: Plan): number {
  return planLimits[plan].minEdge;
}
