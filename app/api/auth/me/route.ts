import { getUserByEmail } from '@/src/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email')?.trim();
  if (!email) return Response.json({ ok: false, error: 'email_required' }, { status: 400 });

  const user = getUserByEmail(email);
  return Response.json({ ok: true, user });
}
