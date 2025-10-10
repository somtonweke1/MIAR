/**
 * Real-Time Materials Data Service
 *
 * Provides live commodity price data, supply chain disruption alerts,
 * and material availability forecasting for SC-GEP optimization
 */

import { EnhancedMaterial } from './sc-gep-enhanced';

export interface CommodityPrice {
  material: string;
  pricePerTonne: number;
  currency: string;
  timestamp: Date;
  source: 'LME' | 'COMEX' | 'SHFE' | 'MCX' | 'estimated';
  change24h: number; // percentage
  change7d: number; // percentage
  volatility: number; // standard deviation
}

export interface SupplyChainEvent {
  id: string;
  type: 'disruption' | 'policy_change' | 'new_source' | 'capacity_expansion' | 'mine_closure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedMaterials: string[];
  country: string;
  description: string;
  impact: string;
  startDate: Date;
  endDate?: Date;
  probabilityEstimate?: number;
}

export interface MaterialAvailabilityForecast {
  material: string;
  year: number;
  primarySupply: number; // tonnes
  secondarySupply: number; // recycled tonnes
  totalSupply: number;
  projectedDemand: number;
  supplyDeficit: number;
  confidence: number; // 0-1
  scenarios: {
    optimistic: number;
    baseline: number;
    pessimistic: number;
  };
}

export interface GeopoliticalRisk {
  country: string;
  materials: string[];
  riskScore: number; // 0-100
  factors: {
    political_stability: number;
    trade_restrictions: number;
    infrastructure: number;
    environmental_regulations: number;
    labor_relations: number;
  };
  trend: 'improving' | 'stable' | 'deteriorating';
  lastUpdated: Date;
}

export class RealTimeMaterialsService {
  private priceCache: Map<string, CommodityPrice> = new Map();
  private eventCache: SupplyChainEvent[] = [];
  private forecastCache: Map<string, MaterialAvailabilityForecast[]> = new Map();
  private riskCache: Map<string, GeopoliticalRisk> = new Map();
  private lastUpdateTime: Date = new Date();

  // Cache duration in milliseconds
  private readonly PRICE_CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
  private readonly EVENT_CACHE_DURATION = 60 * 60 * 1000; // 1 hour
  private readonly FORECAST_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Get real-time commodity prices for critical materials
   */
  public async getCommodityPrices(materials: string[]): Promise<Map<string, CommodityPrice>> {
    const prices = new Map<string, CommodityPrice>();

    for (const material of materials) {
      // Check cache first
      const cachedPrice = this.priceCache.get(material);
      if (cachedPrice && Date.now() - cachedPrice.timestamp.getTime() < this.PRICE_CACHE_DURATION) {
        prices.set(material, cachedPrice);
        continue;
      }

      // Fetch fresh data
      const price = await this.fetchCommodityPrice(material);
      this.priceCache.set(material, price);
      prices.set(material, price);
    }

    return prices;
  }

  /**
   * Fetch commodity price from external APIs
   * In production, this would integrate with LME, COMEX, etc.
   */
  private async fetchCommodityPrice(material: string): Promise<CommodityPrice> {
    // Simulated real-time prices with realistic fluctuations
    const basePrices: Record<string, number> = {
      lithium: 78000,
      cobalt: 34000,
      nickel: 18500,
      copper: 8500,
      graphite: 2800,
      silicon: 2200,
      aluminum: 2400,
      neodymium: 142000,
      dysprosium: 385000,
      steel: 850,
      concrete: 120,
      silver: 745000,
      platinum: 31500000,
      indium: 425000
    };

    const basePrice = basePrices[material] || 10000;
    const volatility = Math.random() * 0.15 + 0.05; // 5-20% volatility
    const currentPrice = basePrice * (1 + (Math.random() - 0.5) * volatility);

    const change24h = (Math.random() - 0.5) * 10; // -5% to +5%
    const change7d = (Math.random() - 0.5) * 20; // -10% to +10%

    return {
      material,
      pricePerTonne: Math.round(currentPrice),
      currency: 'USD',
      timestamp: new Date(),
      source: this.getPriceSource(material),
      change24h: parseFloat(change24h.toFixed(2)),
      change7d: parseFloat(change7d.toFixed(2)),
      volatility: parseFloat(volatility.toFixed(3))
    };
  }

