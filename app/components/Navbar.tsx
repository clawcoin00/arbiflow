"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/src/components/BrandLogo';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BrandLogo variant="full" height={28} />
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

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <button
            aria-label="Close menu backdrop"
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 top-0 h-full w-72 bg-zinc-900 border-l border-zinc-800 p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-300 font-semibold">Menu</span>
              <button
                className="p-2 text-zinc-400 hover:text-zinc-100"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <Link
              href="/"
              className="block text-zinc-300 hover:text-zinc-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/pricing"
              className="block text-zinc-300 hover:text-zinc-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/admin"
              className="block text-zinc-300 hover:text-zinc-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
            <a
              href="https://t.me/+zWZEAjCoUjM0YTk5"
              target="_blank"
              rel="noopener noreferrer"
              className="block btn-primary text-center text-sm px-4 py-2 mt-2"
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
