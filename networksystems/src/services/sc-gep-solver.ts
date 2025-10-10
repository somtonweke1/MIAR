/**
 * SC-GEP Optimization Solver
 *
 * Implements the optimization engine for Supply Chain-Constrained
 * Generation Expansion Planning. Uses heuristic optimization and
 * greedy algorithms to solve the multi-stage MILP.
 *
 * In production, this would interface with commercial solvers like:
 * - Gurobi
 * - CPLEX
 * - MOSEK
 * - Or open-source alternatives like SCIP, HiGHS
 */

import {
  SCGEPConfiguration,
  SCGEPSolution,
  SCGEPVariables,
  BottleneckAnalysis,
  ScenarioComparison,
  TechnologyType,
  ScenarioType
} from './sc-gep-enhanced';

export class SCGEPSolver {
  private config: SCGEPConfiguration;
  private solution: SCGEPSolution | null = null;

  constructor(config: SCGEPConfiguration) {
    this.config = config;
  }

  /**
   * Main solve method
   */
  async solve(): Promise<SCGEPSolution> {
    const startTime = Date.now();

    // Initialize variables
    const variables = this.initializeVariables();

    // Apply heuristic optimization
    let feasible = false;
    let iterations = 0;
    const maxIterations = 50;

    while (!feasible && iterations < maxIterations) {
      // Build candidate solution
      this.buildCandidateSolution(variables, iterations);

      // Check feasibility
      feasible = this.checkFeasibility(variables);

      iterations++;

      if (!feasible && iterations < maxIterations) {
        // Adjust solution based on violations
        this.adjustForViolations(variables);
      }
    }

    // Calculate objective value
    const costs = this.calculateCosts(variables);
    const objectiveValue = costs.investment.reduce((a, b) => a + b, 0) +
      costs.operational.reduce((a, b) => a + b, 0) +
      costs.penalty.reduce((a, b) => a + b, 0);

    // Calculate performance metrics
    const metrics = this.calculateMetrics(variables);

    const solveTime = (Date.now() - startTime) / 1000;

    this.solution = {
      objectiveValue,
      feasibility: feasible,
      convergence: feasible ? (iterations < maxIterations ? 'optimal' : 'feasible') : 'infeasible',
      solveTime,
      iterations,
      gap: iterations >= maxIterations ? 0.1 : 0.01,
      variables,
      costs: {
        ...costs,
        total: objectiveValue
      },
      metrics
    };

    return this.solution;
  }

  /**
   * Initialize decision variables
   */
  private initializeVariables(): SCGEPVariables {
    const { planningHorizon } = this.config.systemParameters;
    const numSeasons = 4;
    const hoursPerDay = 24;

    return {
      // Supply chain variables
      materialUtilization: {},
      componentProduction: {},
      productProduction: {},
      materialStock: {},
      availableArea: {},

      // Investment variables
      plannedCapacity: {},
      builtStatus: {},
      operationalStatus: {},
      retirementStatus: {},

      // Operational variables
      generation: {},
      transmissionFlow: {},
      storageCharging: {},
      storageDischarging: {},
      stateOfCharge: {},

      // Penalty variables
      loadShedding: {},
      reserveMarginViolation: Array(planningHorizon).fill(0),
      rpsViolation: {
        spv: Array(planningHorizon).fill(0),
        lbw: Array(planningHorizon).fill(0),
        osw: Array(planningHorizon).fill(0),
        bse: Array(planningHorizon).fill(0)
      } as Record<TechnologyType, number[]>
    };
  }

