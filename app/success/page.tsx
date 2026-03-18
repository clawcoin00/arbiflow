export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold">✅ Assinatura confirmada</h1>
        <p className="text-zinc-300">
          Seu pagamento foi processado. Em instantes seu plano Pro será ativado automaticamente.
        </p>
        <a href="/admin" className="underline">Ir para Admin</a>
      </div>
    </main>
  );
}
