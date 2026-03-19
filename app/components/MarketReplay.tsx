"use client";

import { useEffect, useState } from 'react';

const blueSeries = [
  0.42, 0.56, 0.48, 0.71, 0.63, 0.79, 0.54, 0.46,
  0.82, 0.57, 0.39, 0.44, 0.31, 0.36, 0.28, 0.24,
  0.26, 0.22, 0.18, 0.17, 0.43, 0.54, 0.81, 0.63,
  0.72, 0.58, 0.41, 0.38, 0.47, 0.82, 0.64, 0.71,
];

const orangeSeries = [
  0.47, 0.51, 0.55, 0.58, 0.61, 0.75, 0.69, 0.68,
  0.67, 0.42, 0.45, 0.46, 0.21, 0.25, 0.32, 0.44,
  0.31, 0.30, 0.29, 0.22, 0.28, 0.29, 0.47, 0.53,
  0.50, 0.70, 0.55, 0.57, 0.52, 0.42, 0.46, 0.69,
];

const replayEvents = [
  { index: 8, label: "BUY", tone: "buy" as const, series: "blue" as const, offset: -14 },
  { index: 13, label: "SELL", tone: "sell" as const, series: "orange" as const, offset: -8 },
  { index: 22, label: "BUY", tone: "buy" as const, series: "blue" as const, offset: -18 },
  { index: 25, label: "SELL", tone: "sell" as const, series: "orange" as const, offset: -12 },
  { index: 29, label: "BUY", tone: "buy" as const, series: "blue" as const, offset: -18 },
];

const axisLabels = [
  { index: 8, label: "20 Feb" },
  { index: 16, label: "23 Feb" },
  { index: 24, label: "27 Feb" },
  { index: 31, label: "02 Mar" },
];

const replayLoopDurationMs = 9400;
const replayLineDurationMs = 7600;
const replaySpreadMultiplier = 16.25;
const replayProfitMultiplier = 128;

const chartWidth = 1040;
const chartHeight = 430;
const chartPadding = {
  top: 38,
  right: 18,
  bottom: 40,
  left: 16,
};

const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;

function getX(index: number) {
  return chartPadding.left + (index / (blueSeries.length - 1)) * plotWidth;
}

function getY(value: number) {
  return chartPadding.top + (1 - value) * plotHeight;
}

function buildStepPath(series: number[]) {
  return series.reduce((path, value, index) => {
    const x = getX(index);
    const y = getY(value);

    if (index === 0) {
      return `M ${x} ${y}`;
    }

    return `${path} H ${x} V ${y}`;
  }, "");
}

function formatReplayPrice(value: number) {
  return `$${(0.35 + value * 0.32).toFixed(3)}`;
}

function getEventDelay(index: number) {
  const progress = index / (blueSeries.length - 1);
  return 600 + progress * 5800;
}

const bluePath = buildStepPath(blueSeries);
const orangePath = buildStepPath(orangeSeries);
const spreadSeries = blueSeries.map((value, index) => Math.abs(value - orangeSeries[index]));
const recordSpreadSeries = spreadSeries.reduce<number[]>((history, value, index) => {
  const previous = index === 0 ? 0 : history[index - 1];
  history.push(Math.max(previous, value));
  return history;
}, []);
const replayMetricsSeries = blueSeries.map((value, index) => {
  const liveSpread = spreadSeries[index] * replaySpreadMultiplier;
  const recordSpread = recordSpreadSeries[index] * replaySpreadMultiplier;
  const totalProfit = Math.round(recordSpread * replayProfitMultiplier);

  return {
    liveSpreadLabel: `${liveSpread.toFixed(2)}%`,
    recordSpreadLabel: `${recordSpread.toFixed(2)}%`,
    totalProfitLabel: `$${totalProfit}`,
    bluePriceLabel: formatReplayPrice(value),
    orangePriceLabel: formatReplayPrice(orangeSeries[index]),
  };
});

export function MarketReplay() {
  const [cycle, setCycle] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const startedAt = performance.now();

    const tick = () => {
      const elapsed = performance.now() - startedAt;
      const progress = Math.min(elapsed / replayLineDurationMs, 1);
      const nextIndex = Math.min(
        Math.floor(progress * (blueSeries.length - 1)),
        blueSeries.length - 1,
      );

      setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
    };

    tick();

    const tickIntervalId = window.setInterval(tick, 90);
    const cycleTimeoutId = window.setTimeout(() => {
      setActiveIndex(0);
      setCycle((current) => current + 1);
    }, replayLoopDurationMs);

    return () => {
      window.clearInterval(tickIntervalId);
      window.clearTimeout(cycleTimeoutId);
    };
  }, [cycle]);

  const currentMetrics = replayMetricsSeries[activeIndex];

  return (
    <section className="replay-section animate-fade-in animate-delay-4">
      <div className="container-main">
        <div className="replay-copy">
          <span className="section-label">Live Replay</span>
          <p className="replay-copy-text">
            A filled Arbiflow trade, visualized in the same dark terminal-style language users expect from premium arbitrage tools.
          </p>
        </div>

        <div className="replay-shell">
          <div className="replay-window-bar">
            <div className="replay-window-dots" aria-hidden="true">
              <span className="replay-window-dot" />
              <span className="replay-window-dot" />
              <span className="replay-window-dot" />
            </div>
            <span className="replay-window-label">LIVE ARBITRAGE REPLAY [ SIMULATED FLOW ]</span>
          </div>

          <div className="replay-cycle">
            <div className="replay-header">
              <div className="replay-market-card replay-animate-in" style={{ animationDelay: '120ms' }}>
                <div className="replay-market-icon" aria-hidden="true">
                  <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
                    <path
                      d="M23 6L9.5 34.5H18.5L23 25L27.5 34.5H36.5L23 6Z"
                      fill="#04110A"
                    />
                    <path
                      d="M23 12.25L16.1 26.75H20.35L23 21.1L25.65 26.75H29.9L23 12.25Z"
                      fill="#22C55E"
                    />
                  </svg>
                </div>

                <div className="replay-market-copy">
                  <div className="replay-market-row">
                    <span className="replay-market-pill replay-market-pill-blue">Polymarket</span>
                    <span className="replay-market-question">ETH ETF approved before Jun 30?</span>
                  </div>
                  <div className="replay-market-row">
                    <span className="replay-market-pill replay-market-pill-orange">Kalshi</span>
                    <span className="replay-market-question">Matched YES contract reprices slower on news.</span>
                  </div>
                  <p className="replay-market-note">
                    Arbiflow watches both books, flags the spread, and shows where entries and exits lock the edge.
                  </p>
                </div>
              </div>

              <div className="replay-stat-grid">
                <div className="replay-stat-card replay-animate-in" style={{ animationDelay: '180ms' }}>
                  <strong aria-live="off">
                    <span
                      key={`live-${cycle}-${currentMetrics.liveSpreadLabel}`}
                      className="replay-stat-number"
                    >
                      {currentMetrics.liveSpreadLabel}
                    </span>
                  </strong>
                  <span>Live spread</span>
                </div>
                <div className="replay-stat-card replay-animate-in" style={{ animationDelay: '260ms' }}>
                  <strong aria-live="off">
                    <span
                      key={`record-${cycle}-${currentMetrics.recordSpreadLabel}`}
                      className="replay-stat-number"
                    >
                      {currentMetrics.recordSpreadLabel}
                    </span>
                  </strong>
                  <span>Best spread</span>
                </div>
                <div className="replay-stat-card replay-stat-card-profit replay-animate-in" style={{ animationDelay: '340ms' }}>
                  <strong aria-live="off">
                    <span
                      key={`profit-${cycle}-${currentMetrics.totalProfitLabel}`}
                      className="replay-stat-number replay-stat-number-profit"
                    >
                      {currentMetrics.totalProfitLabel}
                    </span>
                  </strong>
                  <span>Locked profit</span>
                </div>
              </div>
            </div>

            <div className="replay-chart-shell replay-animate-in" style={{ animationDelay: '420ms' }}>
              <div className="replay-chart-scroll">
                <div key={cycle} className="replay-chart-stage">
                  <div className="replay-chart-glow" aria-hidden="true" />

                  <div className="replay-chart-callout replay-animate-in" style={{ animationDelay: '560ms' }}>
                    <span className="replay-chart-callout-icon">+</span>
                    Positions sold. Profit locked in.
                  </div>

                  <div className="replay-profit-flash" aria-hidden="true">
                    {currentMetrics.recordSpreadLabel} ARBITRAGE! {currentMetrics.totalProfitLabel} LOCKED
                  </div>

                  <svg
                    className="replay-chart-svg"
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    role="img"
                    aria-label="Replay chart comparing Polymarket and Kalshi prices over time."
                  >
                    {Array.from({ length: 5 }, (_, index) => {
                      const y = chartPadding.top + (plotHeight / 4) * index;
                      return (
                        <line
                          key={`grid-y-${index}`}
                          x1={chartPadding.left}
                          y1={y}
                          x2={chartWidth - chartPadding.right}
                          y2={y}
                          stroke="rgba(255,255,255,0.07)"
                          strokeDasharray="4 8"
                        />
                      );
                    })}

                    {Array.from({ length: 4 }, (_, index) => {
                      const x = chartPadding.left + (plotWidth / 4) * (index + 1);
                      return (
                        <line
                          key={`grid-x-${index}`}
                          x1={x}
                          y1={chartPadding.top}
                          x2={x}
                          y2={chartHeight - chartPadding.bottom}
                          stroke="rgba(255,255,255,0.045)"
                          strokeDasharray="4 12"
                        />
                      );
                    })}

                    {replayEvents.map((event) => {
                      const series = event.series === "blue" ? blueSeries : orangeSeries;
                      const x = getX(event.index);
                      const y = getY(series[event.index]);
                      const labelY = Math.max(chartPadding.top + 12, y - 28 + event.offset);
                      const toneFill = event.tone === "buy" ? "#22C55E" : "#EF4444";
                      const toneStroke = event.tone === "buy" ? "rgba(74, 222, 128, 0.55)" : "rgba(248, 113, 113, 0.65)";
                      const lineDash = event.tone === "buy" ? undefined : "6 8";
                      const eventDelay = `${getEventDelay(event.index)}ms`;

                      return (
                        <g key={`${event.label}-${event.index}`}>
                          <line
                            x1={x}
                            y1={chartPadding.top}
                            x2={x}
                            y2={chartHeight - chartPadding.bottom}
                            stroke={toneStroke}
                            strokeDasharray={lineDash}
                            className="replay-event-line"
                            style={{ animationDelay: eventDelay }}
                          />
                          <rect
                            x={x - 28}
                            y={labelY}
                            width="56"
                            height="26"
                            rx="8"
                            fill={toneFill}
                            stroke="rgba(255,255,255,0.22)"
                            className="replay-event-badge"
                            style={{ animationDelay: eventDelay }}
                          />
                          <text
                            x={x}
                            y={labelY + 17}
                            textAnchor="middle"
                            fill="#F8FAFC"
                            fontSize="11"
                            fontWeight="700"
                            letterSpacing="0.08em"
                            className="replay-event-badge"
                            style={{ animationDelay: eventDelay }}
                          >
                            {event.label}
                          </text>
                        </g>
                      );
                    })}

                    <path
                      d={bluePath}
                      className="replay-line replay-line-blue"
                      pathLength={1}
                    />
                    <path
                      d={orangePath}
                      className="replay-line replay-line-orange"
                      pathLength={1}
                    />

                    {[blueSeries, orangeSeries].map((series, seriesIndex) => {
                      const lastIndex = series.length - 1;
                      const x = getX(lastIndex);
                      const y = getY(series[lastIndex]);
                      const color = seriesIndex === 0 ? "#3B82F6" : "#F97316";
                      const pointDelay = `${replayLineDurationMs - 320}ms`;

                      return (
                        <g
                          key={`last-point-${seriesIndex}`}
                          className="replay-endpoint"
                          style={{ animationDelay: pointDelay }}
                        >
                          <circle cx={x} cy={y} r="11" fill={color} opacity="0.15" />
                          <circle cx={x} cy={y} r="4.5" fill={color} stroke="#E4E4E7" strokeWidth="1.5" />
                        </g>
                      );
                    })}

                    {axisLabels.map((label) => (
                      <text
                        key={label.label}
                        x={getX(label.index)}
                        y={chartHeight - 12}
                        textAnchor={label.index === blueSeries.length - 1 ? "end" : "middle"}
                        fill="#6B7280"
                        fontSize="11"
                        letterSpacing="0.08em"
                      >
                        {label.label}
                      </text>
                    ))}
                  </svg>

                  <div className="replay-legend replay-animate-in" style={{ animationDelay: '760ms' }}>
                    <div className="replay-legend-row">
                      <span className="replay-legend-swatch replay-legend-swatch-blue" />
                      <span>Polymarket YES</span>
                      <strong>{currentMetrics.bluePriceLabel}</strong>
                    </div>
                    <div className="replay-legend-row">
                      <span className="replay-legend-swatch replay-legend-swatch-orange" />
                      <span>Kalshi YES</span>
                      <strong>{currentMetrics.orangePriceLabel}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
