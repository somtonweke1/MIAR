import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const materialType = searchParams.get('type') || 'all';
    const region = searchParams.get('region') || 'global';

    // Mock material flow data - in production, this would connect to real data sources
    const materialFlows = {
      lithium: {
        name: 'Lithium',
        type: 'critical',
        currentPrice: 15000, // $/tonne
        priceChange: 2.3, // %
        supply: {
          global: 86000, // tonnes/year
          africa: 8500,
          constraints: ['geopolitical', 'processing_capacity']
        },
        demand: {
          global: 95000, // tonnes/year
          africa: 12000,
          growth_rate: 18.5 // %/year
        },
        bottlenecks: [
          {
            location: 'DRC',
            severity: 'high',
            impact: 'Processing delays due to infrastructure constraints',
            duration: '6-12 months'
          },
          {
            location: 'South Africa',
            severity: 'medium',
            impact: 'Export restrictions affecting global supply',
            duration: '3-6 months'
          }
        ],
        stockLevels: {
          global: 45000, // tonnes
          africa: 5500,
          days_remaining: 172
        }
      },
      cobalt: {
        name: 'Cobalt',
        type: 'critical',
        currentPrice: 55000,
        priceChange: -1.2,
        supply: {
          global: 180000,
          africa: 165000,
          constraints: ['child_labor', 'environmental']
        },
        demand: {
          global: 175000,
          africa: 8000,
          growth_rate: 12.3
        },
        bottlenecks: [
          {
            location: 'DRC',
            severity: 'critical',
            impact: 'Ethical sourcing requirements limiting supply',
            duration: '12+ months'
          }
        ],
        stockLevels: {
          global: 25000,
          africa: 3200,
          days_remaining: 52
        }
      },
      nickel: {
        name: 'Nickel',
        type: 'critical',
        currentPrice: 18000,
        priceChange: 0.8,
        supply: {
          global: 3200000,
          africa: 180000,
          constraints: ['energy_costs', 'environmental']
        },
        demand: {
          global: 3100000,
          africa: 45000,
          growth_rate: 8.7
        },
        bottlenecks: [
          {
            location: 'South Africa',
            severity: 'medium',
            impact: 'Energy cost increases affecting production',
            duration: '3-9 months'
          }
        ],
        stockLevels: {
          global: 450000,
          africa: 28000,
          days_remaining: 53
        }
      },
      copper: {
        name: 'Copper',
        type: 'standard',
        currentPrice: 9000,
        priceChange: 1.5,
        supply: {
          global: 26000000,
          africa: 2100000,
          constraints: ['energy', 'water']
        },
        demand: {
          global: 25000000,
          africa: 850000,
          growth_rate: 3.2
        },
        bottlenecks: [
          {
            location: 'Zambia',
            severity: 'low',
            impact: 'Water scarcity affecting mining operations',
            duration: '2-4 months'
          }
        ],
        stockLevels: {
          global: 2800000,
          africa: 180000,
          days_remaining: 41
        }
      }
    };

    // Filter materials based on type
    let filteredMaterials = materialFlows;
    if (materialType !== 'all') {
      filteredMaterials = Object.fromEntries(
        Object.entries(materialFlows).filter(([_, material]: [string, any]) => 
          material.type === materialType
        )
      );
    }

    // Calculate aggregate metrics
    const aggregateMetrics = {
      totalSupply: Object.values(filteredMaterials).reduce((sum: number, material: any) => 
        sum + material.supply[region], 0),
      totalDemand: Object.values(filteredMaterials).reduce((sum: number, material: any) => 
        sum + material.demand[region], 0),
      totalStock: Object.values(filteredMaterials).reduce((sum: number, material: any) => 
        sum + material.stockLevels[region], 0),
      criticalBottlenecks: Object.values(filteredMaterials).reduce((count: number, material: any) => 
        count + material.bottlenecks.filter((b: any) => b.severity === 'critical' || b.severity === 'high').length, 0)
    };

    return NextResponse.json({
      success: true,
      materials: filteredMaterials,
      aggregateMetrics,
      region,
      timestamp: new Date().toISOString(),
      dataSource: 'MIAR Supply Chain Intelligence'
    });

  } catch (error) {
    console.error('Material Flow API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve material flow data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      material_id,
      scenario_type = 'forecast',
      time_horizon = 12,
      constraints = {}
    } = body;

    // Simulate material flow forecasting
    const forecastData = {
      material_id,
      scenario_type,
      time_horizon,
      forecasts: {
        supply: generateForecast('supply', time_horizon, constraints),
        demand: generateForecast('demand', time_horizon, constraints),
        price: generateForecast('price', time_horizon, constraints),
        stockLevels: generateForecast('stock', time_horizon, constraints)
      },
      riskFactors: [
        {
          factor: 'Geopolitical Risk',
          probability: 0.35,
          impact: 'high',
          description: 'Trade restrictions and export controls'
        },
        {
          factor: 'Environmental Regulations',
          probability: 0.28,
          impact: 'medium',
          description: 'Stricter environmental standards affecting mining'
        },
        {
          factor: 'Technology Disruption',
          probability: 0.15,
          impact: 'high',
          description: 'Alternative materials or recycling breakthroughs'
        }
      ],
      recommendations: [
        {
          type: 'supply_diversification',
          priority: 'high',
          description: 'Establish alternative supply sources outside current primary regions',
          impact: 'Reduce supply risk by 40-60%'
        },
        {
          type: 'stock_building',
          priority: 'medium',
          description: 'Increase strategic stock levels to 6 months of demand',
          impact: 'Provide buffer against short-term disruptions'
        },
        {
          type: 'recycling_investment',
          priority: 'medium',
          description: 'Invest in recycling infrastructure to reduce primary material dependence',
          impact: 'Reduce demand for primary materials by 15-25%'
        }
      ]
    };

    return NextResponse.json({
      success: true,
      forecast: forecastData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Material Forecast API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate material forecast',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function generateForecast(type: string, months: number, constraints: any) {
  const data = [];
  let baseValue = 100;
  let trend = 1.02; // 2% monthly growth
  let volatility = 0.05;

  // Adjust based on constraints
  if (constraints.supply_constraint) {
    trend *= 0.95; // 5% reduction in growth
    volatility *= 1.5; // Increased volatility
  }

  for (let i = 0; i < months; i++) {
    const randomFactor = 1 + (Math.random() - 0.5) * volatility;
    baseValue *= trend * randomFactor;
    
    data.push({
      month: i + 1,
      value: Math.round(baseValue * 100) / 100,
      confidence_interval: {
        lower: Math.round(baseValue * 0.9 * 100) / 100,
        upper: Math.round(baseValue * 1.1 * 100) / 100
      }
    });
  }

  return data;
}
