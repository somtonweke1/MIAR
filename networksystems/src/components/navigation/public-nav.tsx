'use client';

import Link from 'next/link';
import { Shield, TrendingUp } from 'lucide-react';

export function PublicNav() {
  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-zinc-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
              <span className="text-white font-extralight text-xl tracking-wide">M</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-extralight tracking-tight text-zinc-900">MIAR</span>
              <p className="text-xs font-light text-zinc-500">Supply Chain Risk Intelligence</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/entity-list-scanner"
              className="hidden md:flex items-center gap-2 text-sm font-light text-zinc-700 hover:text-emerald-600 transition-colors"
            >
              <Shield className="w-4 h-4" />
              Compliance Scanner
            </Link>

            <Link
              href="/supply-chain-risk"
              className="hidden md:flex items-center gap-2 text-sm font-light text-zinc-700 hover:text-emerald-600 transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              Critical Minerals
            </Link>

            {/* Book Demo CTA */}
            <Link
              href="/#contact"
              className="px-4 py-2 bg-emerald-600 text-white text-sm font-light rounded-lg hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg"
            >
              Book Demo
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
