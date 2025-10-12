'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MaterialFlowTracking from './material-flow-tracking';
import ScenarioModeling from './scenario-modeling';
import GeopoliticalRiskDashboard from './geopolitical-risk-dashboard';
import ScenarioComparison from './scenario-comparison';
import ESGComplianceTracker from './esg-compliance-tracker';
import CustomScenarioBuilder from './custom-scenario-builder';
import ThreeDSupplyChainNetwork from '../visualization/3d-supply-chain-network';
import {
  Package,
  AlertTriangle,
  TrendingUp,
  Clock,
  MapPin,
  Activity,
  Zap,
  BarChart3,
  Settings,
  Download,
  RefreshCw,
  ChevronDown,
  Globe,
  Brain,
  Shield,
  ChevronRight,
  Circle,
  Square,
  Triangle,
  Layers,
  Calculator
} from 'lucide-react';

interface SupplyChainNode {
  id: string;
  name: string;
  type: 'material' | 'component' | 'technology' | 'zone';
  status: 'operational' | 'constrained' | 'bottleneck' | 'critical';
  capacity: number;
  utilization: number;
  cost: number;
  leadTime?: number;
  position: { x: number; y: number };
}

interface SupplyChainFlow {
  from: string;
  to: string;
  volume: number;
  value: number;
  status: 'active' | 'constrained' | 'blocked' | 'bottleneck';
  delay?: number;
}

interface MaterialBottleneck {
  material: string;
  utilization: number;
  constraint: boolean;
  impact: string;
  trend: 'increasing' | 'stable' | 'decreasing';
}

interface SCGEPSolution {
  objectiveValue: number;
  feasibility: boolean;
  solveTime: number;
  iterations: number;
  convergence: 'optimal' | 'feasible' | 'infeasible' | 'unbounded';
  costs?: {
    investment: number;
    operational: number;
    penalties: number;
  };
  metrics?: {
    totalCapacity: number;
    renewableShare: number;
    averageLeadTime: number;
    materialUtilization: Record<string, number>;
  };
}

interface SupplyChainAnalysis {
  materialBottlenecks: MaterialBottleneck[];
  technologyDelays: any[];
  spatialConstraints: any[];
  costImpact: {
    scenario: string;
    totalCost: number;
    costIncrease: number;
    costIncreasePercent: number;
  };
}

