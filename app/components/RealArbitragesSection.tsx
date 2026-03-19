import Link from 'next/link';
import { AUTH_SIGNUP_HREF } from '@/src/lib/routes';

type ArbitrageCard = {
  date: string;
  duration: string;
  title: string;
  topVenue: string;
  topSide: string;
  topPrice: string;
  topTone: 'blue';
  bottomVenue: string;
  bottomSide: string;
  bottomPrice: string;
  bottomTone: 'green' | 'amber';
  spread: string;
  ev: string;
  cost: string;
  ref: string;
};

const arbitrageCards: ArbitrageCard[] = [
  {
    date: 'MAR 10, 2026',
    duration: 'TOOK 30 MINS',
    title: 'Will Gavin Newsom Win Election?',
    topVenue: 'POLYMARKET',
    topSide: 'YES',
    topPrice: '58c',
    topTone: 'blue',
    bottomVenue: 'KALSHI',
    bottomSide: 'NO',
    bottomPrice: '35c',
    bottomTone: 'green',
    spread: '6.9%',
    ev: '$1,264',
    cost: 'Combined Cost (YES + NO): 93c',
    ref: 'ARB-2471',
  },
  {
    date: 'MAR 12, 2026',
    duration: 'TOOK 2 DAYS',
    title: 'F1 Drivers Champion',
    topVenue: 'POLYMARKET',
    topSide: 'NO',
    topPrice: '52c',
    topTone: 'blue',
    bottomVenue: 'KALSHI',
    bottomSide: 'YES',
    bottomPrice: '32c',
    bottomTone: 'green',
    spread: '16.4%',
    ev: '$520',
    cost: 'Combined Cost (YES + NO): 84c',
    ref: 'ARB-2539',
  },
  {
    date: 'MAR 14, 2026',
    duration: 'TOOK 7 HOURS',
    title: 'Fed Rate Cut in March?',
    topVenue: 'POLYMARKET',
    topSide: 'NO',
    topPrice: '61c',
    topTone: 'blue',
    bottomVenue: 'OPINION',
    bottomSide: 'YES',
    bottomPrice: '34c',
    bottomTone: 'amber',
    spread: '5%',
    ev: '$900',
    cost: 'Combined Cost (YES + NO): 95c',
    ref: 'ARB-2611',
  },
  {
    date: 'MAR 15, 2026',
    duration: 'TOOK 1 DAY',
    title: 'Next Korean President',
    topVenue: 'POLYMARKET',
    topSide: 'NO',
    topPrice: '54c',
    topTone: 'blue',
    bottomVenue: 'KALSHI',
    bottomSide: 'YES',
    bottomPrice: '35c',
    bottomTone: 'green',
    spread: '11%',
    ev: '$1,016',
    cost: 'Combined Cost (YES + NO): 89c',
    ref: 'ARB-2690',
  },
];

function venueToneClass(tone: ArbitrageCard['topTone'] | ArbitrageCard['bottomTone']) {
  if (tone === 'blue') return 'proof-market-row proof-market-row-blue';
  if (tone === 'amber') return 'proof-market-row proof-market-row-amber';
  return 'proof-market-row proof-market-row-green';
}

export function RealArbitragesSection() {
  return (
    <>
      <section className="proof-cta-band">
        <div className="proof-cta-band-line" />
        <Link href={AUTH_SIGNUP_HREF} className="proof-cta-button">
          Start Arbitraging
        </Link>
      </section>

      <section className="proof-section">
        <div className="container-main">
          <div className="proof-heading">
            <span className="proof-heading-pill">SETTLED_YIELD_AUDIT</span>
            <h2>Real Arbitrages By Our Users</h2>
            <p>
              See how much our users have made by taking advantage of our arbitrage finder.
            </p>
            <div className="proof-heading-meta">42 ARBS DETECTED / HOUR</div>
          </div>

          <div className="proof-grid">
            {arbitrageCards.map((card) => (
              <article key={`${card.date}-${card.title}`} className="proof-card">
                <div className="proof-card-top">
                  <span className="proof-card-date">{card.date}</span>
                  <span className="proof-card-duration">{card.duration}</span>
                </div>

                <h3>{card.title}</h3>

                <div className={venueToneClass(card.topTone)}>
                  <span className="proof-market-pill">
                    {card.topVenue} {card.topSide}
                  </span>
                  <strong>{card.topPrice}</strong>
                </div>

                <div className={venueToneClass(card.bottomTone)}>
                  <span className="proof-market-pill">
                    {card.bottomVenue} {card.bottomSide}
                  </span>
                  <strong>{card.bottomPrice}</strong>
                </div>

                <div className="proof-metrics">
                  <div>
                    <span>SPREAD</span>
                    <strong>{card.spread}</strong>
                  </div>
                  <div>
                    <span>EV</span>
                    <strong>{card.ev}</strong>
                  </div>
                </div>

                <p className="proof-cost">{card.cost}</p>

                <div className="proof-card-footer">
                  <span>SETTLED & VERIFIED</span>
                  <strong>{card.ref}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="proof-cta-band proof-cta-band-bottom">
        <div className="proof-cta-band-line" />
        <Link href={AUTH_SIGNUP_HREF} className="proof-cta-button">
          Start Arbitraging
        </Link>
      </section>
    </>
  );
}
