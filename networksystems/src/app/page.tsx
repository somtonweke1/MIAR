'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProfessionalLandingPage from '@/components/landing/professional-landing-page';
import DualBeachheadDashboard from '@/components/dashboard/dual-beachhead-dashboard';
import { AuthProvider, useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { LogOut, Home as HomeIcon } from 'lucide-react';
import { useUnifiedPlatform } from '@/stores/unified-platform-store';

function HomeContent() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showLanding, setShowLanding] = useState(true); // Always start with landing page

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

  // Show the main platform
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100">
      {/* Simplified Header */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-zinc-200/50 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-extralight text-zinc-900 tracking-wide">
                MIAR
              </h1>
              <span className="hidden md:inline text-sm font-light text-zinc-500">
                Supply Chain Risk Intelligence
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-sm text-zinc-500 font-light border-r border-zinc-200 pr-4">
                {user?.name}
              </div>

              <Button
                onClick={() => setShowLanding(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400 bg-white/60 backdrop-blur-sm"
                title="Back to Home"
              >
                <HomeIcon className="h-4 w-4" />
                <span className="hidden md:inline">Home</span>
              </Button>

              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400 bg-white/60 backdrop-blur-sm"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <DualBeachheadDashboard />
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

