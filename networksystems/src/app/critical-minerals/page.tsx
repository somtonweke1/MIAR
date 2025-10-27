'use client';

import React from 'react';
import { PublicNav } from '@/components/navigation/public-nav';
import {
  TrendingUp,
  Globe,
  AlertTriangle,
  Shield,
  BarChart3,
  MapPin,
  Zap,
  FileText,
  Mail,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function CriticalMineralsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100">
      <PublicNav />

      {/* Hero Section */}
      <section className="bg-white/95 backdrop-blur-md py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-light mb-6">
              <Globe className="w-4 h-4" />
              Strategic Supply Chain Intelligence
            </div>

            <h1 className="text-5xl font-extralight tracking-tight text-zinc-900 mb-6">
              Critical Minerals Risk Intelligence
              <span className="block text-emerald-600 font-light mt-2">Navigate Lithium, Cobalt, Copper & Rare Earth Supply Chains</span>
            </h1>

            <p className="text-xl font-light text-zinc-600 mb-10 leading-relaxed">
              Real-time supply chain monitoring for energy companies, manufacturers, and defense contractors
              dependent on critical minerals. Make informed sourcing decisions with geopolitical risk intelligence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/supply-chain-risk"
                className="px-8 py-4 bg-emerald-600 text-white text-lg font-light rounded-lg hover:bg-emerald-700 transition-colors shadow-xl hover:shadow-2xl inline-flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                Explore Supply Chain Risk
              </Link>

              <Link
                href="/risk-report"
                className="px-8 py-4 bg-white text-zinc-900 text-lg font-light rounded-lg hover:bg-zinc-50 transition-colors border-2 border-zinc-200 inline-flex items-center justify-center gap-2"
              >
                View Sample Risk Report
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Critical Minerals Overview */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extralight text-zinc-900 mb-4 tracking-tight">
              Why Critical Minerals Matter
            </h2>
            <p className="text-lg text-zinc-600 font-light max-w-2xl mx-auto">
              EV batteries, semiconductors, defense systems - all depend on minerals controlled by concentrated suppliers
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                mineral: 'Cobalt',
                icon: '🔋',
                risk: 'High',
                source: '70% DRC',
                color: 'rose'
              },
              {
                mineral: 'Lithium',
                icon: '⚡',
                risk: 'Medium-High',
                source: 'Chile, Australia',
                color: 'amber'
              },
              {
                mineral: 'Copper',
                icon: '🔌',
                risk: 'Medium',
                source: 'Chile, Peru',
                color: 'orange'
              },
              {
                mineral: 'Rare Earths',
                icon: '🧲',
                risk: 'Critical',
                source: '80% China',
                color: 'red'
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-zinc-200/50 hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-light text-zinc-900 mb-2">{item.mineral}</h3>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-light mb-2 bg-${item.color}-50 text-${item.color}-700`}>
                  {item.risk} Risk
                </div>
                <p className="text-sm font-light text-zinc-600">{item.source}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Risks Section */}
      <section className="py-16 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extralight text-zinc-900 mb-4 tracking-tight">
              Supply Chain Risks We Monitor
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-zinc-200/50">
              <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-light text-zinc-900 mb-3">Geopolitical Instability</h3>
              <p className="text-zinc-600 font-light mb-4">
                Mining shutdowns, export bans, trade restrictions from unstable regions
              </p>
              <div className="text-sm font-light text-zinc-500">
                Examples: DRC cobalt mines, Chilean lithium nationalization
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-zinc-200/50">
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-light text-zinc-900 mb-3">Price Volatility</h3>
              <p className="text-zinc-600 font-light mb-4">
                Sudden price spikes from demand surges or supply disruptions
              </p>
              <div className="text-sm font-light text-zinc-500">
                Recent: Lithium prices up 400% in 2022, down 70% in 2023
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-zinc-200/50">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-light text-zinc-900 mb-3">Concentration Risk</h3>
              <p className="text-zinc-600 font-light mb-4">
                Single countries or companies controlling majority of global supply
              </p>
              <div className="text-sm font-light text-zinc-500">
                Example: China controls 80% of rare earth processing
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Provide Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extralight text-zinc-900 mb-4 tracking-tight">
              What You Get
            </h2>
            <p className="text-lg text-zinc-600 font-light max-w-2xl mx-auto">
              Comprehensive intelligence platform for critical minerals sourcing
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-zinc-200/50">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-light text-zinc-900 mb-2">Real-Time Risk Scoring</h3>
                  <p className="text-sm font-light text-zinc-600">
                    Live risk scores (1-10) for lithium, cobalt, copper, and rare earths across 50+ producing regions
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-zinc-200/50">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-light text-zinc-900 mb-2">Geopolitical Monitoring</h3>
                  <p className="text-sm font-light text-zinc-600">
                    Track political instability, regulatory changes, and trade restrictions in key mining regions
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-zinc-200/50">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-light text-zinc-900 mb-2">Price Forecasting</h3>
                  <p className="text-sm font-light text-zinc-600">
                    6-month price predictions with confidence intervals based on supply/demand modeling
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-zinc-200/50">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-lg font-light text-zinc-900 mb-2">Early Warning Alerts</h3>
                  <p className="text-sm font-light text-zinc-600">
                    Instant notifications when risk scores spike or new threats emerge in your supply chain
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-zinc-200/50">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-light text-zinc-900 mb-2">Alternative Source Mapping</h3>
                  <p className="text-sm font-light text-zinc-600">
                    Identify backup suppliers and diversification opportunities when primary sources show elevated risk
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-zinc-200/50">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-light text-zinc-900 mb-2">Weekly Intelligence Briefings</h3>
                  <p className="text-sm font-light text-zinc-600">
                    Curated reports on supply chain developments, market movements, and strategic recommendations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables Section */}
      <section className="py-16 px-6 bg-white/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extralight text-zinc-900 mb-4 tracking-tight">
              Sample Deliverables
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/risk-report"
              className="bg-white rounded-xl p-6 shadow-lg border border-zinc-200/50 hover:shadow-xl transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-light text-zinc-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    Quarterly Risk Assessment Report
                  </h3>
                  <p className="text-sm font-light text-zinc-600 mb-3">
                    Comprehensive analysis of your critical minerals exposure with risk scores and recommendations
                  </p>
                  <div className="text-sm font-medium text-emerald-600 flex items-center gap-2">
                    View Sample Report
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>

            <Link
              href="/weekly-briefing-sample"
              className="bg-white rounded-xl p-6 shadow-lg border border-zinc-200/50 hover:shadow-xl transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-light text-zinc-900 mb-2 group-hover:text-blue-600 transition-colors">
                    Weekly Intelligence Briefing
                  </h3>
                  <p className="text-sm font-light text-zinc-600 mb-3">
                    Curated weekly updates on geopolitical developments, price movements, and supply disruptions
                  </p>
                  <div className="text-sm font-medium text-blue-600 flex items-center gap-2">
                    View Sample Briefing
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-emerald-600 to-emerald-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extralight text-white mb-6 tracking-tight">
            Ready to Secure Your Critical Minerals Supply Chain?
          </h2>
          <p className="text-xl font-light text-emerald-50 mb-8">
            Get started with a free risk assessment of your current sourcing strategy
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact"
              className="px-8 py-4 bg-white text-emerald-600 text-lg font-light rounded-lg hover:bg-zinc-50 transition-colors shadow-xl hover:shadow-2xl inline-flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Book Free Risk Assessment
            </Link>

            <Link
              href="/supply-chain-risk"
              className="px-8 py-4 bg-transparent text-white text-lg font-light rounded-lg hover:bg-emerald-800 transition-colors border-2 border-white inline-flex items-center justify-center gap-2"
            >
              Explore Platform Features
            </Link>
          </div>
        </div>
      </section>

      {/* Cross-Link to Compliance */}
      <section className="py-12 px-6 bg-zinc-100/50 border-t border-zinc-200">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-md border border-zinc-200/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-rose-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-light text-zinc-900 mb-2">
                  Need Urgent Compliance Help?
                </h3>
                <p className="text-zinc-600 font-light mb-4">
                  Check if your current suppliers are affected by the expanded BIS Entity List. Free compliance scan available.
                </p>
                <Link
                  href="/entity-list-scanner"
                  className="text-emerald-600 font-light hover:text-emerald-700 inline-flex items-center gap-2"
                >
                  Run Free Entity List Compliance Check
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
