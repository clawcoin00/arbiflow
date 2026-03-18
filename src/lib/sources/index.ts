import { fetchKalshi } from './kalshi';
import { fetchPolymarket } from './polymarket';
import { config } from '../config';

export async function fetchAllQuotes() {
  const [polymarket, kalshi] = await Promise.all([
    fetchPolymarket(config.sources.polymarketApiBase),
    fetchKalshi(config.sources.kalshiApiBase),
  ]);

  return { polymarket, kalshi };
}
