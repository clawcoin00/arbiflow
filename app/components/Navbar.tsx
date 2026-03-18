"use client";

import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center font-bold text-zinc-900">
            A
          </div>
          <span className="text-xl font-bold">ArbiFlow</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-zinc-400 hover:text-zinc-100 transition-colors">
            Dashboard
          </Link>
          <Link href="/pricing" className="text-zinc-400 hover:text-zinc-100 transition-colors">
            Pricing
          </Link>
          <Link href="/admin" className="text-zinc-400 hover:text-zinc-100 transition-colors">
            Admin
          </Link>
          <a
            href="https://t.me/ArbiFlowAnnouncements"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm px-4 py-2"
          >
            Join Telegram
          </a>
        </div>
      </div>
    </nav>
  );
}