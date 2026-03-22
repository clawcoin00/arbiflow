import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container-editorial">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="heading-display text-3xl text-white mb-4">
            Welcome to <span className="gradient-text">Pro</span>
          </h1>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            Your subscription has been confirmed. You now have access to 500 alerts per day with priority delivery and premium edge signals.
          </p>

          <div className="space-y-3">
            <Link href="/" className="btn-primary block text-center">
              Go to Dashboard
            </Link>
            <Link href="/admin" className="btn-secondary block text-center">
              View Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
