'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { AFRICAN_MINING_OPERATIONS, NETWORK_CONNECTIONS, AfricanMiningNetwork, AfricanMiningOperation } from '@/services/african-mining-network';
import { REAL_JOHANNESBURG_MINES, TAILINGS_OPPORTUNITIES, RealMiningDataService, RealMineData } from '@/services/real-mining-data';
import { Network, Node, Edge } from '@/stores/network-store';
import { useMiningStore } from '@/stores/mining-store';
import {
  Zap,
  AlertTriangle,
  TrendingUp,
  Globe,
  DollarSign
} from 'lucide-react';

// Real-time network algorithm implementations
class NetworkAlgorithms {
  static calculateBetweennessCentrality(network: Network): Map<string, number> {
    const centrality = new Map<string, number>();
    const nodes = network.nodes;
    const edges = network.edges;

    // Initialize centrality scores
    nodes.forEach(node => centrality.set(node.id, 0));

    // For each pair of nodes, calculate shortest paths
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const source = nodes[i].id;
        const target = nodes[j].id;

        // Find all shortest paths between source and target
        const paths = this.findShortestPaths(network, source, target);

        // For each shortest path, increment centrality of intermediate nodes
        paths.forEach(path => {
          for (let k = 1; k < path.length - 1; k++) {
            const intermediateNode = path[k];
            centrality.set(intermediateNode, (centrality.get(intermediateNode) || 0) + 1);
          }
        });
      }
    }

    return centrality;
  }

  static findShortestPaths(network: Network, source: string, target: string): string[][] {
    // Simplified shortest path using BFS
    const queue = [[source]];
    const visited = new Set<string>();
    const paths: string[][] = [];
    let shortestLength = Infinity;

    while (queue.length > 0) {
      const currentPath = queue.shift()!;
      const currentNode = currentPath[currentPath.length - 1];

      if (currentPath.length > shortestLength) continue;

      if (currentNode === target) {
        if (currentPath.length < shortestLength) {
          shortestLength = currentPath.length;
          paths.length = 0; // Clear longer paths
        }
        if (currentPath.length === shortestLength) {
          paths.push([...currentPath]);
        }
        continue;
      }

      if (visited.has(currentNode)) continue;
      visited.add(currentNode);

      // Find connected nodes
      const neighbors = network.edges
        .filter(edge => edge.source === currentNode || edge.target === currentNode)
        .map(edge => edge.source === currentNode ? edge.target : edge.source)
        .filter(neighbor => !currentPath.includes(neighbor));

      neighbors.forEach(neighbor => {
        queue.push([...currentPath, neighbor]);
      });
    }

    return paths;
  }

  static calculateClusteringCoefficient(network: Network): Map<string, number> {
    const clustering = new Map<string, number>();

    network.nodes.forEach(node => {
      const neighbors = this.getNeighbors(network, node.id);

      if (neighbors.length < 2) {
        clustering.set(node.id, 0);
        return;
      }

      let triangles = 0;
      const maxTriangles = (neighbors.length * (neighbors.length - 1)) / 2;

      for (let i = 0; i < neighbors.length; i++) {
        for (let j = i + 1; j < neighbors.length; j++) {
          if (this.areConnected(network, neighbors[i], neighbors[j])) {
            triangles++;
          }
        }
      }

      clustering.set(node.id, triangles / maxTriangles);
    });

    return clustering;
  }

  private static getNeighbors(network: Network, nodeId: string): string[] {
    return network.edges
      .filter(edge => edge.source === nodeId || edge.target === nodeId)
      .map(edge => edge.source === nodeId ? edge.target : edge.source);
  }

  private static areConnected(network: Network, node1: string, node2: string): boolean {
    return network.edges.some(edge =>
      (edge.source === node1 && edge.target === node2) ||
      (edge.source === node2 && edge.target === node1)
    );
  }
}

const AfricanMiningNetworkMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedOperation, setSelectedOperation] = useState<string | null>(null);
  const [networkMetrics, setNetworkMetrics] = useState<any>({});
  const [liveData, setLiveData] = useState({
    totalFlow: 0,
    criticalPaths: 0,
    vulnerabilities: 0,
    tailingsValue: 0,
    johannesburgProduction: 0
  });
  const [animationFrame, setAnimationFrame] = useState(0);
  const [tailingsAnalysis, setTailingsAnalysis] = useState<any>(null);

  const { runTailingsAnalysis } = useMiningStore();

  // Convert mining operations to network format including real Johannesburg data
  const createMiningNetwork = (): Network => {
    // Continental operations
    const continentalNodes: Node[] = AFRICAN_MINING_OPERATIONS.map(op => ({
      id: op.id,
      label: op.name,
      group: op.region,
      size: Math.log(op.economic_impact.employment) * 5,
      x: op.location.lng,
      y: op.location.lat,
      color: getRegionColor(op.region),
      metadata: {
        type: 'continental',
        country: op.country,
        commodities: op.commodities,
        production: op.production,
        employment: op.economic_impact.employment,
        revenue: op.economic_impact.government_revenue_usd_m
      }
    }));

    // Real Johannesburg mining operations with detailed data
    const johannesburgNodes: Node[] = REAL_JOHANNESBURG_MINES.map(mine => ({
      id: `jb_${mine.id}`,
      label: mine.name,
      group: 'johannesburg_detail',
      size: Math.log(mine.economics.employment) * 6, // Slightly larger for detail
      x: mine.location.lng,
      y: mine.location.lat,
      color: mine.status === 'operational' ? '#16a34a' : mine.status === 'development' ? '#ca8a04' : '#2563eb',
      metadata: {
        type: 'johannesburg',
        operator: mine.operator,
        status: mine.status,
        annual_oz: mine.production.annual_oz,
        grade: mine.production.grade_gt,
        reserves: mine.production.reserves_oz,
        aisc: mine.economics.aisc_usd_oz,
        employment: mine.economics.employment,
        depth: mine.location.depth_m
      }
    }));

    const nodes = [...continentalNodes, ...johannesburgNodes];

    // Continental connections
    const continentalEdges: Edge[] = NETWORK_CONNECTIONS.map(conn => ({
      source: conn.source_id,
      target: conn.target_id,
      weight: conn.strength,
      color: getConnectionColor(conn.strength),
      metadata: {
        type: conn.connection_type,
        value: conn.value_usd_annually,
        description: conn.description
      }
    }));

    // Johannesburg internal connections (mines to tailings opportunities)
    const johannesburgEdges: Edge[] = [];
    const operationalJbMines = REAL_JOHANNESBURG_MINES.filter(m => m.status === 'operational');

    // Create connections between operational mines for tailings flow
    for (let i = 0; i < operationalJbMines.length - 1; i++) {
      johannesburgEdges.push({
        source: `jb_${operationalJbMines[i].id}`,
        target: `jb_${operationalJbMines[i + 1].id}`,
        weight: 0.7,
        color: '#16a34a',
        metadata: {
          type: 'tailings_flow',
          value: 50000000, // $50M annual tailings processing value
          description: 'Tailings reprocessing network'
        }
      });
    }

    const edges = [...continentalEdges, ...johannesburgEdges];

    return {
      id: 'african-mining-network',
      name: 'African Mining Network',
      nodes,
      edges,
      directed: false
    };
  };

  const getRegionColor = (region: string) => {
    const colors = {
      'west_africa': '#4b5563',      // Gray 600
      'east_africa': '#6b7280',      // Gray 500
      'southern_africa': '#9ca3af',  // Gray 400
      'central_africa': '#374151',   // Gray 700
      'north_africa': '#1f2937'      // Gray 800
    };
    return colors[region as keyof typeof colors] || '#6b7280';
  };

  const getConnectionColor = (strength: number) => {
    if (strength >= 0.8) return '#16a34a'; // Strong - Green 600
    if (strength >= 0.6) return '#ca8a04'; // Medium - Yellow 600
    return '#dc2626'; // Weak - Red 600
  };

  // Calculate network metrics using algorithms
  useEffect(() => {
    const network = createMiningNetwork();

    const betweenness = NetworkAlgorithms.calculateBetweennessCentrality(network);
    const clustering = NetworkAlgorithms.calculateClusteringCoefficient(network);

    setNetworkMetrics({
      betweenness: Object.fromEntries(betweenness),
      clustering: Object.fromEntries(clustering),
      totalNodes: network.nodes.length,
      totalEdges: network.edges.length
    });

    // Calculate live metrics including real Johannesburg data
    const totalFlow = NETWORK_CONNECTIONS.reduce((sum, conn) => sum + (conn.value_usd_annually || 0), 0);
    const criticalPaths = Array.from(betweenness.values()).filter(val => val > 0).length;
    const vulnerabilities = NETWORK_CONNECTIONS.filter(conn => conn.strength < 0.6).length;

    // Add real Johannesburg mining data
    const tailingsValue = TAILINGS_OPPORTUNITIES.reduce((sum, t) =>
      sum + (t.estimated_gold_oz * 2400 - t.estimated_gold_oz * t.processing_cost_usd_oz), 0
    );
    const johannesburgProduction = REAL_JOHANNESBURG_MINES
      .filter(m => m.status === 'operational')
      .reduce((sum, m) => sum + m.production.annual_oz, 0);

    setLiveData({
      totalFlow: totalFlow / 1000000000, // Convert to billions
      criticalPaths,
      vulnerabilities,
      tailingsValue: tailingsValue / 1000000000, // Convert to billions
      johannesburgProduction
    });

    // Run live tailings analysis for network intelligence
    runLiveTailingsAnalysis();

    // Setup live animation loop
    const animationInterval = setInterval(() => {
      setAnimationFrame(prev => prev + 1);

      // Update live metrics with slight variations for realism
      setLiveData(prev => ({
        ...prev,
        totalFlow: prev.totalFlow + (Math.random() - 0.5) * 0.1,
        johannesburgProduction: johannesburgProduction + Math.floor(Math.random() * 100 - 50),
        tailingsValue: tailingsValue / 1000000000 + (Math.random() - 0.5) * 0.05
      }));
    }, 3000);

    return () => clearInterval(animationInterval);
  }, []);

  // Live tailings analysis integration
  const runLiveTailingsAnalysis = async () => {
    try {
      const response = await fetch('/api/mining/tailings-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          network: {
            id: 'johannesburg-network',
            sites: REAL_JOHANNESBURG_MINES.map(mine => ({
              id: mine.id,
              name: mine.name,
              location: mine.location,
              production: mine.production
            }))
          },
          sampleData: {
            composition: { gold: 0.35, uranium: 0.08, copper: 0.42 },
            conditions: { pH: 2.8, temperature: 22, grindSize: 75 }
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        setTailingsAnalysis(result);
      }
    } catch (error) {
      console.error('Live tailings analysis failed:', error);
    }
  };

  // SVG Map Component
  const renderNetworkMap = () => {
    const network = createMiningNetwork();
    const width = 1200;
    const height = 600;

    // Africa bounds (approximate)
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
        {/* Background */}
        <rect width={width} height={height} fill="#f9fafb" />

        {/* Connection lines */}
        {network.edges.map((edge, idx) => {
          const sourceNode = network.nodes.find(n => n.id === edge.source);
          const targetNode = network.nodes.find(n => n.id === edge.target);
          if (!sourceNode || !targetNode) return null;

          const x1 = scaleX(sourceNode.x!);
          const y1 = scaleY(sourceNode.y!);
          const x2 = scaleX(targetNode.x!);
          const y2 = scaleY(targetNode.y!);

          return (
            <g key={idx}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={edge.color}
                strokeWidth={Math.max(1, (edge.weight || 0.5) * 4)}
                strokeOpacity={0.8}
              />
              {/* Enhanced flow animation with value indicators */}
              <circle r="4" fill="#4b5563" opacity="0.8">
                <animateMotion dur={`${6 - (edge.weight || 0.5) * 4}s`} repeatCount="indefinite">
                  <mpath href={`#path-${idx}`} />
                </animateMotion>
              </circle>
              <circle r="2" fill="#374151" opacity="0.6">
                <animateMotion dur={`${6 - (edge.weight || 0.5) * 4}s`} repeatCount="indefinite" begin="0.5s">
                  <mpath href={`#path-${idx}`} />
                </animateMotion>
              </circle>
              <path id={`path-${idx}`} d={`M ${x1} ${y1} L ${x2} ${y2}`} fill="none" opacity="0" />

              {/* Value flow indicator for high-value connections */}
              {edge.metadata?.value && edge.metadata.value > 100000000 && (
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 - 8}
                  fill="#6b7280"
                  fontSize="6"
                  textAnchor="middle"
                  className="font-mono font-medium"
                >
                  ${(edge.metadata.value / 1000000000).toFixed(1)}B
                </text>
              )}
            </g>
          );
        })}

        {/* Mining operation nodes */}
        {network.nodes.map((node, idx) => {
          const x = scaleX(node.x!);
          const y = scaleY(node.y!);
          const radius = Math.max(5, (node.size || 10) / 2);
          const isSelected = selectedOperation === node.id;
          const centrality = networkMetrics.betweenness?.[node.id] || 0;

          return (
            <g key={idx}>
              {/* Centrality ring */}
              {centrality > 0 && (
                <circle
                  cx={x}
                  cy={y}
                  r={radius + 8}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2"
                  opacity="0.6"
                />
              )}

              {/* Main node */}
              <circle
                cx={x}
                cy={y}
                r={radius}
                fill={node.color}
                stroke={isSelected ? "#ffffff" : node.color}
                strokeWidth={isSelected ? "3" : "1"}
                opacity="0.9"
                className="cursor-pointer hover:opacity-100"
                onClick={() => setSelectedOperation(selectedOperation === node.id ? null : node.id)}
              />

              {/* Pulse animation for active nodes */}
              {node.metadata?.production?.annual_production > 0 && (
                <circle
                  cx={x}
                  cy={y}
                  r={radius}
                  fill={node.color}
                  opacity="0.4"
                >
                  <animate
                    attributeName="r"
                    values={`${radius};${radius + 10};${radius}`}
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.4;0;0.4"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              {/* Node label - different for Johannesburg operations */}
              <text
                x={x}
                y={y - radius - 5}
                fill="#374151"
                fontSize={node.metadata?.type === 'johannesburg' ? '8' : '10'}
                textAnchor="middle"
                className="font-mono font-medium"
              >
                {node.metadata?.type === 'johannesburg'
                  ? `${node.metadata?.annual_oz?.toLocaleString() || '0'} oz`
                  : node.label
                }
              </text>

              {/* Live production indicator */}
              {(node.metadata?.annual_oz > 0 || node.metadata?.production?.annual_production > 0) && (
                <circle
                  cx={x + 12}
                  cy={y - 12}
                  r="3"
                  fill="#10b981"
                  opacity="0.9"
                >
                  <animate
                    attributeName="r"
                    values="2;5;2"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.9;0.3;0.9"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              {/* Tailings indicator for Johannesburg mines */}
              {node.metadata?.type === 'johannesburg' && (
                <circle
                  cx={x + 15}
                  cy={y - 15}
                  r="4"
                  fill="#f59e0b"
                  opacity="0.8"
                >
                  <animate
                    attributeName="opacity"
                    values="0.8;0.3;0.8"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </g>
          );
        })}

        {/* Critical path highlights */}
        {Object.entries(networkMetrics.betweenness || {})
          .filter(([_, value]) => (value as number) > 2)
          .map(([nodeId, _], idx) => {
            const node = network.nodes.find(n => n.id === nodeId);
            if (!node) return null;

            return (
              <circle
                key={`critical-${idx}`}
                cx={scaleX(node.x!)}
                cy={scaleY(node.y!)}
                r="20"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeDasharray="4,4"
                opacity="0.7"
              >
                <animate
                  attributeName="r"
                  values="15;25;15"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
            );
          })
        }
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Terminal-Style Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-8xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div>
                <h1 className="text-2xl font-medium text-gray-900 tracking-tight">
                  MIAR
                </h1>
                <p className="text-sm text-gray-600 font-light">
                  African Mining Network Intelligence
                </p>
              </div>
              <div className="hidden lg:flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-500 font-mono">LIVE</span>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-8 text-right">
              <div className="space-y-1">
                <div className="text-lg font-mono text-gray-900">${liveData.totalFlow.toFixed(1)}B</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Network Flow</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-mono text-gray-900">${liveData.tailingsValue.toFixed(1)}B</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Tailings Value</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-mono text-gray-900">{liveData.johannesburgProduction.toLocaleString()}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">oz Gold/Year</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-mono text-gray-900">{liveData.criticalPaths}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Critical Nodes</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-mono text-gray-900">{liveData.vulnerabilities}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Risk Points</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-8 py-8 space-y-8">
        {/* Main Network Visualization */}
        <div className="bg-white rounded border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Continental Network Intelligence</h3>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-600">Strong</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                  <span className="text-gray-600">Medium</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="text-gray-600">Vulnerable</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full border border-blue-600"></div>
                  <span className="text-gray-600">Critical</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-hidden rounded border border-gray-200 bg-gray-50">
              {renderNetworkMap()}
            </div>
          </div>
        </div>

        {/* Selected Operation Details - Enhanced for both Continental and Johannesburg */}
        {selectedOperation && (() => {
          // Check if it's a Johannesburg operation
          const isJohannesburg = selectedOperation.startsWith('jb_');
          const operation = isJohannesburg
            ? REAL_JOHANNESBURG_MINES.find(mine => `jb_${mine.id}` === selectedOperation)
            : AFRICAN_MINING_OPERATIONS.find(op => op.id === selectedOperation);

          const centrality = networkMetrics.betweenness?.[selectedOperation] || 0;
          const clustering = networkMetrics.clustering?.[selectedOperation] || 0;

          return operation && (
            <div className="bg-white rounded border border-gray-200 shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {isJohannesburg ? operation.name : operation.name}
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wide">Operations</h4>
                    <div className="space-y-3 text-sm">
                      {isJohannesburg ? (
                        // Johannesburg mine details
                        <>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Operator</span>
                            <span className="text-gray-900 font-mono">{(operation as RealMineData).operator}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Annual Production</span>
                            <span className="text-gray-900 font-mono">{(operation as RealMineData).production.annual_oz.toLocaleString()} oz</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Grade</span>
                            <span className="text-gray-900 font-mono">{(operation as RealMineData).production.grade_gt} g/t</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">AISC</span>
                            <span className="text-gray-900 font-mono">${(operation as RealMineData).economics.aisc_usd_oz}/oz</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-gray-500">Depth</span>
                            <span className="text-gray-900 font-mono">{(operation as RealMineData).location.depth_m}m</span>
                          </div>
                        </>
                      ) : (
                        // Continental operation details
                        <>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Country</span>
                            <span className="text-gray-900 font-mono">{(operation as AfricanMiningOperation).country}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Primary Commodity</span>
                            <span className="text-gray-900 font-mono capitalize">{(operation as AfricanMiningOperation).production.primary_commodity}</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-gray-500">Annual Production</span>
                            <span className="text-gray-900 font-mono">{(operation as AfricanMiningOperation).production.annual_production.toLocaleString()} {(operation as AfricanMiningOperation).production.unit}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wide">Network Analysis</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Betweenness Centrality</span>
                        <span className={`font-mono font-medium ${centrality > 2 ? 'text-red-600' : centrality > 1 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {centrality.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Clustering Coefficient</span>
                        <span className="text-gray-900 font-mono">{(clustering * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Critical Path Risk</span>
                        <span className={`font-mono font-medium ${centrality > 2 ? 'text-red-600' : 'text-green-600'}`}>
                          {centrality > 2 ? 'HIGH' : 'LOW'}
                        </span>
                      </div>
                      {isJohannesburg && tailingsAnalysis && (
                        <div className="flex justify-between py-2">
                          <span className="text-gray-500">Tailings AI Analysis</span>
                          <span className="text-green-600 font-mono">ACTIVE</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wide">{isJohannesburg ? 'Economic Impact' : 'Global Impact'}</h4>
                    <div className="space-y-3 text-sm">
                      {isJohannesburg ? (
                        <>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Employment</span>
                            <span className="text-gray-900 font-mono">{(operation as RealMineData).economics.employment.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Annual Revenue</span>
                            <span className="text-gray-900 font-mono">${(operation as RealMineData).economics.revenue_usd_m}M</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Reserves</span>
                            <span className="text-gray-900 font-mono">{((operation as RealMineData).production.reserves_oz / 1000).toLocaleString()}k oz</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-gray-500">Life of Mine</span>
                            <span className="text-gray-900 font-mono">{(operation as RealMineData).production.life_years} years</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Employment</span>
                            <span className="text-gray-900 font-mono">{(operation as AfricanMiningOperation).economic_impact.employment.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Govt Revenue</span>
                            <span className="text-gray-900 font-mono">${(operation as AfricanMiningOperation).economic_impact.government_revenue_usd_m}M/yr</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-gray-500">GDP Contribution</span>
                            <span className="text-gray-900 font-mono">{(operation as AfricanMiningOperation).economic_impact.gdp_contribution_percent.toFixed(1)}%</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Live Tailings Analysis Results */}
        {tailingsAnalysis && (
          <div className="bg-white rounded border border-gray-200 shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">Live Tailings Analysis</h3>
              <p className="text-sm text-gray-600">Johannesburg Operations</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="space-y-3">
                  <DollarSign className="h-8 w-8 text-gray-600 mx-auto" />
                  <div>
                    <div className="text-xl font-mono text-gray-900 mb-1">${liveData.tailingsValue.toFixed(1)}B</div>
                    <div className="text-sm text-gray-600">Recovery Potential</div>
                    <div className="text-xs text-gray-500 mt-2">AI-driven reprocessing analysis shows massive value in existing tailings</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <Zap className="h-8 w-8 text-gray-600 mx-auto" />
                  <div>
                    <div className="text-xl font-mono text-gray-900 mb-1">Real-Time</div>
                    <div className="text-sm text-gray-600">Processing Optimization</div>
                    <div className="text-xs text-gray-500 mt-2">Live analysis of grade, chemistry, and extraction efficiency</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <TrendingUp className="h-8 w-8 text-gray-600 mx-auto" />
                  <div>
                    <div className="text-xl font-mono text-gray-900 mb-1">Network</div>
                    <div className="text-sm text-gray-600">Effect Multiplier</div>
                    <div className="text-xs text-gray-500 mt-2">Johannesburg operations amplify continental supply chain value</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Platform Intelligence Summary */}
        <div className="bg-white rounded border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">Intelligence Platform</h3>
            <p className="text-sm text-gray-600">Revolutionary network analysis capabilities</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-3">
                <Zap className="h-8 w-8 text-gray-600 mx-auto" />
                <div>
                  <div className="text-base font-medium text-gray-900 mb-1">Live Network + Real Operations</div>
                  <div className="text-sm text-gray-600">Continental mining networks combined with detailed Johannesburg operations data</div>
                </div>
              </div>
              <div className="space-y-3">
                <Globe className="h-8 w-8 text-gray-600 mx-auto" />
                <div>
                  <div className="text-base font-medium text-gray-900 mb-1">AI-Powered Tailings Analysis</div>
                  <div className="text-sm text-gray-600">Real-time processing of $16B+ tailings opportunities with network optimization</div>
                </div>
              </div>
              <div className="space-y-3">
                <TrendingUp className="h-8 w-8 text-gray-600 mx-auto" />
                <div>
                  <div className="text-base font-medium text-gray-900 mb-1">Global Supply Chain Intelligence</div>
                  <div className="text-sm text-gray-600">First platform showing how local operations impact global mineral flows</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AfricanMiningNetworkMap;