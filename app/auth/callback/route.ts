import { NextResponse } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { AUTH_LOGIN_HREF, DASHBOARD_HREF } from '@/src/lib/routes';
import { isSupabaseConfigured } from '@/src/lib/supabase/env';
import { getSupabaseServerClient } from '@/src/lib/supabase/server';

function buildAuthRedirect(requestUrl: URL, errorCode: string) {
  const redirectUrl = new URL(AUTH_LOGIN_HREF, requestUrl.origin);
  redirectUrl.searchParams.set('error', errorCode);
  return redirectUrl;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const tokenHash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type') as EmailOtpType | null;
  const next = requestUrl.searchParams.get('next') || DASHBOARD_HREF;

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(buildAuthRedirect(requestUrl, 'supabase_not_configured'));
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.redirect(buildAuthRedirect(requestUrl, 'supabase_not_configured'));
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(buildAuthRedirect(requestUrl, 'auth_callback_failed'));
    }
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });
    if (error) {
      return NextResponse.redirect(buildAuthRedirect(requestUrl, 'auth_callback_failed'));
    }
  } else {
    return NextResponse.redirect(buildAuthRedirect(requestUrl, 'missing_code'));
  }

  const destination = new URL(next.startsWith('/') ? next : DASHBOARD_HREF, requestUrl.origin);
  return NextResponse.redirect(destination);
}
