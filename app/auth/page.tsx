"use client";

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, startTransition, useEffect, useState, type FormEvent } from 'react';
import { AUTH_LOGIN_HREF, AUTH_SIGNUP_HREF, DASHBOARD_HREF, USER_EMAIL_STORAGE_KEY } from '@/src/lib/routes';
import { getSupabaseBrowserClient } from '@/src/lib/supabase/client';
import { isSupabaseConfigured } from '@/src/lib/supabase/env';

type AuthMode = 'login' | 'signup';

function resolveMode(rawMode: string | null): AuthMode {
  return rawMode === 'login' ? 'login' : 'signup';
}

function resolveAuthError(rawError: string | null) {
  const normalizedError = rawError?.toLowerCase?.() ?? '';

  if (rawError === 'account_not_found') return 'No account found for this email. Switch to Sign Up first.';
  if (rawError === 'invalid_email') return 'Enter a valid email address.';
  if (rawError === 'email_address_invalid') return 'Supabase rejected this email address. Try another valid address.';
  if (rawError === 'invalid_credentials') return 'The email or password is incorrect.';
  if (rawError === 'email_not_confirmed') return 'This account still needs email confirmation.';
  if (normalizedError === 'weak_password' || normalizedError.includes('password should')) {
    return 'Choose a stronger password before continuing.';
  }
  if (
    normalizedError === 'user_already_exists' ||
    normalizedError === 'email_exists' ||
    normalizedError.includes('already registered')
  ) {
    return 'This email already has an account. Switch to Log In.';
  }
  if (rawError === 'over_email_send_rate_limit') {
    return 'Supabase hit the email send limit for this project. Wait a bit before trying again.';
  }
  if (rawError === 'email_address_not_authorized' || rawError === 'email_not_authorized') {
    return 'This project is still using Supabase default email sending. Add custom SMTP or use a team member email.';
  }
  if (rawError === 'auth_callback_failed') return 'We could not confirm your email link. Request a new one.';
  if (rawError === 'missing_code') return 'The login link is incomplete. Request a new one.';
  if (rawError === 'supabase_not_configured') {
    return 'Supabase is not configured yet. Add your project URL and publishable key to continue.';
  }
  return '';
}

function extractErrorCode(caughtError: unknown) {
  if (caughtError && typeof caughtError === 'object' && 'code' in caughtError) {
    const code = Reflect.get(caughtError, 'code');
    return typeof code === 'string' ? code : '';
  }

  if (caughtError instanceof Error) {
    return caughtError.message;
  }

  return '';
}

function resolveMagicLinkNotice(mode: AuthMode) {
  return mode === 'signup'
    ? 'Check your inbox to confirm your account and unlock the dashboard.'
    : 'Check your inbox for the secure login link to enter the dashboard.';
}

function AuthScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = resolveMode(searchParams.get('mode'));
  const supabaseEnabled = isSupabaseConfigured();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [signupPasswordRevealed, setSignupPasswordRevealed] = useState(false);
  const passwordLoginEnabled = supabaseEnabled && mode === 'login';
  const passwordSignupEnabled = supabaseEnabled && mode === 'signup';
  const signupPasswordVisible =
    passwordSignupEnabled && (signupPasswordRevealed || email.trim().length > 0 || password.trim().length > 0);
  const showingPasswordField = passwordLoginEnabled || signupPasswordVisible;
  const usingPasswordLogin = passwordLoginEnabled && password.trim().length > 0;
  const submitDisabled = loading || !email.trim() || (passwordSignupEnabled && !password.trim());

  useEffect(() => {
    const storedEmail = typeof window !== 'undefined' ? window.localStorage.getItem(USER_EMAIL_STORAGE_KEY)?.trim() : '';
    if (storedEmail) setEmail(storedEmail);

    const routeError = resolveAuthError(searchParams.get('error'));
    if (routeError) {
      setError(routeError);
      setNotice('');
    }
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    const maybeRedirectAuthenticatedUser = async () => {
      if (!supabaseEnabled) return;

      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const normalizedEmail = user?.email?.trim().toLowerCase();
      if (!normalizedEmail || cancelled) return;

      window.localStorage.setItem(USER_EMAIL_STORAGE_KEY, normalizedEmail);
      startTransition(() => {
        router.replace(DASHBOARD_HREF);
      });
    };

    maybeRedirectAuthenticatedUser();

    return () => {
      cancelled = true;
    };
  }, [router, supabaseEnabled]);

  useEffect(() => {
    if (mode === 'login') {
      setSignupPasswordRevealed(false);
    }
  }, [mode]);

  const switchMode = (nextMode: AuthMode) => {
    const href = nextMode === 'login' ? AUTH_LOGIN_HREF : AUTH_SIGNUP_HREF;
    setError('');
    setNotice('');
    setPassword('');
    setSignupPasswordRevealed(false);
    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      setError('Enter a valid email address.');
      setNotice('');
      return;
    }

    if (passwordSignupEnabled && !password.trim()) {
      setError('Enter a password to create your account.');
      setNotice('');
      return;
    }

    setLoading(true);
    setError('');
    setNotice('');

    try {
      if (supabaseEnabled) {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) {
          throw new Error('supabase_not_configured');
        }

        const callbackUrl = new URL('/auth/callback', window.location.origin);
        callbackUrl.searchParams.set('next', DASHBOARD_HREF);

        if (mode === 'login' && password.trim()) {
          const { error: authError } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password,
          });

          if (authError) {
            throw authError;
          }

          window.localStorage.setItem(USER_EMAIL_STORAGE_KEY, normalizedEmail);
          startTransition(() => {
            router.replace(DASHBOARD_HREF);
          });
          return;
        }

        if (mode === 'signup' && password.trim()) {
          const { data, error: authError } = await supabase.auth.signUp({
            email: normalizedEmail,
            password,
            options: {
              emailRedirectTo: callbackUrl.toString(),
            },
          });

          if (authError) {
            throw authError;
          }

          window.localStorage.setItem(USER_EMAIL_STORAGE_KEY, normalizedEmail);
          if (data.session) {
            startTransition(() => {
              router.replace(DASHBOARD_HREF);
            });
            return;
          }

          setNotice(resolveMagicLinkNotice(mode));
          return;
        }

        const { error: authError } = await supabase.auth.signInWithOtp({
          email: normalizedEmail,
          options: {
            emailRedirectTo: callbackUrl.toString(),
            shouldCreateUser: mode === 'signup',
          },
        });

        if (authError) {
          throw authError;
        }

        window.localStorage.setItem(USER_EMAIL_STORAGE_KEY, normalizedEmail);
        setNotice(resolveMagicLinkNotice(mode));
        return;
      }

      if (mode === 'signup') {
        const response = await fetch('/api/auth/upsert-user', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ email: normalizedEmail, plan: 'FREE' }),
        });

        const payload = await response.json();
        if (!response.ok || !payload.ok) {
          throw new Error(payload.error || 'signup_failed');
        }
      } else {
        const response = await fetch(`/api/auth/me?email=${encodeURIComponent(normalizedEmail)}`);
        const payload = await response.json();
        if (!response.ok || !payload.user) {
          throw new Error('account_not_found');
        }
      }

      window.localStorage.setItem(USER_EMAIL_STORAGE_KEY, normalizedEmail);
      startTransition(() => {
        router.push(DASHBOARD_HREF);
      });
    } catch (caughtError) {
      const message = resolveAuthError(extractErrorCode(caughtError));
      setError(message || 'Unable to continue right now. Try again.');
      setNotice('');
    } finally {
      setLoading(false);
    }
  };

  const title = mode === 'signup' ? 'Access Live Arbs' : 'Welcome Back';
  const subtitle = supabaseEnabled
    ? mode === 'signup'
      ? 'Start with your email, then create a password to unlock the dashboard.'
      : 'Log in with your password right away, or leave it blank and use a secure email link.'
    : mode === 'signup'
      ? 'Create your account to view real-time opportunities.'
      : 'Log in to continue tracking live arbitrage opportunities.';
  const submitLabel = supabaseEnabled
    ? mode === 'signup'
      ? 'Create Account'
      : usingPasswordLogin
        ? 'Log In'
        : 'Send Login Link'
    : mode === 'signup'
      ? 'View Arbitrage Opportunities'
      : 'Enter Dashboard';

  return (
    <main className="auth-page">
      <div className="auth-grid">
        <section className="auth-hero">
          <Link href="/" className="auth-brand-pill">
            <span className="auth-brand-icon">A</span>
            <span>ASYMMETRIC ARBITRAGE</span>
          </Link>

          <div className="auth-hero-copy">
            <h1>
              Exploit Mispriced
              <span>Odds For +EV</span>
            </h1>
            <p>
              We surface real-time pricing mismatches across prediction markets so you can enter trades with positive
              expected value every time.
            </p>
          </div>

          <div className="auth-preview-card">
            <div className="auth-preview-top">
              <div className="auth-preview-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m7 17 10-10" />
                  <path d="M9 7h8v8" />
                </svg>
              </div>
              <div className="auth-preview-copy">
                <strong>Arbitrage Detected</strong>
                <span>Polymarket vs Kalshi</span>
              </div>
              <div className="auth-preview-metric">
                <b>+12.4%</b>
                <span>EXPECTED RETURN</span>
              </div>
            </div>

            <div className="auth-preview-bars">
              <div>
                <span>PROBABILITY GAP IDENTIFIED</span>
                <span>HIGH-CONFIDENCE MISPRICING</span>
              </div>
              <div className="auth-preview-track">
                <span />
              </div>
            </div>
          </div>
        </section>

        <section className="auth-panel-wrap">
          <div className="auth-panel">
            <div className="auth-panel-head">
              <h2>{title}</h2>
              <p>{subtitle}</p>
            </div>

            <div className="auth-mode-tabs">
              <button
                type="button"
                className={mode === 'login' ? 'is-active' : ''}
                onClick={() => switchMode('login')}
              >
                Log In
              </button>
              <button
                type="button"
                className={mode === 'signup' ? 'is-active' : ''}
                onClick={() => switchMode('signup')}
              >
                Sign Up
              </button>
            </div>

            <form className="auth-form" onSubmit={onSubmit}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="satoshinakamoto@gmail.com"
                value={email}
                onFocus={() => {
                  if (passwordSignupEnabled) {
                    setSignupPasswordRevealed(true);
                  }
                }}
                onChange={(event) => setEmail(event.target.value)}
              />

              {showingPasswordField ? (
                <div className="auth-password-field">
                  <label htmlFor="password">{mode === 'signup' ? 'Create Password' : 'Password'}</label>
                  <input
                    id="password"
                    type="password"
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    placeholder={
                      mode === 'signup'
                        ? 'Create a secure password'
                        : 'Enter your password or leave blank for email link'
                    }
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <p className="auth-form-hint">
                    {mode === 'signup'
                      ? 'We will create your account right away and send a confirmation email if your project requires it.'
                      : 'Leave this blank if you want a magic link instead.'}
                  </p>
                </div>
              ) : null}

              <button type="submit" className="auth-submit-button" disabled={submitDisabled}>
                {loading ? 'Working...' : submitLabel}
              </button>
            </form>

            {notice ? <p className="auth-notice">{notice}</p> : null}
            {error ? <p className="auth-error">{error}</p> : null}

            <p className="auth-panel-foot">
              {mode === 'signup' ? 'Already have an account?' : 'Need an account?'}
              <button type="button" onClick={() => switchMode(mode === 'signup' ? 'login' : 'signup')}>
                {mode === 'signup' ? 'Sign in' : 'Sign up'}
              </button>
            </p>

            <p className="auth-panel-linkout">
              Need checkout access now? <Link href="/pricing">View pricing</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<main className="auth-page" />}>
      <AuthScreen />
    </Suspense>
  );
}
