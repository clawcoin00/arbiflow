import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import Link from 'next/link';

export default function CancelPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Checkout Cancelled</h1>
          <p className="text-zinc-400 mb-8">
            No worries! Your account remains on the Free plan. You can upgrade anytime.
          </p>
          <div className="space-y-3">
            <Link href="/pricing" className="btn-primary block">
              Try Again
            </Link>
            <Link href="/" className="btn-secondary block">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}