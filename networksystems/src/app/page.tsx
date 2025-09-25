'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MiningDashboard from '@/components/dashboard/mining-dashboard';
import NetworkAnalysisDashboard from '@/components/dashboard/network-analysis-dashboard';
import MiningInsights from '@/components/insights/mining-insights';
import { AuthProvider, useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import {
  Network,
  Pickaxe,
  LogOut,
  Lightbulb,
  TrendingUp
} from 'lucide-react';

function HomeContent() {
  const [activeView, setActiveView] = useState<'network' | 'mining' | 'insights'>('network');
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const renderContent = () => {
    switch (activeView) {
      case 'mining':
        return <MiningDashboard />;
      case 'insights':
        return <MiningInsights />;
      default:
        return <NetworkAnalysisDashboard />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <div className="mt-4 text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center space-x-12">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-light tracking-wide text-gray-900">
                  MIAR
                </h1>
                <div className="text-xs text-gray-500 -mt-1">Mining Intelligence</div>
              </div>

              <div className="hidden md:flex space-x-1">
                <button
                  onClick={() => setActiveView('network')}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeView === 'network'
                      ? 'bg-blue-100 text-blue-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Network className="mr-2 h-4 w-4" />
                  Network Analysis
                  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                    MOAT
                  </span>
                </button>

                <button
                  onClick={() => setActiveView('mining')}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeView === 'mining'
                      ? 'bg-amber-100 text-amber-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Pickaxe className="mr-2 h-4 w-4" />
                  Johannesburg Data
                  <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </button>

                <button
                  onClick={() => setActiveView('insights')}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeView === 'insights'
                      ? 'bg-purple-100 text-purple-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Strategic Insights
                  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800">
                    AI
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="hidden lg:flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>African Mining Network</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span>68% Critical Minerals Control</span>
                </div>
              </div>

              <div className="hidden md:block text-sm text-gray-500 font-light">
                {user.name}
              </div>

              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="p-2"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {renderContent()}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  );
}