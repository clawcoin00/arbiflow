export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container-editorial">
        <div className="max-w-md mx-auto text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-2xl bg-zinc-800/50 border border-zinc-700 flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          {/* Content */}
          <h1 className="heading-display text-3xl text-white mb-4">
            Checkout Cancelled
          </h1>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            No worries — your account remains on the Free plan. You can upgrade anytime when you're ready.
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <a href="/pricing" className="btn-primary block text-center">
              Try Again
            </a>
            <a href="/" className="btn-secondary block text-center">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}