import { setAppUserPlan } from '@/src/lib/app-users';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || '').trim();
  const plan = String(body.plan || 'FREE').toUpperCase() as 'FREE' | 'PRO';

  if (!email || !email.includes('@')) {
    return Response.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }

  try {
    const user = await setAppUserPlan(email, plan === 'PRO' ? 'PRO' : 'FREE');
    return Response.json({ ok: true, user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'user_update_failed';
    const status =
      message === 'invalid_email' ? 400 : message === 'user_not_found' ? 404 : message === 'supabase_admin_not_configured' ? 501 : 500;

    return Response.json({ ok: false, error: message }, { status });
  }
}
