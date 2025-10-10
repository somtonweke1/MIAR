'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  Shield, 
  Activity,
  RefreshCw,
  Eye,
  Download,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Map
} from 'lucide-react';
import RealTimeMaterialsService, { GeopoliticalRisk, SupplyChainEvent } from '@/services/real-time-materials-service';

interface RiskAssessment {
  region: string;
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number; // 0-100
  trend: 'improving' | 'stable' | 'deteriorating';
  keyFactors: string[];
  impactOnMaterials: Record<string, number>;
  recentEvents: string[];
  recommendations: string[];
  lastUpdated: Date;
}

interface RiskIndicator {
  id: string;
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  impact: 'low' | 'medium' | 'high';
  description: string;
}

const GeopoliticalRiskDashboard: React.FC = () => {
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [riskIndicators, setRiskIndicators] = useState<RiskIndicator[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'forecast'>('overview');

  useEffect(() => {
    fetchRiskData();
  }, [selectedTimeframe]);

  const fetchRiskData = async () => {
    setIsLoading(true);
    
    try {
      // Fetch geopolitical risks from market intelligence service
      const geopoliticalRisks = await marketIntelligence.getGeopoliticalRisks();
      const alerts = await marketIntelligence.getSupplyChainAlerts('high', selectedRegion);
      
      // Transform data into risk assessments
      const assessments: RiskAssessment[] = geopoliticalRisks.map(risk => ({
        region: risk.region,
        overallRisk: risk.riskLevel,
        riskScore: getRiskScore(risk.riskLevel),
        trend: risk.trend,
        keyFactors: risk.factors,
        impactOnMaterials: risk.impactOnMaterials,
        recentEvents: generateRecentEvents(risk.region, risk.riskLevel),
        recommendations: generateRecommendations(risk),
        lastUpdated: risk.lastUpdated
      }));
      
      setRiskAssessments(assessments);
      
      // Generate risk indicators
      const indicators: RiskIndicator[] = [
        {
          id: 'political_stability',
          name: 'Political Stability Index',
          value: calculatePoliticalStability(assessments),
          trend: 'down',
          impact: 'high',
          description: 'Overall political stability across African mining regions'
        },
        {
          id: 'regulatory_risk',
          name: 'Regulatory Risk Score',
          value: calculateRegulatoryRisk(assessments),
          trend: 'up',
          impact: 'medium',
          description: 'Risk from changing mining regulations and policies'
        },
        {
          id: 'social_unrest',
          name: 'Social Unrest Index',
          value: calculateSocialUnrest(assessments),
          trend: 'stable',
          impact: 'high',
          description: 'Community relations and social license to operate'
        },
        {
          id: 'infrastructure_quality',
          name: 'Infrastructure Quality',
          value: calculateInfrastructureQuality(assessments),
          trend: 'up',
          impact: 'medium',
          description: 'Transport and energy infrastructure reliability'
        },
        {
          id: 'currency_stability',
          name: 'Currency Stability',
          value: calculateCurrencyStability(assessments),
          trend: 'down',
          impact: 'medium',
          description: 'Exchange rate volatility and currency risk'
        },
        {
          id: 'corruption_index',
          name: 'Corruption Perception',
          value: calculateCorruptionIndex(assessments),
          trend: 'stable',
          impact: 'high',
          description: 'Transparency and corruption levels'
        }
      ];
      
      setRiskIndicators(indicators);
      
    } catch (error) {
      console.error('Failed to fetch risk data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskScore = (riskLevel: string): number => {
    switch (riskLevel) {
      case 'low': return 25;
      case 'medium': return 50;
      case 'high': return 75;
      case 'critical': return 95;
      default: return 50;
    }
  };

  const calculatePoliticalStability = (assessments: RiskAssessment[]): number => {
    const avgScore = assessments.reduce((sum, assessment) => {
      const stabilityScore = 100 - assessment.riskScore;
      return sum + stabilityScore;
    }, 0) / assessments.length;
    return Math.round(avgScore);
  };

  const calculateRegulatoryRisk = (assessments: RiskAssessment[]): number => {
    return Math.round(45 + Math.random() * 20); // Simulated regulatory risk
  };

  const calculateSocialUnrest = (assessments: RiskAssessment[]): number => {
    return Math.round(35 + Math.random() * 30); // Simulated social unrest
  };

  const calculateInfrastructureQuality = (assessments: RiskAssessment[]): number => {
    return Math.round(55 + Math.random() * 25); // Simulated infrastructure quality
  };

  const calculateCurrencyStability = (assessments: RiskAssessment[]): number => {
    return Math.round(40 + Math.random() * 30); // Simulated currency stability
  };

  const calculateCorruptionIndex = (assessments: RiskAssessment[]): number => {
    return Math.round(30 + Math.random() * 40); // Simulated corruption index
  };

  const generateRecentEvents = (region: string, riskLevel: string): string[] => {
    const eventTemplates = {
      drc: [
        'New mining code implementation',
        'Export licensing requirements updated',
        'Community protests at mining sites',
        'Infrastructure development delays'
      ],
      south_africa: [
        'Energy crisis affecting mining operations',
        'Labor union negotiations ongoing',
        'Infrastructure maintenance backlogs',
        'Political uncertainty ahead of elections'
      ],
      zambia: [
        'Mining tax reforms implemented',
        'Copper export restrictions eased',
        'Infrastructure investment announced',
        'Community development programs launched'
      ],
      ghana: [
        'Gold mining regulations updated',
        'Environmental compliance requirements',
        'Community benefit agreements signed',
        'Infrastructure projects approved'
      ]
    };
    
    const events = eventTemplates[region as keyof typeof eventTemplates] || [
      'Market conditions stable',
      'No significant events reported'
    ];
    
    return events.slice(0, 3);
  };

  const generateRecommendations = (risk: GeopoliticalRisk): string[] => {
    const recommendations: string[] = [];
    
    if (risk.riskLevel === 'critical' || risk.riskLevel === 'high') {
      recommendations.push('Implement enhanced security protocols');
      recommendations.push('Diversify supply chain sources');
      recommendations.push('Increase local community engagement');
    }
    
    if (risk.factors.includes('political_instability')) {
      recommendations.push('Monitor political developments closely');
      recommendations.push('Establish local partnerships');
    }
    
    if (risk.factors.includes('corruption')) {
      recommendations.push('Implement strict compliance programs');
      recommendations.push('Conduct regular audits');
    }
    
    if (risk.factors.includes('environmental_regulations')) {
      recommendations.push('Invest in sustainable mining practices');
      recommendations.push('Engage with environmental groups');
    }
    
    return recommendations.length > 0 ? recommendations : ['Monitor market conditions'];
  };

  const getRiskColor = (riskLevel: string): string => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredAssessments = selectedRegion === 'all' 
    ? riskAssessments 
    : riskAssessments.filter(assessment => assessment.region === selectedRegion);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-200/50 overflow-hidden shadow-xl shadow-zinc-200/20">
        <div className="border-b border-zinc-200/50 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extralight text-zinc-900 tracking-tight flex items-center">
                <Globe className="h-6 w-6 mr-3 text-blue-600" />
                Geopolitical Risk Intelligence
              </h2>
              <p className="text-sm text-zinc-500 mt-2 font-light">
                Real-time monitoring of political, regulatory, and social risks affecting African mining operations
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-4 py-2 border border-zinc-200 rounded-lg bg-white/60 backdrop-blur-sm text-sm font-light"
              >
                <option value="all">All Regions</option>
                <option value="drc">Democratic Republic of Congo</option>
                <option value="south_africa">South Africa</option>
                <option value="zambia">Zambia</option>
                <option value="ghana">Ghana</option>
                <option value="nigeria">Nigeria</option>
                <option value="kenya">Kenya</option>
              </select>
              
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                className="px-4 py-2 border border-zinc-200 rounded-lg bg-white/60 backdrop-blur-sm text-sm font-light"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
              
              <Button
                onClick={fetchRiskData}
                disabled={isLoading}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Risk Indicators */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {riskIndicators.map((indicator) => (
              <Card key={indicator.id} className="p-6 border border-zinc-200/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-700">{indicator.name}</h3>
                    <p className="text-xs text-zinc-500 mt-1">{indicator.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(indicator.trend)}
                  </div>
                </div>
                
                <div className="text-2xl font-bold text-zinc-900 mb-2">{indicator.value}</div>
                
                <div className="w-full bg-zinc-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      indicator.value > 70 ? 'bg-red-500' :
                      indicator.value > 50 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${indicator.value}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between mt-2 text-xs text-zinc-600">
                  <span>Impact: {indicator.impact}</span>
                  <span>Updated: Now</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Regional Risk Assessments */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-light text-zinc-900">Regional Risk Assessments</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode('overview')}
                  className={`h-8 px-3 text-xs ${viewMode === 'overview' ? 'bg-blue-50 text-blue-600' : ''}`}
                >
                  Overview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode('detailed')}
                  className={`h-8 px-3 text-xs ${viewMode === 'detailed' ? 'bg-blue-50 text-blue-600' : ''}`}
                >
                  Detailed
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode('forecast')}
                  className={`h-8 px-3 text-xs ${viewMode === 'forecast' ? 'bg-blue-50 text-blue-600' : ''}`}
                >
                  Forecast
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAssessments.map((assessment) => (
                <Card key={assessment.region} className={`p-6 border ${getRiskColor(assessment.overallRisk)}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-zinc-600" />
                      <h4 className="text-lg font-medium text-zinc-900 capitalize">
                        {assessment.region.replace('_', ' ')}
                      </h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(assessment.overallRisk)}`}>
                        {assessment.overallRisk.toUpperCase()}
                      </span>
                      {assessment.trend === 'deteriorating' && <TrendingUp className="h-4 w-4 text-red-500" />}
                      {assessment.trend === 'improving' && <TrendingDown className="h-4 w-4 text-green-500" />}
                      {assessment.trend === 'stable' && <Activity className="h-4 w-4 text-gray-500" />}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-3xl font-bold text-zinc-900 mb-2">{assessment.riskScore}/100</div>
                    <div className="w-full bg-zinc-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          assessment.riskScore > 70 ? 'bg-red-500' :
                          assessment.riskScore > 50 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${assessment.riskScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-medium text-zinc-800 mb-2">Key Risk Factors</h5>
                      <div className="flex flex-wrap gap-2">
                        {assessment.keyFactors.map((factor, idx) => (
                          <span key={idx} className="px-2 py-1 bg-zinc-100 text-zinc-700 rounded text-xs">
                            {factor.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-zinc-800 mb-2">Recent Events</h5>
                      <ul className="space-y-1">
                        {assessment.recentEvents.map((event, idx) => (
                          <li key={idx} className="text-xs text-zinc-600 flex items-start">
                            <AlertTriangle className="h-3 w-3 mr-1 mt-0.5 text-amber-500" />
                            {event}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-zinc-800 mb-2">Recommendations</h5>
                      <ul className="space-y-1">
                        {assessment.recommendations.slice(0, 3).map((rec, idx) => (
                          <li key={idx} className="text-xs text-zinc-600 flex items-start">
                            <Shield className="h-3 w-3 mr-1 mt-0.5 text-blue-500" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-zinc-200">
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span>Last updated: {assessment.lastUpdated.toLocaleDateString()}</span>
                      <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeopoliticalRiskDashboard;

