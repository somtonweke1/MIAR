'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProfessionalLandingPage from '@/components/landing/professional-landing-page';
import CriticalMineralsRiskMap from '@/components/live-map/critical-minerals-risk-map';
import InvestmentPortfolioOptimization from '@/components/analytics/investment-portfolio-optimization';
import GlobalTradeNetworkModeling from '@/components/analytics/global-trade-network-modeling';
import SupplyChainOptimization from '@/components/analytics/supply-chain-optimization';
import LiveMarketFeed from '@/components/dashboard/live-market-feed';
import DualBeachheadDashboard from '@/components/dashboard/dual-beachhead-dashboard';
import { AuthProvider, useAuth } from '@/components/auth/auth-provider';
import PlatformGuide from '@/components/guide/platform-guide';
import { Button } from '@/components/ui/button';
import { LogOut, Network, TrendingUp, Ship, Package, HelpCircle, Activity, Upload } from 'lucide-react';
import { useUnifiedPlatform } from '@/stores/unified-platform-store';
import QuickDataUpload from '@/components/integrated/quick-data-upload';

type TabType = 'mining' | 'investment' | 'trade' | 'supply-chain' | 'live-markets';

function HomeContent() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showLanding, setShowLanding] = useState(true); // Always start with landing page
  const [activeTab, setActiveTab] = useState<TabType>('mining');
  const [showGuide, setShowGuide] = useState(false);
  const [forceShowLanding, setForceShowLanding] = useState(false);
  const [showQuickUpload, setShowQuickUpload] = useState(false);

  // Unified platform integration
  const { startLiveMonitoring, stopLiveMonitoring, metrics } = useUnifiedPlatform();

  // Check if user just logged in and should go to platform
  useEffect(() => {
    if (isLoading) return; // Wait for auth to finish loading

    const accessParam = searchParams.get('access');
    if (user && accessParam === 'platform') {
      // User is authenticated and coming from login, go directly to platform
      setShowLanding(false);
      // Clean up the URL
      router.replace('/');
    }
  }, [user, isLoading, searchParams, router]);

  // Start live monitoring when platform is active
  useEffect(() => {
    if (user && !showLanding) {
      startLiveMonitoring();

      return () => {
        stopLiveMonitoring();
      };
    }
  }, [user, showLanding, startLiveMonitoring, stopLiveMonitoring]);

  const handleAccessPlatform = () => {
    if (user) {
      // User is authenticated, go to platform
      setShowLanding(false);
    } else {
      // No user, redirect to login
      router.push('/login');
    }
  };

  const handleGetStarted = () => {
    // Redirect to login when Get Started is clicked
    router.push('/login');
  };

  // Show landing page for public access (no user) or when explicitly requested
  if (!user || showLanding) {
    return <ProfessionalLandingPage onGetStarted={handleGetStarted} user={user} onAccessPlatform={handleAccessPlatform} />;
  }

  // If user is authenticated and showLanding is false, show the dashboard
  // This happens after successful login or when accessing platform

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'mining':
        return <CriticalMineralsRiskMap />;
      case 'investment':
        return <InvestmentPortfolioOptimization />;
      case 'trade':
        return <GlobalTradeNetworkModeling />;
      case 'supply-chain':
        return <SupplyChainOptimization />;
      case 'live-markets':
        return <LiveMarketFeed />;
      default:
        return <CriticalMineralsRiskMap />;
    }
  };

  // Show the main platform
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100">
      {/* Premium Swiss-Style Header */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-zinc-200/50 sticky top-0 z-50">
        <div className="mx-auto max-w-[1800px] px-12">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-extralight text-zinc-900 tracking-wide">
                MIAR
              </h1>

              {/* Tab Navigation */}
              <div className="flex items-center space-x-1 bg-white/60 backdrop-blur-sm rounded-full p-1 border border-zinc-200/50">
                <button
                  onClick={() => setActiveTab('mining')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-light transition-all ${
                    activeTab === 'mining'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
                  }`}
                >
                  <Network className="h-4 w-4" />
                  <span>Supply Chain Risk</span>
                </button>
                <button
                  onClick={() => setActiveTab('investment')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-light transition-all ${
                    activeTab === 'investment'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
                  }`}
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Portfolio Optimization</span>
                </button>
                <button
                  onClick={() => setActiveTab('trade')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-light transition-all ${
                    activeTab === 'trade'
                      ? 'bg-cyan-500 text-white shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
                  }`}
                >
                  <Ship className="h-4 w-4" />
                  <span>Trade Network</span>
                </button>
                <button
                  onClick={() => setActiveTab('supply-chain')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-light transition-all ${
                    activeTab === 'supply-chain'
                      ? 'bg-zinc-700 text-white shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
                  }`}
                >
                  <Package className="h-4 w-4" />
                  <span>SC-GEP Model</span>
                </button>
                <button
                  onClick={() => setActiveTab('live-markets')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-light transition-all ${
                    activeTab === 'live-markets'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
                  }`}
                >
                  <Activity className="h-4 w-4" />
                  <span>Live Markets</span>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Quick Access Tools */}
              <div className="flex items-center space-x-2 border-l border-zinc-200 pl-4">
                <button
                  onClick={() => setShowQuickUpload(true)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-light text-zinc-600 hover:text-zinc-900 hover:bg-white/80 transition-all border border-transparent hover:border-zinc-200"
                  title="Quick upload data"
                >
                  <Upload className="h-4 w-4 text-emerald-600" />
                  <span className="hidden lg:inline">Quick Upload</span>
                </button>
              </div>

              <div className="hidden md:block text-sm text-zinc-500 font-light border-l border-zinc-200 pl-4">
                {user?.name}
              </div>

              <Button
                onClick={() => setShowGuide(true)}
                variant="outline"
                size="sm"
                className="h-10 w-10 p-0 border-zinc-300 text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 bg-white/60 backdrop-blur-sm"
                title="Platform Guide"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>

              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="h-10 w-10 p-0 border-zinc-300 text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 bg-white/60 backdrop-blur-sm"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="px-6 py-8">
        <div className="max-w-[1800px] mx-auto space-y-8">
          {/* Active Tab Content (Maps/Flows) */}
          {renderActiveTab()}

          {/* Dual Beachhead Dashboard - NEW ADDITION BENEATH THE MAPS */}
          <div className="mt-12">
            <DualBeachheadDashboard />
          </div>
        </div>
      </main>

      {/* Platform Guide Modal */}
      {showGuide && (
        <PlatformGuide onClose={() => setShowGuide(false)} />
      )}

      {/* Quick Upload Modal */}
      {showQuickUpload && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <QuickDataUpload onClose={() => setShowQuickUpload(false)} />
        </div>
      )}
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