  /**
   * Get price source for material
   */
  private getPriceSource(material: string): 'LME' | 'COMEX' | 'SHFE' | 'MCX' | 'estimated' {
    const lmeTraded = ['copper', 'aluminum', 'nickel', 'cobalt'];
    const comexTraded = ['copper', 'silver', 'platinum'];

    if (lmeTraded.includes(material)) return 'LME';
    if (comexTraded.includes(material)) return 'COMEX';
    return 'estimated';
  }

  /**
   * Get supply chain disruption events
   */
  public async getSupplyChainEvents(materialFilter?: string[]): Promise<SupplyChainEvent[]> {
    // Check cache
    if (this.eventCache.length > 0 &&
        Date.now() - this.lastUpdateTime.getTime() < this.EVENT_CACHE_DURATION) {
      return this.filterEvents(this.eventCache, materialFilter);
    }

    // Fetch fresh events
    const events = await this.fetchSupplyChainEvents();
    this.eventCache = events;
    this.lastUpdateTime = new Date();

    return this.filterEvents(events, materialFilter);
  }

  /**
   * Fetch supply chain events from news APIs and databases
   */
  private async fetchSupplyChainEvents(): Promise<SupplyChainEvent[]> {
    // Simulated events - in production would integrate with news APIs, trade data, etc.
    const currentEvents: SupplyChainEvent[] = [
      {
        id: 'event_001',
        type: 'disruption',
        severity: 'high',
        affectedMaterials: ['cobalt', 'copper'],
        country: 'Democratic Republic of Congo',
        description: 'Mining operations disrupted due to infrastructure damage',
        impact: 'Estimated 15% reduction in cobalt output for Q1 2024',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-03-31'),
        probabilityEstimate: 0.85
      },
      {
        id: 'event_002',
        type: 'policy_change',
        severity: 'medium',
        affectedMaterials: ['lithium'],
        country: 'Chile',
        description: 'New environmental regulations for lithium extraction',
        impact: 'Increased production costs by 12%, potential supply delays',
        startDate: new Date('2024-02-01'),
        probabilityEstimate: 0.95
      },
      {
        id: 'event_003',
        type: 'capacity_expansion',
        severity: 'low',
        affectedMaterials: ['lithium'],
        country: 'Australia',
        description: 'New lithium mine commissioned in Western Australia',
        impact: 'Additional 50,000 tonnes/year capacity by 2025',
        startDate: new Date('2024-01-10'),
        probabilityEstimate: 0.90
      },
      {
        id: 'event_004',
        type: 'disruption',
        severity: 'critical',
        affectedMaterials: ['neodymium', 'dysprosium'],
        country: 'China',
        description: 'Export restrictions on rare earth elements',
        impact: 'Global rare earth supply reduced by 20-30%',
        startDate: new Date('2024-01-20'),
        probabilityEstimate: 0.70
      },
      {
        id: 'event_005',
        type: 'mine_closure',
        severity: 'medium',
        affectedMaterials: ['nickel'],
        country: 'Indonesia',
        description: 'Temporary closure of nickel mines for environmental review',
        impact: '8% reduction in global nickel supply for 6 months',
        startDate: new Date('2024-02-05'),
        endDate: new Date('2024-08-05'),
        probabilityEstimate: 0.80
      }
    ];

    return currentEvents;
  }

  /**
   * Filter events by material
   */
  private filterEvents(events: SupplyChainEvent[], materialFilter?: string[]): SupplyChainEvent[] {
    if (!materialFilter || materialFilter.length === 0) {
      return events;
    }

    return events.filter(event =>
      event.affectedMaterials.some(material => materialFilter.includes(material))
    );
  }

  /**
   * Get material availability forecast
   */
  public async getMaterialForecast(material: string, years: number = 10): Promise<MaterialAvailabilityForecast[]> {
    // Check cache
    const cacheKey = `${material}_${years}`;
    const cached = this.forecastCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Generate forecast
    const forecast = await this.generateMaterialForecast(material, years);
    this.forecastCache.set(cacheKey, forecast);

    return forecast;
  }

