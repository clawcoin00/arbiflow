import { upsertUser } from '@/src/lib/db';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || '').trim();
  const plan = String(body.plan || 'FREE').toUpperCase() as 'FREE' | 'PRO';

  if (!email || !email.includes('@')) {
    return Response.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }

  const user = upsertUser(email, plan === 'PRO' ? 'PRO' : 'FREE');
  return Response.json({ ok: true, user });
}