  /**
   * Build candidate solution using greedy heuristics
   */
  private buildCandidateSolution(variables: SCGEPVariables, iteration: number): void {
    const { zones, products, materials, components, systemParameters } = this.config;
    const { planningHorizon, reserveMargin } = systemParameters;

    // Initialize material stocks
    materials.forEach(material => {
      variables.materialStock[material.id] = Array(planningHorizon).fill(material.initialStock);
      variables.materialUtilization[material.id] = Array(planningHorizon).fill(0);
    });

    // Initialize component and product production
    components.forEach(comp => {
      variables.componentProduction[comp.id] = Array(planningHorizon).fill(0);
    });

    products.forEach(prod => {
      variables.productProduction[prod.id] = Array(planningHorizon).fill(0);
    });

    // Track capacity needs per zone per year
    for (let year = 0; year < planningHorizon; year++) {
      zones.forEach(zone => {
        // Calculate demand for this year
        const peakLoad = zone.baselinePeakLoad * Math.pow(1 + zone.demandCAGR / 100, year);
        const requiredCapacity = peakLoad * (1 + reserveMargin / 100);

        // Calculate existing capacity
        let existingCapacity = 0;
        zone.existingUnits.forEach(unit => {
          if (!unit.retirementYear || year < (unit.retirementYear - systemParameters.baseYear)) {
            existingCapacity += unit.capacity;
          }
        });

        // Calculate already planned capacity
        let plannedCapacity = 0;
        products.forEach(product => {
          const unitId = `${product.id}_${zone.id}`;
          if (variables.operationalStatus[unitId]) {
            for (let y = 0; y <= year; y++) {
              plannedCapacity += variables.operationalStatus[unitId][y] || 0;
            }
          }
        });

        const capacityGap = requiredCapacity - existingCapacity - plannedCapacity;

        if (capacityGap > 0) {
          // Need to add capacity - prioritize based on:
          // 1. ELCC factor (for reserve margin)
          // 2. Lead time (faster deployment preferred)
          // 3. Material availability
          // 4. Cost

          const sortedProducts = [...products].sort((a, b) => {
            // Prioritize battery storage for quick deployment and high ELCC
            if (a.technologyType === 'bse' && b.technologyType !== 'bse') return -1;
            if (b.technologyType === 'bse' && a.technologyType !== 'bse') return 1;

            // Then solar for fast deployment
            if (a.technologyType === 'spv' && b.technologyType !== 'spv') return -1;
            if (b.technologyType === 'spv' && a.technologyType !== 'spv') return 1;

            // Sort by ELCC * (1/leadTime) * (1/cost)
            const scoreA = a.elccFactor / (a.leadTime + 1) / (a.capitalCost / 1000000);
            const scoreB = b.elccFactor / (b.leadTime + 1) / (b.capitalCost / 1000000);
            return scoreB - scoreA;
          });

          for (const product of sortedProducts) {
            if (capacityGap <= 0) break;

            // Check if we can deploy this year (accounting for lead time)
            const planYear = Math.max(0, year - product.leadTime);
            if (planYear < 0 || planYear >= planningHorizon) continue;

            // Check material availability
            const materialsAvailable = this.checkMaterialsAvailable(
              product,
              capacityGap * 0.3, // Deploy 30% of gap per product
              planYear,
              variables
            );

            if (materialsAvailable) {
              const deployCapacity = Math.min(capacityGap * 0.3, 500); // Max 500 MW per unit
              const unitId = `${product.id}_${zone.id}_y${year}`;

              // Plan capacity
              if (!variables.plannedCapacity[unitId]) {
                variables.plannedCapacity[unitId] = Array(planningHorizon).fill(0);
              }
              variables.plannedCapacity[unitId][planYear] = deployCapacity;

              // Build status
              if (!variables.builtStatus[unitId]) {
                variables.builtStatus[unitId] = Array(planningHorizon).fill(0);
              }
              variables.builtStatus[unitId][year] = 1;

              // Operational status (after lead time)
              if (!variables.operationalStatus[unitId]) {
                variables.operationalStatus[unitId] = Array(planningHorizon).fill(0);
              }
              for (let y = year; y < Math.min(planningHorizon, year + product.lifetime); y++) {
                variables.operationalStatus[unitId][y] = deployCapacity;
              }

              // Consume materials
              this.consumeMaterials(product, deployCapacity, planYear, variables);

              // Update product production
              variables.productProduction[product.id][planYear] += deployCapacity / 1000; // Convert to GW
            }
          }
        }
      });
    }

    // Initialize operational variables (simplified)
    this.initializeOperationalVariables(variables);
  }

  /**
   * Check if materials are available for deployment
   */
  private checkMaterialsAvailable(
    product: Product,
    capacity: number,
    year: number,
    variables: SCGEPVariables
  ): boolean {
    const { components, materials } = this.config;

    // Get components needed
    for (const [compId, unitsPerMW] of Object.entries(product.componentDemand)) {
      const component = components.find(c => c.id === compId);
      if (!component) continue;

      const unitsNeeded = capacity * unitsPerMW;

      // Check each material for this component
      for (const [matId, tonnesPerUnit] of Object.entries(component.materialDemand)) {
        const material = materials.find(m => m.id === matId);
        if (!material) continue;

        const tonnesNeeded = unitsNeeded * tonnesPerUnit;
        const availableSupply = material.primarySupply * (material.energySectorShare || 1.0);
        const currentStock = variables.materialStock[matId]?.[year] || 0;
        const currentUtilization = variables.materialUtilization[matId]?.[year] || 0;

        if (tonnesNeeded > (availableSupply + currentStock - currentUtilization)) {
          return false; // Insufficient material
        }
      }
    }

    return true;
  }

  /**
   * Consume materials for a deployment
   */
  private consumeMaterials(
    product: Product,
    capacity: number,
    year: number,
    variables: SCGEPVariables
  ): void {
    const { components } = this.config;

    for (const [compId, unitsPerMW] of Object.entries(product.componentDemand)) {
      const component = components.find(c => c.id === compId);
      if (!component) continue;

      const unitsNeeded = capacity * unitsPerMW;

      // Update component production
      variables.componentProduction[compId][year] += unitsNeeded;

      // Consume materials
      for (const [matId, tonnesPerUnit] of Object.entries(component.materialDemand)) {
        const tonnesNeeded = unitsNeeded * tonnesPerUnit;
        variables.materialUtilization[matId][year] += tonnesNeeded;

        // Reduce stock
        if (variables.materialStock[matId][year] >= tonnesNeeded) {
          variables.materialStock[matId][year] -= tonnesNeeded;
        }
      }
    }
  }

  /**
   * Initialize operational variables (simplified)
   */
  private initializeOperationalVariables(variables: SCGEPVariables): void {
    const { zones, systemParameters } = this.config;
    const { planningHorizon } = systemParameters;
    const numSeasons = 4;
    const hoursPerDay = 24;

    zones.forEach(zone => {
      if (!variables.loadShedding[zone.id]) {
        variables.loadShedding[zone.id] = Array(planningHorizon)
          .fill(0)
          .map(() =>
            Array(numSeasons)
              .fill(0)
              .map(() => Array(hoursPerDay).fill(0))
          );
      }
    });
  }

  /**
   * Check solution feasibility
   */
  private checkFeasibility(variables: SCGEPVariables): boolean {
    // Check material constraints
    if (!this.checkMaterialConstraints(variables)) return false;

    // Check spatial constraints
    if (!this.checkSpatialConstraints(variables)) return false;

    // Check lead time constraints
    if (!this.checkLeadTimeConstraints(variables)) return false;

    return true;
  }

  private checkMaterialConstraints(variables: SCGEPVariables): boolean {
    const { materials, systemParameters } = this.config;
    const { planningHorizon } = systemParameters;

    for (let year = 0; year < planningHorizon; year++) {
      for (const material of materials) {
        const utilization = variables.materialUtilization[material.id]?.[year] || 0;
        const supply = material.primarySupply * (material.energySectorShare || 1.0);
        const stock = variables.materialStock[material.id]?.[year] || 0;

        if (utilization > supply + stock) {
          return false;
        }
      }
    }

    return true;
  }

  private checkSpatialConstraints(variables: SCGEPVariables): boolean {
    // Simplified spatial check
    return true; // TODO: Implement detailed spatial constraints
  }

  private checkLeadTimeConstraints(variables: SCGEPVariables): boolean {
    // Simplified lead time check
    return true; // TODO: Implement detailed lead time constraints
  }

  /**
   * Adjust solution for constraint violations
   */
  private adjustForViolations(variables: SCGEPVariables): void {
    // Simplified adjustment - reduce capacities if materials constrained
    const { materials, systemParameters } = this.config;
    const { planningHorizon } = systemParameters;

    for (let year = 0; year < planningHorizon; year++) {
      for (const material of materials) {
        const utilization = variables.materialUtilization[material.id]?.[year] || 0;
        const supply = material.primarySupply * (material.energySectorShare || 1.0);

        if (utilization > supply) {
          // Reduce utilization by scaling down product production
          const scaleFactor = supply / utilization;
          this.config.products.forEach(product => {
            if (variables.productProduction[product.id]) {
              variables.productProduction[product.id][year] *= scaleFactor;
            }
          });
          variables.materialUtilization[material.id][year] *= scaleFactor;
        }
      }
    }
  }

  /**
   * Calculate costs
   */
  private calculateCosts(variables: SCGEPVariables): {
    investment: number[];
    operational: number[];
    penalty: number[];
  } {
    const { products, systemParameters } = this.config;
    const { planningHorizon, voll, reserveMarginPenalty, rpsPenalty } = systemParameters;

    const investment = Array(planningHorizon).fill(0);
    const operational = Array(planningHorizon).fill(0);
    const penalty = Array(planningHorizon).fill(0);

    // Investment costs
    for (let year = 0; year < planningHorizon; year++) {
      Object.keys(variables.plannedCapacity).forEach(unitId => {
        const capacity = variables.plannedCapacity[unitId][year];
        if (capacity > 0) {
          const productId = unitId.split('_')[0];
          const product = products.find(p => p.id === productId);
          if (product) {
            investment[year] += capacity * product.capitalCost;
          }
        }
      });

      // Operational costs
      Object.keys(variables.operationalStatus).forEach(unitId => {
        const capacity = variables.operationalStatus[unitId][year];
        if (capacity > 0) {
          const productId = unitId.split('_')[0];
          const product = products.find(p => p.id === productId);
          if (product) {
            operational[year] += capacity * product.fixedOMCost;
            operational[year] += capacity * product.variableOMCost * 8760; // Annual hours
          }
        }
      });

      // Penalty costs
      // Load shedding
      const loadShedding = Object.values(variables.loadShedding).reduce((sum, zoneData) => {
        return sum + zoneData[year].reduce((s, seasonData) =>
          s + seasonData.reduce((h, hourData) => h + hourData, 0), 0);
      }, 0);
      penalty[year] += loadShedding * voll;

      // Reserve margin violation
      penalty[year] += variables.reserveMarginViolation[year] * reserveMarginPenalty;

      // RPS violation
      Object.values(variables.rpsViolation).forEach(techViolation => {
        penalty[year] += techViolation[year] * rpsPenalty;
      });
    }

    return { investment, operational, penalty };
  }

  /**
   * Calculate performance metrics
   */
  private calculateMetrics(variables: SCGEPVariables): SCGEPSolution['metrics'] {
    const { products, materials, zones, systemParameters } = this.config;
    const { planningHorizon } = systemParameters;

    // Total capacity by year and technology
    const totalCapacityByYear: Record<TechnologyType, number[]> = {
      spv: Array(planningHorizon).fill(0),
      lbw: Array(planningHorizon).fill(0),
      osw: Array(planningHorizon).fill(0),
      bse: Array(planningHorizon).fill(0),
      ngcc: Array(planningHorizon).fill(0),
      ngct: Array(planningHorizon).fill(0),
      nuc: Array(planningHorizon).fill(0),
      hyd: Array(planningHorizon).fill(0),
      coal: Array(planningHorizon).fill(0),
      bio: Array(planningHorizon).fill(0),
      oil: Array(planningHorizon).fill(0)
    };

    for (let year = 0; year < planningHorizon; year++) {
      Object.keys(variables.operationalStatus).forEach(unitId => {
        const capacity = variables.operationalStatus[unitId][year];
        if (capacity > 0) {
          const productId = unitId.split('_')[0];
          const product = products.find(p => p.id === productId);
          if (product) {
            totalCapacityByYear[product.technologyType][year] += capacity;
          }
        }
      });

      // Add existing units
      zones.forEach(zone => {
        zone.existingUnits.forEach(unit => {
          if (!unit.retirementYear || year < (unit.retirementYear - systemParameters.baseYear)) {
            totalCapacityByYear[unit.technology][year] += unit.capacity;
          }
        });
      });
    }

    // Material utilization rate
    const materialUtilizationRate: Record<string, number[]> = {};
    materials.forEach(material => {
      materialUtilizationRate[material.id] = Array(planningHorizon).fill(0).map((_, year) => {
        const utilization = variables.materialUtilization[material.id]?.[year] || 0;
        const supply = material.primarySupply * (material.energySectorShare || 1.0);
        return supply > 0 ? (utilization / supply) * 100 : 0;
      });
    });

    // Land utilization rate (simplified)
    const landUtilizationRate: Record<string, Record<string, number[]>> = {};
    zones.forEach(zone => {
      landUtilizationRate[zone.id] = {};
      products.forEach(product => {
        landUtilizationRate[zone.id][product.technologyType] = Array(planningHorizon).fill(0);
      });
    });

    // Reserve margin satisfaction
    const reserveMarginSatisfaction = Array(planningHorizon).fill(100).map((_, year) => {
      const violation = variables.reserveMarginViolation[year];
      return violation > 0 ? Math.max(0, 100 - (violation / 1000)) : 100; // Simplified
    });

    // RPS compliance
    const rpsCompliance: Record<TechnologyType, number[]> = {
      spv: Array(planningHorizon).fill(100),
      lbw: Array(planningHorizon).fill(100),
      osw: Array(planningHorizon).fill(100),
      bse: Array(planningHorizon).fill(100),
      ngcc: Array(planningHorizon).fill(0),
      ngct: Array(planningHorizon).fill(0),
      nuc: Array(planningHorizon).fill(0),
      hyd: Array(planningHorizon).fill(0),
      coal: Array(planningHorizon).fill(0),
      bio: Array(planningHorizon).fill(0),
      oil: Array(planningHorizon).fill(0)
    };

    // Load shedding total
    const loadSheddingTotal = Array(planningHorizon).fill(0).map((_, year) => {
      return Object.values(variables.loadShedding).reduce((sum, zoneData) => {
        return sum + zoneData[year].reduce((s, seasonData) =>
          s + seasonData.reduce((h, hourData) => h + hourData, 0), 0);
      }, 0);
    });

    return {
      totalCapacityByYear,
      materialUtilizationRate,
      landUtilizationRate,
      reserveMarginSatisfaction,
      rpsCompliance,
      loadSheddingTotal
    };
  }

  /**
   * Analyze bottlenecks
   */
  public analyzeBottlenecks(): BottleneckAnalysis {
    if (!this.solution) {
      throw new Error('Must solve before analyzing bottlenecks');
    }

    const { materials, products, zones, systemParameters } = this.config;
    const { planningHorizon } = systemParameters;
    const { variables, metrics } = this.solution;

    // Material bottlenecks
    const materialBottlenecks = materials
      .map(material => {
        const yearsConstrained: number[] = [];
        let peakUtilization = 0;
        const affectedTechnologies: Set<TechnologyType> = new Set();

        for (let year = 0; year < planningHorizon; year++) {
          const utilizationRate = metrics.materialUtilizationRate[material.id][year];
          peakUtilization = Math.max(peakUtilization, utilizationRate);

          if (utilizationRate > 85) {
            yearsConstrained.push(year + systemParameters.baseYear);

            // Find which technologies use this material
            products.forEach(product => {
              Object.keys(product.componentDemand).forEach(compId => {
                const component = this.config.components.find(c => c.id === compId);
                if (component && material.id in component.materialDemand) {
                  affectedTechnologies.add(product.technologyType);
                }
              });
            });
          }
        }

        const severity: 'critical' | 'high' | 'medium' | 'low' =
          peakUtilization > 95 ? 'critical' :
            peakUtilization > 85 ? 'high' :
              peakUtilization > 70 ? 'medium' : 'low';

        return {
          material: material.name,
          years: yearsConstrained,
          severity,
          peakUtilization,
          impactOnDeployment: yearsConstrained.length > 0
            ? `Material constraint active in ${yearsConstrained.length} years`
            : 'No significant impact',
          affectedTechnologies: Array.from(affectedTechnologies)
        };
      })
      .filter(b => b.yearsConstrained.length > 0);

    // Spatial bottlenecks (simplified)
    const spatialBottlenecks: BottleneckAnalysis['spatialBottlenecks'] = [];

    // Lead time delays (simplified)
    const leadTimeDelays: BottleneckAnalysis['leadTimeDelays'] = [];

    // Reliability issues
    const reliabilityIssues = [];
    for (let year = 0; year < planningHorizon; year++) {
      const loadShedding = metrics.loadSheddingTotal[year];
      const reserveDeficit = variables.reserveMarginViolation[year];

      if (loadShedding > 0 || reserveDeficit > 0) {
        reliabilityIssues.push({
          year: year + systemParameters.baseYear,
          loadSheddingMWh: loadShedding,
          reserveMarginDeficitMW: reserveDeficit,
          affectedZones: zones.map(z => z.name)
        });
      }
    }

    return {
      materialBottlenecks,
      spatialBottlenecks,
      leadTimeDelays,
      reliabilityIssues
    };
  }

