export const config = {
  alertEdgeMin: Number(process.env.ALERT_EDGE_MIN ?? '0.05'),
  alertCooldownMs: Number(process.env.ALERT_COOLDOWN_MS ?? `${30 * 60 * 1000}`),
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN ?? '',
    chatId: process.env.TELEGRAM_CHAT_ID ?? '',
  },
  sources: {
    polymarketApiBase: process.env.POLYMARKET_API_BASE ?? '',
    kalshiApiBase: process.env.KALSHI_API_BASE ?? '',
  },
};
