import 'server-only';

import { getUserByEmail, listUsers, upsertUser } from './db';
import { getSupabaseServerClient } from './supabase/server';
import { getSupabaseAdminClient } from './supabase/admin';
import { isSupabaseConfigured } from './supabase/env';
import type { AppUser, Plan } from './user-types';

type AppUserRow = {
  id: string;
  email: string;
  plan: Plan;
  created_at: string;
  updated_at: string;
};

function mapAppUser(row: AppUserRow): AppUser {
  return {
    id: row.id,
    email: row.email,
    plan: row.plan,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function queryCurrentUserRow() {
  if (!isSupabaseConfigured()) return null;

  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) return null;

  const { data, error } = await supabase
    .from('app_users')
    .select('id, email, plan, created_at, updated_at')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    throw new Error(`app_user_query_failed:${error.message}`);
  }

  return data as AppUserRow | null;
}

export async function getCurrentAppUser() {
  const row = await queryCurrentUserRow();
  return row ? mapAppUser(row) : null;
}

export async function getAppUserByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !normalizedEmail.includes('@')) return null;
  if (!isSupabaseConfigured()) {
    return getUserByEmail(normalizedEmail);
  }

  const admin = getSupabaseAdminClient();
  if (admin) {
    const { data, error } = await admin
      .from('app_users')
      .select('id, email, plan, created_at, updated_at')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (error) {
      throw new Error(`app_user_lookup_failed:${error.message}`);
    }

    return data ? mapAppUser(data as AppUserRow) : null;
  }

  const row = await queryCurrentUserRow();
  if (!row) return null;
  if (row.email !== normalizedEmail) return null;

  return mapAppUser(row);
}

export async function listAppUsers() {
  if (!isSupabaseConfigured()) {
    return listUsers();
  }

  const admin = getSupabaseAdminClient();
  if (!admin) {
    throw new Error('supabase_admin_not_configured');
  }

  const { data, error } = await admin
    .from('app_users')
    .select('id, email, plan, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`app_users_list_failed:${error.message}`);
  }

  return (data as AppUserRow[]).map(mapAppUser);
}

export async function setAppUserPlan(email: string, plan: Plan) {
  if (!isSupabaseConfigured()) {
    return upsertUser(email, plan);
  }

  const admin = getSupabaseAdminClient();
  if (!admin) {
    throw new Error('supabase_admin_not_configured');
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    throw new Error('invalid_email');
  }

  const existingUser = await getAppUserByEmail(normalizedEmail);
  if (!existingUser) {
    throw new Error('user_not_found');
  }

  const { data, error } = await admin
    .from('app_users')
    .update({ plan })
    .eq('id', existingUser.id)
    .select('id, email, plan, created_at, updated_at')
    .single();

  if (error) {
    throw new Error(`app_user_update_failed:${error.message}`);
  }

  return mapAppUser(data as AppUserRow);
}
