import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">
            Welcome to <span className="gradient-text">Pro</span>!
          </h1>
          <p className="text-zinc-400 mb-8">
            Your subscription has been confirmed. You now have access to 500 alerts per day with priority delivery.
          </p>
          <div className="space-y-3">
            <Link href="/" className="btn-primary block">
              Go to Dashboard
            </Link>
            <Link href="/admin" className="btn-secondary block">
              View Account
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}