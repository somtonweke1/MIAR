'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Zap,
  CheckCircle,
  RefreshCw,
  ArrowLeft,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

interface LiveData {
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

export default function LiveMonitoringPage() {
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const [backtestData, setBacktestData] = useState<BacktestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchAllData();

    if (autoRefresh) {
      const interval = setInterval(fetchAllData, 30000); // 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchAllData = async () => {
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

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !liveData || !backtestData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-zinc-600">Loading real-time data...</p>
        </div>
      </div>
    );
  }

  const currentDemand = liveData.demand[0]?.value || 0;
  const avgDemand = liveData.demand.reduce((sum, d) => sum + d.value, 0) / liveData.demand.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-100 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-8 h-8" />
                <h1 className="text-4xl font-bold">Live Constraint Monitoring</h1>
              </div>
              <p className="text-xl text-blue-100">
                Real-time monitoring with ACTUAL data from EIA, Weather APIs, and Commodity Markets
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={fetchAllData}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>

              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  autoRefresh ? 'bg-emerald-500' : 'bg-white/20'
                }`}
              >
                <Activity className={`w-4 h-4 ${autoRefresh ? 'animate-pulse' : ''}`} />
                {autoRefresh ? 'Live' : 'Paused'}
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm text-blue-200">
            Last updated: {lastUpdate.toLocaleTimeString()}
            {autoRefresh && ' • Auto-refresh every 30s'}
          </div>
        </div>
      </section>

      {/* Proven ROI Section - THE PROOF */}
      <section className="py-12 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-8 h-8" />
            <h2 className="text-3xl font-bold">Proven ROI from Historical Analysis</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
              <div className="text-sm text-emerald-100 mb-2">Historical Events Analyzed</div>
              <div className="text-4xl font-bold">{backtestData.summary.totalEvents}</div>
              <div className="text-xs text-emerald-200 mt-2">Documented constraint events</div>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
              <div className="text-sm text-emerald-100 mb-2">Total Value Delivered</div>
              <div className="text-4xl font-bold">{backtestData.conclusions.totalValueDelivered}</div>
              <div className="text-xs text-emerald-200 mt-2">In projected savings</div>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
              <div className="text-sm text-emerald-100 mb-2">Proven ROI</div>
              <div className="text-4xl font-bold">{backtestData.conclusions.provenROI}</div>
              <div className="text-xs text-emerald-200 mt-2">Return on investment</div>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
              <div className="text-sm text-emerald-100 mb-2">Detection Speed Advantage</div>
              <div className="text-4xl font-bold">{backtestData.conclusions.averageDetectionSpeed}</div>
              <div className="text-xs text-emerald-200 mt-2">Faster than manual analysis</div>
            </Card>
          </div>

          <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20">
            <div className="flex items-center gap-2 text-sm">
              <Database className="w-4 h-4" />
              <span>
                Based on {backtestData.summary.totalEvents} documented historical events
                with {backtestData.conclusions.confidence} confidence level
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Real-Time Market Data */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-zinc-900 mb-6">Real-Time Market Conditions</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Gas Prices */}
            <Card className="p-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Natural Gas Price</h3>
                </div>
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                  EIA Henry Hub
                </span>
              </div>

              <div className="text-4xl font-bold text-blue-900 mb-2">
                ${liveData.gasPrice.price.toFixed(2)}
              </div>
              <div className="text-sm text-blue-700">per MMBtu</div>

              <div className={`mt-4 flex items-center gap-2 ${
                liveData.gasPrice.changePercent >= 0 ? 'text-rose-600' : 'text-emerald-600'
              }`}>
                <TrendingUp className="w-4 h-4" />
                <span className="font-semibold">
                  {liveData.gasPrice.changePercent >= 0 ? '+' : ''}
                  {liveData.gasPrice.changePercent.toFixed(1)}% vs yesterday
                </span>
              </div>
            </Card>

            {/* Electricity Demand */}
            <Card className="p-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-6 h-6 text-blue-600" />
                  <h3 className="font-semibold text-zinc-900">PJM Demand</h3>
                </div>
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                  Live
                </span>
              </div>

              <div className="text-4xl font-bold text-zinc-900 mb-2">
                {currentDemand.toFixed(0)}
              </div>
              <div className="text-sm text-zinc-700">MW</div>

              <div className="mt-4 text-sm text-zinc-700">
                24hr avg: {avgDemand.toFixed(0)} MW
                ({(((currentDemand - avgDemand) / avgDemand) * 100).toFixed(1)}% variance)
              </div>
            </Card>

            {/* Weather */}
            <Card className="p-6 border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-6 h-6 text-amber-600" />
                  <h3 className="font-semibold text-amber-900">Weather Conditions</h3>
                </div>
                <span className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded">
                  Mid-Atlantic
                </span>
              </div>

              <div className="text-4xl font-bold text-amber-900 mb-2">
                {liveData.weather.temperature.toFixed(0)}°F
              </div>
              <div className="text-sm text-amber-700">{liveData.weather.conditions}</div>

              <div className="mt-4 text-sm text-amber-700">
                Wind: {liveData.weather.windSpeed.toFixed(0)} mph
              </div>
            </Card>
          </div>

          {/* Active Constraints */}
          <Card className="p-6 border-2 border-rose-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
                <h3 className="text-xl font-bold text-zinc-900">Active Constraints Detected</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="font-semibold text-rose-700">
                    {liveData.summary.criticalAlerts}
                  </span>{' '}
                  Critical
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-zinc-700">
                    {liveData.summary.constraintsDetected}
                  </span>{' '}
                  Total
                </div>
              </div>
            </div>

            {liveData.constraints.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
                <p className="text-lg font-medium">No active constraints detected</p>
                <p className="text-sm mt-2">All systems operating normally</p>
              </div>
            ) : (
              <div className="space-y-4">
                {liveData.constraints.map((constraint) => (
                  <div
                    key={constraint.id}
                    className={`border-l-4 p-4 rounded-r-lg ${
                      constraint.severity === 'critical'
                        ? 'border-rose-500 bg-rose-50'
                        : constraint.severity === 'high'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-amber-500 bg-amber-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              constraint.severity === 'critical'
                                ? 'bg-rose-200 text-rose-800'
                                : constraint.severity === 'high'
                                ? 'bg-orange-200 text-orange-800'
                                : 'bg-amber-200 text-amber-800'
                            }`}
                          >
                            {constraint.severity.toUpperCase()}
                          </span>
                          <span className="text-xs text-zinc-500">{constraint.type}</span>
                        </div>

                        <h4 className="font-semibold text-zinc-900 mb-2">
                          {constraint.description}
                        </h4>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-zinc-600">Estimated Impact</div>
                            <div className="font-bold text-rose-700">
                              ${(constraint.estimatedImpact / 1000000).toFixed(1)}M
                            </div>
                          </div>
                          <div>
                            <div className="text-zinc-600">Data Source</div>
                            <div className="font-medium text-zinc-900">
                              {constraint.dataSource}
                            </div>
                          </div>
                          <div>
                            <div className="text-zinc-600">Confidence</div>
                            <div className="font-bold text-blue-700">
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
              <div className="mt-6 p-4 bg-rose-100 rounded-lg border border-rose-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-rose-900">Total Financial Exposure:</span>
                  <span className="text-2xl font-bold text-rose-700">
                    ${(liveData.summary.totalExposure / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
}
