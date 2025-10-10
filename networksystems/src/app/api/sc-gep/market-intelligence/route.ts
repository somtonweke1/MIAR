import { NextRequest, NextResponse } from 'next/server';
import RealTimeMaterialsService from '@/services/real-time-materials-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const materialsParam = searchParams.get('materials');
    const dataType = searchParams.get('type') || 'all';

    const materials = materialsParam ? materialsParam.split(',') : [
      'lithium',
      'cobalt',
      'nickel',
      'copper',
      'graphite',
      'silicon',
      'neodymium',
      'dysprosium'
    ];

    const service = new RealTimeMaterialsService();

    // Return specific data type or complete intelligence report
    switch (dataType) {
      case 'prices':
        const prices = await service.getCommodityPrices(materials);
        return NextResponse.json({
          success: true,
          data: Object.fromEntries(prices),
          timestamp: new Date().toISOString()
        });

      case 'events':
        const events = await service.getSupplyChainEvents(materials);
        return NextResponse.json({
          success: true,
          data: events,
          timestamp: new Date().toISOString()
        });

      case 'forecasts':
        const forecasts = new Map();
        for (const material of materials) {
          forecasts.set(material, await service.getMaterialForecast(material, 10));
        }
        return NextResponse.json({
          success: true,
          data: Object.fromEntries(forecasts),
          timestamp: new Date().toISOString()
        });

      case 'risks':
        const countries = ['Democratic Republic of Congo', 'China', 'Chile', 'Australia', 'Indonesia', 'South Africa'];
        const risks = await service.getGeopoliticalRisks(countries);
        return NextResponse.json({
          success: true,
          data: Object.fromEntries(risks),
          timestamp: new Date().toISOString()
        });

      case 'all':
      default:
        const intelligence = await service.getMarketIntelligence(materials);
        return NextResponse.json({
          success: true,
          data: {
            prices: Object.fromEntries(intelligence.prices),
            events: intelligence.events,
            forecasts: Object.fromEntries(intelligence.forecasts),
            risks: Object.fromEntries(intelligence.risks),
            summary: intelligence.summary
          },
          timestamp: new Date().toISOString()
        });
    }

  } catch (error) {
    console.error('Market Intelligence API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch market intelligence',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, materials = [] } = body;

    const service = new RealTimeMaterialsService();

    if (action === 'subscribe') {
      // In a real implementation, this would establish a WebSocket connection
      return NextResponse.json({
        success: true,
        message: 'WebSocket subscription endpoint - use /ws/market-data for live updates',
        subscriptionId: `sub_${Date.now()}`
      });
    }

    if (action === 'clear_cache') {
      service.clearCache();
      return NextResponse.json({
        success: true,
        message: 'Market intelligence cache cleared'
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('Market Intelligence API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
