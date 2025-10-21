'use client';

import React, { useState, useEffect } from 'react';
import { useCommodityPrices, useFinancialData } from '@/hooks/use-live-data';
import { TrendingUp, TrendingDown, RefreshCw, Activity, AlertTriangle, DollarSign, Zap, CheckCircle, Database } from 'lucide-react';
import { Card } from '@/components/ui/card';
import PlatformMetricsBar from '@/components/integrated/platform-metrics-bar';

interface LiveConstraintData {
  gasPrice: {
    price: number;
    change: number;
    changePercent: number;
  };
  demand: Array<{ period: string; value: number; units: string }>;
  weather: {
    temperature: number;
    conditions: string;
    windSpeed: number;
  };
  constraints: Array<{
    id: string;
    type: string;
    severity: string;
    description: string;
    estimatedImpact: number;
    dataSource: string;
    confidence: number;
  }>;
  summary: {
    constraintsDetected: number;
    criticalAlerts: number;
    totalExposure: number;
  };
}

interface BacktestData {
  summary: {
    totalEvents: number;
    totalActualLosses: number;
    totalSavings: number;
    roi: number;
    timeAdvantage: number;
    confidence: number;
  };
  conclusions: {
    provenROI: string;
    totalValueDelivered: string;
    averageDetectionSpeed: string;
    confidence: string;
  };
}

/**
 * Live Market Feed Component
 * Displays real-time commodity prices and market data
 */
const LiveMarketFeed: React.FC = () => {
  const { data: commodities, isLoading: commoditiesLoading, lastUpdated: commoditiesUpdated, refetch: refetchCommodities } = useCommodityPrices(true);
  const { data: financial, isLoading: financialLoading, lastUpdated: financialUpdated } = useFinancialData(true);

  // Constraint monitoring state
  const [liveData, setLiveData] = useState<LiveConstraintData | null>(null);
  const [backtestData, setBacktestData] = useState<BacktestData | null>(null);
  const [constraintLoading, setConstraintLoading] = useState(true);

  // Fetch constraint data
  useEffect(() => {
    const fetchConstraintData = async () => {
      try {
        const [liveResponse, backtestResponse] = await Promise.all([
          fetch('/api/v1/live-monitoring?type=all'),
          fetch('/api/v1/backtest')
        ]);

        const liveJson = await liveResponse.json();
        const backtestJson = await backtestResponse.json();

        if (liveJson.success) {
          setLiveData(liveJson.data);
        }

        if (backtestJson.success) {
          setBacktestData(backtestJson.data);
        }
      } catch (error) {
        console.error('Error fetching constraint data:', error);
      } finally {
        setConstraintLoading(false);
      }
    };

    fetchConstraintData();
    const interval = setInterval(fetchConstraintData, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(price);
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-emerald-600';
    if (change < 0) return 'text-rose-600';
    return 'text-zinc-600';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4" />;
    if (change < 0) return <TrendingDown className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  const renderCommodityCard = (name: string, data: any) => {
    if (!data) return null;

    const price = data.current || data.price || 0;
    const change = data.daily_change || data.change_24h || 0;

    return (
      <div key={name} className="bg-white/60 backdrop-blur-sm rounded-lg border border-zinc-200/50 p-4 hover:border-zinc-300 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-zinc-900 capitalize">{name.replace(/_/g, ' ')}</h4>
          <div className={`flex items-center space-x-1 ${getChangeColor(change)}`}>
            {getChangeIcon(change)}
            <span className="text-xs font-medium">{formatChange(change)}</span>
          </div>
        </div>
        <div className="text-2xl font-extralight text-zinc-900">
          ${formatPrice(price)}
        </div>
        {data.source && (
          <div className="mt-2 text-xs text-zinc-500">
            {data.source.replace(/_/g, ' ')}
          </div>
        )}
      </div>
    );
  };

  const renderMiningStock = (name: string, data: any) => {
    if (!data) return null;

    return (
      <div key={name} className="bg-white/60 backdrop-blur-sm rounded-lg border border-zinc-200/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="text-sm font-medium text-zinc-900 capitalize">{name.replace(/_/g, ' ')}</h4>
            <span className="text-xs text-zinc-500">{data.symbol}</span>
          </div>
          <div className={`flex items-center space-x-1 ${getChangeColor(data.daily_change || 0)}`}>
            {getChangeIcon(data.daily_change || 0)}
            <span className="text-xs font-medium">{formatChange(data.daily_change || 0)}</span>
          </div>
        </div>
        <div className="text-xl font-extralight text-zinc-900">
          ${formatPrice(data.current)}
        </div>
        {data.market_cap && (
          <div className="mt-1 text-xs text-zinc-500">
            Market Cap: ${(data.market_cap / 1000000000).toFixed(2)}B
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Live Monitoring Metrics Bar */}
      <PlatformMetricsBar />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extralight text-zinc-900 tracking-tight">Live Market Data</h2>
          <p className="text-sm text-zinc-500 mt-1">Real-time commodities, mining stocks, forex, and battery metals</p>
        </div>
        <div className="flex items-center space-x-4">
          {commoditiesUpdated && (
            <div className="text-xs text-zinc-500">
              Updated: {commoditiesUpdated.toLocaleTimeString()}
            </div>
          )}
          <button
            onClick={refetchCommodities}
            disabled={commoditiesLoading}
            className="flex items-center space-x-2 px-3 py-2 bg-white/60 backdrop-blur-sm border border-zinc-200 rounded-lg hover:border-zinc-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${commoditiesLoading ? 'animate-spin' : ''}`} />
            <span className="text-sm">Refresh</span>
          </button>
        </div>
      </div>

      {/* Commodity Prices */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-200/50 overflow-hidden shadow-xl shadow-zinc-200/20">
        <div className="border-b border-zinc-200/50 px-6 py-4">
          <h3 className="text-lg font-light text-zinc-900">Commodity Prices</h3>
        </div>
        <div className="p-6">
          {commoditiesLoading && !commodities ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
          ) : commodities ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(commodities).map(([name, data]) =>
                renderCommodityCard(name, data)
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-500">
              <p className="text-sm">No commodity data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Mining Stocks */}
      {financial?.mining_stocks && Object.keys(financial.mining_stocks).length > 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-200/50 overflow-hidden shadow-xl shadow-zinc-200/20">
          <div className="border-b border-zinc-200/50 px-6 py-4">
            <h3 className="text-lg font-light text-zinc-900">Mining Stocks</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(financial.mining_stocks).map(([name, data]) =>
                renderMiningStock(name, data)
              )}
            </div>
          </div>
        </div>
      )}

      {/* Battery Metals & Rare Earths */}
      {financial?.battery_metals && Object.keys(financial.battery_metals).length > 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-200/50 overflow-hidden shadow-xl shadow-zinc-200/20">
          <div className="border-b border-zinc-200/50 px-6 py-4">
            <h3 className="text-lg font-light text-zinc-900">Battery Metals & Critical Minerals</h3>
            <p className="text-xs text-zinc-500 mt-1">Essential for EV batteries and renewable energy</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(financial.battery_metals).map(([name, data]: [string, any]) => (
                <div key={name} className="bg-white/60 backdrop-blur-sm rounded-lg border border-zinc-200/50 p-4 hover:border-zinc-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-medium text-zinc-900 capitalize">{name.replace(/_/g, ' ')}</h4>
                      {data.supply_risk && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          data.supply_risk === 'critical' ? 'bg-rose-100 text-rose-700' :
                          data.supply_risk === 'high' ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {data.supply_risk} risk
                        </span>
                      )}
                    </div>
                    <div className={`flex items-center space-x-1 ${getChangeColor(data.daily_change || 0)}`}>
                      {getChangeIcon(data.daily_change || 0)}
                      <span className="text-xs font-medium">{formatChange(data.daily_change || 0)}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-extralight text-zinc-900">
                    ${formatPrice(data.current, 0)}
                  </div>
                  <div className="mt-2 text-xs text-zinc-500">
                    {data.applications && data.applications.length > 0 && (
                      <div className="mt-1">Uses: {data.applications.slice(0, 2).join(', ')}</div>
                    )}
                    {data.primary_producers && data.primary_producers.length > 0 && (
                      <div className="mt-1">Top: {data.primary_producers[0]}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mining Currency Exchange Rates */}
      {financial?.forex_rates && Object.keys(financial.forex_rates).length > 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-200/50 overflow-hidden shadow-xl shadow-zinc-200/20">
          <div className="border-b border-zinc-200/50 px-6 py-4">
            <h3 className="text-lg font-light text-zinc-900">Mining Jurisdiction Currencies</h3>
            <p className="text-xs text-zinc-500 mt-1">Exchange rates affecting mining economics</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(financial.forex_rates).map(([name, data]: [string, any]) => (
                <div key={name} className="bg-white/60 backdrop-blur-sm rounded-lg border border-zinc-200/50 p-4 hover:border-zinc-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-medium text-zinc-900 capitalize">{name.replace(/_/g, ' ')}</h4>
                      <span className="text-xs text-zinc-500">{data.symbol}</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${getChangeColor(data.daily_change || 0)}`}>
                      {getChangeIcon(data.daily_change || 0)}
                      <span className="text-xs font-medium">{formatChange(data.daily_change || 0)}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-extralight text-zinc-900">
                    {formatPrice(data.rate, 4)}
                  </div>
                  {data.impact && (
                    <div className="mt-2 text-xs text-zinc-500 line-clamp-2">
                      {data.impact}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cryptocurrency (if relevant to mining operations) */}
      {financial?.crypto && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-200/50 overflow-hidden shadow-xl shadow-zinc-200/20">
          <div className="border-b border-zinc-200/50 px-6 py-4">
            <h3 className="text-lg font-light text-zinc-900">Cryptocurrency Markets</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(financial.crypto).map(([name, data]: [string, any]) => (
                <div key={name} className="bg-white/60 backdrop-blur-sm rounded-lg border border-zinc-200/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-zinc-900 capitalize">{name}</h4>
                    <div className={`flex items-center space-x-1 ${getChangeColor(data.daily_change || 0)}`}>
                      {getChangeIcon(data.daily_change || 0)}
                      <span className="text-xs font-medium">{formatChange(data.daily_change || 0)}</span>
                    </div>
                  </div>
                  <div className="text-xl font-extralight text-zinc-900">
                    ${formatPrice(data.current, 0)}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">{data.source}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Energy Constraint Monitoring - Proven ROI */}
      {!constraintLoading && backtestData && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-200/50 overflow-hidden shadow-xl shadow-zinc-200/20">
          <div className="border-b border-zinc-200/50 px-6 py-4 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-light text-zinc-900">Energy Constraint Monitoring</h3>
                <p className="text-xs text-zinc-500 mt-1">Proven ROI from historical analysis</p>
              </div>
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-zinc-200/50 p-4">
                <div className="text-xs text-zinc-500 mb-1 font-light">Historical Events</div>
                <div className="text-2xl font-extralight text-zinc-900">{backtestData.summary.totalEvents}</div>
                <div className="text-xs text-zinc-500 mt-1">Documented events</div>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-zinc-200/50 p-4">
                <div className="text-xs text-zinc-500 mb-1 font-light">Value Delivered</div>
                <div className="text-2xl font-extralight text-emerald-600">{backtestData.conclusions.totalValueDelivered}</div>
                <div className="text-xs text-zinc-500 mt-1">Projected savings</div>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-zinc-200/50 p-4">
                <div className="text-xs text-zinc-500 mb-1 font-light">Proven ROI</div>
                <div className="text-2xl font-extralight text-emerald-600">{backtestData.conclusions.provenROI}</div>
                <div className="text-xs text-zinc-500 mt-1">Return on investment</div>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-zinc-200/50 p-4">
                <div className="text-xs text-zinc-500 mb-1 font-light">Detection Speed</div>
                <div className="text-2xl font-extralight text-zinc-900">{backtestData.conclusions.averageDetectionSpeed}</div>
                <div className="text-xs text-zinc-500 mt-1">Faster response</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-Time Energy Market Conditions */}
      {!constraintLoading && liveData && (
        <>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-200/50 overflow-hidden shadow-xl shadow-zinc-200/20">
            <div className="border-b border-zinc-200/50 px-6 py-4">
              <h3 className="text-lg font-light text-zinc-900">Real-Time Energy Market Conditions</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Gas Prices */}
                <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-zinc-200/50 p-4 hover:border-zinc-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-zinc-600" />
                      <h4 className="text-sm font-medium text-zinc-900">Natural Gas Price</h4>
                    </div>
                    <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded font-light">
                      EIA Henry Hub
                    </span>
                  </div>

                  <div className="text-2xl font-extralight text-zinc-900">
                    ${liveData.gasPrice.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">per MMBtu</div>

                  <div className={`mt-2 flex items-center gap-1.5 text-xs font-light ${
                    liveData.gasPrice.changePercent >= 0 ? 'text-rose-600' : 'text-emerald-600'
                  }`}>
                    <TrendingUp className="h-3 w-3" />
                    <span>
                      {liveData.gasPrice.changePercent >= 0 ? '+' : ''}
                      {liveData.gasPrice.changePercent.toFixed(1)}% vs yesterday
                    </span>
                  </div>
                </div>

                {/* Electricity Demand */}
                <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-zinc-200/50 p-4 hover:border-zinc-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-zinc-600" />
                      <h4 className="text-sm font-medium text-zinc-900">PJM Demand</h4>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-light">
                      Live
                    </span>
                  </div>

                  <div className="text-2xl font-extralight text-zinc-900">
                    {liveData.demand[0]?.value.toFixed(0) || '0'}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">MW</div>

                  <div className="mt-2 text-xs text-zinc-600 font-light">
                    24hr avg: {(liveData.demand.reduce((sum, d) => sum + d.value, 0) / liveData.demand.length).toFixed(0)} MW
                  </div>
                </div>

                {/* Weather */}
                <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-zinc-200/50 p-4 hover:border-zinc-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-zinc-600" />
                      <h4 className="text-sm font-medium text-zinc-900">Weather</h4>
                    </div>
                    <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded font-light">
                      Mid-Atlantic
                    </span>
                  </div>

                  <div className="text-2xl font-extralight text-zinc-900">
                    {liveData.weather.temperature.toFixed(0)}°F
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">{liveData.weather.conditions}</div>

                  <div className="mt-2 text-xs text-zinc-600 font-light">
                    Wind: {liveData.weather.windSpeed.toFixed(0)} mph
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Constraints */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-200/50 overflow-hidden shadow-xl shadow-zinc-200/20">
            <div className="border-b border-zinc-200/50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-light text-zinc-900">Active Energy Constraints</h3>
                  <p className="text-xs text-zinc-500 mt-1">Real-time operational alerts</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="font-medium text-rose-700">{liveData.summary.criticalAlerts}</span> Critical
                  </div>
                  <div>
                    <span className="font-medium text-zinc-700">{liveData.summary.constraintsDetected}</span> Total
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {liveData.constraints.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-emerald-500" />
                  <p className="text-sm font-light text-zinc-900">No active constraints detected</p>
                  <p className="text-xs text-zinc-500 mt-1 font-light">All systems operating normally</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {liveData.constraints.map((constraint) => (
                    <div
                      key={constraint.id}
                      className={`bg-white/60 backdrop-blur-sm rounded-lg border-l-4 p-4 ${
                        constraint.severity === 'critical'
                          ? 'border-l-rose-500 bg-rose-50/50'
                          : constraint.severity === 'high'
                          ? 'border-l-orange-500 bg-orange-50/50'
                          : 'border-l-amber-500 bg-amber-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                constraint.severity === 'critical'
                                  ? 'bg-rose-200 text-rose-800'
                                  : constraint.severity === 'high'
                                  ? 'bg-orange-200 text-orange-800'
                                  : 'bg-amber-200 text-amber-800'
                              }`}
                            >
                              {constraint.severity.toUpperCase()}
                            </span>
                            <span className="text-xs text-zinc-500 font-light">{constraint.type}</span>
                          </div>

                          <h4 className="text-sm font-medium text-zinc-900 mb-2">
                            {constraint.description}
                          </h4>

                          <div className="grid grid-cols-3 gap-4 text-xs">
                            <div>
                              <div className="text-zinc-600 font-light">Estimated Impact</div>
                              <div className="font-semibold text-rose-700">
                                ${(constraint.estimatedImpact / 1000000).toFixed(1)}M
                              </div>
                            </div>
                            <div>
                              <div className="text-zinc-600 font-light">Data Source</div>
                              <div className="font-light text-zinc-900">
                                {constraint.dataSource}
                              </div>
                            </div>
                            <div>
                              <div className="text-zinc-600 font-light">Confidence</div>
                              <div className="font-semibold text-emerald-700">
                                {(constraint.confidence * 100).toFixed(0)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {liveData.summary.totalExposure > 0 && (
                <div className="mt-4 bg-rose-100/50 rounded-lg p-4 border border-rose-200/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-light text-rose-900">Total Financial Exposure:</span>
                    <span className="text-xl font-extralight text-rose-700">
                      ${(liveData.summary.totalExposure / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Live Data Indicator */}
      <div className="flex items-center justify-center space-x-2 text-xs text-zinc-500">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span>Live Data</span>
        </div>
        <span>•</span>
        <span>Updates every 30 seconds</span>
        <span>•</span>
        <span>Multiple data sources</span>
      </div>
    </div>
  );
};

export default LiveMarketFeed;
