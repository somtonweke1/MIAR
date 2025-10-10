import { NextRequest, NextResponse } from 'next/server';
import { SCGEPModel, createAfricanMiningSCGEPConfig, SupplyChainConstraints } from '@/services/sc-gep-model';
import { createMarylandSCGEPConfig, ScenarioType } from '@/services/sc-gep-enhanced';
import SCGEPSolver from '@/services/sc-gep-solver';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      scenario = 'baseline',
      region = 'maryland',
      constraints = {},
      analysis_type = 'full',
      use_enhanced = true
    } = body;

    if (use_enhanced) {
      // Use enhanced SC-GEP model with Maryland/PJM configuration
      const scenarioType = scenario as ScenarioType;
      let config;

      if (region === 'maryland') {
        config = createMarylandSCGEPConfig(scenarioType);
      } else {
        // For African mining, create a compatible enhanced config
        config = createMarylandSCGEPConfig(scenarioType);
        // TODO: Create proper African config in sc-gep-enhanced.ts
      }

      // Apply any custom constraints
      if (Object.keys(constraints).length > 0) {
        Object.assign(config, constraints);
      }

      const solver = new SCGEPSolver(config);
      const solution = await solver.solve();

      if (!solution.feasibility) {
        return NextResponse.json({
          success: false,
          error: 'Model is infeasible with given constraints',
          solution: null,
          details: 'Supply chain constraints cannot be satisfied within the planning horizon'
        }, { status: 400 });
      }

      // Perform bottleneck analysis if requested
      let bottleneckAnalysis = null;
      if (analysis_type === 'full' || analysis_type === 'bottlenecks') {
        bottleneckAnalysis = solver.analyzeBottlenecks();
      }

      return NextResponse.json({
        success: true,
        solution: {
          objectiveValue: solution.objectiveValue,
          feasibility: solution.feasibility,
          solveTime: solution.solveTime,
          iterations: solution.iterations,
          convergence: solution.convergence,
          costs: solution.costs,
          metrics: solution.metrics
        },
        bottleneckAnalysis,
        metadata: {
          scenario: scenarioType,
          region,
          timestamp: new Date().toISOString(),
          modelVersion: '2.0.0-enhanced',
          paperReference: 'Yao, Bernstein, Dvorkin (2025) arXiv:2508.03001v1'
        }
      });
    } else {
      // Use legacy SC-GEP model
      const baseConfig = createAfricanMiningSCGEPConfig();
      const customConstraints: Partial<SupplyChainConstraints> = {
        ...baseConfig,
        ...constraints
      };

      const model = new SCGEPModel(customConstraints as SupplyChainConstraints);
      const solution = await model.solve();

      if (!solution.feasibility) {
        return NextResponse.json({
          success: false,
          error: 'Model is infeasible with given constraints',
          solution: null
        }, { status: 400 });
      }

      let analysis = null;
      if (analysis_type === 'full' || analysis_type === 'analysis') {
        analysis = model.analyzeSupplyChain();
      }

      return NextResponse.json({
        success: true,
        solution: {
          objectiveValue: solution.objectiveValue,
          feasibility: solution.feasibility,
          solveTime: solution.solveTime,
          iterations: solution.iterations,
          convergence: solution.convergence
        },
        analysis,
        metadata: {
          scenario,
          timestamp: new Date().toISOString(),
          modelVersion: '1.0.0'
        }
      });
    }

  } catch (error) {
    console.error('SC-GEP API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scenario = searchParams.get('scenario') || 'default';
    
    // Return default configuration for the specified scenario
    const config = createAfricanMiningSCGEPConfig();
    
    return NextResponse.json({
      success: true,
      configuration: config,
      scenarios: {
        default: 'Standard African mining supply chain constraints',
        high_demand: 'High demand growth scenario with material bottlenecks',
        constrained_supply: 'Limited material supply from geopolitical constraints',
        rapid_expansion: 'Aggressive renewable energy deployment scenario'
      },
      metadata: {
        scenario,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('SC-GEP Config API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve configuration'
    }, { status: 500 });
  }
}
