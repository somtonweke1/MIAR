'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Shield,
  DollarSign,
  MapPin,
  Factory,
  Truck,
  Download,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function RiskReportPage() {
  const [generating, setGenerating] = useState(false);

  // Sample data for Constellation Energy battery storage project
  const reportData = {
    client: 'Constellation Energy',
    project: '5GW Battery Storage Deployment (2025-2030)',
    dateGenerated: new Date().toLocaleDateString(),
    minerals: [
      {
        name: 'Lithium',
        annualRequirement: '12,500 tons',
        primarySources: ['Chile (45%)', 'Australia (30%)', 'Argentina (15%)', 'Africa (10%)'],
        riskScore: 5.8,
        trend: 'stable',
        keyRisks: [
          'Chilean water regulations tightening',
          'Price volatility (300% spike in 2021-2022)',
          'Limited processing capacity outside China'
        ],
        alternatives: [
          'Increase Australian sourcing (+20% cost)',
          'Develop DRC lithium sources (2-3 year lead time)',
          'Consider lithium iron phosphate chemistry (35% less lithium)'
        ]
      },
      {
        name: 'Cobalt',
        annualRequirement: '8,000 tons',
        primarySources: ['DRC (70%)', 'Indonesia (10%)', 'Australia (8%)', 'Zambia (7%)'],
        riskScore: 7.2,
        trend: 'increasing',
        keyRisks: [
          'DRC political instability (recent mining code changes)',
          'Single-source dependency (70% from one country)',
          'Child labor / ESG compliance concerns'
        ],
        alternatives: [
          'Shift to nickel-rich cathode chemistries (-60% cobalt)',
          'Develop Indonesian sources (2024-2025 timeline)',
          'Stockpile strategy (6-month buffer = $45M cost)'
        ]
      },
      {
        name: 'Nickel',
        annualRequirement: '15,000 tons',
        primarySources: ['Indonesia (35%)', 'Philippines (25%)', 'Russia (15%)', 'Australia (10%)'],
        riskScore: 6.5,
        trend: 'increasing',
        keyRisks: [
          'Indonesian export restrictions',
          'Russia sanctions impact',
          'Class 1 nickel shortage for batteries'
        ],
        alternatives: [
          'Australian nickel sulfate contracts',
          'Recycling programs (2027+ timeline)',
          'LFP battery mix (eliminates nickel need)'
        ]
      }
    ],
    supplyChainAssessment: {
      overallRisk: 6.5,
      financialExposure: '$180M',
      criticalBottlenecks: [
        {
          location: 'DRC → Dar es Salaam Port',
          mineral: 'Cobalt',
          risk: 'High',
          issue: 'Single rail route, political instability',
          impact: '30-60 day delays possible',
          mitigation: 'Diversify to Zambian routes via Durban'
        },
        {
          location: 'Chinese Processing Facilities',
          mineral: 'Lithium (conversion)',
          risk: 'High',
          issue: '60% of global processing capacity',
          impact: 'Price manipulation, supply restrictions',
          mitigation: 'Support US/EU processing capacity development'
        }
      ]
    },
    costImpactScenarios: [
      {
        scenario: 'Baseline (Current Conditions)',
        probability: '40%',
        materialCost: '$850M',
        delayRisk: 'Low',
        recommendation: 'Current sourcing strategy adequate'
      },
      {
        scenario: 'Moderate Disruption (DRC instability)',
        probability: '35%',
        materialCost: '$1.02B (+20%)',
        delayRisk: 'Medium (3-6 month delays)',
        recommendation: 'Increase stockpile, diversify cobalt sources'
      },
      {
        scenario: 'Severe Disruption (Multi-country issues)',
        probability: '15%',
        materialCost: '$1.36B (+60%)',
        delayRisk: 'High (6-12 month delays)',
        recommendation: 'Alternative battery chemistry, aggressive hedging'
      },
      {
        scenario: 'Critical Failure (Supply collapse)',
        probability: '10%',
        materialCost: 'Project at risk',
        delayRisk: 'Critical (12+ month delays)',
        recommendation: 'Project delay, fundamental sourcing restructure'
      }
    ],
    recommendations: [
      {
        priority: 'High',
        action: 'Diversify Cobalt Sources',
        timeline: 'Q1 2025',
        cost: '$12M (contracts + logistics)',
        impact: 'Reduces DRC dependency from 70% to 45%',
        roi: '3.5x (avoids $42M disruption cost)'
      },
      {
        priority: 'High',
        action: 'Establish Strategic Stockpile',
        timeline: 'Q2 2025',
        cost: '$65M (6-month buffer)',
        impact: 'Absorbs 6-month supply disruption',
        roi: '2.8x (insurance against delay costs)'
      },
      {
        priority: 'Medium',
        action: 'Alternative Battery Chemistry Mix',
        timeline: '2025-2027',
        cost: '$8M (R&D + testing)',
        impact: 'Reduces cobalt need by 40%, lithium by 20%',
        roi: '4.2x (permanent cost reduction)'
      },
      {
        priority: 'Medium',
        action: 'Direct Sourcing Agreements',
        timeline: 'Q3 2025',
        cost: '$5M (legal + due diligence)',
        impact: 'Locks in pricing, improves ESG compliance',
        roi: '2.1x (price stability value)'
      }
    ]
  };

  const handleDownload = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      alert('PDF generation coming soon. For now, use Print to PDF from your browser.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100">
      {/* Header */}
      <section className="bg-white/95 backdrop-blur-md border-b border-zinc-200/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <Link href="/supply-chain-risk" className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors text-sm font-light">
              <ArrowLeft className="w-4 h-4" />
              Back to Supply Chain Risk Intelligence
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extralight tracking-tight text-zinc-900 mb-2">
                Critical Minerals Supply Chain Risk Assessment
              </h1>
              <p className="text-lg font-light text-zinc-600">
                {reportData.client} • {reportData.project}
              </p>
            </div>
            <Button onClick={handleDownload} disabled={generating} size="lg">
              {generating ? 'Generating...' : 'Download PDF'}
              <Download className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="mt-4 text-sm font-light text-zinc-500">
            Report Generated: {reportData.dateGenerated} • Johns Hopkins Supply Chain Intelligence Lab
          </div>
        </div>
      </section>

      {/* Executive Summary */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 border-l-4 border-rose-500">
            <h2 className="text-2xl font-extralight tracking-tight text-zinc-900 mb-4">Executive Summary</h2>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <div className="text-sm font-light text-zinc-600 mb-1">Overall Risk Score</div>
                <div className="text-4xl font-extralight text-rose-600">{reportData.supplyChainAssessment.overallRisk}</div>
                <div className="text-xs font-light text-zinc-500">Out of 10 (High Risk)</div>
              </div>
              <div>
                <div className="text-sm font-light text-zinc-600 mb-1">Financial Exposure</div>
                <div className="text-4xl font-extralight text-amber-600">{reportData.supplyChainAssessment.financialExposure}</div>
                <div className="text-xs font-light text-zinc-500">At-risk budget allocation</div>
              </div>
              <div>
                <div className="text-sm font-light text-zinc-600 mb-1">Critical Bottlenecks</div>
                <div className="text-4xl font-extralight text-zinc-900">{reportData.supplyChainAssessment.criticalBottlenecks.length}</div>
                <div className="text-xs font-light text-zinc-500">Requiring immediate attention</div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-light text-zinc-900 mb-2">
                    <strong>Key Finding:</strong> Your 5GW battery storage deployment faces significant supply chain risks,
                    with 35% probability of moderate disruption and potential cost overruns of $170M+.
                  </p>
                  <p className="font-light text-zinc-700">
                    <strong>Primary Concern:</strong> Over-reliance on DRC for cobalt (70% of supply) and Chinese processing
                    facilities (60% of lithium conversion) creates single-point-of-failure vulnerabilities.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Mineral-by-Mineral Analysis */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extralight tracking-tight text-zinc-900 mb-6">Critical Minerals Risk Profile</h2>

          <div className="space-y-6">
            {reportData.minerals.map((mineral) => (
              <Card key={mineral.name} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-extralight text-zinc-900 mb-1">{mineral.name}</h3>
                    <div className="text-sm font-light text-zinc-600">
                      Annual Requirement: {mineral.annualRequirement}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-4xl font-extralight ${mineral.riskScore >= 7 ? 'text-rose-600' : mineral.riskScore >= 6 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {mineral.riskScore}
                    </div>
                    <div className="text-xs font-light text-zinc-500">Risk Score</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-zinc-900 uppercase tracking-wide mb-3">Primary Sources</h4>
                    <div className="space-y-2">
                      {mineral.primarySources.map((source, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm font-light text-zinc-700">
                          <MapPin className="w-4 h-4 text-zinc-400" />
                          {source}
                        </div>
                      ))}
                    </div>

                    <h4 className="text-sm font-medium text-zinc-900 uppercase tracking-wide mb-3 mt-6">Key Risks</h4>
                    <div className="space-y-2">
                      {mineral.keyRisks.map((risk, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm font-light text-zinc-700">{risk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-zinc-900 uppercase tracking-wide mb-3">Alternative Strategies</h4>
                    <div className="space-y-3">
                      {mineral.alternatives.map((alt, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm font-light text-zinc-700">{alt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Critical Bottlenecks */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extralight tracking-tight text-zinc-900 mb-6">Supply Chain Bottlenecks</h2>

          <div className="space-y-4">
            {reportData.supplyChainAssessment.criticalBottlenecks.map((bottleneck, idx) => (
              <Card key={idx} className="p-6 border-l-4 border-rose-500">
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs font-light text-zinc-600 uppercase tracking-wide mb-1">Location</div>
                    <div className="font-light text-zinc-900">{bottleneck.location}</div>
                  </div>
                  <div>
                    <div className="text-xs font-light text-zinc-600 uppercase tracking-wide mb-1">Mineral</div>
                    <div className="font-light text-zinc-900">{bottleneck.mineral}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-xs font-light text-zinc-600 uppercase tracking-wide mb-1">Issue</div>
                    <div className="font-light text-zinc-900 mb-2">{bottleneck.issue}</div>
                    <div className="text-sm font-light text-rose-700">Impact: {bottleneck.impact}</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-200/50">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-medium text-zinc-600 uppercase tracking-wide">Mitigation: </span>
                      <span className="text-sm font-light text-zinc-700">{bottleneck.mitigation}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Impact Scenarios */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extralight tracking-tight text-zinc-900 mb-6">Cost Impact Scenarios</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {reportData.costImpactScenarios.map((scenario, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-light text-zinc-900 mb-1">{scenario.scenario}</h3>
                    <div className="text-sm font-light text-zinc-600">Probability: {scenario.probability}</div>
                  </div>
                  {idx === 0 && <CheckCircle className="w-6 h-6 text-emerald-600" />}
                  {idx === 1 && <AlertCircle className="w-6 h-6 text-amber-600" />}
                  {idx >= 2 && <AlertTriangle className="w-6 h-6 text-rose-600" />}
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-light text-zinc-600 uppercase tracking-wide mb-1">Material Cost</div>
                    <div className="text-2xl font-extralight text-zinc-900">{scenario.materialCost}</div>
                  </div>
                  <div>
                    <div className="text-xs font-light text-zinc-600 uppercase tracking-wide mb-1">Delay Risk</div>
                    <div className="text-sm font-light text-zinc-900">{scenario.delayRisk}</div>
                  </div>
                  <div className="pt-3 border-t border-zinc-200/50">
                    <div className="text-xs font-medium text-zinc-600 uppercase tracking-wide mb-1">Recommendation</div>
                    <div className="text-sm font-light text-zinc-700">{scenario.recommendation}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extralight tracking-tight text-zinc-900 mb-6">Strategic Recommendations</h2>

          <div className="space-y-4">
            {reportData.recommendations.map((rec, idx) => (
              <Card key={idx} className={`p-6 ${rec.priority === 'High' ? 'border-l-4 border-rose-500' : 'border-l-4 border-amber-500'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium uppercase tracking-wide ${
                        rec.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {rec.priority} Priority
                      </span>
                      <span className="text-sm font-light text-zinc-600">{rec.timeline}</span>
                    </div>
                    <h3 className="text-xl font-light text-zinc-900">{rec.action}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-light text-zinc-600 mb-1">ROI</div>
                    <div className="text-2xl font-extralight text-emerald-600">{rec.roi}</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-xs font-light text-zinc-600 uppercase tracking-wide mb-1">Investment</div>
                    <div className="font-light text-zinc-900">{rec.cost}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-xs font-light text-zinc-600 uppercase tracking-wide mb-1">Expected Impact</div>
                    <div className="font-light text-zinc-900">{rec.impact}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-8 bg-white/50 border-t border-zinc-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-light text-zinc-600 mb-4">
              This report was generated by the Johns Hopkins Supply Chain Intelligence Lab
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/supply-chain-risk">
                <Button variant="outline">Request Custom Assessment</Button>
              </Link>
              <Button onClick={handleDownload}>
                Download Full Report (PDF)
                <Download className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
