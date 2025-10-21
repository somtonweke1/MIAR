'use client';

import React from 'react';
import { AlertTriangle, Target, Database, TrendingUp, Activity, Zap } from 'lucide-react';
import { useUnifiedPlatform } from '@/stores/unified-platform-store';
import Link from 'next/link';

export default function PlatformMetricsBar() {
  const { metrics, isLiveMonitoring } = useUnifiedPlatform();

  return (
    <div className="bg-gradient-to-r from-zinc-50 to-zinc-100 border-b border-zinc-200 py-3 px-6">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex items-center justify-between">
          {/* Live Status Indicator */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-zinc-200 shadow-sm">
              <Activity className={`w-4 h-4 ${isLiveMonitoring ? 'text-emerald-500 animate-pulse' : 'text-zinc-400'}`} />
              <span className="text-sm font-medium text-zinc-700">
                {isLiveMonitoring ? 'Live Monitoring' : 'Monitoring Paused'}
              </span>
            </div>
          </div>

          {/* Platform Metrics */}
          <div className="flex items-center gap-4">
            {/* Critical Alerts */}
            {metrics.criticalAlerts > 0 && (
              <Link
                href="/decision-center"
                className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <div>
                  <div className="text-xs text-rose-600 font-medium">Critical Alerts</div>
                  <div className="text-lg font-bold text-rose-700">{metrics.criticalAlerts}</div>
                </div>
              </Link>
            )}

            {/* Pending Decisions */}
            {metrics.pendingDecisions > 0 && (
              <Link
                href="/decision-center"
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <Target className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="text-xs text-blue-600 font-medium">Decisions Pending</div>
                  <div className="text-lg font-bold text-blue-700">{metrics.pendingDecisions}</div>
                </div>
              </Link>
            )}

            {/* Total Exposure */}
            {metrics.totalExposure > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <div>
                  <div className="text-xs text-amber-600 font-medium">Total Exposure</div>
                  <div className="text-lg font-bold text-amber-700">
                    ${(metrics.totalExposure / 1000000).toFixed(1)}M
                  </div>
                </div>
              </div>
            )}

            {/* Datasets Loaded */}
            {metrics.datasetsLoaded > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                <Database className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="text-xs text-emerald-600 font-medium">Datasets Loaded</div>
                  <div className="text-lg font-bold text-emerald-700">{metrics.datasetsLoaded}</div>
                </div>
              </div>
            )}

            {/* Constraints Monitored */}
            {metrics.constraintsMonitored > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                <Zap className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="text-xs text-blue-600 font-medium">Active Constraints</div>
                  <div className="text-lg font-bold text-blue-700">{metrics.constraintsMonitored}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
