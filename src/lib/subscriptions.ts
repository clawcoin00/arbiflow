import { setAppUserPlan } from './app-users';

export async function activateProByEmail(email: string) {
  return setAppUserPlan(email, 'PRO');
}

export async function downgradeToFreeByEmail(email: string) {
  return setAppUserPlan(email, 'FREE');
}
