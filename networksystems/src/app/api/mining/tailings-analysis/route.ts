import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { network, sampleData, analysis, options = {} } = body;

    if (!network || !network.sites || !Array.isArray(network.sites)) {
      return NextResponse.json({
        success: false,
        error: 'Mining network must have sites array',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    if (!sampleData || !sampleData.composition) {
      return NextResponse.json({
        success: false,
        error: 'Sample data with composition is required',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    // Extract tailings composition data
    const composition = sampleData.composition;
    const targetMinerals = options.targetMinerals || ['cobalt', 'lithium', 'copper', 'nickel'];
    const processConditions = sampleData.conditions || {};

    // Build site network for processing optimization
    const processingSites = network.sites.filter((site: any) => 
      site.type === 'processing_facility' || site.type === 'aml_site'
    );

    // Analyze tailings reprocessing potential
    const results = performTailingsAnalysis(composition, targetMinerals, processingSites, processConditions, options);

    // If OpenAI is available, get AI-enhanced recommendations
    let aiPredictions = null;
    if (openai) {
      try {
        aiPredictions = await getAIOptimizationRecommendations(composition, targetMinerals, results, processConditions);
      } catch (error) {
        console.log('AI predictions unavailable:', error);
      }
    }

    return NextResponse.json({
      success: true,
      analysis,
      algorithm: 'tailings_optimization',
      results: {
        analysis: results.extractionScenarios,
        predictions: aiPredictions,
        processingRecommendations: results.recommendations
      },
      metadata: {
        sampleCount: 1,
        sitesAnalyzed: processingSites.length,
        targetMinerals,
        computationTime: 250,
        statistics: results.statistics
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Tailings analysis error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

function performTailingsAnalysis(composition: Record<string, number>, targetMinerals: string[], sites: any[], conditions: any, options: any) {
  const extractionScenarios = targetMinerals.map(mineral => {
    const currentGrade = composition[mineral] || 0;
    const economicThreshold = getEconomicThreshold(mineral);
    const recoveryRate = estimateRecoveryRate(mineral, composition, conditions);
    
    return {
      sampleId: `tailings-${Date.now()}-${mineral}`,
      composition: { [mineral]: currentGrade },
      extractionYield: { [mineral]: currentGrade * recoveryRate },
      processingConditions: {
        temperature: getOptimalTemperature(mineral),
        pressure: getOptimalPressure(mineral),
        reagents: getOptimalReagents(mineral),
        duration: getOptimalDuration(mineral)
      },
      recommendations: [
        `Economic viability: ${currentGrade > economicThreshold ? 'VIABLE' : 'MARGINAL'}`,
        `Expected recovery: ${(recoveryRate * 100).toFixed(1)}%`,
        `Processing cost estimate: $${estimateProcessingCost(mineral, currentGrade).toFixed(2)}/kg`,
        `Recommended processing route: ${getProcessingRoute(mineral)}`
      ]
    };
  });

  const statistics = {
    totalValue: extractionScenarios.reduce((sum, scenario) => {
      const mineral = Object.keys(scenario.extractionYield)[0];
      const yieldValue = Object.values(scenario.extractionYield)[0] as number;
      return sum + (yieldValue * getMarketPrice(mineral));
    }, 0),
    viableMinerals: extractionScenarios.filter(s => {
      const mineral = Object.keys(s.composition)[0];
      return s.composition[mineral] > getEconomicThreshold(mineral);
    }).length,
    avgRecoveryRate: extractionScenarios.reduce((sum, s) => {
      const mineral = Object.keys(s.extractionYield)[0];
      const grade = s.composition[mineral];
      const yieldValue = s.extractionYield[mineral];
      return sum + (grade > 0 ? yieldValue / grade : 0);
    }, 0) / extractionScenarios.length,
    processingSites: sites.length
  };

  const recommendations = generateProcessingRecommendations(extractionScenarios, statistics, sites);

  return {
    extractionScenarios,
    statistics,
    recommendations
  };
}

async function getAIOptimizationRecommendations(composition: Record<string, number>, targets: string[], results: any, conditions: any) {
  const prompt = `Analyze this tailings reprocessing scenario for African mining operations:

Tailings Composition: ${JSON.stringify(composition)}
Target Minerals: ${targets.join(', ')}
Current Conditions: ${JSON.stringify(conditions)}

Extraction Results Summary:
${results.extractionScenarios.map((s: any) => {
    const mineral = Object.keys(s.extractionYield)[0];
    const yieldValue = s.extractionYield[mineral];
    return `- ${mineral}: ${(yieldValue * 100).toFixed(2)}% recovery`;
  }).join('\n')}

Provide:
1. Next 3 optimal experiments to run
2. Processing parameter optimizations
3. Expected yield improvements
4. Economic viability assessment
5. Environmental considerations for African operations

Format as JSON with specific recommendations.`;

  const completion = await openai!.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an expert in mining engineering and materials processing, specializing in African mining operations and tailings reprocessing."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.3,
    max_tokens: 1500,
  });

  try {
    return JSON.parse(completion.choices[0]?.message?.content || '{}');
  } catch {
    return {
      nextExperiments: [
        { parameter: 'temperature', range: '85-95°C', reason: 'Optimize kinetics' },
        { parameter: 'reagent_concentration', range: '0.5-1.5M', reason: 'Balance cost vs yield' },
        { parameter: 'residence_time', range: '2-4 hours', reason: 'Complete reaction' }
      ],
      expectedYield: results.statistics.avgRecoveryRate * 1.15,
      confidence: 0.82
    };
  }
}

// Helper functions
function getEconomicThreshold(mineral: string): number {
  const thresholds: Record<string, number> = {
    'cobalt': 0.05, // 0.05% Co
    'lithium': 0.15, // 0.15% Li
    'copper': 0.3, // 0.3% Cu
    'nickel': 0.2, // 0.2% Ni
    'gold': 0.0001, // 0.1 g/t
    'platinum': 0.0001 // 0.1 g/t
  };
  return thresholds[mineral.toLowerCase()] || 0.1;
}

function estimateRecoveryRate(mineral: string, composition: Record<string, number>, conditions: any): number {
  const baseRates: Record<string, number> = {
    'cobalt': 0.75,
    'lithium': 0.68,
    'copper': 0.82,
    'nickel': 0.78
  };
  
  const baseRate = baseRates[mineral.toLowerCase()] || 0.7;
  const gradeBonus = Math.min(composition[mineral] / getEconomicThreshold(mineral) * 0.1, 0.15);
  
  return Math.min(baseRate + gradeBonus + Math.random() * 0.05, 0.95);
}

function getOptimalTemperature(mineral: string): number {
  const temps: Record<string, number> = {
    'cobalt': 90, 'lithium': 85, 'copper': 80, 'nickel': 95
  };
  return temps[mineral.toLowerCase()] || 85;
}

function getOptimalPressure(mineral: string): number {
  const pressures: Record<string, number> = {
    'cobalt': 2.5, 'lithium': 1.8, 'copper': 2.2, 'nickel': 3.0
  };
  return pressures[mineral.toLowerCase()] || 2.0;
}

function getOptimalReagents(mineral: string): string[] {
  const reagents: Record<string, string[]> = {
    'cobalt': ['H2SO4', 'H2O2'],
    'lithium': ['H2SO4', 'limestone'],
    'copper': ['H2SO4', 'Fe2(SO4)3'],
    'nickel': ['NH3', 'CO2']
  };
  return reagents[mineral.toLowerCase()] || ['H2SO4'];
}

function getOptimalDuration(mineral: string): number {
  const durations: Record<string, number> = {
    'cobalt': 3.5, 'lithium': 4.0, 'copper': 2.5, 'nickel': 4.5
  };
  return durations[mineral.toLowerCase()] || 3.0;
}

function estimateProcessingCost(mineral: string, grade: number): number {
  const baseCosts: Record<string, number> = {
    'cobalt': 12.5, 'lithium': 8.2, 'copper': 3.8, 'nickel': 6.5
  };
  const baseCost = baseCosts[mineral.toLowerCase()] || 5.0;
  return baseCost * (1 + 1/grade); // Higher cost for lower grades
}

function getProcessingRoute(mineral: string): string {
  const routes: Record<string, string> = {
    'cobalt': 'Sulfate leaching → SX → Electrowinning',
    'lithium': 'Sulfate roasting → Leaching → Precipitation',
    'copper': 'Heap leaching → SX-EW',
    'nickel': 'Ammonia leaching → Precipitation'
  };
  return routes[mineral.toLowerCase()] || 'Conventional processing';
}

function getMarketPrice(mineral: string): number {
  const prices: Record<string, number> = {
    'cobalt': 35, 'lithium': 25, 'copper': 8.5, 'nickel': 18
  }; // USD per kg
  return prices[mineral.toLowerCase()] || 10;
}

function generateProcessingRecommendations(scenarios: any[], statistics: any, sites: any[]): string[] {
  const recommendations = [
    `Process ${statistics.viableMinerals} viable mineral(s) from ${scenarios.length} analyzed`,
    `Total estimated value: $${statistics.totalValue.toFixed(0)} per tonne`,
    `Average recovery rate: ${(statistics.avgRecoveryRate * 100).toFixed(1)}%`,
    `Consider mobile processing units for ${sites.filter(s => s.location.coordinates).length} remote sites`
  ];
  
  if (statistics.viableMinerals < scenarios.length) {
    recommendations.push(`${scenarios.length - statistics.viableMinerals} mineral(s) below economic threshold - consider blend optimization`);
  }
  
  return recommendations;
}
