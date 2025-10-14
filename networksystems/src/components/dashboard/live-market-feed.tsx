'use client';

import React from 'react';
import { useCommodityPrices, useFinancialData } from '@/hooks/use-live-data';
import { TrendingUp, TrendingDown, RefreshCw, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';

/**
 * Live Market Feed Component
 * Displays real-time commodity prices and market data
 */
const LiveMarketFeed: React.FC = () => {
  const { data: commodities, isLoading: commoditiesLoading, lastUpdated: commoditiesUpdated, refetch: refetchCommodities } = useCommodityPrices(true);
  const { data: financial, isLoading: financialLoading, lastUpdated: financialUpdated } = useFinancialData(true);

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