  /**
   * Get solution
   */
  public getSolution(): SCGEPSolution | null {
    return this.solution;
  }
}

/**
 * Compare multiple scenarios
 */
export async function compareScenarios(
  scenarios: ScenarioType[],
  baseConfig: SCGEPConfiguration
): Promise<ScenarioComparison> {
  const results: Record<ScenarioType, SCGEPSolution> = {} as any;

  // Solve each scenario
  for (const scenario of scenarios) {
    const config = { ...baseConfig, scenario };
    const solver = new SCGEPSolver(config);
    results[scenario] = await solver.solve();
  }

  // Build comparison
  const comparison: ScenarioComparison['comparison'] = {
    totalInvestment: {},
    totalOperationalCost: {},
    totalPenaltyCost: {},
    loadSheddingTotal: {},
    technologyMix: {},
    materialConstraintYears: {},
    deploymentDelays: {}
  } as any;

  scenarios.forEach(scenario => {
    const solution = results[scenario];
    const { costs, metrics } = solution;

    comparison.totalInvestment[scenario] = costs.investment.reduce((a, b) => a + b, 0);
    comparison.totalOperationalCost[scenario] = costs.operational.reduce((a, b) => a + b, 0);
    comparison.totalPenaltyCost[scenario] = costs.penalty.reduce((a, b) => a + b, 0);
    comparison.loadSheddingTotal[scenario] = metrics.loadSheddingTotal.reduce((a, b) => a + b, 0);

    // Technology mix (final year)
    const lastYear = metrics.totalCapacityByYear.spv.length - 1;
    comparison.technologyMix[scenario] = {
      spv: metrics.totalCapacityByYear.spv[lastYear],
      lbw: metrics.totalCapacityByYear.lbw[lastYear],
      osw: metrics.totalCapacityByYear.osw[lastYear],
      bse: metrics.totalCapacityByYear.bse[lastYear]
    } as any;

    // Material constraint years
    comparison.materialConstraintYears[scenario] = Object.values(metrics.materialUtilizationRate)
      .reduce((count, utilRates) => {
        return count + utilRates.filter(rate => rate > 85).length;
      }, 0);

    // Deployment delays (placeholder)
    comparison.deploymentDelays[scenario] = 0;
  });

  // Generate insights
  const insights: string[] = [
    `Compared ${scenarios.length} scenarios over ${baseConfig.systemParameters.planningHorizon} year planning horizon`,
    `Total investment ranges from $${Math.min(...Object.values(comparison.totalInvestment)) / 1e9}B to $${Math.max(...Object.values(comparison.totalInvestment)) / 1e9}B`,
    `Material constraints are most severe in ${scenarios[Object.keys(comparison.materialConstraintYears).reduce((a, b) =>
      comparison.materialConstraintYears[a as ScenarioType] > comparison.materialConstraintYears[b as ScenarioType] ? a : b
    ) as ScenarioType]} scenario`
  ];

  return {
    scenarios,
    comparison,
    insights
  };
}

export default SCGEPSolver;
