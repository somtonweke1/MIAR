'use client';

import React from 'react';
import {
  ArrowRight,
  Droplet,
  Shield,
  Package,
  Waves,
  FileText,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function UnifiedMIARLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-zinc-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                <span className="text-white font-extralight text-xl tracking-wide">M</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-extralight tracking-tight text-zinc-900">MIAR</span>
                <p className="text-xs font-light text-zinc-500">Compliance Intelligence Engine</p>
              </div>
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-4">
              <Link
                href="/pfas-scanner"
                className="hidden md:block text-sm font-light text-zinc-700 hover:text-emerald-600 transition-colors"
              >
                PFAS Scanner
              </Link>
              <Link
                href="/entity-list-scanner"
                className="hidden md:block text-sm font-light text-zinc-700 hover:text-emerald-600 transition-colors"
              >
                BIS Scanner
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm" className="font-light">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white/95 backdrop-blur-md border-b border-zinc-200/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-light mb-6">
              <Sparkles className="w-4 h-4" />
              Platform Launch: PFAS + BIS Modules Now Live
            </div>

            <h1 className="text-5xl font-extralight tracking-tight text-zinc-900 mb-6">
              Compliance Intelligence Engine for Regulated Physical Systems
              <span className="block text-emerald-600 font-light mt-2">One Platform. Multiple Modules.</span>
            </h1>

            <p className="text-xl font-light text-zinc-600 mb-8 leading-relaxed">
              We build the unified compliance layer for modern manufacturing. Ingest material data,
              evaluate regulatory rules across dependency graphs, produce verified compliance outputs in real time.
            </p>

            <div className="flex items-center justify-center gap-4">
              <a href="#modules">
                <Button size="lg" className="text-lg px-8 py-6 bg-emerald-600 hover:bg-emerald-700">
                  View Live Modules
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
            </div>

            <p className="text-sm font-light text-zinc-500 mt-4">
              ✓ Free for first 10 facilities  •  ✓ Instant results  •  ✓ No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extralight tracking-tight text-zinc-900 mb-4">
              Live Compliance Modules
            </h2>
            <p className="text-lg font-light text-zinc-600">
              Start with PFAS or BIS. Expand to materials provenance, water infrastructure, supply-chain reporting.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* PFAS */}
            <Link href="/pfas-scanner">
              <Card className="p-6 hover:shadow-xl transition-shadow cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Droplet className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                    LIVE
                  </div>
                </div>
                <h3 className="text-xl font-light text-zinc-900 mb-2">
                  PFAS Compliance
                </h3>
                <p className="text-zinc-600 font-light leading-relaxed text-sm mb-4">
                  EPA compliance analysis for water treatment systems. GAC capacity estimation,
                  breakthrough prediction, risk scoring.
                </p>
                <div className="text-blue-600 font-light group-hover:underline inline-flex items-center text-sm">
                  Launch Scanner <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </Card>
            </Link>

            {/* BIS */}
            <Link href="/entity-list-scanner">
              <Card className="p-6 hover:shadow-xl transition-shadow cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-rose-50 rounded-xl">
                    <Shield className="w-6 h-6 text-rose-600" />
                  </div>
                  <div className="px-3 py-1 bg-rose-600 text-white text-xs font-medium rounded-full">
                    LIVE
                  </div>
                </div>
                <h3 className="text-xl font-light text-zinc-900 mb-2">
                  BIS Export Controls
                </h3>
                <p className="text-zinc-600 font-light leading-relaxed text-sm mb-4">
                  Automated entity list screening with ownership structure mapping.
                  Flags compliance risks across supplier networks.
                </p>
                <div className="text-rose-600 font-light group-hover:underline inline-flex items-center text-sm">
                  Launch Scanner <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </Card>
            </Link>

            {/* Materials Provenance */}
            <Card className="p-6 opacity-60">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-zinc-100 rounded-xl">
                  <Package className="w-6 h-6 text-zinc-600" />
                </div>
                <div className="px-3 py-1 bg-zinc-200 text-zinc-700 text-xs font-medium rounded-full">
                  COMING SOON
                </div>
              </div>
              <h3 className="text-xl font-light text-zinc-900 mb-2">
                Materials Provenance
              </h3>
              <p className="text-zinc-600 font-light leading-relaxed text-sm">
                Critical minerals tracking from mine to final product. Conflict-free sourcing,
                ESG compliance verification.
              </p>
            </Card>

            {/* Water Infrastructure */}
            <Card className="p-6 opacity-60">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-zinc-100 rounded-xl">
                  <Waves className="w-6 h-6 text-zinc-600" />
                </div>
                <div className="px-3 py-1 bg-zinc-200 text-zinc-700 text-xs font-medium rounded-full">
                  COMING SOON
                </div>
              </div>
              <h3 className="text-xl font-light text-zinc-900 mb-2">
                Water Infrastructure
              </h3>
              <p className="text-zinc-600 font-light leading-relaxed text-sm">
                Full EPA/state water quality compliance beyond PFAS. SDWA, CWA,
                NPDES permit tracking with real-time alerts.
              </p>
            </Card>
          </div>

          {/* Supply Chain - Full Width */}
          <div className="max-w-5xl mx-auto mt-6">
            <Card className="p-6 opacity-60">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-zinc-100 rounded-xl">
                  <FileText className="w-6 h-6 text-zinc-600" />
                </div>
                <div className="px-3 py-1 bg-zinc-200 text-zinc-700 text-xs font-medium rounded-full">
                  COMING SOON
                </div>
              </div>
              <h3 className="text-xl font-light text-zinc-900 mb-2">
                Supply Chain Transparency Reporting
              </h3>
              <p className="text-zinc-600 font-light leading-relaxed text-sm">
                Auto-generate Scope 3 emissions, CSRD disclosures, California SB-253 reports.
                Ingest supplier data, calculate carbon footprint, produce audit-ready documentation.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extralight tracking-tight text-zinc-900 mb-4">
              The New PFAS Challenge
            </h2>
            <p className="text-lg font-light text-zinc-600 max-w-3xl mx-auto">
              Regulations are accelerating faster than manufacturing ERP systems can adapt.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-xl transition-shadow">
              <div className="p-3 bg-blue-50 rounded-xl w-fit mb-4">
                <Droplet className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-light text-zinc-900 mb-3">Stricter Limits</h3>
              <p className="text-zinc-600 font-light leading-relaxed">
                PFOA and PFOS now limited to 4 ng/L (down from 70 ng/L). Most GAC systems need recalibration.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-shadow">
              <div className="p-3 bg-amber-50 rounded-xl w-fit mb-4">
                <Shield className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-light text-zinc-900 mb-3">Hidden Relationships</h3>
              <p className="text-zinc-600 font-light leading-relaxed">
                Ownership structures are complex. A supplier might be compliant on paper but owned by a listed entity.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-shadow">
              <div className="p-3 bg-rose-50 rounded-xl w-fit mb-4">
                <FileText className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-light text-zinc-900 mb-3">Real Financial Risk</h3>
              <p className="text-zinc-600 font-light leading-relaxed">
                EPA violations carry fines up to $25,000/day. Accurate capacity predictions save millions.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extralight tracking-tight text-zinc-900 mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-left">
            <Card className="p-6">
              <div className="text-emerald-600 font-medium mb-2">1. Ingest</div>
              <p className="text-sm text-zinc-600 font-light leading-relaxed">
                Material certificates, SDS sheets, supplier declarations, lab reports
              </p>
            </Card>

            <Card className="p-6">
              <div className="text-emerald-600 font-medium mb-2">2. Graph</div>
              <p className="text-sm text-zinc-600 font-light leading-relaxed">
                Build dependency tree: chemicals → components → assemblies → products
              </p>
            </Card>

            <Card className="p-6">
              <div className="text-emerald-600 font-medium mb-2">3. Evaluate</div>
              <p className="text-sm text-zinc-600 font-light leading-relaxed">
                Rules engine applies PFAS, BIS, TSCA, REACH regulations across graph
              </p>
            </Card>

            <Card className="p-6">
              <div className="text-emerald-600 font-medium mb-2">4. Verify</div>
              <p className="text-sm text-zinc-600 font-light leading-relaxed">
                Auto-flag non-compliance, suggest alternatives, generate audit reports
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-zinc-500 font-light">
          <p>MIAR - Compliance Intelligence Engine</p>
        </div>
      </footer>
    </div>
  );
}
