'use client';

import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Zap,
  Activity,
  Shield,
  Target,
  RefreshCw,
  Bell,
  ChevronRight,
  AlertCircle,
  ThumbsUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Alert {
  id: string;
  timestamp: Date;
  severity: 'critical' | 'high' | 'medium' | 'low';
  details: {
    metric: string;
    oldValue: number;
    newValue: number;
    percentChange: number;
  };
  estimatedImpact: {
    financial: number;
    operational: string;
  };
  requiresAction: boolean;
}

interface DecisionOption {
  id: string;
  rank: number;
  title: string;
  description: string;
  upfrontCost: number;
  expectedBenefit: number;
  netValue: number;
  roi: number;
  timeToImplement: number;
  confidence: number;
  riskReduction: number;
}

interface DecisionFrame {
  id: string;
  situation: string;
  problem: string;
  stakes: string;
  urgency: 'immediate' | 'urgent' | 'important' | 'monitor';
  expiresAt: Date;
  options: DecisionOption[];
  recommendedOption: string;
}

export default function DecisionCenterPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [decisions, setDecisions] = useState<DecisionFrame[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    fetchAlerts();
    // Refresh every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/v1/alerts');
      const result = await response.json();

      if (result.success) {
        setAlerts(result.data.activeAlerts.items || []);
        setDecisions(result.data.pendingDecisions.items || []);
        setSummary(result.data.summary);
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerCheck = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check' })
      });

      const result = await response.json();
      if (result.success) {
        await fetchAlerts();
      }
    } catch (error) {
      console.error('Failed to trigger check:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveDecision = async (decisionId: string, optionId: string) => {
    setApproving(true);
    try {
      const response = await fetch('/api/v1/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          decisionId,
          optionId,
          approvedBy: 'Executive User' // In production, use actual user identity
        })
      });

      const result = await response.json();
      if (result.success) {
        await fetchAlerts();
        setSelectedDecision(null);
      }
    } catch (error) {
      console.error('Failed to approve decision:', error);
    } finally {
      setApproving(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'immediate': return 'rose';
      case 'urgent': return 'orange';
      case 'important': return 'amber';
      default: return 'blue';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'rose';
      case 'high': return 'orange';
      case 'medium': return 'amber';
      default: return 'blue';
    }
  };

  if (loading && !summary) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-zinc-600">Loading Decision Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-8 h-8" />
                <h1 className="text-4xl font-bold">Decision Center</h1>
              </div>
              <p className="text-xl text-blue-100">
                Real-time constraint monitoring and automated decision generation
              </p>
            </div>
            <Button
              onClick={triggerCheck}
              disabled={loading}
              className="bg-white text-blue-700 hover:bg-blue-50 font-semibold"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Check Now
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Summary Cards */}
      {summary && (
        <section className="py-8 bg-white border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="p-6 bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="w-8 h-8 text-rose-700" />
                  {summary.totalAlerts > 0 && (
                    <div className="w-6 h-6 bg-rose-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {summary.totalAlerts}
                    </div>
                  )}
                </div>
                <p className="text-sm text-rose-700 font-medium mb-1">Active Alerts</p>
                <p className="text-3xl font-bold text-rose-900">{summary.totalAlerts}</p>
                <p className="text-xs text-rose-600 mt-2">Requiring immediate attention</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-8 h-8 text-amber-700" />
                  <Activity className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-sm text-amber-700 font-medium mb-1">Total Exposure</p>
                <p className="text-3xl font-bold text-amber-900">
                  ${(summary.totalExposure / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-amber-600 mt-2">Across all active constraints</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-8 h-8 text-blue-700" />
                  {summary.decisionsRequired > 0 && (
                    <Clock className="w-5 h-5 text-blue-600 animate-pulse" />
                  )}
                </div>
                <p className="text-sm text-blue-700 font-medium mb-1">Decisions Pending</p>
                <p className="text-3xl font-bold text-blue-900">{summary.decisionsRequired}</p>
                <p className="text-xs text-blue-600 mt-2">
                  {summary.immediateActions} require immediate action
                </p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <Shield className="w-8 h-8 text-emerald-700" />
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-sm text-emerald-700 font-medium mb-1">System Status</p>
                <p className="text-3xl font-bold text-emerald-900">Active</p>
                <p className="text-xs text-emerald-600 mt-2">All monitoring sources online</p>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Pending Decisions */}
      {decisions.length > 0 && (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-blue-600 animate-pulse" />
              <h2 className="text-2xl font-bold text-zinc-900">Decisions Required</h2>
            </div>
            <span className="text-sm text-zinc-600">
              {decisions.filter(d => d.urgency === 'immediate' || d.urgency === 'urgent').length} urgent
            </span>
          </div>

          <div className="space-y-6">
            {decisions.map((decision) => {
              const urgencyColor = getUrgencyColor(decision.urgency);
              const isExpanded = selectedDecision === decision.id;
              const timeRemaining = new Date(decision.expiresAt).getTime() - Date.now();
              const hoursRemaining = Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60)));

              return (
                <Card
                  key={decision.id}
                  className={`p-6 border-l-4 ${
                    decision.urgency === 'immediate'
                      ? 'border-rose-500 bg-rose-50/30'
                      : decision.urgency === 'urgent'
                        ? 'border-orange-500 bg-orange-50/30'
                        : 'border-blue-500 bg-blue-50/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${urgencyColor}-100 text-${urgencyColor}-700 uppercase`}>
                          {decision.urgency}
                        </span>
                        <span className="text-sm text-zinc-600 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {hoursRemaining}h remaining
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-zinc-900 mb-2">{decision.situation}</h3>
                      <p className="text-sm text-zinc-700 mb-3">{decision.problem}</p>
                      <p className="text-sm font-semibold text-zinc-900">{decision.stakes}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDecision(isExpanded ? null : decision.id)}
                    >
                      {isExpanded ? 'Collapse' : 'Review Options'}
                      <ChevronRight className={`ml-2 w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </Button>
                  </div>

                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-zinc-200">
                      <h4 className="text-sm font-semibold text-zinc-900 mb-4">
                        Decision Options (Ranked by NPV)
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {decision.options.map((option) => {
                          const isRecommended = option.id === decision.recommendedOption;

                          return (
                            <div
                              key={option.id}
                              className={`p-4 rounded-lg border-2 ${
                                isRecommended
                                  ? 'border-emerald-500 bg-emerald-50'
                                  : 'border-zinc-200 bg-white'
                              }`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-bold text-zinc-600">
                                      Option {option.rank}
                                    </span>
                                    {isRecommended && (
                                      <span className="px-2 py-0.5 bg-emerald-600 text-white text-xs font-bold rounded">
                                        RECOMMENDED
                                      </span>
                                    )}
                                  </div>
                                  <h5 className="font-semibold text-zinc-900">{option.title}</h5>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3 mb-4">
                                <div>
                                  <div className="text-xs text-zinc-600 mb-1">Cost</div>
                                  <div className="text-lg font-bold text-rose-600">
                                    ${(option.upfrontCost / 1000000).toFixed(1)}M
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-zinc-600 mb-1">Benefit</div>
                                  <div className="text-lg font-bold text-emerald-600">
                                    ${(option.expectedBenefit / 1000000).toFixed(1)}M
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-zinc-600 mb-1">Net Value</div>
                                  <div className={`text-lg font-bold ${
                                    option.netValue > 0 ? 'text-emerald-600' : 'text-rose-600'
                                  }`}>
                                    ${(option.netValue / 1000000).toFixed(1)}M
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-zinc-600 mb-1">ROI</div>
                                  <div className="text-lg font-bold text-blue-600">
                                    {option.roi.toFixed(1)}:1
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-zinc-600">Implementation Time:</span>
                                  <span className="font-medium text-zinc-900">
                                    {option.timeToImplement}h
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-zinc-600">Risk Reduction:</span>
                                  <span className="font-medium text-zinc-900">
                                    {(option.riskReduction * 100).toFixed(0)}%
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-zinc-600">Confidence:</span>
                                  <span className="font-medium text-zinc-900">
                                    {(option.confidence * 100).toFixed(0)}%
                                  </span>
                                </div>
                              </div>

                              {option.id !== 'option_do_nothing' && (
                                <Button
                                  className={`w-full ${
                                    isRecommended
                                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                                  }`}
                                  onClick={() => approveDecision(decision.id, option.id)}
                                  disabled={approving}
                                >
                                  {approving ? (
                                    <>
                                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                      Approving...
                                    </>
                                  ) : (
                                    <>
                                      <ThumbsUp className="w-4 h-4 mr-2" />
                                      Approve Option {option.rank}
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <section className="py-12 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-zinc-900">Active Constraint Alerts</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {alerts.slice(0, 6).map((alert) => {
                const severityColor = getSeverityColor(alert.severity);

                return (
                  <Card key={alert.id} className="p-4 border-l-4 border-amber-500">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold bg-${severityColor}-100 text-${severityColor}-700 uppercase`}>
                            {alert.severity}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-zinc-900 mb-1">
                          {alert.details.metric} changed {alert.details.percentChange.toFixed(1)}%
                        </p>
                        <p className="text-xs text-zinc-600 mb-2">
                          From {alert.details.oldValue.toLocaleString()} to {alert.details.newValue.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-rose-700">
                          ${(alert.estimatedImpact.financial / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-xs text-zinc-500">Impact</div>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-600">{alert.estimatedImpact.operational}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {decisions.length === 0 && alerts.length === 0 && (
        <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center bg-white rounded-2xl border border-zinc-200 p-12">
            <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-zinc-900 mb-2">All Clear</h3>
            <p className="text-zinc-600 mb-6">
              No active constraint alerts or pending decisions at this time.
            </p>
            <Button onClick={triggerCheck} className="bg-blue-600 text-white hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Run Manual Check
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
