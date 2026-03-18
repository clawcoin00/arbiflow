import { getUserByEmail, upsertUser } from './db';

export function activateProByEmail(email: string) {
  const existing = getUserByEmail(email);
  if (!existing) return upsertUser(email, 'PRO');
  return upsertUser(email, 'PRO');
}

export function downgradeToFreeByEmail(email: string) {
  const existing = getUserByEmail(email);
  if (!existing) return upsertUser(email, 'FREE');
  return upsertUser(email, 'FREE');
}
