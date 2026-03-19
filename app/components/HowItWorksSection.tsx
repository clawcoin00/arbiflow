import Link from 'next/link';
import { AUTH_SIGNUP_HREF } from '@/src/lib/routes';

type Step = {
  number: string;
  title: string;
  description: string;
  accent: string;
  layout: 'left' | 'right';
  renderVisual: () => React.ReactNode;
};

function ScannerVisual() {
  return (
    <div className="protocol-visual protocol-visual-scanner">
      <div className="protocol-panel-header">
        <div>
          <p className="protocol-panel-step">STEP 01 SCANNER</p>
          <h3 className="protocol-panel-title">Cross-Market Spread Engine</h3>
        </div>
        <span className="protocol-live-pill">Live Replay</span>
      </div>

      <div className="protocol-scan-list">
        {[
          ['ETH ETF inflows above $1B this month?', 'YES 46.5%', 'YES 38.2%'],
          ['OpenAI launches GPT-6 in 2026?', 'YES 54.1%', 'YES 49.3%'],
        ].map(([market, leftOdds, rightOdds], index) => (
          <div key={market} className={`protocol-scan-row${index === 1 ? ' protocol-scan-row-dim' : ''}`}>
            <div className="protocol-scan-side">
              <span className="protocol-scan-icon protocol-scan-icon-blue">P</span>
              <div>
                <p>{market}</p>
                <span>{leftOdds}</span>
              </div>
            </div>
            <span className="protocol-scan-vs">VS</span>
            <div className="protocol-scan-side protocol-scan-side-right">
              <div>
                <p>{market}</p>
                <span>{rightOdds}</span>
              </div>
              <span className="protocol-scan-icon protocol-scan-icon-orange">K</span>
            </div>
          </div>
        ))}
      </div>

      <div className="protocol-detection-card">
        <div className="protocol-detection-top">
          <span className="protocol-scan-icon protocol-scan-icon-blue">P</span>
          <div>
            <p>Fed cuts rates by July 2026?</p>
            <span>YES - 46.5%</span>
          </div>
          <span className="protocol-scan-vs">VS</span>
          <div className="protocol-detection-right">
            <p>Fed cuts rates by July 2026?</p>
            <span>YES - 38.2%</span>
          </div>
          <span className="protocol-scan-icon protocol-scan-icon-orange">K</span>
        </div>

        <div className="protocol-detection-body">
          <div className="protocol-detection-graph" />
          <div className="protocol-detection-copy">
            <strong>ARB DETECTED</strong>
            <span>10.7% spread</span>
            <em>$609 MAX EV</em>
            <small>Execution window open now</small>
          </div>
        </div>
      </div>

      <div className="protocol-panel-footer">
        <div>
          <strong>ARB DETECTED · 10.7% spread</strong>
          <span>Fed cuts rates by July 2026?</span>
        </div>
        <b>$609</b>
      </div>
    </div>
  );
}

