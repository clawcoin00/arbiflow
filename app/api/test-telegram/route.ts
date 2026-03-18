import { sendTelegram } from '@/src/lib/telegram';

export async function POST() {
  await sendTelegram('✅ Arb Bot: teste de alerta (Telegram) — configuração OK.');
  return Response.json({ ok: true });
}
