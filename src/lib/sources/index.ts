import { fetchKalshi } from './kalshi';
import { fetchLimitless } from './limitless';
import { fetchOpinion } from './opinion';
import { fetchPolymarket } from './polymarket';
import { fetchPredictFun } from './predictfun';
import { fetchProbo } from './probo';
import { config } from '../config';

export async function fetchAllQuotes() {
  const [polymarket, opinion, kalshi, probo, predictfun, limitless] = await Promise.all([
    fetchPolymarket(config.sources.polymarketApiBase),
    fetchOpinion(config.sources.opinionApiBase, config.sources.opinionApiKey),
    fetchKalshi(config.sources.kalshiApiBase),
    fetchProbo(config.sources.proboApiBase),
    fetchPredictFun(config.sources.predictfunApiBase, config.sources.predictfunApiKey),
    fetchLimitless(config.sources.limitlessApiBase, config.sources.limitlessApiKey),
  ]);

  return { polymarket, opinion, kalshi, probo, predictfun, limitless };
}
