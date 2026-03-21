import type { Plan } from './user-types';

type EdgeWindow = {
  minEdge: number;
  maxEdge?: number;
};

export const planLimits: Record<Plan, { alertsPerDay: number; edgeWindow: EdgeWindow }> = {
  FREE: { alertsPerDay: 20, edgeWindow: { minEdge: 0, maxEdge: 0.02 } }, // até 2%
  PRO: { alertsPerDay: 500, edgeWindow: { minEdge: 0.05 } }, // acima de 5%
};

export function getEdgeWindowForPlan(plan: Plan): EdgeWindow {
  return planLimits[plan].edgeWindow;
}

export function filterOpportunitiesForPlan<T extends { edge: number }>(plan: Plan, opportunities: T[]): T[] {
  const { minEdge, maxEdge } = getEdgeWindowForPlan(plan);
  return opportunities.filter((op) => {
    if (op.edge < minEdge) return false;
    if (typeof maxEdge === 'number' && op.edge > maxEdge) return false;
    return true;
  });
}
