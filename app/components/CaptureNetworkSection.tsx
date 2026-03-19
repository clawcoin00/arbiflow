import Link from 'next/link';
import { AUTH_SIGNUP_HREF } from '@/src/lib/routes';

const venueRows = [
  { name: 'KALSHI', liquidity: '$82M', sync: '18ms', tone: 'green' },
  { name: 'OPINION', liquidity: '$46M', sync: '16ms', tone: 'orange' },
  { name: 'LIMITLESS', liquidity: '$29M', sync: '22ms', tone: 'lime' },
];

const streamRows = [
  { node: 'SGP_03', target: 'GOLD_REACH_ATH', yield: '+$334.93', roi: '4.1%' },
  { node: 'TYO_09', target: 'SPX_LANDING', yield: '+$511.09', roi: '15.0%' },
  { node: 'FRA_02', target: 'AAPL_REV_Q1', yield: '+$393.00', roi: '9.9%' },
  { node: 'NYC_04', target: 'GOLD_REACH_ATH', yield: '+$64.77', roi: '10.6%' },
  { node: 'TYO_09', target: 'SPX_LANDING', yield: '+$209.36', roi: '4.3%' },
];

export function CaptureNetworkSection() {
  return (
    <>
      <section className="capture-section">
        <div className="container-main">
          <div className="capture-heading">
            <span className="capture-heading-pill">NETWORK_ACTIVITY // 5.5K_ACTIVE_NODES</span>
            <h2>The Fastest Arbitrage Capture in the World.</h2>
          </div>

          <div className="capture-strip-wrap">
            <div className="capture-strip-label">DIRECT LIQUIDITY ACCESS TO</div>
            <div className="capture-strip">
              {venueRows.map((venue) => (
                <div key={venue.name} className="capture-strip-item">
                  <span className={`capture-strip-dot capture-strip-dot-${venue.tone}`} />
                  <strong>{venue.name}</strong>
                  <div>
                    <span>LIQUIDITY</span>
                    <b>{venue.liquidity}</b>
                  </div>
                  <div>
                    <span>SYNC</span>
                    <b>{venue.sync}</b>
                  </div>
                  <em>DIRECT_API</em>
                </div>
              ))}
            </div>
          </div>

          <div className="capture-grid">
            <div className="capture-copy">
              <h3>
                <span>Securing Alpha</span>
                While the World Sleeps.
              </h3>
              <p>
                Our protocol nodes are distributed globally, ensuring you don&apos;t miss a single time-sensitive arb
                opportunity.
              </p>

              <div className="capture-stats">
                <div>
                  <strong>$1.1M</strong>
                  <span>TOTAL CAPTURES</span>
                </div>
                <div>
                  <strong>99.8%</strong>
                  <span>UPTIME AVG</span>
                </div>
              </div>
            </div>

            <div className="capture-terminal">
              <div className="capture-terminal-top">
                <span className="capture-terminal-label">GLOBAL_CAPTURE_STREAM</span>
                <span className="capture-terminal-live">LIVE_SYNC</span>
              </div>

              <div className="capture-terminal-head">
                <span>NODE</span>
                <span>EXECUTION_TARGET</span>
                <span>YIELD</span>
              </div>

              <div className="capture-terminal-body">
                {streamRows.map((row) => (
                  <div key={`${row.node}-${row.target}-${row.yield}`} className="capture-terminal-row">
                    <strong>{row.node}</strong>
                    <span>{row.target}</span>
                    <div>
                      <b>{row.yield}</b>
                      <em>{row.roi}</em>
                    </div>
                  </div>
                ))}
              </div>

              <div className="capture-terminal-footer">
                <span>PROTOCOL INTEGRITY</span>
                <strong>AES-256_ENCRYPTED</strong>
                <span>AVERAGE_SETTLEMENT</span>
                <strong>&lt;2.4ms</strong>
              </div>
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
