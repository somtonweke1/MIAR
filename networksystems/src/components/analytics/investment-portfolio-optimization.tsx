'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { AFRICAN_MINING_OPERATIONS, NETWORK_CONNECTIONS } from '@/services/african-mining-network';
import { REAL_JOHANNESBURG_MINES } from '@/services/real-mining-data';
import { Network } from '@/stores/network-store';
import { usePortfolioData, useCommodityPrices, useMarketIntelligence } from '@/hooks/use-live-data';
import {
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Target,
  BarChart3,
  Shield,
  Activity,
  Zap
} from 'lucide-react';

interface PortfolioAsset {
  id: string;
  name: string;
  allocation: number;
  value: number;
  networkNode: string;
  risk: 'low' | 'medium' | 'high';
  correlation: number[];
}

interface RiskMetrics {
  systemicRisk: number;
  concentrationRisk: number;
  correlationRisk: number;
  liquidityRisk: number;
  overallScore: number;
}

const InvestmentPortfolioOptimization: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioAsset[]>([]);
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics>({
    systemicRisk: 0,
    concentrationRisk: 0,
    correlationRisk: 0,
    liquidityRisk: 0,
    overallScore: 0
  });
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  // Live data hooks
  const { data: portfolioLiveData, lastUpdated: portfolioUpdated } = usePortfolioData();
  const { data: commodityData, lastUpdated: commodityUpdated } = useCommodityPrices();
  const { data: marketIntel, lastUpdated: intelUpdated } = useMarketIntelligence();

  useEffect(() => {
    const mockPortfolio: PortfolioAsset[] = [
      {
        id: 'p1',
        name: 'Johannesburg Gold Holdings',
        allocation: 25,
        value: 612.5,
        networkNode: 'jb_target_mine',
        risk: 'medium',
        correlation: [0.8, 0.6, 0.3, 0.4, 0.7]
      },
      {
        id: 'p2',
        name: 'DRC Cobalt Mining Corp',
        allocation: 20,
        value: 490,
        networkNode: 'kamoa_kakula',
        risk: 'high',
        correlation: [0.8, 0.9, 0.2, 0.5, 0.6]
      },
      {
        id: 'p3',
        name: 'Ghanaian Gold Assets',
        allocation: 18,
        value: 441,
        networkNode: 'ashanti_goldfields',
        risk: 'low',
        correlation: [0.6, 0.9, 0.1, 0.3, 0.8]
      }
    ];

    setPortfolio(mockPortfolio);
    calculateRiskMetrics(mockPortfolio);

    const interval = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        dailyPnL: prev.dailyPnL + (Math.random() - 0.5) * 5,
        portfolioValue: prev.portfolioValue + (Math.random() - 0.5) * 20,
        systemicExposure: Math.max(60, Math.min(85, prev.systemicExposure + (Math.random() - 0.5) * 2))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const calculateRiskMetrics = (portfolioData: PortfolioAsset[]) => {
    const systemicRisk = portfolioData.reduce((acc, asset) => {
      const centralityWeight = asset.risk === 'high' ? 0.8 : asset.risk === 'medium' ? 0.5 : 0.2;
      return acc + (asset.allocation / 100) * centralityWeight;
    }, 0) * 100;

    const concentrationRisk = Math.max(...portfolioData.map(a => a.allocation));

    const avgCorrelation = portfolioData.reduce((acc, asset) => {
      const avgAssetCorr = asset.correlation.reduce((sum, corr) => sum + corr, 0) / asset.correlation.length;
      return acc + avgAssetCorr * (asset.allocation / 100);
    }, 0) * 100;

    const liquidityRisk = portfolioData.reduce((acc, asset) => {
      const liquidityScore = asset.risk === 'high' ? 0.7 : asset.risk === 'medium' ? 0.4 : 0.1;
      return acc + (asset.allocation / 100) * liquidityScore;
    }, 0) * 100;

    const overallScore = (systemicRisk + concentrationRisk + avgCorrelation + liquidityRisk) / 4;

    setRiskMetrics({
      systemicRisk,
      concentrationRisk,
      correlationRisk: avgCorrelation,
      liquidityRisk,
      overallScore
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-200/50 overflow-hidden shadow-xl shadow-zinc-200/20">
        <div className="border-b border-zinc-200/50 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extralight text-zinc-900 tracking-tight">Investment Portfolio Optimization</h2>
              <p className="text-sm text-zinc-500 mt-2 font-light">Network-based risk analysis and portfolio intelligence</p>
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-xl font-light text-zinc-900">
                  ${portfolioLiveData ? portfolioLiveData.total_value.toFixed(1) : '2450.0'}M
                </div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider font-light">Portfolio Value</div>
                {portfolioUpdated && (
                  <div className="flex items-center justify-center space-x-1 mt-1">
                    <Activity className="h-3 w-3 text-emerald-500" />
                    <span className="text-xs text-emerald-500">Live</span>
                  </div>
                )}
              </div>
              <div className="text-center">
                <div className={`text-xl font-light ${
                  portfolioLiveData ?
                    (portfolioLiveData.daily_pnl >= 0 ? 'text-emerald-600' : 'text-rose-600') :
                    'text-emerald-600'
                }`}>
                  {portfolioLiveData ?
                    `${portfolioLiveData.daily_pnl >= 0 ? '+' : ''}${portfolioLiveData.daily_pnl.toFixed(1)}M` :
                    '+45.2M'
                  }
                </div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider font-light">Daily P&L</div>
                {commodityData && commodityData.gold && (
                  <div className="text-xs text-zinc-500 mt-1">
                    Gold: ${commodityData.gold.current}/oz {commodityData.gold.daily_change >= 0 ? '↗' : '↘'} {Math.abs(commodityData.gold.daily_change).toFixed(1)}%
                  </div>
                )}
              </div>
              <div className="text-center">
                <div className="text-xl font-light text-amber-500">
                  {portfolioLiveData ? portfolioLiveData.risk_score.toFixed(0) : '73'}%
                </div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider font-light">Systemic Risk</div>
                {portfolioUpdated && (
                  <div className="text-xs text-zinc-500 mt-1">
                    Updated {portfolioUpdated.toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-200/50 overflow-hidden shadow-xl shadow-zinc-200/20">
          <div className="border-b border-zinc-200/50 px-6 py-4">
            <h3 className="text-lg font-light text-zinc-900">Risk Analysis</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="h-4 w-4 text-rose-500" />
                  <span className="text-sm font-light text-zinc-700">Systemic Risk</span>
                </div>
                <span className="text-sm font-medium text-rose-600">{riskMetrics.systemicRisk.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-zinc-200 rounded-full h-2">
                <div
                  className="bg-rose-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${riskMetrics.systemicRisk}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Target className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-light text-zinc-700">Concentration Risk</span>
                </div>
                <span className="text-sm font-medium text-amber-600">{riskMetrics.concentrationRisk.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-zinc-200 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${riskMetrics.concentrationRisk}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-zinc-50 rounded-lg p-4 mt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-700">Overall Risk Score</span>
                <span className={`text-lg font-semibold ${riskMetrics.overallScore > 60 ? 'text-rose-600' : riskMetrics.overallScore > 40 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {riskMetrics.overallScore.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-200/50 overflow-hidden shadow-xl shadow-zinc-200/20">
          <div className="border-b border-zinc-200/50 px-6 py-4">
            <h3 className="text-lg font-light text-zinc-900">Portfolio Holdings</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {portfolio.map((asset, idx) => (
                <div
                  key={asset.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedAsset === asset.id
                      ? 'border-blue-300 bg-blue-50/50'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                  onClick={() => setSelectedAsset(selectedAsset === asset.id ? null : asset.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-zinc-900">{asset.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${
                        asset.risk === 'high' ? 'bg-rose-500' :
                        asset.risk === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}></span>
                      <span className="text-xs text-zinc-500">{asset.risk}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-600">{asset.allocation}% allocation</span>
                    <span className="text-sm font-medium text-emerald-600">${asset.value}M</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-200/50 overflow-hidden shadow-xl shadow-zinc-200/20">
        <div className="border-b border-zinc-200/50 px-8 py-6">
          <h3 className="text-xl font-extralight text-zinc-900 tracking-tight">Actionable Intelligence</h3>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-rose-50/50 to-rose-100/30 rounded-xl p-6 border border-rose-200/30">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="h-5 w-5 text-rose-500" />
                <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-light">HIGH PRIORITY</span>
              </div>
              <h4 className="font-light text-zinc-900 mb-2">Reduce DRC Exposure</h4>
              <p className="text-sm text-zinc-600 mb-4 font-light">Portfolio has 73% exposure to high-centrality nodes</p>
              <div className="text-sm">
                <span className="text-zinc-500">Recommended Action:</span>
                <span className="font-light text-zinc-900 ml-2">Rebalance to West African gold</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50/50 to-amber-100/30 rounded-xl p-6 border border-amber-200/30">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="h-5 w-5 text-amber-500" />
                <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-light">OPPORTUNITY</span>
              </div>
              <h4 className="font-light text-zinc-900 mb-2">Correlation Alert</h4>
              <p className="text-sm text-zinc-600 mb-4 font-light">DRC disruption would affect 5 of 8 holdings simultaneously</p>
              <div className="text-sm">
                <span className="text-zinc-500">Expected Impact:</span>
                <span className="font-light text-amber-600 ml-2">$145M portfolio protection</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 rounded-xl p-6 border border-emerald-200/30">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-light">REBALANCE</span>
              </div>
              <h4 className="font-light text-zinc-900 mb-2">Optimization Opportunity</h4>
              <p className="text-sm text-zinc-600 mb-4 font-light">Network analysis suggests increasing Morocco phosphate exposure</p>
              <div className="text-sm">
                <span className="text-zinc-500">Risk Reduction:</span>
                <span className="font-light text-emerald-600 ml-2">12% overall portfolio risk</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentPortfolioOptimization;