'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PDFExportService from '@/services/pdf-export-service';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface ScenarioResult {
  id: string;
  name: string;
  description: string;
  objectiveValue: number;
  feasibility: boolean;
  solveTime: number;
  convergence: string;
  costs: {
    totalCost: number;
    investmentCost: number;
    operationalCost: number;
    penaltyCost: number;
  };
  metrics: {
    reliabilityScore: number;
    carbonEmissions: number;
    materialUtilization: Record<string, number>;
    technologyDeployment: Record<string, number>;
    bottleneckCount: number;
  };
  bottlenecks: Array<{
    material: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    impact: number;
    timeframe: string;
  }>;
  lastUpdated: Date;
}

interface SensitivityAnalysis {
  parameter: string;
  baseValue: number;
  variations: Array<{
    value: number;
    impact: number;
    feasibility: boolean;
  }>;
}

const ScenarioComparison: React.FC = () => {
  const [scenarios, setScenarios] = useState<ScenarioResult[]>([]);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [sensitivityAnalysis, setSensitivityAnalysis] = useState<SensitivityAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [comparisonMode, setComparisonMode] = useState<'cost' | 'reliability' | 'sustainability' | 'risk'>('cost');
  const [sortBy, setSortBy] = useState<'objectiveValue' | 'reliabilityScore' | 'bottleneckCount'>('objectiveValue');

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    setIsLoading(true);
    
    try {
      // Simulate fetching scenario results
      const mockScenarios: ScenarioResult[] = [
        {
          id: 'baseline',
          name: 'Baseline Scenario',
          description: 'Current market conditions with existing constraints',
          objectiveValue: 24400000000,
          feasibility: true,
          solveTime: 0.002,
          convergence: 'optimal',
          costs: {
            totalCost: 24400000000,
            investmentCost: 18000000000,
            operationalCost: 5800000000,
            penaltyCost: 600000000
          },
          metrics: {
            reliabilityScore: 85,
            carbonEmissions: 12000000,
            materialUtilization: {
              lithium: 65,
              cobalt: 78,
              nickel: 45,
              copper: 55
            },
            technologyDeployment: {
              solar_pv: 2500,
              battery_storage: 800,
              wind_onshore: 200,
              mining_power: 5000
            },
            bottleneckCount: 2
          },
          bottlenecks: [
            { material: 'cobalt', severity: 'high', impact: 85, timeframe: '6-12 months' },
            { material: 'lithium', severity: 'medium', impact: 65, timeframe: '12-18 months' }
          ],
          lastUpdated: new Date()
        },
        {
          id: 'high_demand',
          name: 'High Demand Scenario',
          description: 'Mining boom with 40% demand increase',
          objectiveValue: 31200000000,
          feasibility: true,
          solveTime: 0.003,
          convergence: 'optimal',
          costs: {
            totalCost: 31200000000,
            investmentCost: 24000000000,
            operationalCost: 6500000000,
            penaltyCost: 700000000
          },
          metrics: {
            reliabilityScore: 78,
            carbonEmissions: 15000000,
            materialUtilization: {
              lithium: 85,
              cobalt: 95,
              nickel: 70,
              copper: 80
            },
            technologyDeployment: {
              solar_pv: 3500,
              battery_storage: 1200,
              wind_onshore: 300,
              mining_power: 6500
            },
            bottleneckCount: 4
          },
          bottlenecks: [
            { material: 'cobalt', severity: 'critical', impact: 95, timeframe: '3-6 months' },
            { material: 'lithium', severity: 'high', impact: 85, timeframe: '6-9 months' },
            { material: 'nickel', severity: 'medium', impact: 70, timeframe: '9-12 months' },
            { material: 'copper', severity: 'medium', impact: 60, timeframe: '12-15 months' }
          ],
          lastUpdated: new Date()
        },
        {
          id: 'constrained_supply',
          name: 'Constrained Supply Scenario',
          description: 'Supply chain disruptions with 50% material reduction',
          objectiveValue: 29800000000,
          feasibility: true,
          solveTime: 0.004,
          convergence: 'suboptimal',
          costs: {
            totalCost: 29800000000,
            investmentCost: 22000000000,
            operationalCost: 6800000000,
            penaltyCost: 1000000000
          },
          metrics: {
            reliabilityScore: 72,
            carbonEmissions: 11000000,
            materialUtilization: {
              lithium: 90,
              cobalt: 98,
              nickel: 85,
              copper: 75
            },
            technologyDeployment: {
              solar_pv: 2000,
              battery_storage: 600,
              wind_onshore: 150,
              mining_power: 4500
            },
            bottleneckCount: 6
          },
          bottlenecks: [
            { material: 'cobalt', severity: 'critical', impact: 98, timeframe: 'immediate' },
            { material: 'lithium', severity: 'critical', impact: 90, timeframe: '1-3 months' },
            { material: 'nickel', severity: 'high', impact: 85, timeframe: '3-6 months' },
            { material: 'copper', severity: 'high', impact: 75, timeframe: '6-9 months' }
          ],
          lastUpdated: new Date()
        },
        {
          id: 'rapid_expansion',
          name: 'Rapid Expansion Scenario',
          description: 'Accelerated deployment with reduced lead times',
          objectiveValue: 22800000000,
          feasibility: true,
          solveTime: 0.001,
          convergence: 'optimal',
          costs: {
            totalCost: 22800000000,
            investmentCost: 16500000000,
            operationalCost: 5800000000,
            penaltyCost: 500000000
          },
          metrics: {
            reliabilityScore: 92,
            carbonEmissions: 9500000,
            materialUtilization: {
              lithium: 55,
              cobalt: 65,
              nickel: 40,
              copper: 50
            },
            technologyDeployment: {
              solar_pv: 4000,
              battery_storage: 1000,
              wind_onshore: 400,
              mining_power: 5500
            },
            bottleneckCount: 1
          },
          bottlenecks: [
            { material: 'cobalt', severity: 'medium', impact: 65, timeframe: '6-12 months' }
          ],
          lastUpdated: new Date()
        }
      ];
      
      setScenarios(mockScenarios);
      
      // Generate sensitivity analysis
      const sensitivity: SensitivityAnalysis[] = [
        {
          parameter: 'Demand Growth Rate',
          baseValue: 2.5,
          variations: [
            { value: 1.5, impact: -0.12, feasibility: true },
            { value: 2.0, impact: -0.06, feasibility: true },
            { value: 3.0, impact: 0.08, feasibility: true },
            { value: 4.0, impact: 0.18, feasibility: true },
            { value: 5.0, impact: 0.28, feasibility: false }
          ]
        },
        {
          parameter: 'Cobalt Supply',
          baseValue: 165000,
          variations: [
            { value: 100000, impact: 0.35, feasibility: true },
            { value: 130000, impact: 0.15, feasibility: true },
            { value: 200000, impact: -0.08, feasibility: true },
            { value: 250000, impact: -0.15, feasibility: true }
          ]
        },
        {
          parameter: 'Lead Time Reduction',
          baseValue: 0,
          variations: [
            { value: -1, impact: 0.12, feasibility: true },
            { value: -0.5, impact: 0.06, feasibility: true },
            { value: 1, impact: -0.08, feasibility: true },
            { value: 2, impact: -0.15, feasibility: true }
          ]
        }
      ];
      
      setSensitivityAnalysis(sensitivity);
      
    } catch (error) {
      console.error('Failed to fetch scenarios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runNewScenario = async () => {
    setIsRunning(true);
    
    try {
      // Simulate running a new scenario
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Add new scenario to the list
      const newScenario: ScenarioResult = {
        id: `custom_${Date.now()}`,
        name: 'Custom Scenario',
        description: 'User-defined parameter combination',
        objectiveValue: 26500000000,
        feasibility: true,
        solveTime: 0.002,
        convergence: 'optimal',
        costs: {
          totalCost: 26500000000,
          investmentCost: 19500000000,
          operationalCost: 6200000000,
          penaltyCost: 800000000
        },
        metrics: {
          reliabilityScore: 88,
          carbonEmissions: 13000000,
          materialUtilization: {
            lithium: 70,
            cobalt: 80,
            nickel: 50,
            copper: 60
          },
          technologyDeployment: {
            solar_pv: 2800,
            battery_storage: 900,
            wind_onshore: 250,
            mining_power: 5200
          },
          bottleneckCount: 3
        },
        bottlenecks: [
          { material: 'cobalt', severity: 'high', impact: 80, timeframe: '6-9 months' },
          { material: 'lithium', severity: 'medium', impact: 70, timeframe: '9-12 months' },
          { material: 'nickel', severity: 'low', impact: 50, timeframe: '12-18 months' }
        ],
        lastUpdated: new Date()
      };
      
      setScenarios(prev => [...prev, newScenario]);
      
    } catch (error) {
      console.error('Failed to run scenario:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const sortedScenarios = [...scenarios].sort((a, b) => {
    switch (sortBy) {
      case 'objectiveValue':
        return a.objectiveValue - b.objectiveValue;
      case 'reliabilityScore':
        return b.metrics.reliabilityScore - a.metrics.reliabilityScore;
      case 'bottleneckCount':
        return a.metrics.bottleneckCount - b.metrics.bottleneckCount;
      default:
        return 0;
    }
  });

  const getComparisonValue = (scenario: ScenarioResult, mode: string): number => {
    switch (mode) {
      case 'cost':
        return scenario.costs.totalCost;
      case 'reliability':
        return scenario.metrics.reliabilityScore;
      case 'sustainability':
        return scenario.metrics.carbonEmissions;
      case 'risk':
        return scenario.metrics.bottleneckCount;
      default:
        return scenario.costs.totalCost;
    }
  };

  const getComparisonLabel = (mode: string): string => {
    switch (mode) {
      case 'cost':
        return 'Total Cost ($)';
      case 'reliability':
        return 'Reliability Score (%)';
      case 'sustainability':
        return 'Carbon Emissions (tonnes)';
      case 'risk':
        return 'Bottleneck Count';
      default:
        return 'Total Cost ($)';
    }
  };

  const formatValue = (value: number, mode: string): string => {
    switch (mode) {
      case 'cost':
        return `$${(value / 1000000000).toFixed(1)}B`;
      case 'reliability':
        return `${value}%`;
      case 'sustainability':
        return `${(value / 1000000).toFixed(1)}M`;
      case 'risk':
        return value.toString();
      default:
        return value.toLocaleString();
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'high': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'critical': return 'text-rose-600 bg-rose-50 border-rose-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleExportToPDF = () => {
    if (scenarios.length === 0) {
      alert('No scenarios available to export');
      return;
    }

    // Prepare risk alerts from all scenarios' bottlenecks
    const allRiskAlerts = scenarios.flatMap(scenario =>
      scenario.bottlenecks.map(bottleneck => ({
        severity: bottleneck.severity,
        category: 'Supply Chain Bottleneck',
        description: `${bottleneck.material}: ${bottleneck.impact}% impact - ${bottleneck.timeframe}`,
        date: scenario.lastUpdated
      }))
    );

    // Prepare commodity data from selected scenarios or all scenarios
    const scenariosToExport = selectedScenarios.length > 0
      ? scenarios.filter(s => selectedScenarios.includes(s.id))
      : scenarios;

    const commodities: Record<string, any> = {};
    scenariosToExport.forEach(scenario => {
      Object.entries(scenario.metrics.materialUtilization).forEach(([material, utilization]) => {
        if (!commodities[material]) {
          commodities[material] = {
            name: material.charAt(0).toUpperCase() + material.slice(1),
            current: 0,
            daily_change: 0,
            volume: 0,
            source: 'Scenario Analysis'
          };
        }
        commodities[material].current += utilization;
      });
    });

    // Average the utilization values
    Object.keys(commodities).forEach(key => {
      commodities[key].current = commodities[key].current / scenariosToExport.length;
      commodities[key].daily_change = Math.random() * 10 - 5; // Mock change
    });

    const reportData = {
      title: 'Scenario Comparison Report',
      reportDate: new Date(),
      userName: 'User',
      userCompany: 'MIAR Platform',
      commodities: commodities,
      riskAlerts: allRiskAlerts,
      summary: `Comparison of ${scenarios.length} supply chain scenarios. ${
        selectedScenarios.length > 0
          ? `Selected scenarios: ${selectedScenarios.length}`
          : 'All scenarios included'
      }. Analysis mode: ${comparisonMode}.`
    };

    const doc = PDFExportService.generateDetailedReport(reportData);
    const filename = `scenario-comparison-${new Date().toISOString().split('T')[0]}.pdf`;

    PDFExportService.downloadReport(doc, filename);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-200/50 overflow-hidden shadow-xl shadow-zinc-200/20">
        <div className="border-b border-zinc-200/50 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extralight text-zinc-900 tracking-tight">
                Scenario Comparison & Sensitivity Analysis
              </h2>
              <p className="text-sm text-zinc-500 mt-2 font-light">
                Compare multiple scenarios and analyze parameter sensitivity for optimal decision making
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={runNewScenario}
                disabled={isRunning}
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Scenario
                  </>
                )}
              </Button>
              
              <Button variant="outline" onClick={handleExportToPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-8 border-b border-zinc-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div>
                <label className="text-sm font-medium text-zinc-700 mb-2 block">Comparison Mode</label>
                <select
                  value={comparisonMode}
                  onChange={(e) => setComparisonMode(e.target.value as any)}
                  className="px-4 py-2 border border-zinc-200 rounded-lg bg-white/60 backdrop-blur-sm text-sm"
                >
                  <option value="cost">Cost Optimization</option>
                  <option value="reliability">Reliability</option>
                  <option value="sustainability">Sustainability</option>
                  <option value="risk">Risk Management</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-zinc-700 mb-2 block">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-zinc-200 rounded-lg bg-white/60 backdrop-blur-sm text-sm"
                >
                  <option value="objectiveValue">Total Cost</option>
                  <option value="reliabilityScore">Reliability Score</option>
                  <option value="bottleneckCount">Bottleneck Count</option>
                </select>
              </div>
            </div>
            
            <div className="text-sm text-zinc-500">
              {sortedScenarios.length} scenarios analyzed
            </div>
          </div>
        </div>

        {/* Scenario Results */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedScenarios.map((scenario) => {
              const comparisonValue = getComparisonValue(scenario, comparisonMode);
              const isSelected = selectedScenarios.includes(scenario.id);
              
              return (
                <Card key={scenario.id} className={`p-6 border transition-all cursor-pointer ${
                  isSelected ? 'border-purple-300 bg-purple-50/50' : 'border-zinc-200 hover:border-zinc-300'
                }`} onClick={() => {
                  setSelectedScenarios(prev => 
                    prev.includes(scenario.id) 
                      ? prev.filter(id => id !== scenario.id)
                      : [...prev, scenario.id]
                  );
                }}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-zinc-900">{scenario.name}</h3>
                      <p className="text-sm text-zinc-500 mt-1">{scenario.description}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {scenario.feasibility ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-rose-500" />
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        scenario.feasibility ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {scenario.feasibility ? 'Feasible' : 'Infeasible'}
                      </span>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-zinc-50 rounded-lg">
                      <div className="text-2xl font-bold text-zinc-900">
                        {formatValue(comparisonValue, comparisonMode)}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">{getComparisonLabel(comparisonMode)}</div>
                    </div>
                    
                    <div className="text-center p-3 bg-zinc-50 rounded-lg">
                      <div className="text-2xl font-bold text-zinc-900">{scenario.metrics.reliabilityScore}%</div>
                      <div className="text-xs text-zinc-500 mt-1">Reliability</div>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-zinc-700 mb-3">Cost Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Investment</span>
                        <span>${(scenario.costs.investmentCost / 1000000000).toFixed(1)}B</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Operational</span>
                        <span>${(scenario.costs.operationalCost / 1000000000).toFixed(1)}B</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Penalties</span>
                        <span>${(scenario.costs.penaltyCost / 1000000000).toFixed(1)}B</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottlenecks */}
                  <div>
                    <h4 className="text-sm font-medium text-zinc-700 mb-3">Critical Bottlenecks</h4>
                    <div className="space-y-2">
                      {scenario.bottlenecks.slice(0, 3).map((bottleneck, idx) => (
                        <div key={idx} className={`px-3 py-2 rounded border text-xs ${getSeverityColor(bottleneck.severity)}`}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{bottleneck.material}</span>
                            <span>{bottleneck.timeframe}</span>
                          </div>
                          <div className="mt-1 text-xs opacity-75">
                            Impact: {bottleneck.impact}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-zinc-200">
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span>Solve time: {scenario.solveTime}s</span>
                      <span>Updated: {scenario.lastUpdated.toLocaleDateString()}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sensitivity Analysis */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-200/50 overflow-hidden shadow-xl shadow-zinc-200/20">
        <div className="border-b border-zinc-200/50 px-8 py-6">
          <h3 className="text-lg font-light text-zinc-900">Sensitivity Analysis</h3>
          <p className="text-sm text-zinc-500 mt-1">Impact of parameter variations on system performance</p>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {sensitivityAnalysis.map((analysis, idx) => (
              <Card key={idx} className="p-6 border border-zinc-200/50">
                <h4 className="text-sm font-medium text-zinc-700 mb-4">{analysis.parameter}</h4>
                
                <div className="space-y-3">
                  {analysis.variations.map((variation, varIdx) => (
                    <div key={varIdx} className="flex items-center justify-between p-3 bg-zinc-50 rounded">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium">{variation.value}</span>
                        {variation.feasibility ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-rose-500" />
                        )}
                      </div>
                      
                      <div className={`text-sm font-medium ${
                        variation.impact > 0 ? 'text-rose-600' : 'text-green-600'
                      }`}>
                        {variation.impact > 0 ? '+' : ''}{(variation.impact * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-zinc-200">
                  <div className="text-xs text-zinc-500">
                    Base value: {analysis.baseValue}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioComparison;

