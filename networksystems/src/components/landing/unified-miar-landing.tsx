'use client';

import React from 'react';
import {
  ArrowRight,
  Droplet,
  Shield,
  Package,
  Waves,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function UnifiedMIARLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-zinc-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-extralight text-zinc-900 tracking-wide">
              MIAR
            </h1>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline" size="sm" className="font-light">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-extralight tracking-tight text-zinc-900 mb-8">
            Compliance Intelligence Engine
            <span className="block text-5xl md:text-6xl text-zinc-600 font-extralight mt-4">
              for Regulated Physical Systems
            </span>
          </h1>

          <p className="text-xl font-light text-zinc-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            We build the unified compliance layer for modern manufacturing. Ingest material data,
            evaluate regulatory rules across dependency graphs, produce verified compliance outputs in real time.
          </p>

          <div className="flex items-center justify-center gap-4">
            <a href="#modules">
              <Button size="lg" className="text-lg px-8 py-6 bg-zinc-900 hover:bg-zinc-800">
                View Live Modules
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
            <a href="mailto:somton@jhu.edu">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Contact
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="py-20 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extralight tracking-tight text-zinc-900 mb-4">
              One Platform. Multiple Modules.
            </h2>
            <p className="text-xl font-light text-zinc-600">
              Start with PFAS or BIS. Expand to materials provenance, water infrastructure, supply-chain reporting.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* PFAS */}
            <Link href="/pfas-scanner">
              <Card className="p-8 hover:shadow-xl transition-shadow cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Droplet className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                    LIVE
                  </div>
                </div>
                <h3 className="text-2xl font-light text-zinc-900 mb-3">
                  PFAS Compliance
                </h3>
                <p className="text-zinc-600 font-light leading-relaxed mb-4">
                  EPA compliance analysis for water treatment systems. GAC capacity estimation,
                  breakthrough prediction, risk scoring.
                </p>
                <div className="text-blue-600 font-light group-hover:underline inline-flex items-center">
                  Launch Scanner <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </Card>
            </Link>

            {/* BIS */}
            <Link href="/entity-list-scanner">
              <Card className="p-8 hover:shadow-xl transition-shadow cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-rose-50 rounded-xl">
                    <Shield className="w-8 h-8 text-rose-600" />
                  </div>
                  <div className="px-3 py-1 bg-rose-600 text-white text-xs font-medium rounded-full">
                    LIVE
                  </div>
                </div>
                <h3 className="text-2xl font-light text-zinc-900 mb-3">
                  BIS Export Controls
                </h3>
                <p className="text-zinc-600 font-light leading-relaxed mb-4">
                  Automated entity list screening with ownership structure mapping.
                  Flags compliance risks across supplier networks.
                </p>
                <div className="text-rose-600 font-light group-hover:underline inline-flex items-center">
                  Launch Scanner <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </Card>
            </Link>

            {/* Materials Provenance */}
            <Card className="p-8 opacity-60">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-zinc-100 rounded-xl">
                  <Package className="w-8 h-8 text-zinc-600" />
                </div>
                <div className="px-3 py-1 bg-zinc-200 text-zinc-700 text-xs font-medium rounded-full">
                  COMING SOON
                </div>
              </div>
              <h3 className="text-2xl font-light text-zinc-900 mb-3">
                Materials Provenance
              </h3>
              <p className="text-zinc-600 font-light leading-relaxed">
                Critical minerals tracking from mine to final product. Conflict-free sourcing,
                ESG compliance verification.
              </p>
            </Card>

            {/* Water Infrastructure */}
            <Card className="p-8 opacity-60">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-zinc-100 rounded-xl">
                  <Waves className="w-8 h-8 text-zinc-600" />
                </div>
                <div className="px-3 py-1 bg-zinc-200 text-zinc-700 text-xs font-medium rounded-full">
                  COMING SOON
                </div>
              </div>
              <h3 className="text-2xl font-light text-zinc-900 mb-3">
                Water Infrastructure
              </h3>
              <p className="text-zinc-600 font-light leading-relaxed">
                Full EPA/state water quality compliance beyond PFAS. SDWA, CWA,
                NPDES permit tracking with real-time alerts.
              </p>
            </Card>
          </div>

          {/* Supply Chain - Full Width */}
          <div className="max-w-4xl mx-auto mt-8">
            <Card className="p-8 opacity-60">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-zinc-100 rounded-xl">
                  <FileText className="w-8 h-8 text-zinc-600" />
                </div>
                <div className="px-3 py-1 bg-zinc-200 text-zinc-700 text-xs font-medium rounded-full">
                  COMING SOON
                </div>
              </div>
              <h3 className="text-2xl font-light text-zinc-900 mb-3">
                Supply Chain Transparency Reporting
              </h3>
              <p className="text-zinc-600 font-light leading-relaxed">
                Auto-generate Scope 3 emissions, CSRD disclosures, California SB-253 reports.
                Ingest supplier data, calculate carbon footprint, produce audit-ready documentation.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* The Architecture */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extralight tracking-tight text-zinc-900 mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-left">
            <Card className="p-6">
              <h3 className="font-light text-zinc-900 mb-2">1. Ingest</h3>
              <p className="text-sm text-zinc-600 font-light leading-relaxed">
                Material certificates, SDS sheets, supplier declarations, lab reports
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-light text-zinc-900 mb-2">2. Graph</h3>
              <p className="text-sm text-zinc-600 font-light leading-relaxed">
                Build dependency tree: chemicals → components → assemblies → products
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-light text-zinc-900 mb-2">3. Evaluate</h3>
              <p className="text-sm text-zinc-600 font-light leading-relaxed">
                Rules engine applies PFAS, BIS, TSCA, REACH regulations across graph
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-light text-zinc-900 mb-2">4. Verify</h3>
              <p className="text-sm text-zinc-600 font-light leading-relaxed">
                Auto-flag non-compliance, suggest alternatives, generate audit reports
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Now */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extralight tracking-tight text-zinc-900 mb-6">
            Why Now
          </h2>
          <p className="text-xl font-light text-zinc-600 mb-12 max-w-2xl mx-auto">
            Regulations are accelerating faster than manufacturing ERP systems can adapt.
            Manual compliance is no longer tenable.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-extralight text-zinc-900 mb-2">$25k/day</div>
              <p className="text-sm text-zinc-600 font-light">EPA violation fines</p>
            </div>
            <div>
              <div className="text-3xl font-extralight text-zinc-900 mb-2">3-6 months</div>
              <p className="text-sm text-zinc-600 font-light">Product release delays</p>
            </div>
            <div>
              <div className="text-3xl font-extralight text-zinc-900 mb-2">Weekly</div>
              <p className="text-sm text-zinc-600 font-light">BIS entity list updates</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-zinc-500 font-light">
          <p>MIAR - Compliance Intelligence Engine</p>
        </div>
      </footer>
    </div>
  );
}