  /**
   * Generate material availability forecast using supply/demand models
   */
  private async generateMaterialForecast(
    material: string,
    years: number
  ): Promise<MaterialAvailabilityForecast[]> {
    const forecasts: MaterialAvailabilityForecast[] = [];

    // Base supply levels (tonnes/year)
    const baseSupply: Record<string, number> = {
      lithium: 86000,
      cobalt: 180000,
      nickel: 2700000,
      copper: 20000000,
      graphite: 1300000,
      silicon: 8000000,
      neodymium: 7500,
      dysprosium: 1200
    };

    const currentYear = new Date().getFullYear();
    const supply = baseSupply[material] || 100000;

    // Growth rates based on EV and renewable energy expansion
    const demandGrowthRate = 0.15; // 15% annual demand growth
    const supplyGrowthRate = 0.08; // 8% annual supply growth

    for (let year = 0; year < years; year++) {
      const forecastYear = currentYear + year;
      const primarySupply = supply * Math.pow(1 + supplyGrowthRate, year);
      const secondarySupply = primarySupply * 0.05 * year; // Recycling ramps up
      const totalSupply = primarySupply + secondarySupply;
      const projectedDemand = supply * Math.pow(1 + demandGrowthRate, year);
      const supplyDeficit = Math.max(0, projectedDemand - totalSupply);

      forecasts.push({
        material,
        year: forecastYear,
        primarySupply: Math.round(primarySupply),
        secondarySupply: Math.round(secondarySupply),
        totalSupply: Math.round(totalSupply),
        projectedDemand: Math.round(projectedDemand),
        supplyDeficit: Math.round(supplyDeficit),
        confidence: Math.max(0.5, 0.95 - year * 0.05), // Confidence decreases over time
        scenarios: {
          optimistic: Math.round(totalSupply * 1.15),
          baseline: Math.round(totalSupply),
          pessimistic: Math.round(totalSupply * 0.85)
        }
      });
    }

    return forecasts;
  }

  /**
   * Get geopolitical risk assessment for countries
   */
  public async getGeopoliticalRisks(countries: string[]): Promise<Map<string, GeopoliticalRisk>> {
    const risks = new Map<string, GeopoliticalRisk>();

    for (const country of countries) {
      // Check cache
      const cached = this.riskCache.get(country);
      if (cached && Date.now() - cached.lastUpdated.getTime() < this.FORECAST_CACHE_DURATION) {
        risks.set(country, cached);
        continue;
      }

      // Generate risk assessment
      const risk = await this.assessGeopoliticalRisk(country);
      this.riskCache.set(country, risk);
      risks.set(country, risk);
    }

    return risks;
  }

  /**
   * Assess geopolitical risk for a country
   */
  private async assessGeopoliticalRisk(country: string): Promise<GeopoliticalRisk> {
    // Risk profiles by country (0-100 scale, higher = more risk)
    const riskProfiles: Record<string, any> = {
      'Democratic Republic of Congo': {
        materials: ['cobalt', 'copper'],
        factors: {
          political_stability: 35, // Low stability = high risk
          trade_restrictions: 60,
          infrastructure: 40,
          environmental_regulations: 55,
          labor_relations: 45
        },
        trend: 'stable' as const
      },
      'China': {
        materials: ['neodymium', 'dysprosium', 'graphite', 'silicon'],
        factors: {
          political_stability: 75,
          trade_restrictions: 70,
          infrastructure: 85,
          environmental_regulations: 65,
          labor_relations: 80
        },
        trend: 'deteriorating' as const
      },
      'Chile': {
        materials: ['lithium', 'copper'],
        factors: {
          political_stability: 70,
          trade_restrictions: 50,
          infrastructure: 75,
          environmental_regulations: 60,
          labor_relations: 55
        },
        trend: 'stable' as const
      },
      'Australia': {
        materials: ['lithium', 'nickel', 'cobalt'],
        factors: {
          political_stability: 90,
          trade_restrictions: 30,
          infrastructure: 85,
          environmental_regulations: 70,
          labor_relations: 75
        },
        trend: 'improving' as const
      },
      'Indonesia': {
        materials: ['nickel', 'cobalt'],
        factors: {
          political_stability: 65,
          trade_restrictions: 55,
          infrastructure: 60,
          environmental_regulations: 50,
          labor_relations: 60
        },
        trend: 'stable' as const
      },
      'South Africa': {
        materials: ['platinum', 'chromium', 'manganese'],
        factors: {
          political_stability: 60,
          trade_restrictions: 45,
          infrastructure: 65,
          environmental_regulations: 60,
          labor_relations: 50
        },
        trend: 'deteriorating' as const
      }
    };

    const profile = riskProfiles[country] || {
      materials: [],
      factors: {
        political_stability: 50,
        trade_restrictions: 50,
        infrastructure: 50,
        environmental_regulations: 50,
        labor_relations: 50
      },
      trend: 'stable' as const
    };

    // Calculate overall risk score (weighted average, inverted so higher = more risk)
    const factors = profile.factors;
    const riskScore = (
      (100 - factors.political_stability) * 0.30 +
      factors.trade_restrictions * 0.25 +
      (100 - factors.infrastructure) * 0.20 +
      factors.environmental_regulations * 0.15 +
      (100 - factors.labor_relations) * 0.10
    );

    return {
      country,
      materials: profile.materials,
      riskScore: Math.round(riskScore),
      factors,
      trend: profile.trend,
      lastUpdated: new Date()
    };
  }

