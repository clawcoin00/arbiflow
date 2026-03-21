import { listAppUsers } from '@/src/lib/app-users';

export async function GET() {
  try {
    const users = await listAppUsers();
    return Response.json({ ok: true, users });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'users_list_failed';
    const status = message === 'supabase_admin_not_configured' ? 501 : 500;
    return Response.json({ ok: false, error: message }, { status });
  }
}
