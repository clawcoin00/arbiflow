import { listUsers } from '@/src/lib/db';

export async function GET() {
  return Response.json({ ok: true, users: listUsers() });
}
