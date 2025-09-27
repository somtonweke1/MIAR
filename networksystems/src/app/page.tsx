'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfessionalLandingPage from '@/components/landing/professional-landing-page';
import AfricanMiningNetworkMap from '@/components/live-map/african-mining-network-map';
import InvestmentPortfolioOptimization from '@/components/analytics/investment-portfolio-optimization';
import GlobalTradeNetworkModeling from '@/components/analytics/global-trade-network-modeling';
import { AuthProvider, useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { LogOut, Network, TrendingUp, Ship } from 'lucide-react';

type TabType = 'mining' | 'investment' | 'trade';

function HomeContent() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [showLanding, setShowLanding] = useState(false); // Start with false
  const [activeTab, setActiveTab] = useState<TabType>('mining');

  // Check authentication immediately
  useEffect(() => {
    if (isLoading) return; // Wait for auth to finish loading

    if (user) {
      // User is authenticated, skip landing page and go to platform
      setShowLanding(false);
    } else {
      // No user, show landing page
      setShowLanding(true);
    }
  }, [user, isLoading]);

  const handleGetStarted = () => {
    // Redirect to login when Get Started is clicked
    router.push('/login');
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <div className="mt-4 text-zinc-600 font-light">Loading platform...</div>
        </div>
      </div>
    );
  }

  // Show landing page only if no user
  if (!user && showLanding) {
    return <ProfessionalLandingPage onGetStarted={handleGetStarted} />;
  }

  // If no user and not showing landing, redirect to login
  if (!user) {
    router.push('/login');
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <div className="mt-4 text-zinc-600 font-light">Redirecting to login...</div>
        </div>
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'mining':
        return <AfricanMiningNetworkMap />;
      case 'investment':
        return <InvestmentPortfolioOptimization />;
      case 'trade':
        return <GlobalTradeNetworkModeling />;
      default:
        return <AfricanMiningNetworkMap />;
    }
  };

  // Show the main platform
  return (
    <div className="min-h-screen bg-zinc-50">
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
                  <span>Mining Intelligence</span>
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
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="hidden md:block text-sm text-zinc-500 font-light">
                {user.name}
              </div>

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
        <div className="max-w-[1800px] mx-auto">
          {renderActiveTab()}
        </div>
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