  /**
   * Subscribe to real-time price updates (WebSocket)
   * Returns unsubscribe function
   */
  public subscribeToPriceUpdates(
    materials: string[],
    callback: (prices: Map<string, CommodityPrice>) => void
  ): () => void {
    // Simulated WebSocket connection
    const interval = setInterval(async () => {
      const prices = await this.getCommodityPrices(materials);
      callback(prices);
    }, 60000); // Update every minute

    // Return unsubscribe function
    return () => clearInterval(interval);
  }

  /**
   * Get comprehensive market intelligence report
   */
  public async getMarketIntelligence(materials: string[]): Promise<{
    prices: Map<string, CommodityPrice>;
    events: SupplyChainEvent[];
    forecasts: Map<string, MaterialAvailabilityForecast[]>;
    risks: Map<string, GeopoliticalRisk>;
    summary: {
      criticalAlerts: number;
      avgPriceChange24h: number;
      supplyRiskMaterials: string[];
      opportunityMaterials: string[];
    };
  }> {
    // Fetch all data in parallel
    const [prices, events, risks] = await Promise.all([
      this.getCommodityPrices(materials),
      this.getSupplyChainEvents(materials),
      this.getGeopoliticalRisks(this.getRelevantCountries(materials))
    ]);

    // Get forecasts
    const forecasts = new Map<string, MaterialAvailabilityForecast[]>();
    for (const material of materials) {
      forecasts.set(material, await this.getMaterialForecast(material, 10));
    }

    // Generate summary analytics
    const criticalAlerts = events.filter(e => e.severity === 'critical').length;

    let totalPriceChange = 0;
    prices.forEach(price => {
      totalPriceChange += price.change24h;
    });
    const avgPriceChange24h = totalPriceChange / prices.size;

    const supplyRiskMaterials: string[] = [];
    const opportunityMaterials: string[] = [];

    forecasts.forEach((forecast, material) => {
      const nearTermForecast = forecast[2]; // Year 2
      if (nearTermForecast.supplyDeficit > nearTermForecast.totalSupply * 0.1) {
        supplyRiskMaterials.push(material);
      }
    });

    prices.forEach((price, material) => {
      if (price.change7d < -10) { // Price dropped > 10%
        opportunityMaterials.push(material);
      }
    });

    return {
      prices,
      events,
      forecasts,
      risks,
      summary: {
        criticalAlerts,
        avgPriceChange24h: parseFloat(avgPriceChange24h.toFixed(2)),
        supplyRiskMaterials,
        opportunityMaterials
      }
    };
  }

  /**
   * Get relevant countries for materials
   */
  private getRelevantCountries(materials: string[]): string[] {
    const materialCountries: Record<string, string[]> = {
      cobalt: ['Democratic Republic of Congo', 'Australia', 'Indonesia'],
      lithium: ['Chile', 'Australia', 'Argentina'],
      nickel: ['Indonesia', 'Australia', 'Philippines'],
      neodymium: ['China', 'Australia'],
      dysprosium: ['China'],
      graphite: ['China', 'Mozambique'],
      copper: ['Chile', 'Peru', 'Democratic Republic of Congo']
    };

    const countries = new Set<string>();
    materials.forEach(material => {
      const materialCountryList = materialCountries[material] || [];
      materialCountryList.forEach(country => countries.add(country));
    });

    return Array.from(countries);
  }

  /**
   * Clear all caches
   */
  public clearCache(): void {
    this.priceCache.clear();
    this.eventCache = [];
    this.forecastCache.clear();
    this.riskCache.clear();
  }
}

export default RealTimeMaterialsService;
