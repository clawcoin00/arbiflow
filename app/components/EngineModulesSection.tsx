import Link from 'next/link';
import { AUTH_SIGNUP_HREF } from '@/src/lib/routes';

type ModuleTone = 'blue' | 'green' | 'amber' | 'red';

const modules = [
  {
    tone: 'blue' as ModuleTone,
    tag: 'CONNECTIVITY',
    title: 'INSTANT ARB ALERTS',
    description:
      'Low-latency hooks for Telegram & Discord. Receive high-conviction signals within 40ms of a spread opening.',
    metric: '40ms Average',
    glyph: 'alerts',
  },
  {
    tone: 'green' as ModuleTone,
    tag: 'RISK_MANAGEMENT',
    title: 'AUTOMATED SIZING',
    description:
      'The system automatically detects how to size bets on both prediction markets in order to maximize yield and EV.',
    metric: 'Dynamic Hedge',
    glyph: 'sizing',
  },
  {
    tone: 'amber' as ModuleTone,
    tag: 'PROFIT_PROTECTION',
    title: 'EARLY EXIT TRACKING',
    description:
      'Proprietary algorithms monitor spread decay. Lock in profits before the market corrects the mispricing.',
    metric: '98% Efficiency',
    glyph: 'tracking',
  },
  {
    tone: 'red' as ModuleTone,
    tag: 'INFRASTRUCTURE',
    title: 'STALE-DATA SHIELD',
    description:
      'Proprietary systems make sure that our real-time data is reliable and that no fake or expired arbs get displayed.',
    metric: 'Verified_Only',
    glyph: 'shield',
  },
];

function ModuleGlyph({ glyph }: { glyph: string }) {
  switch (glyph) {
    case 'alerts':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85">
          <path d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.42V11a6 6 0 0 0-12 0v3.18a2 2 0 0 1-.6 1.42L4 17h5" />
          <path d="M9.5 17a2.5 2.5 0 0 0 5 0" />
        </svg>
      );
    case 'sizing':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85">
          <path d="M12 3v18" />
          <path d="M6 7h12" />
          <path d="M8 7a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
          <path d="M21 7a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
          <path d="M9 17h6" />
          <path d="M11 17a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
          <path d="M18 17a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
        </svg>
      );
    case 'tracking':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85">
          <circle cx="12" cy="13" r="6.5" />
          <path d="M12 13l3.4-3.4" />
          <path d="M9 2h6" />
        </svg>
      );
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85">
          <path d="M12 3 6 5v6c0 4.2 2.54 8.12 6 10 3.46-1.88 6-5.8 6-10V5l-6-2Z" />
          <path d="M12 8v5" />
          <path d="M12 16h.01" />
        </svg>
      );
  }
}

export function EngineModulesSection() {
  return (
    <>
      <section className="engine-section">
        <div className="container-main">
          <div className="engine-heading">
            <span className="engine-heading-pill">ENGINE_MODULES</span>
            <h2>
              Engineered for
              <span>Unfair Advantage.</span>
            </h2>
          </div>

          <div className="engine-shell">
            {modules.map((module) => (
              <article key={module.title} className="engine-card">
                <div className="engine-card-top">
                  <div className={`engine-card-icon engine-card-icon-${module.tone}`}>
                    <ModuleGlyph glyph={module.glyph} />
                  </div>
                  <span className="engine-card-tag">{module.tag}</span>
                </div>

                <div className="engine-card-body">
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                </div>

                <div className="engine-card-footer">
                  <span>PERFORMANCE</span>
                  <strong>{module.metric}</strong>
                </div>
              </article>
            ))}
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
