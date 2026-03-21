export type Plan = 'FREE' | 'PRO';

export type AppUser = {
  id: string;
  email: string;
  plan: Plan;
  createdAt: string;
  updatedAt: string;
};
