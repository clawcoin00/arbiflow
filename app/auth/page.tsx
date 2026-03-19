"use client";

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, startTransition, useEffect, useState, type FormEvent } from 'react';
import { AUTH_LOGIN_HREF, AUTH_SIGNUP_HREF, USER_EMAIL_STORAGE_KEY } from '@/src/lib/routes';

type AuthMode = 'login' | 'signup';

function resolveMode(rawMode: string | null): AuthMode {
  return rawMode === 'login' ? 'login' : 'signup';
}

function AuthScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = resolveMode(searchParams.get('mode'));

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedEmail = window.localStorage.getItem(USER_EMAIL_STORAGE_KEY)?.trim();
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const switchMode = (nextMode: AuthMode) => {
    const href = nextMode === 'login' ? AUTH_LOGIN_HREF : AUTH_SIGNUP_HREF;
    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
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
        router.push('/');
      });
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'auth_failed';
      if (message === 'account_not_found') {
        setError('No account found for this email. Switch to Sign Up first.');
      } else if (message === 'invalid_email') {
        setError('Enter a valid email address.');
      } else {
        setError('Unable to continue right now. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const title = mode === 'signup' ? 'Access Live Arbs' : 'Welcome Back';
  const subtitle =
    mode === 'signup'
      ? 'Create your account to view real-time opportunities.'
      : 'Log in to continue tracking live arbitrage opportunities.';
  const submitLabel = mode === 'signup' ? 'View Arbitrage Opportunities' : 'Enter Dashboard';

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
                onChange={(event) => setEmail(event.target.value)}
              />

              <button type="submit" className="auth-submit-button" disabled={loading || !email.trim()}>
                {loading ? 'Working...' : submitLabel}
              </button>
            </form>

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