const SupplyChainOptimization: React.FC = () => {
  const [solution, setSolution] = useState<SCGEPSolution | null>(null);
  const [analysis, setAnalysis] = useState<SupplyChainAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('baseline');
  const [selectedRegion, setSelectedRegion] = useState('africa');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['materials', 'technologies']));
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'network' | 'materials' | 'scenarios' | 'custom_scenarios' | 'geopolitical_risk' | 'scenario_comparison' | 'esg_compliance'>('network');

  // Mock data for visualization
  const [nodes, setNodes] = useState<SupplyChainNode[]>([
    // Materials
    { id: 'lithium', name: 'Lithium', type: 'material', status: 'constrained', capacity: 50000, utilization: 87, cost: 15000, position: { x: 100, y: 100 } },
    { id: 'cobalt', name: 'Cobalt', type: 'material', status: 'bottleneck', capacity: 150000, utilization: 94, cost: 55000, position: { x: 100, y: 200 } },
    { id: 'nickel', name: 'Nickel', type: 'material', status: 'operational', capacity: 3000000, utilization: 72, cost: 18000, position: { x: 100, y: 300 } },
    { id: 'silicon', name: 'Silicon', type: 'material', status: 'operational', capacity: 8000000, utilization: 65, cost: 2500, position: { x: 100, y: 400 } },
    
    // Components
    { id: 'battery_cells', name: 'Battery Cells', type: 'component', status: 'constrained', capacity: 100000, utilization: 82, cost: 250, leadTime: 2, position: { x: 300, y: 150 } },
    { id: 'solar_panels', name: 'Solar Panels', type: 'component', status: 'operational', capacity: 50000, utilization: 68, cost: 180, leadTime: 1, position: { x: 300, y: 250 } },
    { id: 'wind_turbines', name: 'Wind Turbines', type: 'component', status: 'constrained', capacity: 10000, utilization: 89, cost: 1200, leadTime: 3, position: { x: 300, y: 350 } },
    
    // Technologies
    { id: 'solar_pv', name: 'Solar PV', type: 'technology', status: 'operational', capacity: 5000, utilization: 75, cost: 1200000, position: { x: 500, y: 200 } },
    { id: 'battery_storage', name: 'Battery Storage', type: 'technology', status: 'constrained', capacity: 2000, utilization: 91, cost: 350000, position: { x: 500, y: 300 } },
    { id: 'wind_onshore', name: 'Onshore Wind', type: 'technology', status: 'constrained', capacity: 1500, utilization: 88, cost: 1500000, position: { x: 500, y: 400 } },
    
    // Zones
    { id: 'bge', name: 'BGE', type: 'zone', status: 'operational', capacity: 6428, utilization: 78, cost: 0, position: { x: 700, y: 200 } },
    { id: 'aps', name: 'APS', type: 'zone', status: 'constrained', capacity: 1554, utilization: 92, cost: 0, position: { x: 700, y: 300 } },
    { id: 'dpl', name: 'DPL', type: 'zone', status: 'operational', capacity: 961, utilization: 69, cost: 0, position: { x: 700, y: 400 } }
  ]);

  const [flows, setFlows] = useState<SupplyChainFlow[]>([
    { from: 'lithium', to: 'battery_cells', volume: 45000, value: 675000000, status: 'constrained', delay: 30 },
    { from: 'cobalt', to: 'battery_cells', volume: 141000, value: 7755000000, status: 'bottleneck', delay: 45 },
    { from: 'nickel', to: 'battery_cells', volume: 2160000, value: 38880000000, status: 'active' },
    { from: 'battery_cells', to: 'battery_storage', volume: 82000, value: 20500000000, status: 'constrained', delay: 20 },
    { from: 'solar_panels', to: 'solar_pv', volume: 34000, value: 6120000000, status: 'active' },
    { from: 'wind_turbines', to: 'wind_onshore', volume: 8900, value: 10680000000, status: 'constrained', delay: 60 },
    { from: 'solar_pv', to: 'bge', volume: 3750, value: 4500000000, status: 'active' },
    { from: 'battery_storage', to: 'aps', volume: 1820, value: 637000000, status: 'constrained', delay: 15 },
    { from: 'wind_onshore', to: 'dpl', volume: 1320, value: 1980000000, status: 'constrained', delay: 90 }
  ]);

  const runOptimization = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/sc-gep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: selectedScenario,
          region: selectedRegion,
          analysis_type: 'full',
          use_enhanced: true
        })
      });

      const data = await response.json();
      if (data.success) {
        setSolution(data.solution);
        setAnalysis(data.bottleneckAnalysis);
      } else {
        console.error('Optimization failed:', data.error);
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedScenario, selectedRegion]);

  const runBottleneckAnalysis = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/sc-gep/bottlenecks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sensitivity_analysis: true,
          timeHorizon: 30,
          region: selectedRegion
        })
      });

      const data = await response.json();
      if (data.success) {
        // Update nodes and flows based on bottleneck analysis
        const updatedNodes = nodes.map(node => {
          const bottleneck = data.bottlenecks.material.find((b: any) => b.material === node.name);
          if (bottleneck) {
            return {
              ...node,
              status: bottleneck.constraint ? 'bottleneck' : node.status,
              utilization: bottleneck.utilization
            };
          }
          return node;
        });
        setNodes(updatedNodes);
      }
    } catch (error) {
      console.error('Bottleneck Analysis Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [nodes, selectedRegion]);

  useEffect(() => {
    runOptimization();
  }, [runOptimization]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'materials':
        return <MaterialFlowTracking />;
      case 'scenarios':
        return <ScenarioModeling />;
      case 'custom_scenarios':
        return <CustomScenarioBuilder />;
      case 'geopolitical_risk':
        return <GeopoliticalRiskDashboard />;
      case 'scenario_comparison':
        return <ScenarioComparison />;
      case 'esg_compliance':
        return <ESGComplianceTracker />;
      default:
        return renderNetworkView();
    }
  };

  const renderNetworkView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Supply Chain Network Visualization */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-200/50 overflow-hidden shadow-xl shadow-zinc-200/20">
        <div className="border-b border-zinc-200/50 px-6 py-4">
          <h3 className="text-lg font-light text-zinc-900">Supply Chain Network</h3>
        </div>
        <div className="p-6">
          <div className="relative h-96 bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-lg overflow-hidden">
            {/* SVG Network Visualization */}
            <svg className="w-full h-full">
              {/* Flows */}
              {flows.map((flow, idx) => {
                const fromNode = nodes.find(n => n.id === flow.from);
                const toNode = nodes.find(n => n.id === flow.to);
                if (!fromNode || !toNode) return null;

                const strokeColor = flow.status === 'active' ? '#10b981' : 
                                  flow.status === 'constrained' ? '#f59e0b' : 
                                  flow.status === 'bottleneck' ? '#ef4444' : '#6b7280';
                const strokeWidth = Math.max(2, Math.log(flow.volume) / 2);

                return (
                  <line
                    key={idx}
                    x1={fromNode.position.x}
                    y1={fromNode.position.y}
                    x2={toNode.position.x}
                    y2={toNode.position.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeOpacity={0.7}
                    markerEnd="url(#arrowhead)"
                  />
                );
              })}

              {/* Nodes */}
              {nodes.map((node) => {
                const fillColor = node.status === 'operational' ? '#10b981' : 
                                node.status === 'constrained' ? '#f59e0b' : 
                                node.status === 'bottleneck' ? '#ef4444' : '#6b7280';
                
                return (
                  <g key={node.id}>
                    <circle
                      cx={node.position.x}
                      cy={node.position.y}
                      r={12}
                      fill={fillColor}
                      stroke="white"
                      strokeWidth={2}
                      className="cursor-pointer hover:r-16 transition-all"
                      onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                    />
                    <text
                      x={node.position.x}
                      y={node.position.y - 20}
                      textAnchor="middle"
                      className="text-xs font-light fill-zinc-700"
                    >
                      {node.name}
                    </text>
                    {selectedNode === node.id && (
                      <>
                        <rect
                          x={node.position.x - 60}
                          y={node.position.y + 20}
                          width={120}
                          height={60}
                          fill="white"
                          stroke={fillColor}
                          strokeWidth={1}
                          rx={4}
                          className="drop-shadow-lg"
                        />
                        <text x={node.position.x} y={node.position.y + 35} textAnchor="middle" className="text-xs fill-zinc-700">
                          {node.utilization.toFixed(0)}% util
                        </text>
                        <text x={node.position.x} y={node.position.y + 50} textAnchor="middle" className="text-xs fill-zinc-700">
                          {node.capacity.toLocaleString()} cap
                        </text>
                      </>
                    )}
                  </g>
                );
              })}

              {/* Arrow marker */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
                </marker>
              </defs>
            </svg>

            {/* Legend */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-zinc-200">
              <div className="text-xs font-medium text-zinc-700 mb-2">Status</div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-xs text-zinc-600">Operational</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-xs text-zinc-600">Constrained</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                  <span className="text-xs text-zinc-600">Bottleneck</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottleneck Analysis */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-200/50 overflow-hidden shadow-xl shadow-zinc-200/20">
        <div className="border-b border-zinc-200/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-light text-zinc-900">Bottleneck Analysis</h3>
            <Button
              onClick={runBottleneckAnalysis}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
            >
              Analyze
            </Button>
          </div>
        </div>
        <div className="p-6">
          {analysis?.materialBottlenecks ? (
            <div className="space-y-4">
              {analysis.materialBottlenecks.map((bottleneck, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    bottleneck.constraint ? 'border-rose-200 bg-rose-50/50' : 'border-emerald-200 bg-emerald-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-zinc-900">{bottleneck.material}</span>
                    <span className={`text-sm font-medium ${
                      bottleneck.constraint ? 'text-rose-600' : 'text-emerald-600'
                    }`}>
                      {bottleneck.utilization.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-zinc-200 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        bottleneck.constraint ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(bottleneck.utilization, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-zinc-600">{bottleneck.impact}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-500">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-light">Run analysis to identify bottlenecks</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-200/50 overflow-hidden shadow-xl shadow-zinc-200/20">
        <div className="border-b border-zinc-200/50 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extralight text-zinc-900 tracking-tight">Supply Chain-Constrained Analysis</h2>
              <p className="text-sm text-zinc-500 mt-2 font-light">Strategic mining supply chain intelligence and optimization</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 bg-white/60 backdrop-blur-sm rounded-full p-1 border border-zinc-200/50">
                <button
                  onClick={() => setActiveView('network')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-light transition-all ${
                    activeView === 'network'
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
                  }`}
                >
                  <Layers className="h-4 w-4" />
                  <span>Network</span>
                </button>
                <button
                  onClick={() => setActiveView('materials')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-light transition-all ${
                    activeView === 'materials'
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
                  }`}
                >
                  <Package className="h-4 w-4" />
                  <span>Materials</span>
                </button>
                <button
                  onClick={() => setActiveView('scenarios')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-light transition-all ${
                    activeView === 'scenarios'
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
                  }`}
                >
                  <Calculator className="h-4 w-4" />
                  <span>Scenarios</span>
                </button>
                <button
                  onClick={() => setActiveView('custom_scenarios')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-light transition-all ${
                    activeView === 'custom_scenarios'
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Custom</span>
                </button>
                <button
                  onClick={() => setActiveView('geopolitical_risk')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-light transition-all ${
                    activeView === 'geopolitical_risk'
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
                  }`}
                >
                  <Globe className="h-4 w-4" />
                  <span>Geo Risk</span>
                </button>
                <button
                  onClick={() => setActiveView('scenario_comparison')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-light transition-all ${
                    activeView === 'scenario_comparison'
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
                  }`}
                >
                  <Layers className="h-4 w-4" />
                  <span>Compare</span>
                </button>
                <button
                  onClick={() => setActiveView('esg_compliance')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-light transition-all ${
                    activeView === 'esg_compliance'
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  <span>ESG</span>
                </button>
              </div>
              {activeView === 'network' && (
                <>
                  <select
                    value={selectedScenario}
                    onChange={(e) => setSelectedScenario(e.target.value)}
                    className="px-4 py-2 border border-zinc-200 rounded-lg bg-white/60 backdrop-blur-sm text-sm font-light"
                  >
                    <option value="baseline">Baseline Scenario</option>
                    <option value="high_demand">High Demand</option>
                    <option value="constrained_supply">Constrained Supply</option>
                    <option value="rapid_expansion">Rapid Expansion</option>
                  </select>
                  <Button
                    onClick={runOptimization}
                    disabled={isLoading}
                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    {isLoading && <RefreshCw className="h-4 w-4 animate-spin mr-2" />}
                    Optimize
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Solution Status */}
        {solution && (
          <div className="px-8 py-4 bg-zinc-50/50">
            <div className="grid grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-extralight text-zinc-900">
                  ${(solution.objectiveValue / 1000000000).toFixed(1)}B
                </div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider font-light">Total Cost</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-extralight ${
                  solution.convergence === 'optimal' ? 'text-emerald-600' :
                  solution.convergence === 'feasible' ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {solution.convergence.toUpperCase()}
                </div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider font-light">Solution Status</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-extralight text-blue-600">
                  {solution.solveTime.toFixed(2)}s
                </div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider font-light">Solve Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-extralight text-emerald-600">
                  {solution.iterations}
                </div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider font-light">Iterations</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Render active view */}
      {renderActiveView()}
    </div>
  );
};

export default SupplyChainOptimization;
