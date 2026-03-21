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

type DetectionPoint = [number, number];

const detectionUpperPoints: DetectionPoint[] = [
  [0, 148],
  [72, 134],
  [138, 122],
  [208, 116],
  [278, 120],
  [352, 118],
  [434, 121],
  [516, 124],
  [590, 118],
  [664, 104],
  [734, 92],
  [804, 86],
  [874, 78],
  [936, 84],
  [1000, 82],
];

const detectionLowerPoints: DetectionPoint[] = [
  [0, 164],
  [72, 150],
  [138, 138],
  [208, 132],
  [278, 136],
  [352, 132],
  [434, 134],
  [516, 148],
  [590, 196],
  [664, 258],
  [734, 352],
  [804, 432],
  [874, 470],
  [936, 512],
  [1000, 518],
];

const detectionGridY = [72, 176, 280, 384, 488];
const detectionGridX = [136, 336, 536, 736, 936];

function buildSmoothPath(points: DetectionPoint[]) {
  if (points.length === 0) {
    return '';
  }

  if (points.length === 1) {
    return `M ${points[0][0]} ${points[0][1]}`;
  }

  let path = `M ${points[0][0]} ${points[0][1]}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[index - 1] ?? points[index];
    const current = points[index];
    const next = points[index + 1];
    const upcoming = points[index + 2] ?? next;

    const controlPointOneX = current[0] + (next[0] - previous[0]) / 6;
    const controlPointOneY = current[1] + (next[1] - previous[1]) / 6;
    const controlPointTwoX = next[0] - (upcoming[0] - current[0]) / 6;
    const controlPointTwoY = next[1] - (upcoming[1] - current[1]) / 6;

    path += ` C ${controlPointOneX} ${controlPointOneY}, ${controlPointTwoX} ${controlPointTwoY}, ${next[0]} ${next[1]}`;
  }

  return path;
}

function buildAreaPath(upper: DetectionPoint[], lower: DetectionPoint[]) {
  const upperPath = upper.map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
  const lowerPath = [...lower].reverse().map(([x, y]) => `L ${x} ${y}`).join(' ');

  return `${upperPath} ${lowerPath} Z`;
}

const detectionUpperPath = buildSmoothPath(detectionUpperPoints);
const detectionLowerPath = buildSmoothPath(detectionLowerPoints);
const detectionAreaPath = buildAreaPath(detectionUpperPoints, detectionLowerPoints);
const detectionUpperEnd = detectionUpperPoints[detectionUpperPoints.length - 1];
const detectionLowerEnd = detectionLowerPoints[detectionLowerPoints.length - 1];

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
          <div className="protocol-detection-graph" aria-hidden="true">
            <div className="protocol-detection-sweep" />
            <svg className="protocol-detection-svg" viewBox="0 0 1000 520" preserveAspectRatio="none">
              <defs>
                <linearGradient id="protocol-detection-fill-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.08" />
                  <stop offset="58%" stopColor="#10b981" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.28" />
                </linearGradient>
                <pattern id="protocol-detection-hatch" width="18" height="18" patternUnits="userSpaceOnUse">
                  <path
                    d="M-4 18 L18 -4 M4 22 L22 4 M-8 10 L10 -8"
                    fill="none"
                    stroke="rgba(110, 231, 183, 0.22)"
                    strokeWidth="2"
                  />
                  <animateTransform
                    attributeName="patternTransform"
                    type="translate"
                    values="0 0;18 0;0 0"
                    dur="5.8s"
                    repeatCount="indefinite"
                  />
                </pattern>
              </defs>

              <g className="protocol-detection-grid-lines">
                {detectionGridY.map((y) => (
                  <line key={`grid-y-${y}`} x1="0" y1={y} x2="1000" y2={y} />
                ))}
                {detectionGridX.map((x) => (
                  <line key={`grid-x-${x}`} x1={x} y1="0" x2={x} y2="520" />
                ))}
              </g>

              <path className="protocol-detection-area" d={detectionAreaPath} />
              <path className="protocol-detection-area-hatch" d={detectionAreaPath} />
              <path className="protocol-detection-line protocol-detection-line-upper" d={detectionUpperPath} />
              <path className="protocol-detection-line protocol-detection-line-lower" d={detectionLowerPath} />
              <circle
                className="protocol-detection-node protocol-detection-node-upper"
                cx={detectionUpperEnd[0]}
                cy={detectionUpperEnd[1]}
                r="8"
              />
              <circle
                className="protocol-detection-node protocol-detection-node-lower"
                cx={detectionLowerEnd[0]}
                cy={detectionLowerEnd[1]}
                r="7"
              />
            </svg>
          </div>
          <div className="protocol-detection-copy">
            <strong>ARB DETECTED</strong>
            <span>10.7% spread</span>
            <em>$609 MAX EV</em>
            <small>Execution window open now</small>
          </div>
        </div>
        <span className="protocol-telegram-live-badge">LIVE</span>
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
        <div className="protocol-market-brand" aria-hidden="true">
          <svg className="protocol-market-brand-logo" viewBox="0 0 168 92" role="presentation" focusable="false">
            <defs>
              <linearGradient id="protocol-market-brand-surface" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#f5f7fb" />
              </linearGradient>
            </defs>

            <rect x="2" y="2" width="164" height="88" rx="18" fill="url(#protocol-market-brand-surface)" />

            <circle cx="64" cy="28" r="16" fill="#fbbf24" />
            <circle cx="88" cy="28" r="16" fill="#fbbf24" />

            <path
              d="M18 35 L30 25 L46 24 L40 30 L54 33 L39 37 L32 46 L18 46 L24 38 L12 36 Z"
              fill="#ef233c"
            />
            <path
              d="M134 35 L122 25 L106 24 L112 30 L98 33 L113 37 L120 46 L134 46 L128 38 L140 36 Z"
              fill="#ef233c"
            />

            <path d="M42 18 L48 12 L46 20 Z" fill="#ef233c" />
            <path d="M126 18 L120 12 L122 20 Z" fill="#ef233c" />

            <text
              x="84"
              y="72"
              textAnchor="middle"
              fill="#ef233c"
              fontSize="25"
              fontWeight="900"
              fontFamily="Arial, Helvetica, sans-serif"
              letterSpacing="-1"
            >
              RedBull
            </text>
          </svg>
        </div>
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
        <div className="protocol-telegram-avatar">AF</div>
        <div>
          <strong>ArbiFlow Bot</strong>
          <span>bot • live notifications</span>
        </div>
      </div>

      <div className="protocol-telegram-feed">
        <div className="protocol-telegram-feed-track">
        <div className="protocol-telegram-card protocol-telegram-card-highlight">
          <span>Lock in your $291 Profit</span>
          <button>
            <svg className="protocol-telegram-button-icon" viewBox="0 0 16 16" role="presentation" focusable="false">
              <path
                d="M14.4 2.1 1.8 7.2c-.8.3-.7 1.4.2 1.6l4.6 1.1 1.1 4.6c.2.9 1.3 1 1.6.2l5.1-12.6c.3-.8-.5-1.6-1.3-1.3Z"
                fill="currentColor"
              />
              <path d="M6.9 9.1 14 2" stroke="#04110a" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            Click to Sell
          </button>
          <small>Watching Divergence</small>
        </div>

        <div className="protocol-telegram-card protocol-telegram-card-event">
          <strong>Peak Detected: MegaETH FDV &gt; $1B</strong>
          <p>16.4% Spread • $402 EV</p>
          <div className="protocol-telegram-lines">
            <span>Polymarket YES</span>
            <span>$1627 @ $0.54</span>
            <span>Kalshi NO</span>
            <span>$873 @ $0.29</span>
          </div>
        </div>

        <div className="protocol-telegram-card protocol-telegram-card-fill">
          <span className="protocol-telegram-card-eyebrow">Trade Filled</span>
          <strong>Position synced across both books</strong>
          <div className="protocol-telegram-lines">
            <span>Polymarket YES</span>
            <span>$1647 @ $0.56</span>
            <span>Kalshi NO</span>
            <span>$853 @ $0.29</span>
          </div>
        </div>

        <div className="protocol-telegram-card protocol-telegram-card-highlight protocol-telegram-card-highlight-secondary">
          <span>Lock in your $186 Profit</span>
          <button>
            <svg className="protocol-telegram-button-icon" viewBox="0 0 16 16" role="presentation" focusable="false">
              <path
                d="M14.4 2.1 1.8 7.2c-.8.3-.7 1.4.2 1.6l4.6 1.1 1.1 4.6c.2.9 1.3 1 1.6.2l5.1-12.6c.3-.8-.5-1.6-1.3-1.3Z"
                fill="currentColor"
              />
              <path d="M6.9 9.1 14 2" stroke="#04110a" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            Click to Sell
          </button>
          <small>Entry Filled</small>
        </div>

        <div className="protocol-telegram-card protocol-telegram-card-exit">
          <strong>Exit Window Open</strong>
          <p>Liquidity improved on both books. Close now to realize profit.</p>
          <div className="protocol-telegram-status-row">
            <span>Latency 41ms</span>
            <span>Route stable</span>
          </div>
        </div>
        </div>
        <div className="protocol-telegram-scrollbar" aria-hidden="true">
          <span />
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
