import { NextRequest, NextResponse } from 'next/server';
import { SCGEPModel, createAfricanMiningSCGEPConfig } from '@/services/sc-gep-model';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      materials = [],
      technologies = [],
      timeHorizon = 30,
      sensitivity_analysis = false
    } = body;

    // Create model with default configuration
    const config = createAfricanMiningSCGEPConfig();
    
    // Apply custom material constraints if provided
    if (materials.length > 0) {
      config.materials = config.materials.map(material => {
        const customMaterial = materials.find((m: any) => m.id === material.id);
        return customMaterial ? { ...material, ...customMaterial } : material;
      });
    }

    // Apply custom technology constraints if provided
    if (technologies.length > 0) {
      config.technologies = config.technologies.map(tech => {
        const customTech = technologies.find((t: any) => t.id === tech.id);
        return customTech ? { ...tech, ...customTech } : tech;
      });
    }

    config.planningHorizon = timeHorizon;

    const model = new SCGEPModel(config);
    const solution = await model.solve();

    if (!solution.feasibility) {
      return NextResponse.json({
        success: false,
        error: 'Model infeasible with given constraints',
        bottlenecks: null
      }, { status: 400 });
    }

    // Analyze bottlenecks
    const analysis = model.analyzeSupplyChain();

    // Perform sensitivity analysis if requested
    let sensitivityResults = null;
    if (sensitivity_analysis) {
      sensitivityResults = await performSensitivityAnalysis(config, model);
    }

    // Identify critical bottlenecks
    const criticalBottlenecks = analysis.materialBottlenecks.filter(b => b.constraint);
    const spatialBottlenecks = analysis.spatialConstraints.filter(s => s.constraint);

    return NextResponse.json({
      success: true,
      bottlenecks: {
        material: analysis.materialBottlenecks,
        spatial: analysis.spatialConstraints,
        critical: criticalBottlenecks,
        spatial_critical: spatialBottlenecks
      },
      sensitivity: sensitivityResults,
      recommendations: generateBottleneckRecommendations(analysis),
      metadata: {
        analysis_timestamp: new Date().toISOString(),
        model_convergence: solution.convergence,
        solve_time: solution.solveTime
      }
    });

  } catch (error) {
    console.error('Bottleneck Analysis API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to analyze bottlenecks',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function performSensitivityAnalysis(config: any, baseModel: SCGEPModel) {
  const sensitivityResults: {
    material_supply: Record<string, any>;
    lead_times: Record<string, any>;
    land_availability: Record<string, any>;
  } = {
    material_supply: {},
    lead_times: {},
    land_availability: {}
  };

  // Material supply sensitivity (±20%)
  for (const material of config.materials) {
    const originalSupply = material.primarySupply;
    
    for (const variation of [-0.2, -0.1, 0.1, 0.2]) {
      const newSupply = originalSupply * (1 + variation);
      const modifiedConfig = { ...config };
      const materialIndex = modifiedConfig.materials.findIndex((m: any) => m.id === material.id);
      modifiedConfig.materials[materialIndex] = { ...material, primarySupply: newSupply };
      
      const testModel = new SCGEPModel(modifiedConfig);
      const solution = await testModel.solve();
      
      if (solution.feasibility) {
        const analysis = testModel.analyzeSupplyChain();
        const baseSolution = baseModel.getSolution();
        sensitivityResults.material_supply[`${material.id}_${variation > 0 ? 'increase' : 'decrease'}_${Math.abs(variation * 100)}%`] = {
          objective_change: baseSolution ? solution.objectiveValue - baseSolution.objectiveValue : 0,
          bottleneck_impact: analysis.materialBottlenecks.find(b => b.material === material.name)?.utilization
        };
      }
    }
  }

  return sensitivityResults;
}

function generateBottleneckRecommendations(analysis: any) {
  const recommendations = [];

  // Material bottleneck recommendations
  const criticalMaterials = analysis.materialBottlenecks.filter((b: any) => b.constraint);
  if (criticalMaterials.length > 0) {
    recommendations.push({
      type: 'material_diversification',
      priority: 'high',
      title: 'Material Supply Diversification',
      description: `Critical bottlenecks detected in ${criticalMaterials.map((m: any) => m.material).join(', ')}`,
      actions: [
        'Establish alternative supply sources',
        'Increase recycling rates',
        'Invest in material substitution technologies',
        'Build strategic material reserves'
      ],
      estimated_impact: 'Reduce supply chain risk by 40-60%'
    });
  }

  // Spatial constraint recommendations
  const criticalSpatial = analysis.spatialConstraints.filter((s: any) => s.constraint);
  if (criticalSpatial.length > 0) {
    recommendations.push({
      type: 'spatial_optimization',
      priority: 'medium',
      title: 'Land Use Optimization',
      description: `Land constraints detected in ${criticalSpatial.map((s: any) => `${s.zone} (${s.technology})`).join(', ')}`,
      actions: [
        'Optimize technology mix for land efficiency',
        'Consider offshore alternatives',
        'Implement vertical integration strategies',
        'Explore shared infrastructure options'
      ],
      estimated_impact: 'Improve land utilization by 25-35%'
    });
  }

  // Technology delay recommendations
  if (analysis.technologyDelays && analysis.technologyDelays.length > 0) {
    recommendations.push({
      type: 'lead_time_management',
      priority: 'high',
      title: 'Lead Time Management',
      description: 'Technology deployment delays identified',
      actions: [
        'Pre-order critical components',
        'Establish local manufacturing partnerships',
        'Implement modular deployment strategies',
        'Create contingency plans for delays'
      ],
      estimated_impact: 'Reduce deployment delays by 30-50%'
    });
  }

  return recommendations;
}
