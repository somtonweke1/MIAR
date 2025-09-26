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
    <div className="min-h-screen bg-zinc-50">
      {/* Premium Swiss-Style Header */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-zinc-200/50 sticky top-0 z-50">
        <div className="mx-auto max-w-[1800px] px-12">
          <div className="flex h-16 items-center justify-between">
            <div>
              <h1 className="text-xl font-extralight text-zinc-900 tracking-wide">
                MIAR
              </h1>
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