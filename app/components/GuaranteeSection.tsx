import Link from 'next/link';
import { AUTH_SIGNUP_HREF } from '@/src/lib/routes';

export function GuaranteeSection() {
  return (
    <>
      <section className="guarantee-section">
        <div className="container-main">
          <div className="guarantee-shell">
            <div className="guarantee-shell-top">
              <div className="guarantee-shell-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M4 20h16" />
                  <path d="M6 20V9h12v11" />
                  <path d="M3 9h18" />
                  <path d="m12 4 9 5H3l9-5Z" />
                </svg>
                <span>INSTITUTIONAL_POLICY - ASYM-COVERAGE-001</span>
              </div>

              <span className="guarantee-shell-pill">HEDGED TRADING VERIFIED</span>
            </div>

            <div className="guarantee-shell-body">
              <h2>
                <span>WE GUARANTEE</span>
                THAT YOU WIN
              </h2>

              <div className="guarantee-shell-divider" />

              <div className="guarantee-panel">
                <div className="guarantee-panel-head">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                    <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z" />
                  </svg>
                  <span>THE ROI GUARANTEE</span>
                </div>

                <p>
                  If you do not make back your subscription cost in your first month of trading, your second month is
                  <strong> 100% subsidized by ArbsFlow.</strong>
                </p>

                <small>
                  * Eligibility requires active trading activity and a suitably sized bankroll during the initial month.
                </small>
              </div>
            </div>

            <div className="guarantee-shell-footer">
              <span>START YOUR HEDGED-TRADING SESSION TODAY.</span>
              <Link href={AUTH_SIGNUP_HREF} className="guarantee-shell-button">
                Start Executing
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="capture-cta-band">
        <div className="capture-cta-band-line" />
        <Link href={AUTH_SIGNUP_HREF} className="capture-cta-button">
          Start Arbitraging
        </Link>
      </section>
    </>
  );
}
