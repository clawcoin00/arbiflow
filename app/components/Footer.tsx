export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950/50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center font-bold text-zinc-900 text-xs">
              A
            </div>
            <span className="font-semibold">ArbiFlow</span>
          </div>
          <p className="text-zinc-500 text-sm">
            © 2026 ArbiFlow. Real-time arbitrage alerts for prediction markets.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://t.me/+zWZEAjCoUjM0YTk5" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-100 transition-colors">
              Telegram
            </a>
            <a href="https://github.com/clawcoin00/arbiflow" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-100 transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}