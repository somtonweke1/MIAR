'use client';

import React, { useState } from 'react';
import { PublicNav } from '@/components/navigation/public-nav';
import {
  AlertTriangle,
  TrendingUp,
  Shield,
  Globe,
  Zap,
  CheckCircle,
  ArrowRight,
  MapPin,
  BarChart3,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function SupplyChainRiskPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with email service
    setSubmitted(true);
  };

  const riskData = [
    {
      mineral: 'Cobalt',
      risk: 7.2,
      trend: 'increasing',
      primarySource: 'DRC',
      concern: 'Political instability, production concentration',
      color: 'rose'
    },
    {
      mineral: 'Lithium',
      risk: 5.8,
      trend: 'stable',
      primarySource: 'Chile/Australia',
      concern: 'Water regulations, price volatility',
      color: 'amber'
    },
    {
      mineral: 'Copper',
      risk: 6.1,
      trend: 'increasing',
      primarySource: 'Zambia/Chile',
      concern: 'Infrastructure bottlenecks, energy costs',
      color: 'orange'
    },
    {
      mineral: 'Rare Earths',
      risk: 8.5,
      trend: 'critical',
      primarySource: 'China',
      concern: 'Geopolitical dependency, export controls',
      color: 'rose'
    }
  ];

  const useCases = [
    {
      icon: Zap,
      title: 'Energy & Utilities',
      description: 'Ensure reliable mineral supplies for battery storage, grid infrastructure, and renewable energy projects.',
      companies: 'Constellation, NextEra, Duke Energy'
    },
    {
      icon: BarChart3,
      title: 'Manufacturing & Auto',
      description: 'Mitigate EV battery supply chain risks and secure critical materials for production continuity.',
      companies: 'Tesla, Ford, GM, LG Energy'
    },
    {
      icon: Shield,
      title: 'Defense & Aerospace',
      description: 'Monitor rare earth element supply chains critical for defense systems and aerospace applications.',
      companies: 'Lockheed, Raytheon, Boeing'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100">
      <PublicNav />

      {/* Hero Section */}
      <section className="bg-white/95 backdrop-blur-md border-b border-zinc-200/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-700 px-4 py-2 rounded-full text-sm font-light mb-6">
              <AlertTriangle className="w-4 h-4" />
              68% of critical minerals flow through African supply chains
            </div>

            <h1 className="text-5xl font-extralight tracking-tight text-zinc-900 mb-6">
              Don't Let Critical Mineral Shortages Derail Your Energy Projects
            </h1>

            <p className="text-xl font-light text-zinc-600 mb-8 leading-relaxed">
              Supply chain risk intelligence for lithium, cobalt, copper, and rare earth elements.
              Research-grade intelligence mapping the world's most critical mineral flows.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link href="#briefing">
                <Button size="lg" className="text-lg px-8 py-6">
                  Get Free Risk Briefing
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  View Live Risk Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live Risk Dashboard */}
      <section id="demo" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extralight tracking-tight text-zinc-900 mb-4">
              Live Critical Minerals Risk Monitor
            </h2>
            <p className="text-lg font-light text-zinc-600">
              Real-time risk scores based on political stability, infrastructure, production concentration, and market dynamics
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {riskData.map((item) => (
              <Card key={item.mineral} className="p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-extralight text-zinc-900">{item.mineral}</h3>
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium uppercase tracking-wide ${
                        item.color === 'rose' ? 'bg-rose-100 text-rose-700' :
                        item.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                        item.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {item.trend}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-light text-zinc-600">
                      <MapPin className="w-4 h-4" />
                      Primary: {item.primarySource}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-4xl font-extralight ${
                      item.color === 'rose' ? 'text-rose-600' :
                      item.color === 'amber' ? 'text-amber-600' :
                      item.color === 'orange' ? 'text-orange-600' :
                      'text-rose-600'
                    }`}>
                      {item.risk}
                    </div>
                    <div className="text-xs font-light text-zinc-500">Risk Score</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-200/50">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className={`w-4 h-4 mt-1 flex-shrink-0 ${
                      item.color === 'rose' ? 'text-rose-600' :
                      item.color === 'amber' ? 'text-amber-600' :
                      item.color === 'orange' ? 'text-orange-600' :
                      'text-rose-600'
                    }`} />
                    <p className="text-sm font-light text-zinc-700">{item.concern}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-8 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl">
                <Globe className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <Link href="/" className="group cursor-pointer block mb-4">
                  <h3 className="text-xl font-light text-zinc-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    Comprehensive African Supply Chain Intelligence
                  </h3>
                  <p className="text-zinc-700 font-light group-hover:text-zinc-900 transition-colors">
                    We track 127 mining operations, 45 processing facilities, and 23 critical trade routes across 8 African countries -
                    representing 68% of global cobalt, 40% of manganese, and 25% of lithium reserves.
                  </p>
                </Link>
                <Link href="/decision-center">
                  <Button variant="outline" className="bg-white">
                    Explore Full Intelligence Platform
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Removed "Built for Critical Infrastructure" section */}

      {/* Weekly Briefing Signup */}
      <section id="briefing" className="py-20 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extralight tracking-tight mb-4">
              Get the Weekly Critical Minerals Risk Briefing
            </h2>
            <p className="text-xl font-light text-zinc-300">
              Free for a limited time. Trusted by procurement and risk teams at leading energy companies.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
              <div className="flex gap-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@company.com"
                  className="flex-1 px-6 py-4 rounded-lg text-zinc-900 font-light focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 px-8"
                >
                  Subscribe
                  <Mail className="ml-2 w-5 h-5" />
                </Button>
              </div>
              <p className="text-sm font-light text-zinc-400 mt-4 text-center">
                Weekly insights on supply chain disruptions, price volatility, and alternative sourcing options
              </p>
            </form>
          ) : (
            <Card className="max-w-xl mx-auto p-8 bg-white/10 backdrop-blur-sm border-white/20">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-2xl font-light mb-2">You're subscribed!</h3>
                <p className="font-light text-zinc-300">
                  Check your email for this week's briefing. We'll send updates every Monday at 9am EST.
                </p>
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* Custom Assessment CTA */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-12 bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
            <div className="text-center">
              <h2 className="text-3xl font-extralight tracking-tight text-zinc-900 mb-4">
                Need a Custom Supply Chain Risk Assessment?
              </h2>
              <p className="text-lg font-light text-zinc-700 mb-8 max-w-2xl mx-auto">
                Get a comprehensive analysis of your specific critical mineral supply chains,
                including alternative sourcing recommendations, disruption probabilities, and cost impact scenarios.
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="text-left">
                  <div className="flex items-center gap-2 text-sm font-light text-zinc-600 mb-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Custom risk modeling for your projects
                  </div>
                  <div className="flex items-center gap-2 text-sm font-light text-zinc-600 mb-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Alternative sourcing strategies
                  </div>
                  <div className="flex items-center gap-2 text-sm font-light text-zinc-600">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    2-week delivery, $5,000 per assessment
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <a href="mailto:somton@jhu.edu?subject=Custom Supply Chain Risk Assessment">
                  <Button size="lg" className="text-lg px-8 py-6">
                    Request Custom Assessment
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </a>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Research Credibility */}
      {/* Removed academic branding section */}

      {/* Cross-Links to Other Tools */}
      <section className="py-12 px-6 bg-zinc-100/50 border-t border-zinc-200">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* BIS Entity List Scanner */}
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

          {/* PFAS Compliance Engine */}
          <div className="bg-white rounded-xl p-8 shadow-md border border-zinc-200/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-light text-zinc-900 mb-2">
                  PFAS Rapid Compliance Engine for Municipal Water Safety
                </h3>
                <p className="text-zinc-600 font-light mb-4">
                  Convert raw PFAS sampling data into actionable compliance decisions. Track EPA MCL exceedances, evaluate treatment options, simulate compliance costs — all guided by regulatory requirements.
                </p>
                <Link
                  href="/pfas-scanner"
                  className="text-blue-600 font-light hover:text-blue-700 inline-flex items-center gap-2"
                >
                  Launch PFAS Scanner
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
