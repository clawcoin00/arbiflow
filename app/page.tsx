import { detectOpportunities } from '@/src/lib/arbitrage';
import { config } from '@/src/lib/config';
import { fetchAllQuotes } from '@/src/lib/sources';

async function loadData() {
  try {
    const { polymarket, kalshi } = await fetchAllQuotes();
    const opportunities = detectOpportunities(polymarket, kalshi, config.alertEdgeMin);
    return {
      threshold: config.alertEdgeMin,
      opportunities,
      generatedAt: new Date().toISOString(),
      usingMock: !config.sources.polymarketApiBase || !config.sources.kalshiApiBase,
      recentCount: opportunities.length,
    };
  } catch {
    return {
      threshold: config.alertEdgeMin,
      opportunities: [],
      generatedAt: new Date().toISOString(),
      usingMock: true,
      recentCount: 0,
    };
  }
}

export default async function Home() {
  const data = await loadData();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">ArbiFlow — Polymarket × Kalshi (Alerts Only)</h1>
          <p className="text-zinc-300">
            MVP informativo: detecta oportunidades e envia alertas no Telegram (sem execução de trade).
          </p>
          <div className="text-sm text-zinc-400">
            Threshold: {(data.threshold * 100).toFixed(2)}% • Source: {data.usingMock ? 'Mock fallback' : 'Live API'} • Opportunities: {data.recentCount} • Updated:{' '}
            {new Date(data.generatedAt).toLocaleString()}
          </div>
        </header>

        <section className="rounded-xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-300">
              <tr>
                <th className="text-left p-3">Event</th>
                <th className="text-left p-3">Outcome</th>
                <th className="text-right p-3">Polymarket</th>
                <th className="text-right p-3">Kalshi</th>
                <th className="text-right p-3">Edge</th>
              </tr>
            </thead>
            <tbody>
              {data.opportunities.length === 0 ? (
                <tr>
                  <td className="p-4 text-zinc-400" colSpan={5}>
                    Nenhuma oportunidade acima do threshold no momento.
                  </td>
                </tr>
              ) : (
                data.opportunities.map((op) => (
                  <tr key={`${op.eventKey}-${op.outcome}`} className="border-t border-zinc-800">
                    <td className="p-3">{op.eventKey}</td>
                    <td className="p-3">{op.outcome}</td>
                    <td className="p-3 text-right">{op.polymarket.price.toFixed(3)}</td>
                    <td className="p-3 text-right">{op.kalshi.price.toFixed(3)}</td>
                    <td className="p-3 text-right font-semibold text-emerald-400">{op.percentEdge.toFixed(2)}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        <section className="text-sm text-zinc-400 space-y-1">
          <div>API endpoints:</div>
          <div>• GET /api/opportunities</div>
          <div>• POST /api/scan (detecta e envia alertas Telegram)</div>
          <div>• POST /api/test-telegram</div>
        </section>
      </div>
    </main>
  );
}
