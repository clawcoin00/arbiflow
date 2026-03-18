export default function CancelPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold">Checkout cancelado</h1>
        <p className="text-zinc-300">Sem problemas — você pode tentar novamente quando quiser.</p>
        <a href="/pricing" className="underline">Voltar para Pricing</a>
      </div>
    </main>
  );
}
