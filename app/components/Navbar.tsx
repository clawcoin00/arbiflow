"use client";

import { useState } from 'react';
import Link from 'next/link';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center font-bold text-zinc-900">
            A
          </div>
          <span className="text-xl font-bold">ArbsFlow</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
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
            href="https://t.me/+zWZEAjCoUjM0YTk5"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm px-4 py-2"
          >
            Join Telegram
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-zinc-900 border-b border-zinc-800">
          <div className="px-6 py-4 space-y-4">
            <Link
              href="/"
              className="block text-zinc-400 hover:text-zinc-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/pricing"
              className="block text-zinc-400 hover:text-zinc-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/admin"
              className="block text-zinc-400 hover:text-zinc-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
            <a
              href="https://t.me/+zWZEAjCoUjM0YTk5"
              target="_blank"
              rel="noopener noreferrer"
              className="block btn-primary text-center text-sm px-4 py-2"
              onClick={() => setIsOpen(false)}
            >
              Join Telegram
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
