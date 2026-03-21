import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';
import { getCurrentAppUser } from '@/src/lib/app-users';
import { AUTH_LOGIN_HREF } from '@/src/lib/routes';
import { isSupabaseConfigured } from '@/src/lib/supabase/env';

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    return <DashboardClient initialAuth={null} />;
  }

  const currentUser = await getCurrentAppUser();
  if (!currentUser) {
    redirect(AUTH_LOGIN_HREF);
  }

  return <DashboardClient initialAuth={{ email: currentUser.email, plan: currentUser.plan }} />;
}
