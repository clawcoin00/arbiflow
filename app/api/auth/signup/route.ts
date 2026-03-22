import type { User } from '@supabase/supabase-js';
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from '@/src/lib/supabase/admin';

function normalizeEmail(rawEmail: unknown) {
  return String(rawEmail || '').trim().toLowerCase();
}

function normalizePassword(rawPassword: unknown) {
  return String(rawPassword || '');
}

function isAlreadyRegisteredError(message: string) {
  const normalizedMessage = message.toLowerCase();
  return normalizedMessage.includes('already registered') || normalizedMessage.includes('already exists');
}

async function findAuthUserByEmail(email: string): Promise<User | null> {
  const admin = getSupabaseAdminClient();
  if (!admin) return null;

  const { data: appUserRow } = await admin
    .from('app_users')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (appUserRow?.id) {
    const { data, error } = await admin.auth.admin.getUserById(appUserRow.id);
    if (!error && data.user) {
      return data.user;
    }
  }

  let page = 1;

  while (page <= 10) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) {
      throw new Error(`auth_user_lookup_failed:${error.message}`);
    }

    const match = data.users.find((user) => user.email?.trim().toLowerCase() === email);
    if (match) {
      return match;
    }

    if (!data.nextPage || page >= data.lastPage) {
      break;
    }

    page = data.nextPage;
  }

  return null;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = normalizeEmail(body.email);
  const password = normalizePassword(body.password);

  if (!email || !email.includes('@')) {
    return Response.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }

  if (password.trim().length < 8) {
    return Response.json({ ok: false, error: 'weak_password' }, { status: 400 });
  }

  if (!isSupabaseAdminConfigured()) {
    return Response.json({ ok: false, error: 'supabase_admin_not_configured' }, { status: 501 });
  }

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return Response.json({ ok: false, error: 'supabase_admin_not_configured' }, { status: 501 });
  }

  try {
    const existingUser = await findAuthUserByEmail(email);

    if (existingUser) {
      if (existingUser.email_confirmed_at) {
        return Response.json({ ok: false, error: 'user_already_exists' }, { status: 409 });
      }

      const { data, error } = await admin.auth.admin.updateUserById(existingUser.id, {
        email,
        password,
        email_confirm: true,
      });

      if (error) {
        return Response.json({ ok: false, error: error.message || 'signup_update_failed' }, { status: 500 });
      }

      return Response.json({
        ok: true,
        user: { id: data.user?.id, email: data.user?.email || email },
        mode: 'recovered',
      });
    }

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      if (isAlreadyRegisteredError(error.message || '')) {
        return Response.json({ ok: false, error: 'user_already_exists' }, { status: 409 });
      }

      return Response.json({ ok: false, error: error.message || 'signup_create_failed' }, { status: 500 });
    }

    return Response.json({
      ok: true,
      user: { id: data.user?.id, email: data.user?.email || email },
      mode: 'created',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'signup_create_failed';
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
