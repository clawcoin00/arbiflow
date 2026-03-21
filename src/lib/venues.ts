import type { Platform } from './types';

export type DashboardPair = {
  key: string;
  left: Platform;
  right: Platform;
  label: string;
  navLabel: string;
  accentClass: string;
  iconGlyph: string;
};

export const platformMeta: Record<
  Platform,
  {
    label: string;
    compactLabel: string;
    navLabel: string;
    iconGlyph: string;
    accentClass: string;
    websiteUrl: string;
  }
> = {
  polymarket: {
    label: 'Polymarket',
    compactLabel: 'POLY',
    navLabel: 'Poly',
    iconGlyph: 'P',
    accentClass: 'dashboard-source-polymarket',
    websiteUrl: 'https://polymarket.com',
  },
  opinion: {
    label: 'Opinion',
    compactLabel: 'OPIN',
    navLabel: 'Opinion',
    iconGlyph: 'O',
    accentClass: 'dashboard-source-opinion',
    websiteUrl: 'https://opinion.trade',
  },
  kalshi: {
    label: 'Kalshi',
    compactLabel: 'KLSH',
    navLabel: 'Kalshi',
    iconGlyph: 'K',
    accentClass: 'dashboard-source-kalshi',
    websiteUrl: 'https://kalshi.com',
  },
  probo: {
    label: 'Probo',
    compactLabel: 'PROB',
    navLabel: 'Probo',
    iconGlyph: 'B',
    accentClass: 'dashboard-source-probo',
    websiteUrl: 'https://probo.in',
  },
  predictfun: {
    label: 'Predict.fun',
    compactLabel: 'PRD',
    navLabel: 'Predict.Fun',
    iconGlyph: 'F',
    accentClass: 'dashboard-source-predictfun',
    websiteUrl: 'https://predict.fun',
  },
  limitless: {
    label: 'Limitless',
    compactLabel: 'LMTS',
    navLabel: 'Limitless',
    iconGlyph: 'L',
    accentClass: 'dashboard-source-limitless',
    websiteUrl: 'https://limitless.exchange',
  },
};

function createPairKey(left: Platform, right: Platform) {
  return `${left}::${right}`;
}

function createPair(left: Platform, right: Platform): DashboardPair {
  return {
    key: createPairKey(left, right),
    left,
    right,
    label: `${platformMeta[left].label} / ${platformMeta[right].label}`,
    navLabel: `${platformMeta[left].navLabel} ↔ ${platformMeta[right].navLabel}`,
    accentClass: platformMeta[right].accentClass,
    iconGlyph: platformMeta[right].iconGlyph,
  };
}

export const dashboardPairs: DashboardPair[] = [
  createPair('polymarket', 'opinion'),
  createPair('polymarket', 'kalshi'),
  createPair('polymarket', 'probo'),
  createPair('polymarket', 'predictfun'),
  createPair('polymarket', 'limitless'),
];

const pairMeta = new Map(dashboardPairs.map((pair) => [pair.key, pair]));

export function getPlatformLabel(platform: Platform) {
  return platformMeta[platform].label;
}

export function getPlatformWebsite(platform: Platform) {
  return platformMeta[platform].websiteUrl;
}

export function getPairMeta(pairKey: string) {
  return pairMeta.get(pairKey) ?? null;
}

export function getPairKey(left: Platform, right: Platform) {
  return createPairKey(left, right);
}
