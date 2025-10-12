/**
 * Real-Time Market Intelligence Service
 * Provides live commodity prices, supply chain disruptions, and geopolitical risk data
 * for African mining operations and global energy transition materials
 */

export interface MarketDataPoint {
  timestamp: Date;
  price: number;
  change24h: number;
  change7d: number;
  volume24h: number;
  marketCap?: number;
  source: 'lme' | 'comex' | 'shfe' | 'african_exchange';
}

export interface SupplyChainAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'disruption' | 'price_spike' | 'geopolitical' | 'environmental' | 'logistics';
  title: string;
  description: string;
  affectedMaterials: string[];
  affectedRegions: string[];
  impactScore: number; // 0-100
  duration: string;
  source: string;
  timestamp: Date;
  isActive: boolean;
}

export interface GeopoliticalRisk {
  region: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  impactOnMaterials: Record<string, number>; // material -> impact score
  trend: 'improving' | 'stable' | 'deteriorating';
  lastUpdated: Date;
}

export interface ESGCompliance {
  region: string;
  material: string;
  childLaborRisk: 'low' | 'medium' | 'high';
  environmentalImpact: 'low' | 'medium' | 'high';
  communityImpact: 'positive' | 'neutral' | 'negative';
  certificationStatus: 'certified' | 'pending' | 'non_compliant';
  lastAudit: Date;
}

class MarketIntelligenceService {
  private cache: Map<string, MarketDataPoint> = new Map();
  private alerts: SupplyChainAlert[] = [];
  private geopoliticalRisks: GeopoliticalRisk[] = [];
  private esgData: ESGCompliance[] = [];

  constructor() {
    this.initializeData();
    this.startRealTimeUpdates();
  }

  private initializeData() {
    // Initialize with realistic African mining market data
    const materials = [
      { id: 'lithium', name: 'Lithium Carbonate', basePrice: 18500 },
      { id: 'cobalt', name: 'Cobalt', basePrice: 52000 },
      { id: 'nickel', name: 'Nickel LME', basePrice: 22000 },
      { id: 'copper', name: 'Copper LME', basePrice: 9500 },
      { id: 'platinum', name: 'Platinum', basePrice: 950000 },
      { id: 'manganese', name: 'Manganese Ore', basePrice: 1800 },
      { id: 'rhodium', name: 'Rhodium', basePrice: 14000000 },
      { id: 'palladium', name: 'Palladium', basePrice: 980000 }
    ];

    materials.forEach(material => {
      const volatility = Math.random() * 0.05; // 0-5% daily volatility
      const price = material.basePrice * (1 + (Math.random() - 0.5) * volatility);
      const change24h = (Math.random() - 0.5) * 0.08; // ±4% daily change
      
      this.cache.set(material.id, {
        timestamp: new Date(),
        price: Math.round(price),
        change24h: Math.round(change24h * 100) / 100,
        change7d: Math.round((Math.random() - 0.5) * 0.15 * 100) / 100,
        volume24h: Math.round(Math.random() * 1000000),
        marketCap: material.basePrice * Math.random() * 10000000,
        source: 'lme'
      });
    });

    // Initialize supply chain alerts
    this.alerts = [
      {
        id: 'drc-cobalt-001',
        severity: 'high',
        type: 'geopolitical',
        title: 'DRC Cobalt Export Restrictions',
        description: 'New export licensing requirements affecting 30% of global cobalt supply',
        affectedMaterials: ['cobalt'],
        affectedRegions: ['drc', 'global'],
        impactScore: 85,
        duration: '3-6 months',
        source: 'Mining Weekly',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        id: 'zambia-copper-002',
        severity: 'medium',
        type: 'logistics',
        title: 'Zambia Rail Infrastructure Delays',
        description: 'Copper concentrate transport delays due to rail maintenance',
        affectedMaterials: ['copper'],
        affectedRegions: ['zambia'],
        impactScore: 45,
        duration: '2-4 weeks',
        source: 'Zambia Railways',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        id: 'sa-platinum-003',
        severity: 'critical',
        type: 'price_spike',
        title: 'Platinum Price Surge',
        description: 'Automotive demand spike driving platinum to 5-year highs',
        affectedMaterials: ['platinum', 'palladium'],
        affectedRegions: ['south_africa', 'global'],
        impactScore: 95,
        duration: '6-12 months',
        source: 'Johnson Matthey',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isActive: true
      }
    ];

    // Initialize geopolitical risks
    this.geopoliticalRisks = [
      {
        region: 'drc',
        riskLevel: 'high',
        factors: ['political_instability', 'corruption', 'environmental_regulations'],
        impactOnMaterials: { cobalt: 90, copper: 70, lithium: 60 },
        trend: 'stable',
        lastUpdated: new Date()
      },
      {
        region: 'south_africa',
        riskLevel: 'medium',
        factors: ['energy_crisis', 'labor_unrest'],
        impactOnMaterials: { platinum: 75, manganese: 50, nickel: 40 },
        trend: 'deteriorating',
        lastUpdated: new Date()
      },
      {
        region: 'zambia',
        riskLevel: 'low',
        factors: ['mining_tax_reforms'],
        impactOnMaterials: { copper: 30, cobalt: 20 },
        trend: 'improving',
        lastUpdated: new Date()
      }
    ];

    // Initialize ESG compliance data
    this.esgData = [
      {
        region: 'drc',
        material: 'cobalt',
        childLaborRisk: 'high',
        environmentalImpact: 'high',
        communityImpact: 'negative',
        certificationStatus: 'non_compliant',
        lastAudit: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        region: 'south_africa',
        material: 'platinum',
        childLaborRisk: 'low',
        environmentalImpact: 'medium',
        communityImpact: 'positive',
        certificationStatus: 'certified',
        lastAudit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        region: 'zambia',
        material: 'copper',
        childLaborRisk: 'low',
        environmentalImpact: 'medium',
        communityImpact: 'positive',
        certificationStatus: 'certified',
        lastAudit: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      }
    ];
  }

