import Link from 'next/link';
import { AUTH_SIGNUP_HREF } from '@/src/lib/routes';

const faqs = [
  {
    question: 'Do I need prior trading experience?',
    answer:
      'No. ArbiFlow is designed to surface mispricings clearly, show the sizing logic, and guide execution without requiring discretionary trading.',
  },
  {
    question: 'Is this legal?',
    answer:
      'The product monitors public prediction markets and surfaces cross-market price differences. Users are responsible for complying with their local rules and platform terms.',
  },
  {
    question: 'How much capital do I need to start?',
    answer:
      'Most users begin with a modest bankroll and scale up once they are comfortable with execution, fills, and platform limits.',
  },
  {
    question: 'Is this guaranteed profit?',
    answer:
      'No market workflow is risk-free. Execution speed, fills, limits, stale quotes, and market changes still matter even when the edge is clear.',
  },
  {
    question: 'Are there risks involved?',
    answer:
      'Yes. Operational delays, slippage, venue restrictions, and bankroll management all affect outcome quality. The system helps reduce risk, not remove it entirely.',
  },
];

const legalItems = ['Terms of Service', 'Disclaimer', 'Privacy Policy', 'Refund Policy', 'Risk Disclosure'];

export function FaqSection() {
  return (
    <>
      <section className="faq-section">
        <div className="container-main">
          <div className="faq-heading">
            <span className="faq-pill">FAQ</span>
            <h2>Frequently Asked Questions</h2>
          </div>

          <div className="faq-list">
            {faqs.map((item) => (
              <details key={item.question} className="faq-item">
                <summary>
                  <span>{item.question}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                  </svg>
                </summary>
                <div className="faq-item-body">
                  <p>{item.answer}</p>
                </div>
              </details>
            ))}
          </div>

          <div className="faq-actions">
            <Link href={AUTH_SIGNUP_HREF} className="faq-access-button">
              Get Access
            </Link>
          </div>
        </div>
      </section>

      <footer className="faq-footer">
        <div className="container-main">
          <div className="faq-footer-links">
            {legalItems.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <p>(c) 2026 ArbiFlow</p>
        </div>
      </footer>
    </>
  );
}
