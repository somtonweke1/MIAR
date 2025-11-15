'use client';

import React from 'react';
import {
  ArrowRight,
  Droplet,
  Shield,
  Package,
  Waves,
  FileText,
  Sparkles,
  AlertCircle,
  Database,
  GitBranch,
  Network,
  CheckCircle
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
              <a href="mailto:somton@jhu.edu">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-zinc-300 hover:border-emerald-600 hover:text-emerald-700">
                  Contact
                </Button>
              </a>
            </div>

            <p className="text-sm font-light text-zinc-500 mt-4">
              ✓ Free for first 10 facilities  •  ✓ Instant results  •  ✓ No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extralight tracking-tight text-zinc-900 mb-4">
              The System-Level Failure in Manufacturing Compliance
            </h2>
            <p className="text-lg font-light text-zinc-600 max-w-3xl mx-auto">
              Manufacturers are being crushed by rising regulatory complexity: PFAS bans, BIS export controls,
              supply-chain transparency laws, REACH, TSCA, FDA material disclosures.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-xl transition-shadow">
              <div className="p-3 bg-rose-50 rounded-xl w-fit mb-4">
                <AlertCircle className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-light text-zinc-900 mb-3">Unverified Materials</h3>
              <p className="text-zinc-600 font-light leading-relaxed">
                No unified system tracks material lineage across suppliers, components, and assemblies.
                One bad batch can trigger million-dollar recalls.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-shadow">
              <div className="p-3 bg-amber-50 rounded-xl w-fit mb-4">
                <FileText className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-light text-zinc-900 mb-3">Regulatory Whack-a-Mole</h3>
              <p className="text-zinc-600 font-light leading-relaxed">
                PFAS, REACH, BIS, TSCA updates happen weekly. Manufacturers can't adapt fast enough
                without automation.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-shadow">
              <div className="p-3 bg-blue-50 rounded-xl w-fit mb-4">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-light text-zinc-900 mb-3">Months to Market</h3>
              <p className="text-zinc-600 font-light leading-relaxed">
                Manual compliance checks delay product releases by 3-6 months. Competitors move faster
                with better systems.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* The Insight */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extralight tracking-tight text-zinc-900 mb-4">
              The Insight: Compliance is a Graph Problem
            </h2>
            <p className="text-xl font-light text-zinc-600 max-w-3xl mx-auto">
              Every product is a dependency tree: chemicals → components → assemblies → final goods.
              <span className="block mt-2 text-zinc-900">
                Regulations apply across this graph, but manufacturers have no engine to evaluate compliance at scale.
              </span>
            </p>
          </div>

          <Card className="p-8 md:p-12 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
            <h3 className="text-2xl font-light mb-8 text-center">MIAR Architecture</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="p-4 bg-white/10 rounded-xl mb-4 inline-block">
                  <Database className="w-8 h-8" />
                </div>
                <h4 className="font-medium mb-2">Multi-Source Ingestion</h4>
                <p className="text-sm text-zinc-300 font-light">
                  Material certificates, SDS sheets, supplier declarations, lab reports
                </p>
              </div>

              <div className="text-center">
                <div className="p-4 bg-white/10 rounded-xl mb-4 inline-block">
                  <GitBranch className="w-8 h-8" />
                </div>
                <h4 className="font-medium mb-2">Unified Material Graph</h4>
                <p className="text-sm text-zinc-300 font-light">
                  Version-controlled dependency graph with full lineage tracking
                </p>
              </div>

              <div className="text-center">
                <div className="p-4 bg-white/10 rounded-xl mb-4 inline-block">
                  <Network className="w-8 h-8" />
                </div>
                <h4 className="font-medium mb-2">Regulatory Rules Engine</h4>
                <p className="text-sm text-zinc-300 font-light">
                  DSL evaluates PFAS, BIS, TSCA, REACH against every material change
                </p>
              </div>

              <div className="text-center">
                <div className="p-4 bg-white/10 rounded-xl mb-4 inline-block">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-medium mb-2">Real-Time Verification</h4>
                <p className="text-sm text-zinc-300 font-light">
                  Auto-flags non-compliance, suggests alternatives, generates audit reports
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extralight tracking-tight text-zinc-900 mb-4">
              One Platform. Multiple Modules.
            </h2>
            <p className="text-xl font-light text-zinc-600 max-w-3xl mx-auto">
              MIAR's architecture scales across every regulated domain in manufacturing.
              <span className="block mt-2 text-zinc-900">
                Start with PFAS or BIS. Expand to materials provenance, water infrastructure, and supply-chain reporting.
              </span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-6">
            {/* PFAS Module - LIVE */}
            <Link href="/pfas-scanner">
              <Card className="p-8 border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white hover:shadow-2xl transition-all group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Droplet className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                    LIVE
                  </div>
                </div>
                <h3 className="text-2xl font-light text-zinc-900 mb-3">
                  PFAS Water Compliance
                </h3>
                <p className="text-zinc-600 font-light mb-6 leading-relaxed">
                  GAC capacity estimation, breakthrough prediction, EPA risk scoring (4 ng/L MCLs).
                  Freundlich + Thomas models with Monte Carlo validation.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-zinc-600">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Instant EPA compliance analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-600">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>GAC lifespan predictions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-600">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Water utilities + chemical suppliers</span>
                  </div>
                </div>
                <div className="text-blue-600 font-light group-hover:underline inline-flex items-center">
                  Launch PFAS Scanner
                  <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </Card>
            </Link>

            {/* BIS Module - LIVE */}
            <Link href="/entity-list-scanner">
              <Card className="p-8 border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-white hover:shadow-2xl transition-all group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-rose-100 rounded-xl">
                    <Shield className="w-8 h-8 text-rose-600" />
                  </div>
                  <div className="px-3 py-1 bg-rose-600 text-white text-xs font-medium rounded-full">
                    LIVE
                  </div>
                </div>
                <h3 className="text-2xl font-light text-zinc-900 mb-3">
                  BIS Export Controls
                </h3>
                <p className="text-zinc-600 font-light mb-6 leading-relaxed">
                  Automated entity list screening with ownership structure mapping. Flags affiliates,
                  subsidiaries, and hidden compliance risks.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-zinc-600">
                    <CheckCircle className="w-4 h-4 text-rose-600" />
                    <span>700+ supplier relationships mapped</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-600">
                    <CheckCircle className="w-4 h-4 text-rose-600" />
                    <span>48-hour compliance reports</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-600">
                    <CheckCircle className="w-4 h-4 text-rose-600" />
                    <span>Aerospace + defense manufacturers</span>
                  </div>
                </div>
                <div className="text-rose-600 font-light group-hover:underline inline-flex items-center">
                  Launch BIS Scanner
                  <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </Card>
            </Link>

            {/* Materials Provenance - COMING SOON */}
            <Card className="p-8 border border-zinc-300 bg-gradient-to-br from-zinc-50 to-white opacity-90">
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
              <p className="text-zinc-600 font-light mb-6 leading-relaxed">
                Track critical minerals from mine to final product. Verify conflict-free sourcing,
                ESG compliance, and supply chain resilience.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <div className="w-4 h-4 rounded-full border-2 border-zinc-300" />
                  <span>Lithium, cobalt, rare earth tracking</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <div className="w-4 h-4 rounded-full border-2 border-zinc-300" />
                  <span>Conflict minerals certification</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <div className="w-4 h-4 rounded-full border-2 border-zinc-300" />
                  <span>EV battery + electronics OEMs</span>
                </div>
              </div>
            </Card>

            {/* Water Infrastructure - COMING SOON */}
            <Card className="p-8 border border-zinc-300 bg-gradient-to-br from-zinc-50 to-white opacity-90">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-zinc-100 rounded-xl">
                  <Waves className="w-8 h-8 text-zinc-600" />
                </div>
                <div className="px-3 py-1 bg-zinc-200 text-zinc-700 text-xs font-medium rounded-full">
                  COMING SOON
                </div>
              </div>
              <h3 className="text-2xl font-light text-zinc-900 mb-3">
                Water Infrastructure Compliance
              </h3>
              <p className="text-zinc-600 font-light mb-6 leading-relaxed">
                Expand beyond PFAS to full EPA/state water quality compliance. SDWA, CWA, NPDES permit tracking
                with real-time alerts.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <div className="w-4 h-4 rounded-full border-2 border-zinc-300" />
                  <span>Multi-contaminant monitoring</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <div className="w-4 h-4 rounded-full border-2 border-zinc-300" />
                  <span>Automated permit compliance</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <div className="w-4 h-4 rounded-full border-2 border-zinc-300" />
                  <span>Municipal + industrial wastewater</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Supply Chain - Full Width */}
          <div className="max-w-5xl mx-auto">
            <Card className="p-8 border border-zinc-300 bg-gradient-to-br from-zinc-50 to-white opacity-90">
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
              <p className="text-zinc-600 font-light mb-6 leading-relaxed max-w-3xl">
                Auto-generate Scope 3 emissions, CSRD disclosures, California SB-253 reports. Ingest supplier
                data, calculate carbon footprint, produce audit-ready documentation.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <div className="w-4 h-4 rounded-full border-2 border-zinc-300" />
                  <span>Scope 3 emissions tracking</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <div className="w-4 h-4 rounded-full border-2 border-zinc-300" />
                  <span>CSRD + SB-253 compliance</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <div className="w-4 h-4 rounded-full border-2 border-zinc-300" />
                  <span>Manufacturing + retail</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Now */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-12 bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
            <div className="text-center">
              <h2 className="text-3xl font-extralight tracking-tight text-zinc-900 mb-6">
                Why Now
              </h2>
              <p className="text-lg font-light text-zinc-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                Regulations are accelerating faster than manufacturing ERP systems can adapt.
                <span className="block mt-3 text-xl font-normal text-zinc-900">
                  PFAS bans alone create billions in risk exposure for suppliers in water, agriculture,
                  aerospace, and consumer goods.
                </span>
              </p>
              <div className="grid md:grid-cols-3 gap-8 text-left">
                <div className="bg-white rounded-lg p-6">
                  <div className="text-3xl font-light text-rose-600 mb-2">$25k/day</div>
                  <p className="text-sm text-zinc-600 font-light">
                    EPA violation fines for PFAS non-compliance
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6">
                  <div className="text-3xl font-light text-amber-600 mb-2">3-6 months</div>
                  <p className="text-sm text-zinc-600 font-light">
                    Product release delays from manual compliance checks
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6">
                  <div className="text-3xl font-light text-blue-600 mb-2">Weekly</div>
                  <p className="text-sm text-zinc-600 font-light">
                    BIS entity list updates manufacturers must track
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-12 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto text-center text-sm text-zinc-500 font-light">
          <p>MIAR - Compliance Intelligence Engine for Regulated Physical Systems</p>
        </div>
      </footer>
    </div>
  );
}
