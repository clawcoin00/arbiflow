export type Platform = 'polymarket' | 'opinion' | 'kalshi' | 'probo' | 'predictfun' | 'limitless';

export type Outcome = 'YES' | 'NO';

export interface MarketQuote {
  platform: Platform;
  eventKey: string; // normalized event identity used to match cross-platform markets
  marketKey: string; // unique key inside platform
  title: string;
  outcome: Outcome;
  price: number; // 0..1 probability-like price
  volume24h?: number;
  updatedAt: string;
  url?: string;
}

export interface Opportunity {
  eventKey: string;
  outcome: Outcome;
  pairKey: string;
  sourceA: MarketQuote;
  sourceB: MarketQuote;
  edge: number; // absolute spread between platforms (0..1)
  percentEdge: number; // edge * 100
  detectedAt: string;
}
