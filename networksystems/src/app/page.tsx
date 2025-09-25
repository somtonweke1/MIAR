'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AfricanMiningNetworkMap from '@/components/live-map/african-mining-network-map';
import { AuthProvider, useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

function HomeContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <div className="mt-4 text-white">Initializing network intelligence...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Minimal Header */}
      <nav className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-12 items-center justify-between">
            <div>
              <h1 className="text-lg font-light text-white tracking-wide">
                MIAR
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-sm text-slate-400 font-light">
                {user.name}
              </div>

              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 border-slate-600 text-slate-400 hover:text-white hover:border-slate-500"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* The Revolutionary Live Map - This IS the platform */}
      <main>
        <AfricanMiningNetworkMap />
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