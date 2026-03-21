import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { getSupabasePublishableKey, getSupabaseUrl, isSupabaseConfigured } from './env';

let browserClient: SupabaseClient<Database> | null = null;

export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) return null;
  if (browserClient) return browserClient;

  browserClient = createBrowserClient<Database>(getSupabaseUrl(), getSupabasePublishableKey());
  return browserClient;
}