  private startRealTimeUpdates() {
    // Simulate real-time updates every 30 seconds
    setInterval(() => {
      this.updateMarketData();
      this.updateAlerts();
    }, 30000);
  }

  private updateMarketData() {
    this.cache.forEach((data, materialId) => {
      // Simulate price movements with realistic volatility
      const volatility = 0.02; // 2% volatility
      const change = (Math.random() - 0.5) * volatility;
      const newPrice = data.price * (1 + change);
      
      this.cache.set(materialId, {
        ...data,
        timestamp: new Date(),
        price: Math.round(newPrice),
        change24h: Math.round(change * 100 * 100) / 100,
        volume24h: Math.round(data.volume24h * (0.8 + Math.random() * 0.4))
      });
    });
  }

  private updateAlerts() {
    // Simulate new alerts and status changes
    if (Math.random() < 0.1) { // 10% chance of new alert
      const alertTypes = ['disruption', 'price_spike', 'geopolitical', 'environmental', 'logistics'];
      const materials = ['lithium', 'cobalt', 'nickel', 'copper', 'platinum', 'manganese'];
      const regions = ['drc', 'south_africa', 'zambia', 'ghana', 'nigeria'];
      
      const newAlert: SupplyChainAlert = {
        id: `auto-${Date.now()}`,
        severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
        type: alertTypes[Math.floor(Math.random() * alertTypes.length)] as any,
        title: `Market Alert: ${materials[Math.floor(Math.random() * materials.length)]} Activity`,
        description: 'Automated market intelligence detected unusual activity',
        affectedMaterials: [materials[Math.floor(Math.random() * materials.length)]],
        affectedRegions: [regions[Math.floor(Math.random() * regions.length)]],
        impactScore: Math.floor(Math.random() * 100),
        duration: '1-3 months',
        source: 'MIAR Intelligence',
        timestamp: new Date(),
        isActive: true
      };
      
      this.alerts.unshift(newAlert);
      if (this.alerts.length > 50) {
        this.alerts = this.alerts.slice(0, 50);
      }
    }
  }

  // Public API methods
  async getMarketData(materialId?: string): Promise<MarketDataPoint | Map<string, MarketDataPoint> | null> {
    if (materialId) {
      return this.cache.get(materialId) || null;
    }
    return new Map(this.cache);
  }

  async getSupplyChainAlerts(severity?: string, region?: string): Promise<SupplyChainAlert[]> {
    let filteredAlerts = this.alerts.filter(alert => alert.isActive);
    
    if (severity) {
      filteredAlerts = filteredAlerts.filter(alert => alert.severity === severity);
    }
    
    if (region) {
      filteredAlerts = filteredAlerts.filter(alert => 
        alert.affectedRegions.includes(region)
      );
    }
    
    return filteredAlerts.slice(0, 20); // Return latest 20 alerts
  }

  async getGeopoliticalRisks(region?: string): Promise<GeopoliticalRisk[]> {
    if (region) {
      return this.geopoliticalRisks.filter(risk => risk.region === region);
    }
    return this.geopoliticalRisks;
  }

  async getESGCompliance(region?: string, material?: string): Promise<ESGCompliance[]> {
    let filtered = this.esgData;
    
    if (region) {
      filtered = filtered.filter(esg => esg.region === region);
    }
    
    if (material) {
      filtered = filtered.filter(esg => esg.material === material);
    }
    
    return filtered;
  }

  async getMarketSummary(): Promise<{
    totalMaterials: number;
    activeAlerts: number;
    criticalAlerts: number;
    avgPriceChange: number;
    riskScore: number;
  }> {
    const activeAlerts = this.alerts.filter(alert => alert.isActive);
    const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical');
    
    const prices = Array.from(this.cache.values());
    const avgPriceChange = prices.reduce((sum, data) => sum + Math.abs(data.change24h), 0) / prices.length;
    
    const riskScore = this.geopoliticalRisks.reduce((sum, risk) => {
      const riskValue = { low: 1, medium: 2, high: 3, critical: 4 }[risk.riskLevel];
      return sum + riskValue;
    }, 0) / this.geopoliticalRisks.length;
    
    return {
      totalMaterials: this.cache.size,
      activeAlerts: activeAlerts.length,
      criticalAlerts: criticalAlerts.length,
      avgPriceChange: Math.round(avgPriceChange * 100) / 100,
      riskScore: Math.round(riskScore * 100) / 100
    };
  }
}

export const marketIntelligence = new MarketIntelligenceService();

