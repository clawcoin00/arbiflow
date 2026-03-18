import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ArbiFlow — Real-Time Arbitrage Alerts',
  description: 'Detect arbitrage opportunities between Polymarket and Kalshi with real-time alerts.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 antialiased">{children}</body>
    </html>
  );
}