'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { AFRICAN_MINING_OPERATIONS, NETWORK_CONNECTIONS } from '@/services/african-mining-network';
import { REAL_JOHANNESBURG_MINES } from '@/services/real-mining-data';
import { Network } from '@/stores/network-store';
import {
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Target,
  BarChart3,
  Shield
} from 'lucide-react';

// Portfolio data structure
interface PortfolioAsset {
  id: string;
  name: string;
  allocation: number; // percentage
  value: number; // USD millions
  networkNode: string; // references mining operation ID
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
  const [liveData, setLiveData] = useState({
    portfolioValue: 2450,
    dailyPnL: 45.2,
    systemicExposure: 73,
    correlationAlert: 5
  });

  // Initialize portfolio data based on network operations
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
      },
      {
        id: 'p4',
        name: 'Botswana Diamond Fund',
        allocation: 15,
        value: 367.5,
        networkNode: 'jwaneng_mine',
        risk: 'medium',
        correlation: [0.3, 0.2, 0.1, 0.4, 0.2]
      },
      {
        id: 'p5',
        name: 'Zambian Copper ETF',
        allocation: 12,
        value: 294,
        networkNode: 'konkola_copper',
        risk: 'high',
        correlation: [0.4, 0.5, 0.3, 0.4, 0.6]
      },
      {
        id: 'p6',
        name: 'Morocco Phosphate Co.',
        allocation: 10,
        value: 245,
        networkNode: 'ocp_morocco',
        risk: 'low',
        correlation: [0.7, 0.6, 0.8, 0.2, 0.6]
      }
    ];

    setPortfolio(mockPortfolio);
    calculateRiskMetrics(mockPortfolio);

    // Setup live updates
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
    // Calculate systemic risk based on network centrality
    const systemicRisk = portfolioData.reduce((acc, asset) => {
      const centralityWeight = asset.risk === 'high' ? 0.8 : asset.risk === 'medium' ? 0.5 : 0.2;
      return acc + (asset.allocation / 100) * centralityWeight;
    }, 0) * 100;

    // Calculate concentration risk
    const concentrationRisk = Math.max(...portfolioData.map(a => a.allocation));

    // Calculate correlation risk
    const avgCorrelation = portfolioData.reduce((acc, asset) => {
      const avgAssetCorr = asset.correlation.reduce((sum, corr) => sum + corr, 0) / asset.correlation.length;
      return acc + avgAssetCorr * (asset.allocation / 100);
    }, 0) * 100;

    // Calculate liquidity risk
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

  const renderPortfolioMap = () => {
    const width = 1200;
    const height = 600;

    // Africa bounds
    const africaBounds = {
      minLat: -35,
      maxLat: 37,
      minLng: -20,
      maxLng: 55
    };

    const scaleX = (lng: number) => ((lng - africaBounds.minLng) / (africaBounds.maxLng - africaBounds.minLng)) * width;
    const scaleY = (lat: number) => height - ((lat - africaBounds.minLat) / (africaBounds.maxLat - africaBounds.minLat)) * height;

    return (
      <svg width={width} height={height} className="w-full h-auto">
        <defs>
          <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef3c7"/>
            <stop offset="50%" stopColor="#fbbf24"/>
            <stop offset="100%" stopColor="#dc2626"/>
          </linearGradient>
          <radialGradient id="portfolioGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
          </radialGradient>
        </defs>

        {/* Africa background */}
        <rect width={width} height={height} fill="#f8fafc" />

        {/* Regional risk heatmap */}
        <ellipse cx="400" cy="300" rx="150" ry="100" fill="url(#riskGradient)" opacity="0.3" />
        <ellipse cx="300" cy="450" rx="120" ry="80" fill="#fbbf24" opacity="0.2" />
        <ellipse cx="500" cy="200" rx="100" ry="70" fill="#10b981" opacity="0.2" />

        {/* Portfolio correlation web */}
        {portfolio.map((asset, i) =>
          portfolio.slice(i + 1).map((otherAsset, j) => {
            const correlation = asset.correlation[j] || 0;
            if (correlation < 0.5) return null;

            const sourceOp = AFRICAN_MINING_OPERATIONS.find(op => op.id === asset.networkNode);
            const targetOp = AFRICAN_MINING_OPERATIONS.find(op => op.id === otherAsset.networkNode);

            if (!sourceOp || !targetOp) return null;

            const x1 = scaleX(sourceOp.location.lng);
            const y1 = scaleY(sourceOp.location.lat);
            const x2 = scaleX(targetOp.location.lng);
            const y2 = scaleY(targetOp.location.lat);

            return (
              <g key={`${i}-${j}`}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={correlation > 0.7 ? "#dc2626" : "#f59e0b"}
                  strokeWidth={correlation * 4}
                  strokeOpacity={0.6}
                  strokeDasharray="8,4"
                />
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 - 5}
                  fill="#374151"
                  fontSize="8"
                  textAnchor="middle"
                  className="font-mono"
                >
                  {(correlation * 100).toFixed(0)}%
                </text>
              </g>
            );
          })
        )}

        {/* Portfolio assets as nodes */}
        {portfolio.map((asset, idx) => {
          const operation = AFRICAN_MINING_OPERATIONS.find(op => op.id === asset.networkNode);
          if (!operation) return null;

          const x = scaleX(operation.location.lng);
          const y = scaleY(operation.location.lat);
          const radius = Math.max(15, asset.allocation * 1.2);
          const isSelected = selectedAsset === asset.id;

          return (
            <g key={idx}>
              {/* Portfolio glow */}
              <circle
                cx={x}
                cy={y}
                r={radius + 20}
                fill="url(#portfolioGlow)"
                opacity={isSelected ? 0.8 : 0.4}
              />

              {/* Risk indicator ring */}
              <circle
                cx={x}
                cy={y}
                r={radius + 8}
                fill="none"
                stroke={asset.risk === 'high' ? "#dc2626" : asset.risk === 'medium' ? "#f59e0b" : "#10b981"}
                strokeWidth="3"
                opacity="0.8"
              />

              {/* Main asset node */}
              <circle
                cx={x}
                cy={y}
                r={radius}
                fill="#3b82f6"
                stroke={isSelected ? "#ffffff" : "#1e40af"}
                strokeWidth={isSelected ? "4" : "2"}
                opacity="0.9"
                className="cursor-pointer hover:opacity-100"
                onClick={() => setSelectedAsset(selectedAsset === asset.id ? null : asset.id)}
              />

              {/* Capital flow animation */}
              <circle r="5" fill="#10b981" opacity="0.8">
                <animateMotion dur="3s" repeatCount="indefinite">
                  <mpath href={`#flow-${idx}`} />
                </animateMotion>
              </circle>
              <path id={`flow-${idx}`} d={`M ${x - 30} ${y} Q ${x} ${y - 30} ${x + 30} ${y}`} fill="none" opacity="0" />

              {/* Asset allocation label */}
              <text
                x={x}
                y={y - radius - 12}
                fill="#1f2937"
                fontSize="10"
                textAnchor="middle"
                className="font-sans font-medium"
              >
                {asset.allocation}%
              </text>

              {/* Value indicator */}
              <text
                x={x}
                y={y + radius + 15}
                fill="#059669"
                fontSize="8"
                textAnchor="middle"
                className="font-mono font-bold"
              >
                ${asset.value}M
              </text>
            </g>
          );
        })}

        {/* Systemic risk indicators */}
        {portfolio.filter(asset => asset.risk === 'high').map((asset, idx) => {
          const operation = AFRICAN_MINING_OPERATIONS.find(op => op.id === asset.networkNode);
          if (!operation) return null;

          return (
            <circle
              key={`risk-${idx}`}
              cx={scaleX(operation.location.lng)}
              cy={scaleY(operation.location.lat)}
              r="35"
              fill="none"
              stroke="#dc2626"
              strokeWidth="2"
              strokeDasharray="6,6"
              opacity="0.7"
            >
              <animate
                attributeName="r"
                values="30;40;30"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-200/50 overflow-hidden shadow-xl shadow-zinc-200/20">
        <div className="border-b border-zinc-200/50 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extralight text-zinc-900 tracking-tight">Investment Portfolio Optimization</h2>
              <p className="text-sm text-zinc-500 mt-2 font-light">Network-based risk analysis and portfolio intelligence</p>
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-xl font-light text-zinc-900">${liveData.portfolioValue.toFixed(1)}M</div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider font-light">Portfolio Value</div>
              </div>
              <div className="text-center">
                <div className={`text-xl font-light ${liveData.dailyPnL >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {liveData.dailyPnL >= 0 ? '+' : ''}${liveData.dailyPnL.toFixed(1)}M
                </div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider font-light">Daily P&L</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-light text-amber-500">{liveData.systemicExposure.toFixed(0)}%</div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider font-light">Systemic Risk</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Map */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-200/50 overflow-hidden shadow-xl shadow-zinc-200/20">
        <div className="border-b border-zinc-200/50 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-extralight text-zinc-900 tracking-tight">Portfolio Network Visualization</h3>
              <p className="text-sm text-zinc-500 mt-2 font-light">Asset allocation and correlation risk mapping</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-xs font-light text-zinc-600">Low Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span className="text-xs font-light text-zinc-600">Medium Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                <span className="text-xs font-light text-zinc-600">High Risk</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="bg-zinc-50/50 rounded-xl border border-zinc-200/30 overflow-hidden">
            {renderPortfolioMap()}
          </div>
        </div>
      </div>

      {/* Risk Metrics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Analysis */}
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

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-light text-zinc-700">Correlation Risk</span>
                </div>
                <span className="text-sm font-medium text-blue-600">{riskMetrics.correlationRisk.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-zinc-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${riskMetrics.correlationRisk}%` }}
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

        {/* Portfolio Holdings */}
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
                      }`}></div>
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

      {/* Actionable Intelligence */}
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
              <p className="text-sm text-zinc-600 mb-4 font-light">Portfolio has 73% exposure to high-centrality nodes - reduce concentration by 15%</p>
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
              <p className="text-sm text-zinc-600 mb-4 font-light">DRC disruption would affect 5 of 8 holdings simultaneously - diversify routing</p>
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
              <p className="text-sm text-zinc-600 mb-4 font-light">Network analysis suggests increasing Morocco phosphate exposure by 8%</p>
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