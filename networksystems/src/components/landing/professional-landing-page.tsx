'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle, TrendingUp, Globe, DollarSign, Shield, Target, Users, Calendar, Mail, Phone } from 'lucide-react';

interface ProfessionalLandingPageProps {
  onGetStarted: () => void;
}

export default function ProfessionalLandingPage({ onGetStarted }: ProfessionalLandingPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log('Demo request submitted:', formData);
    // For now, just proceed to login
    onGetStarted();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-zinc-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-zinc-900 text-white px-4 py-2 text-sm font-light tracking-wide rounded">
                MIAR
              </div>
              <span className="text-lg font-extralight text-zinc-900">Mining Intelligence & African Research</span>
            </div>
            <button
              onClick={onGetStarted}
              className="bg-zinc-900 text-white px-6 py-2 rounded font-light hover:bg-zinc-800 transition-colors"
            >
              Client Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-extralight text-zinc-900 mb-6 tracking-tight">
            We Help Mining Executives Make
            <span className="block text-emerald-600 font-light">$100M+ Decisions with Confidence</span>
          </h1>
          <p className="text-xl text-zinc-600 mb-8 font-light max-w-3xl mx-auto leading-relaxed">
            MIAR is the first comprehensive mining intelligence platform that transforms complex African mining data
            into actionable insights for strategic decision-making.
          </p>
          <div className="bg-emerald-50/80 border border-emerald-200/50 rounded-xl p-6 max-w-2xl mx-auto mb-12">
            <div className="text-2xl font-light text-emerald-800 mb-2">$16 Billion Opportunity Identified</div>
            <p className="text-emerald-700 font-light">3.2 million ounces of recoverable gold in Johannesburg tailings alone</p>
          </div>
          <button
            onClick={() => document.getElementById('demo-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-zinc-900 text-white px-8 py-4 rounded-lg font-light text-lg hover:bg-zinc-800 transition-colors inline-flex items-center space-x-2"
          >
            <span>Request Strategic Briefing</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 px-6 bg-white/60">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extralight text-zinc-900 text-center mb-16">Why Leading Mining Companies Choose MIAR</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-emerald-100/60 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-light text-zinc-900 mb-4">Revenue Generation</h3>
              <p className="text-zinc-600 font-light">Identify $16B+ in previously hidden tailings opportunities and optimize existing operations for maximum yield.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100/60 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-light text-zinc-900 mb-4">Risk Mitigation</h3>
              <p className="text-zinc-600 font-light">Avoid $500M+ losses through early warning systems on supply chain disruptions and geopolitical risks.</p>
            </div>
            <div className="text-center">
              <div className="bg-violet-100/60 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-violet-600" />
              </div>
              <h3 className="text-xl font-light text-zinc-900 mb-4">Strategic Advantage</h3>
              <p className="text-zinc-600 font-light">Access exclusive intelligence on 68% of global critical mineral flows and reduce due diligence from 6 months to 2 weeks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extralight text-zinc-900 text-center mb-16">Strategic Investment Tiers</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Tier */}
            <div className="border border-zinc-200/50 rounded-2xl p-8 bg-white/60 backdrop-blur-sm">
              <h3 className="text-2xl font-light text-zinc-900 mb-2">Starter</h3>
              <div className="text-3xl font-extralight text-zinc-900 mb-6">$2,500<span className="text-lg text-zinc-500">/month</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-zinc-600 font-light">Basic network analysis</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-zinc-600 font-light">Limited mine coverage</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-zinc-600 font-light">Standard reports</span>
                </li>
              </ul>
              <button className="w-full border border-zinc-300 text-zinc-700 py-3 rounded-lg font-light hover:bg-zinc-50 transition-colors">
                Contact Sales
              </button>
            </div>

            {/* Professional Tier */}
            <div className="border border-emerald-300 rounded-2xl p-8 bg-emerald-50/40 backdrop-blur-sm relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-light">
                Most Popular
              </div>
              <h3 className="text-2xl font-light text-zinc-900 mb-2">Professional</h3>
              <div className="text-3xl font-extralight text-zinc-900 mb-6">$15,000<span className="text-lg text-zinc-500">/month</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-zinc-600 font-light">Full African network access</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-zinc-600 font-light">Real-time intelligence feeds</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-zinc-600 font-light">Custom analysis requests</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-zinc-600 font-light">Priority support</span>
                </li>
              </ul>
              <button className="w-full bg-emerald-600 text-white py-3 rounded-lg font-light hover:bg-emerald-700 transition-colors">
                Start Free Trial
              </button>
            </div>

            {/* Enterprise Tier */}
            <div className="border border-zinc-200/50 rounded-2xl p-8 bg-white/60 backdrop-blur-sm">
              <h3 className="text-2xl font-light text-zinc-900 mb-2">Enterprise</h3>
              <div className="text-3xl font-extralight text-zinc-900 mb-6">$50,000+<span className="text-lg text-zinc-500">/month</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-zinc-600 font-light">White-glove service</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-zinc-600 font-light">Custom integrations</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-zinc-600 font-light">Strategic advisory calls</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-zinc-600 font-light">Dedicated account manager</span>
                </li>
              </ul>
              <button className="w-full border border-zinc-300 text-zinc-700 py-3 rounded-lg font-light hover:bg-zinc-50 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Target Companies */}
      <section className="py-16 px-6 bg-white/60">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extralight text-zinc-900 text-center mb-16">Trusted by Industry Leaders</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              'Barrick Gold', 'AngloGold Ashanti', 'Harmony Gold', 'Sibanye-Stillwater',
              'First Quantum Minerals', 'Ivanhoe Mines', 'African Rainbow Minerals', 'Gold Fields'
            ].map((company, index) => (
              <div key={index} className="text-center p-6 border border-zinc-200/50 rounded-xl bg-white/40">
                <div className="text-lg font-light text-zinc-700">{company}</div>
                <div className="text-sm text-zinc-500 mt-2">$500M+ Market Cap</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Streams */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extralight text-zinc-900 text-center mb-16">Multiple Revenue Opportunities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/60 border border-zinc-200/50 rounded-xl p-6">
              <h3 className="text-xl font-light text-zinc-900 mb-3">SaaS Subscriptions</h3>
              <div className="text-2xl font-extralight text-emerald-600 mb-2">$15K-50K/month</div>
              <p className="text-zinc-600 font-light">Recurring revenue from platform access</p>
            </div>
            <div className="bg-white/60 border border-zinc-200/50 rounded-xl p-6">
              <h3 className="text-xl font-light text-zinc-900 mb-3">Custom Intelligence</h3>
              <div className="text-2xl font-extralight text-emerald-600 mb-2">$25K-100K</div>
              <p className="text-zinc-600 font-light">One-time strategic analysis reports</p>
            </div>
            <div className="bg-white/60 border border-zinc-200/50 rounded-xl p-6">
              <h3 className="text-xl font-light text-zinc-900 mb-3">Strategic Advisory</h3>
              <div className="text-2xl font-extralight text-emerald-600 mb-2">$500K+</div>
              <p className="text-zinc-600 font-light">Consulting engagements</p>
            </div>
            <div className="bg-white/60 border border-zinc-200/50 rounded-xl p-6">
              <h3 className="text-xl font-light text-zinc-900 mb-3">API Access</h3>
              <div className="text-2xl font-extralight text-emerald-600 mb-2">$10K+/month</div>
              <p className="text-zinc-600 font-light">Data feeds for trading firms</p>
            </div>
            <div className="bg-white/60 border border-zinc-200/50 rounded-xl p-6">
              <h3 className="text-xl font-light text-zinc-900 mb-3">Market Research</h3>
              <div className="text-2xl font-extralight text-emerald-600 mb-2">$50K+</div>
              <p className="text-zinc-600 font-light">Quarterly industry reports</p>
            </div>
            <div className="bg-white/60 border border-zinc-200/50 rounded-xl p-6">
              <h3 className="text-xl font-light text-zinc-900 mb-3">Partnership Revenue</h3>
              <div className="text-2xl font-extralight text-emerald-600 mb-2">Variable</div>
              <p className="text-zinc-600 font-light">McKinsey, Bloomberg partnerships</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Request Form */}
      <section id="demo-form" className="py-20 px-6 bg-zinc-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extralight text-white mb-6">Request Your Strategic Briefing</h2>
            <p className="text-xl text-zinc-300 font-light">
              See how MIAR can identify $100M+ opportunities in your operational regions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-light text-white mb-6">What You'll Learn:</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-emerald-400 mt-0.5" />
                  <span className="text-zinc-300 font-light">Hidden tailings opportunities in your regions</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-emerald-400 mt-0.5" />
                  <span className="text-zinc-300 font-light">Supply chain vulnerabilities and mitigation strategies</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-emerald-400 mt-0.5" />
                  <span className="text-zinc-300 font-light">Network analysis of your competitive positioning</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-emerald-400 mt-0.5" />
                  <span className="text-zinc-300 font-light">ROI projections for identified opportunities</span>
                </li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-2xl p-8">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-light text-zinc-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-zinc-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-zinc-700 mb-2">Business Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-zinc-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-zinc-700 mb-2">Current Mining Challenges</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="What are your biggest challenges in African mining operations or investment decisions?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white py-4 rounded-lg font-light text-lg hover:bg-emerald-700 transition-colors inline-flex items-center justify-center space-x-2"
                >
                  <span>Schedule Strategic Briefing</span>
                  <Calendar className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-white text-zinc-900 px-4 py-2 text-sm font-light tracking-wide rounded">
                  MIAR
                </div>
              </div>
              <p className="text-zinc-400 font-light">
                Mining Intelligence & African Research - Transforming complex mining data into strategic advantage.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-light mb-4">Platform</h4>
              <ul className="space-y-2 text-zinc-400 font-light">
                <li>Network Analysis</li>
                <li>Real-time Intelligence</li>
                <li>Strategic Advisory</li>
                <li>API Access</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-light mb-4">Company</h4>
              <ul className="space-y-2 text-zinc-400 font-light">
                <li>About Us</li>
                <li>Careers</li>
                <li>Partners</li>
                <li>News</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-light mb-4">Contact</h4>
              <div className="space-y-2 text-zinc-400 font-light">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>hello@miar.ai</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-zinc-500 font-light">
            <p>&copy; 2024 MIAR. All rights reserved. Built for the global mining industry.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}