import { getAppUserByEmail, getCurrentAppUser } from '@/src/lib/app-users';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email')?.trim();

  const user = email ? await getAppUserByEmail(email) : await getCurrentAppUser();
  return Response.json({ ok: true, user });
}