function MathVisual() {
  return (
    <div className="protocol-visual protocol-visual-math">
      <div className="protocol-market-head">
        <div className="protocol-market-brand">RB</div>
        <div>
          <span className="protocol-market-label">MARKET</span>
          <h3>F1 Constructors Champion - Red Bull Racing</h3>
        </div>
      </div>

      <div className="protocol-bankroll-input">
        <div className="protocol-bankroll-row">
          <span>WAGER AMOUNT</span>
          <small>Avg Fill: 61.0c / 24.0c</small>
        </div>
        <div className="protocol-bankroll-value">$ 1000</div>
        <div className="protocol-bankroll-pills">
          {['$500', '$1,000', '$2,500', '$5,000', '$10,000'].map((amount, index) => (
            <span key={amount} className={index === 1 ? 'is-active' : ''}>
              {amount}
            </span>
          ))}
        </div>
      </div>

      <div className="protocol-math-summary">
        <div className="protocol-profit-card">
          <span>NET PROFIT</span>
          <strong>+$176.5</strong>
        </div>
        <div className="protocol-roi-stack">
          <div>
            <span>ROI</span>
            <strong>17.65%</strong>
          </div>
          <div>
            <span>RETURN AMOUNT</span>
            <strong>$1,176.5</strong>
          </div>
        </div>
      </div>

      <div className="protocol-legs-grid">
        {[
          ['LEG 1', 'Polymarket', '61c', 'YES', '$0.610', '1.176', '$717.65', '$1,176 ($459)'],
          ['LEG 2', 'Kalshi', '24c', 'NO', '$0.240', '1.176', '$282.35', '$1,176 ($894)'],
        ].map(([leg, venue, price, direction, buyPrice, shares, totalCost, toReturn], index) => (
          <div key={leg} className="protocol-leg-card">
            <div className="protocol-leg-head">
              <span>{leg}</span>
              <strong>{venue}</strong>
              <b>{price}</b>
            </div>
            <dl>
              <div><dt>DIRECTION</dt><dd>{direction}</dd></div>
              <div><dt>BUY PRICE</dt><dd>{buyPrice}</dd></div>
              <div><dt>SHARES</dt><dd>{shares}</dd></div>
              <div><dt>TOTAL COST</dt><dd>{totalCost}</dd></div>
              <div><dt>TO RETURN</dt><dd>{toReturn}</dd></div>
            </dl>
            <button className={index === 0 ? 'protocol-leg-button protocol-leg-button-blue' : 'protocol-leg-button protocol-leg-button-green'}>
              TAKE THE ARB
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertVisual() {
  return (
    <div className="protocol-visual protocol-visual-alert">
      <div className="protocol-telegram-topbar">
        <div className="protocol-telegram-dots">
          <span />
          <span />
          <span />
        </div>
        <span>Telegram</span>
      </div>

      <div className="protocol-telegram-header">
        <div className="protocol-telegram-avatar">A</div>
        <div>
          <strong>ARBSXYZ Bot</strong>
          <span>bot • live notifications</span>
        </div>
      </div>

      <div className="protocol-telegram-feed">
        <div className="protocol-telegram-card protocol-telegram-card-highlight">
          <span>Lock in your $291 Profit</span>
          <button>Click to Sell</button>
          <small>Watching Divergence</small>
        </div>

        <div className="protocol-telegram-card">
          <strong>Peak Detected: MegaETH FDV &gt; $1B</strong>
          <p>16.4% Spread • $402 EV</p>
          <div className="protocol-telegram-lines">
            <span>Polymarket YES</span>
            <span>$1627 @ $0.54</span>
            <span>Opinion NO</span>
            <span>$873 @ $0.29</span>
          </div>
        </div>

        <div className="protocol-telegram-card">
          <strong>Exit Window Open</strong>
          <p>Liquidity improved on both books. Close now to realize profit.</p>
        </div>
      </div>
    </div>
  );
}

const steps: Step[] = [
  {
    number: '01',
    title: 'We Find the Spread',
    description:
      'Our scanner monitors cross-market pricing in real time and surfaces the exact moments where Polymarket and Kalshi disagree enough to create a tradable edge.',
    accent: 'SYSTEM OPTIMIZED',
    layout: 'left',
    renderVisual: () => <ScannerVisual />,
  },
  {
    number: '02',
    title: 'We Do the Math',
    description:
      'The engine sizes both legs, estimates fills, calculates EV and return, and removes manual spreadsheet work before you commit capital.',
    accent: 'SELECT YOUR BANKROLL',
    layout: 'right',
    renderVisual: () => <MathVisual />,
  },
  {
    number: '03',
    title: 'You Lock In Profit',
    description:
      'When the spread peaks, Arbiflow alerts you instantly so you can close into strength and capture the profit without hunting for the exit yourself.',
    accent: 'SYSTEM OPTIMIZED',
    layout: 'left',
    renderVisual: () => <AlertVisual />,
  },
];

export function HowItWorksSection() {
  return (
    <>
      <section className="protocol-cta-band">
        <div className="protocol-cta-band-line" />
        <Link href={AUTH_SIGNUP_HREF} className="protocol-cta-button">
          Start Arbitraging
        </Link>
      </section>

      <section className="protocol-section">
        <div className="container-main">
          <div className="protocol-heading">
            <span className="protocol-heading-pill">The Protocol</span>
            <h2>How It Works:</h2>
          </div>

          <div className="protocol-timeline">
            {steps.map((step) => (
              <article
                key={step.number}
                className={`protocol-step ${step.layout === 'right' ? 'protocol-step-reverse' : ''}`}
              >
                <div className="protocol-step-copy">
                  <div className="protocol-step-number">{step.number}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <div className="protocol-step-foot">
                    <span />
                    <strong>{step.accent}</strong>
                  </div>
                </div>

                <div className="protocol-step-visual">
                  {step.renderVisual()}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
