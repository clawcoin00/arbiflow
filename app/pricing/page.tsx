"use client";

import { useState } from 'react';

export default function PricingPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onUpgrade = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'checkout_failed');
      if (data.url) window.location.href = data.url;
    } catch (e: any) {
      setError(e.message || 'Erro no checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">ArbiFlow Pricing</h1>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border border-zinc-800 rounded-xl p-4">
            <h2 className="font-semibold text-xl">Free</h2>
            <p className="text-zinc-400">$0</p>
            <ul className="list-disc pl-5 mt-2 text-sm text-zinc-300">
              <li>20 alertas/dia</li>
              <li>Dashboard básico</li>
            </ul>
          </div>
          <div className="border border-emerald-700 rounded-xl p-4">
            <h2 className="font-semibold text-xl">Pro</h2>
            <p className="text-zinc-200">Assinatura mensal</p>
            <ul className="list-disc pl-5 mt-2 text-sm text-zinc-300">
              <li>500 alertas/dia</li>
              <li>Prioridade de alertas</li>
            </ul>
            <div className="mt-4 space-y-2">
              <input
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="w-full bg-emerald-600 hover:bg-emerald-500 rounded px-3 py-2 disabled:opacity-50"
                onClick={onUpgrade}
                disabled={loading || !email}
              >
                {loading ? 'Abrindo checkout...' : 'Upgrade para Pro'}
              </button>
              {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
