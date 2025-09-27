'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { AFRICAN_MINING_OPERATIONS, NETWORK_CONNECTIONS } from '@/services/african-mining-network';
import {
  Ship,
  Anchor,
  AlertTriangle,
  TrendingUp,
  Navigation,
  Globe,
  Clock,
  MapPin
} from 'lucide-react';

// Trade network data structures
interface TradePort {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  capacity: number; // TEU millions
  utilization: number; // percentage
  throughput: number; // millions of tonnes
  status: 'operational' | 'congested' | 'disrupted';
  commodities: string[];
}

interface ShippingRoute {
  id: string;
  source: string;
  target: string;
  distance: number; // nautical miles
  transitTime: number; // days
  capacity: number; // million tonnes/year
  currentLoad: number; // percentage
  risk: 'low' | 'medium' | 'high';
  status: 'active' | 'delayed' | 'blocked';
}

interface TradeFlow {
  commodity: string;
  volume: number; // million tonnes
  value: number; // billion USD
  route: string;
  destination: string;
}

const GlobalTradeNetworkModeling: React.FC = () => {
  const [ports, setPorts] = useState<TradePort[]>([]);
  const [routes, setRoutes] = useState<ShippingRoute[]>([]);
  const [tradeFlows, setTradeFlows] = useState<TradeFlow[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [liveData, setLiveData] = useState({
    totalCargo: 847.3,
    activePorts: 12,
    routeEfficiency: 94.2,
    disruptionAlerts: 3
  });

  useEffect(() => {
    // Initialize trade ports based on mining operations
    const tradePorts: TradePort[] = [
      {
        id: 'durban',
        name: 'Durban Port',
        location: { lat: -29.8587, lng: 31.0218 },
        capacity: 2.9,
        utilization: 87,
        throughput: 65.2,
        status: 'operational',
        commodities: ['Gold', 'Coal', 'Iron Ore']
      },
      {
        id: 'cape_town',
        name: 'Cape Town Port',
        location: { lat: -33.9249, lng: 18.4241 },
        capacity: 1.2,
        utilization: 72,
        throughput: 28.4,
        status: 'operational',
        commodities: ['Diamonds', 'Fruit', 'Wine']
      },
      {
        id: 'lagos',
        name: 'Lagos Port',
        location: { lat: 6.4474, lng: 3.3903 },
        capacity: 1.5,
        utilization: 94,
        throughput: 42.1,
        status: 'congested',
        commodities: ['Oil', 'Cocoa', 'Minerals']
      },
      {
        id: 'casablanca',
        name: 'Casablanca Port',
        location: { lat: 33.6018, lng: -7.6307 },
        capacity: 2.1,
        utilization: 68,
        throughput: 38.7,
        status: 'operational',
        commodities: ['Phosphates', 'Citrus', 'Textiles']
      },
      {
        id: 'dar_es_salaam',
        name: 'Dar es Salaam Port',
        location: { lat: -6.7924, lng: 39.2083 },
        capacity: 0.8,
        utilization: 91,
        throughput: 18.3,
        status: 'congested',
        commodities: ['Gold', 'Coffee', 'Minerals']
      },
      {
        id: 'djibouti',
        name: 'Djibouti Port',
        location: { lat: 11.5889, lng: 43.1456 },
        capacity: 1.0,
        utilization: 76,
        throughput: 22.1,
        status: 'operational',
        commodities: ['Transit Cargo', 'Salt', 'Livestock']
      }
    ];

    // Initialize shipping routes
    const shippingRoutes: ShippingRoute[] = [
      {
        id: 'suez_route',
        source: 'durban',
        target: 'rotterdam',
        distance: 6850,
        transitTime: 18,
        capacity: 45,
        currentLoad: 87,
        risk: 'medium',
        status: 'active'
      },
      {
        id: 'cape_route',
        source: 'cape_town',
        target: 'rotterdam',
        distance: 8200,
        transitTime: 22,
        capacity: 38,
        currentLoad: 65,
        risk: 'low',
        status: 'active'
      },
      {
        id: 'west_africa_europe',
        source: 'lagos',
        target: 'rotterdam',
        distance: 5400,
        transitTime: 14,
        capacity: 52,
        currentLoad: 94,
        risk: 'high',
        status: 'delayed'
      },
      {
        id: 'mediterranean',
        source: 'casablanca',
        target: 'valencia',
        distance: 1200,
        transitTime: 4,
        capacity: 25,
        currentLoad: 78,
        risk: 'low',
        status: 'active'
      },
      {
        id: 'red_sea',
        source: 'djibouti',
        target: 'jeddah',
        distance: 850,
        transitTime: 3,
        capacity: 18,
        currentLoad: 82,
        risk: 'medium',
        status: 'active'
      },
      {
        id: 'indian_ocean',
        source: 'dar_es_salaam',
        target: 'mumbai',
        distance: 2100,
        transitTime: 7,
        capacity: 28,
        currentLoad: 91,
        risk: 'medium',
        status: 'active'
      }
    ];

    // Initialize trade flows
    const flows: TradeFlow[] = [
      {
        commodity: 'Iron Ore',
        volume: 125.4,
        value: 8.2,
        route: 'cape_route',
        destination: 'China'
      },
      {
        commodity: 'Gold',
        volume: 0.8,
        value: 62.1,
        route: 'suez_route',
        destination: 'Europe'
      },
      {
        commodity: 'Cobalt',
        volume: 2.1,
        value: 15.7,
        route: 'west_africa_europe',
        destination: 'Battery Manufacturers'
      },
      {
        commodity: 'Phosphates',
        volume: 42.3,
        value: 3.8,
        route: 'mediterranean',
        destination: 'Global Fertilizer'
      }
    ];

    setPorts(tradePorts);
    setRoutes(shippingRoutes);
    setTradeFlows(flows);

    // Setup live updates
    const interval = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        totalCargo: prev.totalCargo + (Math.random() - 0.5) * 10,
        routeEfficiency: Math.max(85, Math.min(98, prev.routeEfficiency + (Math.random() - 0.5) * 2)),
        disruptionAlerts: Math.max(0, Math.min(8, prev.disruptionAlerts + Math.floor((Math.random() - 0.7) * 2)))
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const renderTradeNetworkMap = () => {
    const width = 1200;
    const height = 600;

    // Global bounds (focused on Africa and trade routes)
    const bounds = {
      minLat: -40,
      maxLat: 45,
      minLng: -25,
      maxLng: 70
    };

    const scaleX = (lng: number) => ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * width;
    const scaleY = (lat: number) => height - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * height;

    return (
      <svg width={width} height={height} className="w-full h-auto">
        <defs>
          <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe"/>
            <stop offset="50%" stopColor="#0ea5e9"/>
            <stop offset="100%" stopColor="#0284c7"/>
          </linearGradient>
          <pattern id="wavePattern" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 10 Q10 5 20 10 T40 10" stroke="#0ea5e9" strokeWidth="1" fill="none" opacity="0.3"/>
          </pattern>
          <radialGradient id="portGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
          </radialGradient>
        </defs>

        {/* Ocean background */}
        <rect width={width} height={height} fill="url(#oceanGradient)" />
        <rect width={width} height={height} fill="url(#wavePattern)" />

        {/* Continental outline */}
        <path
          d="M200,150 Q300,120 400,140 Q500,160 550,200 Q580,280 570,380 Q540,480 480,520 Q400,540 320,530 Q240,510 200,450 Q170,380 180,280 Q190,220 200,150 Z"
          fill="#f4f4f5"
          stroke="#d4d4d8"
          strokeWidth="2"
          opacity="0.8"
        />

        {/* Major shipping lanes */}
        <path
          d="M100,300 Q200,280 400,290 Q600,300 800,320 Q1000,340 1100,360"
          stroke="#0ea5e9"
          strokeWidth="4"
          strokeDasharray="15,10"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M150,450 Q350,420 550,400 Q750,380 950,370"
          stroke="#0ea5e9"
          strokeWidth="4"
          strokeDasharray="15,10"
          fill="none"
          opacity="0.6"
        />

        {/* Shipping routes */}
        {routes.map((route, idx) => {
          const sourcePort = ports.find(p => p.id === route.source);
          const targetPort = ports.find(p => p.id === route.target);

          if (!sourcePort) return null;

          // For visualization, create target coordinates
          const targetCoords = route.target === 'rotterdam' ? { lat: 51.9244, lng: 4.4777 } :
                               route.target === 'valencia' ? { lat: 39.4699, lng: -0.3763 } :
                               route.target === 'jeddah' ? { lat: 21.5169, lng: 39.2192 } :
                               route.target === 'mumbai' ? { lat: 19.0760, lng: 72.8777 } :
                               { lat: 0, lng: 60 };

          const x1 = scaleX(sourcePort.location.lng);
          const y1 = scaleY(sourcePort.location.lat);
          const x2 = scaleX(targetCoords.lng);
          const y2 = scaleY(targetCoords.lat);

          const isSelected = selectedRoute === route.id;

          return (
            <g key={idx}>
              {/* Route path */}
              <path
                d={`M ${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.min(y1, y2) - 50} ${x2} ${y2}`}
                stroke={route.status === 'blocked' ? '#dc2626' :
                       route.status === 'delayed' ? '#f59e0b' : '#10b981'}
                strokeWidth={isSelected ? "6" : "4"}
                strokeDasharray={route.status === 'active' ? "none" : "12,8"}
                fill="none"
                opacity={isSelected ? 1 : 0.7}
                className="cursor-pointer"
                onClick={() => setSelectedRoute(selectedRoute === route.id ? null : route.id)}
              />

              {/* Cargo flow animation */}
              {route.status === 'active' && (
                <>
                  <circle r="6" fill="#3b82f6" opacity="0.8">
                    <animateMotion dur={`${route.transitTime}s`} repeatCount="indefinite">
                      <mpath href={`#route-${idx}`} />
                    </animateMotion>
                  </circle>
                  <circle r="4" fill="#1e40af" opacity="0.6">
                    <animateMotion dur={`${route.transitTime}s`} repeatCount="indefinite" begin="1s">
                      <mpath href={`#route-${idx}`} />
                    </animateMotion>
                  </circle>
                </>
              )}

              <path id={`route-${idx}`} d={`M ${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.min(y1, y2) - 50} ${x2} ${y2}`} fill="none" opacity="0" />

              {/* Route capacity indicator */}
              <text
                x={(x1 + x2) / 2}
                y={Math.min(y1, y2) - 70}
                fill="#1f2937"
                fontSize="8"
                textAnchor="middle"
                className="font-mono"
              >
                {route.currentLoad}% | {route.transitTime}d
              </text>
            </g>
          );
        })}

        {/* Trade ports */}
        {ports.map((port, idx) => {
          const x = scaleX(port.location.lng);
          const y = scaleY(port.location.lat);
          const radius = Math.max(12, port.throughput / 3);

          return (
            <g key={idx}>
              {/* Port influence area */}
              <circle
                cx={x}
                cy={y}
                r={radius + 25}
                fill="url(#portGlow)"
                opacity={port.status === 'operational' ? 0.4 : 0.2}
              />

              {/* Congestion warning */}
              {port.utilization > 85 && (
                <circle
                  cx={x}
                  cy={y}
                  r={radius + 15}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeDasharray="6,6"
                  opacity="0.8"
                >
                  <animate
                    attributeName="r"
                    values={`${radius + 10};${radius + 20};${radius + 10}`}
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              {/* Main port node */}
              <circle
                cx={x}
                cy={y}
                r={radius}
                fill={port.status === 'operational' ? '#10b981' :
                     port.status === 'congested' ? '#f59e0b' : '#dc2626'}
                stroke="#ffffff"
                strokeWidth="3"
                opacity="0.9"
                className="cursor-pointer hover:opacity-100"
              />

              {/* Cargo handling animation */}
              <circle
                cx={x + 20}
                cy={y - 20}
                r="4"
                fill="#3b82f6"
                opacity="0.7"
              >
                <animate
                  attributeName="r"
                  values="3;8;3"
                  dur="3s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.7;0.3;0.7"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Port name and capacity */}
              <text
                x={x}
                y={y - radius - 8}
                fill="#1f2937"
                fontSize="10"
                textAnchor="middle"
                className="font-sans font-medium"
              >
                {port.name}
              </text>

              {/* Throughput indicator */}
              <text
                x={x}
                y={y + radius + 15}
                fill="#059669"
                fontSize="8"
                textAnchor="middle"
                className="font-mono font-bold"
              >
                {port.throughput}MT/yr
              </text>

              {/* Utilization percentage */}
              <text
                x={x}
                y={y + radius + 25}
                fill={port.utilization > 85 ? "#dc2626" : "#6b7280"}
                fontSize="8"
                textAnchor="middle"
                className="font-mono"
              >
                {port.utilization}% util
              </text>
            </g>
          );
        })}

        {/* Chokepoint risk indicators */}
        <g>
          {/* Suez Canal chokepoint */}
          <rect
            x={scaleX(32) - 5}
            y={scaleY(30) - 5}
            width="10"
            height="10"
            fill="#dc2626"
            opacity="0.7"
            transform={`rotate(45 ${scaleX(32)} ${scaleY(30)})`}
          />
          <text
            x={scaleX(32)}
            y={scaleY(30) - 10}
            fill="#dc2626"
            fontSize="8"
            textAnchor="middle"
            className="font-bold"
          >
            SUEZ
          </text>

          {/* Strait of Hormuz */}
          <rect
            x={scaleX(56) - 5}
            y={scaleY(26) - 5}
            width="10"
            height="10"
            fill="#f59e0b"
            opacity="0.7"
            transform={`rotate(45 ${scaleX(56)} ${scaleY(26)})`}
          />
          <text
            x={scaleX(56)}
            y={scaleY(26) - 10}
            fill="#f59e0b"
            fontSize="8"
            textAnchor="middle"
            className="font-bold"
          >
            HORMUZ
          </text>
        </g>
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
              <h2 className="text-2xl font-extralight text-zinc-900 tracking-tight">Global Trade Network Modeling</h2>
              <p className="text-sm text-zinc-500 mt-2 font-light">Physical trade routes and supply chain intelligence</p>
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-xl font-light text-zinc-900">{liveData.totalCargo.toFixed(1)}M</div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider font-light">Tonnes in Transit</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-light text-emerald-600">{liveData.routeEfficiency.toFixed(1)}%</div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider font-light">Route Efficiency</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-light text-blue-600">{liveData.activePorts}</div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider font-light">Active Ports</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-light text-amber-500">{liveData.disruptionAlerts}</div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider font-light">Alerts</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trade Network Map */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-200/50 overflow-hidden shadow-xl shadow-zinc-200/20">
        <div className="border-b border-zinc-200/50 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-extralight text-zinc-900 tracking-tight">Global Shipping Network</h3>
              <p className="text-sm text-zinc-500 mt-2 font-light">Live cargo flows and route optimization</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-xs font-light text-zinc-600">Operational</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span className="text-xs font-light text-zinc-600">Congested</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                <span className="text-xs font-light text-zinc-600">Disrupted</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="bg-blue-50/50 rounded-xl border border-blue-200/30 overflow-hidden">
            {renderTradeNetworkMap()}
          </div>
        </div>
      </div>

      {/* Trade Intelligence Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Route Status */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-200/50 overflow-hidden shadow-xl shadow-zinc-200/20">
          <div className="border-b border-zinc-200/50 px-6 py-4">
            <h3 className="text-lg font-light text-zinc-900">Shipping Routes Status</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {routes.map((route, idx) => (
                <div
                  key={route.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedRoute === route.id
                      ? 'border-blue-300 bg-blue-50/50'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                  onClick={() => setSelectedRoute(selectedRoute === route.id ? null : route.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-zinc-900">{route.source} → {route.target}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${
                        route.status === 'active' ? 'bg-emerald-500' :
                        route.status === 'delayed' ? 'bg-amber-500' : 'bg-rose-500'
                      }`}></div>
                      <span className="text-xs text-zinc-500">{route.status}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-zinc-500">Load:</span>
                      <span className="font-medium ml-1">{route.currentLoad}%</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Transit:</span>
                      <span className="font-medium ml-1">{route.transitTime}d</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Risk:</span>
                      <span className={`font-medium ml-1 ${
                        route.risk === 'high' ? 'text-rose-600' :
                        route.risk === 'medium' ? 'text-amber-600' : 'text-emerald-600'
                      }`}>{route.risk}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trade Flows */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-200/50 overflow-hidden shadow-xl shadow-zinc-200/20">
          <div className="border-b border-zinc-200/50 px-6 py-4">
            <h3 className="text-lg font-light text-zinc-900">Commodity Trade Flows</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {tradeFlows.map((flow, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-zinc-200 bg-zinc-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-zinc-900">{flow.commodity}</span>
                    <span className="text-sm font-bold text-emerald-600">${flow.value.toFixed(1)}B</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-zinc-500">Volume:</span>
                      <span className="font-medium ml-1">{flow.volume}MT</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Destination:</span>
                      <span className="font-medium ml-1">{flow.destination}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Disruption Alerts & Route Optimization */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-200/50 overflow-hidden shadow-xl shadow-zinc-200/20">
        <div className="border-b border-zinc-200/50 px-8 py-6">
          <h3 className="text-xl font-extralight text-zinc-900 tracking-tight">Route Intelligence & Optimization</h3>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-rose-50/50 to-rose-100/30 rounded-xl p-6 border border-rose-200/30">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="h-5 w-5 text-rose-500" />
                <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-light">URGENT</span>
              </div>
              <h4 className="font-light text-zinc-900 mb-2">Suez Canal Delays</h4>
              <p className="text-sm text-zinc-600 mb-4 font-light">8-day backlog detected - recommend Cape of Good Hope routing</p>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Cost Impact:</span>
                <span className="font-light text-rose-600">+$2.3M</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50/50 to-amber-100/30 rounded-xl p-6 border border-amber-200/30">
              <div className="flex items-center justify-between mb-4">
                <Navigation className="h-5 w-5 text-amber-500" />
                <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-light">OPTIMIZE</span>
              </div>
              <h4 className="font-light text-zinc-900 mb-2">Port Capacity Alert</h4>
              <p className="text-sm text-zinc-600 mb-4 font-light">Shanghai reaching 94% capacity - redirect to Ningbo</p>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Time Saved:</span>
                <span className="font-light text-amber-600">3 days</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 rounded-xl p-6 border border-emerald-200/30">
              <div className="flex items-center justify-between mb-4">
                <Ship className="h-5 w-5 text-emerald-500" />
                <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-light">OPPORTUNITY</span>
              </div>
              <h4 className="font-light text-zinc-900 mb-2">New Route Available</h4>
              <p className="text-sm text-zinc-600 mb-4 font-light">Mozambique port opening Q2 2025 - reduces costs by 18%</p>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Annual Savings:</span>
                <span className="font-light text-emerald-600">$45M</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalTradeNetworkModeling;