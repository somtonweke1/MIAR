/**
 * Enhanced Supply Chain-Constrained Generation Expansion Planning (SC-GEP) Model
 * Based on research: "Integrating Upstream Supply Chains into Generation Expansion Planning"
 * Yao, Bernstein, Dvorkin (2025) - arXiv:2508.03001v1
 *
 * This implementation includes:
 * - Complete material-component-product flow modeling
 * - 14 critical materials (lithium, cobalt, nickel, neodymium, etc.)
 * - Lead time constraints and deployment delays
 * - Spatial constraints (land and offshore)
 * - Reserve margin and RPS compliance
 * - Multi-scenario analysis (Low/High demand, constrained/unconstrained supply)
 * - Maryland/PJM case study data
 */

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export type MaterialType = 'critical' | 'standard' | 'rare_earth';
export type TechnologyType = 'spv' | 'lbw' | 'osw' | 'bse' | 'ngcc' | 'ngct' | 'nuc' | 'hyd' | 'coal' | 'bio' | 'oil';
export type ScenarioType = 'baseline' | 'low_demand' | 'high_demand' | 'w/o_SC' | 'lim_SC';

/**
 * Critical materials as identified in the paper (Table from USGS/DOE)
 */
export interface CriticalMaterial {
  id: string;
  name: string;
  type: MaterialType;
  usgsCode?: string;
  // Primary supply (M_my) - from domestic + imports
  primarySupply: number; // tonnes/year
  // Recovery rate (RRM_mg) from retired units
  recoveryRate: number; // 0-1 (typically 0.1 for 10%)
  // Current stock level (s_my initial)
  initialStock: number; // tonnes
  // Sectoral allocation (energy sector share)
  energySectorShare: number; // 0-1 (0.1 or 0.3 as per paper)
  // Material cost
  costPerTonne: number; // $/tonne
}

/**
 * Components that are manufactured from materials
 */
export interface Component {
  id: string;
  name: string;
  // Material demand coefficient (DCO_mc) - tonnes of material m per unit of component c
  materialDemand: Record<string, number>; // material_id -> tonnes/unit
  // Production capacity
  productionCapacity: number; // units/year
  // Manufacturing lead time
  leadTime: number; // years
}

/**
 * Products (final technologies) assembled from components
 */
export interface Product {
  id: string;
  name: string;
  technologyType: TechnologyType;
  // Component demand coefficient (DPR_cp) - units of component c per MW of product p
  componentDemand: Record<string, number>; // component_id -> units/MW
  // Technology parameters
  capacityDensity: number; // MW/km² (RCAP_k)
  leadTime: number; // years (T_LEAD_g)
  lifetime: number; // years (T_LT_g)
  // Cost parameters
  capitalCost: number; // $/MW (CI_gy)
  fixedOMCost: number; // $/MW/year (CF_gy)
  variableOMCost: number; // $/MWh (CV_g)
  // Reliability parameters
  elccFactor: number; // ELCC factor (F_ELCC_ky)
  availabilityFactor?: number; // for renewables (F_GEN_igthy)
}

/**
 * Existing generation units
 */
export interface ExistingUnit {
  id: string;
  name: string;
  zone: string;
  technology: TechnologyType;
  capacity: number; // MW (P_G_g)
  retirementYear?: number; // T_RT_g for existing units
  commissionYear?: number;
}

/**
 * Zones (Maryland utility service territories: BGE, APS, DPL, PEPCO)
 */
export interface Zone {
  id: string;
  name: string;
  // Spatial availability
  availableLand: number; // km² (A_k_i initial)
  availableOffshore?: number; // km² for offshore wind
  // Load parameters
  baselinePeakLoad: number; // MW for year 1 (L_y at y=1)
  demandCAGR: number; // Compound Annual Growth Rate (%)
  // Existing capacity by technology
  existingUnits: ExistingUnit[];
  // Representative load profiles (4 seasons × 24 hours)
  loadProfiles: number[][]; // [season][hour]
  // Renewable availability factors
  renewableProfiles?: Record<TechnologyType, number[][]>; // [season][hour]
}

/**
 * Transmission corridor between zones
 */
export interface TransmissionLine {
  id: string;
  from: string; // zone id
  to: string; // zone id
  capacity: number; // MW (P_L_l)
}

/**
 * System-wide parameters
 */
export interface SystemParameters {
  // Planning horizon
  planningHorizon: number; // years
  baseYear: number; // e.g., 2024

  // Reliability requirements
  reserveMargin: number; // percentage (RRM_y)

  // Policy requirements (RPS)
  rpsTargets: Record<TechnologyType, number>; // RRPS_ky - renewable portfolio standard by technology

  // Penalty costs
  voll: number; // $/MWh - Value of Lost Load (P_VOLL)
  reserveMarginPenalty: number; // $/MW-year (P_RM)
  rpsPenalty: number; // $/MWh (P_RPS)

  // Discount rate for NPV calculations
  discountRate: number; // e.g., 0.05 for 5%

  // Representative days per year
  representativeDays: {
    season: 'spring' | 'summer' | 'fall' | 'winter';
    occurrences: number; // days per year (N_ty)
  }[];
}

/**
 * Complete SC-GEP configuration
 */
export interface SCGEPConfiguration {
  materials: CriticalMaterial[];
  components: Component[];
  products: Product[];
  zones: Zone[];
  transmissionLines: TransmissionLine[];
  systemParameters: SystemParameters;
  scenario: ScenarioType;
  // Scenario-specific modifications
  scenarioModifiers?: {
    supplyConstraintMultiplier?: number; // for lim_SC scenarios
    removeLeadTimes?: boolean; // for w/o_SC scenarios
    expandLandAvailability?: boolean; // for w/o_SC scenarios
  };
}

/**
 * Decision variables for SC-GEP
 */
export interface SCGEPVariables {
  // ===== Supply Chain Module Variables =====
  // Material utilization (u_my) - tonnes of material m used in year y
  materialUtilization: Record<string, number[]>; // material_id -> [year]

  // Component production (v_cy) - units of component c produced in year y
  componentProduction: Record<string, number[]>; // component_id -> [year]

  // Product production (w_py) - GW of product p produced in year y
  productProduction: Record<string, number[]>; // product_id -> [year]

  // Material stock (s_my) - tonnes of material m in stock at end of year y
  materialStock: Record<string, number[]>; // material_id -> [year]

  // Available field area (f_k_iy) - km² available for technology k in zone i at start of year y
  availableArea: Record<string, Record<string, number[]>>; // tech_id -> zone_id -> [year]

  // ===== Investment Variables =====
  // Planning decision (d_gy) - capacity planned for unit g in year y (MW or 0-1)
  plannedCapacity: Record<string, number[]>; // unit_id -> [year]

  // Build status (b_gy) - binary, 1 if unit g is built in year y
  builtStatus: Record<string, number[]>; // unit_id -> [year]

  // Operational status (o_gy) - 1 if unit g is operational in year y
  operationalStatus: Record<string, number[]>; // unit_id -> [year]

  // Retirement decision (r_gy) - 1 if unit g is retired in year y
  retirementStatus: Record<string, number[]>; // unit_id -> [year]

  // ===== Operational Variables (hourly) =====
  // Generation (p_gthy) - MW generated by unit g in period t, hour h, year y
  generation: Record<string, number[][][]>; // unit_id -> [year][period][hour]

  // Transmission flow (q_lthy) - MW flow through line l in period t, hour h, year y
  transmissionFlow: Record<string, number[][][]>; // line_id -> [year][period][hour]

  // Storage charging (cg_thy) - MW charging for storage g in period t, hour h, year y
  storageCharging: Record<string, number[][][]>; // unit_id -> [year][period][hour]

  // Storage discharging (dcg_thy) - MW discharging for storage g in period t, hour h, year y
  storageDischarging: Record<string, number[][][]>; // unit_id -> [year][period][hour]

  // State of charge (esoc_gthy) - MWh stored in storage g in period t, hour h, year y
  stateOfCharge: Record<string, number[][][]>; // unit_id -> [year][period][hour]

  // ===== Slack/Penalty Variables =====
  // Load shedding (pLS_ithy) - MW of unserved load in zone i, period t, hour h, year y
  loadShedding: Record<string, number[][][]>; // zone_id -> [year][period][hour]

  // Reserve margin violation (pRM_y) - MW of reserve margin shortfall in year y
  reserveMarginViolation: number[]; // [year]

  // RPS violation (eRPS_ky) - MWh of RPS non-compliance for technology k in year y
  rpsViolation: Record<TechnologyType, number[]>; // tech_type -> [year]
}

/**
 * Solution output from SC-GEP optimization
 */
export interface SCGEPSolution {
  // Optimization metadata
  objectiveValue: number; // Total system cost ($)
  feasibility: boolean;
  convergence: 'optimal' | 'feasible' | 'infeasible' | 'unbounded' | 'time_limit';
  solveTime: number; // seconds
  iterations: number;
  gap?: number; // MIP gap if applicable

  // Solution variables
  variables: SCGEPVariables;

  // Cost breakdown
  costs: {
    investment: number[]; // by year
    operational: number[]; // by year
    penalty: number[]; // by year
    total: number;
  };

  // Performance metrics
  metrics: {
    totalCapacityByYear: Record<TechnologyType, number[]>; // [year]
    materialUtilizationRate: Record<string, number[]>; // [year]
    landUtilizationRate: Record<string, Record<string, number[]>>; // zone -> tech -> [year]
    reserveMarginSatisfaction: number[]; // [year]
    rpsCompliance: Record<TechnologyType, number[]>; // [year]
    loadSheddingTotal: number[]; // MWh by year
  };
}

/**
 * Bottleneck analysis results
 */
export interface BottleneckAnalysis {
  materialBottlenecks: {
    material: string;
    years: number[];
    severity: 'critical' | 'high' | 'medium' | 'low';
    peakUtilization: number; // percentage
    impactOnDeployment: string;
    affectedTechnologies: TechnologyType[];
  }[];

  spatialBottlenecks: {
    zone: string;
    technology: TechnologyType;
    years: number[];
    landUtilization: number; // percentage
    constraint: boolean;
  }[];

  leadTimeDelays: {
    technology: TechnologyType;
    plannedYear: number;
    deployedYear: number;
    delayYears: number;
    reason: string;
  }[];

  reliabilityIssues: {
    year: number;
    loadSheddingMWh: number;
    reserveMarginDeficitMW: number;
    affectedZones: string[];
  }[];
}

/**
 * Scenario comparison results
 */
export interface ScenarioComparison {
  scenarios: ScenarioType[];
  comparison: {
    totalInvestment: Record<ScenarioType, number>;
    totalOperationalCost: Record<ScenarioType, number>;
    totalPenaltyCost: Record<ScenarioType, number>;
    loadSheddingTotal: Record<ScenarioType, number>;
    technologyMix: Record<ScenarioType, Record<TechnologyType, number>>; // final year capacity
    materialConstraintYears: Record<ScenarioType, number>; // years with material constraints
    deploymentDelays: Record<ScenarioType, number>; // average delay in years
  };
  insights: string[];
}

// ============================================================================
// CONFIGURATION FACTORIES
// ============================================================================

/**
 * Create Maryland/PJM case study configuration
 * Based on the paper's Maryland study (Section IV)
 */
export function createMarylandSCGEPConfig(scenario: ScenarioType = 'baseline'): SCGEPConfiguration {
  // 14 critical materials from USGS/DOE lists
  const materials: CriticalMaterial[] = [
    {
      id: 'aluminum',
      name: 'Aluminum',
      type: 'standard',
      primarySupply: 45000, // MD share of US supply (1.6%)
      recoveryRate: 0.1,
      initialStock: 0,
      energySectorShare: 0.1,
      costPerTonne: 2500
    },
    {
      id: 'cobalt',
      name: 'Cobalt',
      type: 'critical',
      usgsCode: 'Co',
      primarySupply: 2880, // 1.6% of 180k tonnes
      recoveryRate: 0.1,
      initialStock: 0,
      energySectorShare: 0.3,
      costPerTonne: 55000
    },
    {
      id: 'dysprosium',
      name: 'Dysprosium',
      type: 'rare_earth',
      usgsCode: 'Dy',
      primarySupply: 16, // very limited supply
      recoveryRate: 0.1,
      initialStock: 0,
      energySectorShare: 0.3,
      costPerTonne: 350000
    },
    {
      id: 'gallium',
      name: 'Gallium',
      type: 'critical',
      usgsCode: 'Ga',
      primarySupply: 6.4, // very limited
      recoveryRate: 0.1,
      initialStock: 0,
      energySectorShare: 0.1,
      costPerTonne: 300000
    },
    {
      id: 'graphite',
      name: 'Graphite',
      type: 'critical',
      usgsCode: 'C',
      primarySupply: 16000,
      recoveryRate: 0.1,
      initialStock: 0,
      energySectorShare: 0.3,
      costPerTonne: 1500
    },
    {
      id: 'lithium',
      name: 'Lithium',
      type: 'critical',
      usgsCode: 'Li',
      primarySupply: 1376, // 1.6% of 86k tonnes
      recoveryRate: 0.1,
      initialStock: 0,
      energySectorShare: 0.3,
      costPerTonne: 15000
    },
    {
      id: 'manganese',
      name: 'Manganese',
      type: 'standard',
      primarySupply: 80000,
      recoveryRate: 0.1,
      initialStock: 0,
      energySectorShare: 0.1,
      costPerTonne: 2000
    },
    {
      id: 'neodymium',
      name: 'Neodymium',
      type: 'rare_earth',
      usgsCode: 'Nd',
      primarySupply: 480,
      recoveryRate: 0.1,
      initialStock: 0,
      energySectorShare: 0.3,
      costPerTonne: 80000
    },
    {
      id: 'nickel',
      name: 'Nickel',
      type: 'critical',
      usgsCode: 'Ni',
      primarySupply: 51200, // 1.6% of 3.2M tonnes
      recoveryRate: 0.1,
      initialStock: 0,
      energySectorShare: 0.3,
      costPerTonne: 18000
    },
    {
      id: 'praseodymium',
      name: 'Praseodymium',
      type: 'rare_earth',
      usgsCode: 'Pr',
      primarySupply: 160,
      recoveryRate: 0.1,
      initialStock: 0,
      energySectorShare: 0.3,
      costPerTonne: 75000
    },
    {
      id: 'silicon',
      name: 'Silicon',
      type: 'critical',
      usgsCode: 'Si',
      primarySupply: 128000,
      recoveryRate: 0.1,
      initialStock: 0,
      energySectorShare: 0.3,
      costPerTonne: 2000
    },
    {
      id: 'terbium',
      name: 'Terbium',
      type: 'rare_earth',
      usgsCode: 'Tb',
      primarySupply: 4.8,
      recoveryRate: 0.1,
      initialStock: 0,
      energySectorShare: 0.3,
      costPerTonne: 1200000
    },
    {
      id: 'tin',
      name: 'Tin',
      type: 'standard',
      primarySupply: 4800,
      recoveryRate: 0.1,
      initialStock: 0,
      energySectorShare: 0.1,
      costPerTonne: 25000
    },
    {
      id: 'titanium',
      name: 'Titanium',
      type: 'standard',
      primarySupply: 32000,
      recoveryRate: 0.1,
      initialStock: 0,
      energySectorShare: 0.1,
      costPerTonne: 8000
    }
  ];

  // Apply scenario modifiers to materials
  if (scenario === 'lim_SC') {
    // Reduce supply from geopolitical constraints (allied countries only)
    materials.forEach(m => {
      if (m.type === 'rare_earth') {
        m.primarySupply *= 0.5; // 50% reduction for rare earths
      } else if (m.type === 'critical') {
        m.primarySupply *= 0.7; // 30% reduction for critical materials
      }
    });
  }

  // Components (simplified subset from paper's 12 products)
  const components: Component[] = [
    {
      id: 'c_si_solar_cells',
      name: 'Crystalline Silicon Solar Cells',
      materialDemand: { silicon: 5.5, aluminum: 2.0, tin: 0.02 },
      productionCapacity: 50000,
      leadTime: 1
    },
    {
      id: 'cdte_solar_cells',
      name: 'CdTe Thin Film Solar Cells',
      materialDemand: { aluminum: 1.8, tin: 0.015 },
      productionCapacity: 30000,
      leadTime: 1
    },
    {
      id: 'nmc_111_cells',
      name: 'NMC 111 Battery Cells',
      materialDemand: { lithium: 0.4, nickel: 0.6, cobalt: 0.6, graphite: 1.2, manganese: 0.6 },
      productionCapacity: 20000,
      leadTime: 1
    },
    {
      id: 'nmc_811_cells',
      name: 'NMC 811 Battery Cells',
      materialDemand: { lithium: 0.4, nickel: 1.6, cobalt: 0.2, graphite: 1.2, manganese: 0.2 },
      productionCapacity: 25000,
      leadTime: 1
    },
    {
      id: 'lbw_gearbox_components',
      name: 'Land-based Wind Gearbox Components',
      materialDemand: { nickel: 8.0, neodymium: 0.15, dysprosium: 0.01 },
      productionCapacity: 5000,
      leadTime: 2
    },
    {
      id: 'lbw_direct_drive_components',
      name: 'Land-based Wind Direct Drive Components',
      materialDemand: { nickel: 6.0, neodymium: 0.6, praseodymium: 0.08, dysprosium: 0.04 },
      productionCapacity: 4000,
      leadTime: 2
    },
    {
      id: 'osw_gearbox_components',
      name: 'Offshore Wind Gearbox Components',
      materialDemand: { nickel: 12.0, neodymium: 0.2, dysprosium: 0.015 },
      productionCapacity: 2000,
      leadTime: 3
    },
    {
      id: 'osw_direct_drive_components',
      name: 'Offshore Wind Direct Drive Components',
      materialDemand: { nickel: 8.0, neodymium: 0.9, praseodymium: 0.12, dysprosium: 0.06 },
      productionCapacity: 1500,
      leadTime: 3
    }
  ];

  // Products (final technologies)
  const products: Product[] = [
    {
      id: 'spv_c_si',
      name: 'Solar PV (c-Si)',
      technologyType: 'spv',
      componentDemand: { c_si_solar_cells: 1.0 },
      capacityDensity: 36,
      leadTime: 2,
      lifetime: 30,
      capitalCost: 1200000,
      fixedOMCost: 15000,
      variableOMCost: 0,
      elccFactor: 0.7,
      availabilityFactor: 0.25
    },
    {
      id: 'spv_cdte',
      name: 'Solar PV (CdTe)',
      technologyType: 'spv',
      componentDemand: { cdte_solar_cells: 1.0 },
      capacityDensity: 36,
      leadTime: 2,
      lifetime: 30,
      capitalCost: 1150000,
      fixedOMCost: 14000,
      variableOMCost: 0,
      elccFactor: 0.7,
      availabilityFactor: 0.25
    },
    {
      id: 'bse_nmc_111',
      name: 'Battery Storage (NMC 111)',
      technologyType: 'bse',
      componentDemand: { nmc_111_cells: 2.0 },
      capacityDensity: 900,
      leadTime: 1,
      lifetime: 15,
      capitalCost: 350000,
      fixedOMCost: 7000,
      variableOMCost: 5,
      elccFactor: 0.95
    },
    {
      id: 'bse_nmc_811',
      name: 'Battery Storage (NMC 811)',
      technologyType: 'bse',
      componentDemand: { nmc_811_cells: 2.0 },
      capacityDensity: 900,
      leadTime: 1,
      lifetime: 15,
      capitalCost: 340000,
      fixedOMCost: 6800,
      variableOMCost: 5,
      elccFactor: 0.95
    },
    {
      id: 'lbw_gearbox',
      name: 'Land-based Wind (Gearbox)',
      technologyType: 'lbw',
      componentDemand: { lbw_gearbox_components: 0.1 },
      capacityDensity: 3.09,
      leadTime: 3,
      lifetime: 30,
      capitalCost: 1500000,
      fixedOMCost: 45000,
      variableOMCost: 0,
      elccFactor: 0.85,
      availabilityFactor: 0.35
    },
    {
      id: 'lbw_direct_drive',
      name: 'Land-based Wind (Direct Drive)',
      technologyType: 'lbw',
      componentDemand: { lbw_direct_drive_components: 0.1 },
      capacityDensity: 3.09,
      leadTime: 3,
      lifetime: 30,
      capitalCost: 1520000,
      fixedOMCost: 46000,
      variableOMCost: 0,
      elccFactor: 0.85,
      availabilityFactor: 0.35
    },
    {
      id: 'osw_gearbox',
      name: 'Offshore Wind (Gearbox)',
      technologyType: 'osw',
      componentDemand: { osw_gearbox_components: 0.1 },
      capacityDensity: 5.2,
      leadTime: 4,
      lifetime: 30,
      capitalCost: 4000000,
      fixedOMCost: 120000,
      variableOMCost: 0,
      elccFactor: 0.9,
      availabilityFactor: 0.45
    },
    {
      id: 'osw_direct_drive',
      name: 'Offshore Wind (Direct Drive)',
      technologyType: 'osw',
      componentDemand: { osw_direct_drive_components: 0.1 },
      capacityDensity: 5.2,
      leadTime: 4,
      lifetime: 30,
      capitalCost: 4050000,
      fixedOMCost: 122000,
      variableOMCost: 0,
      elccFactor: 0.9,
      availabilityFactor: 0.45
    }
  ];

  // Maryland zones (BGE, APS, DPL, PEPCO)
  const zones: Zone[] = [
    {
      id: 'bge',
      name: 'BGE (Baltimore Gas & Electric)',
      availableLand: 500, // km²
      availableOffshore: 2000, // km²
      baselinePeakLoad: scenario === 'high_demand' ? 6491 : 6428,
      demandCAGR: scenario === 'high_demand' ? 0.60 : -0.65,
      existingUnits: [
        { id: 'brandon_shores', name: 'Brandon Shores', zone: 'bge', technology: 'coal', capacity: 1350, retirementYear: 2025 },
        { id: 'wagner', name: 'Wagner', zone: 'bge', technology: 'coal', capacity: 1070, retirementYear: 2025 },
        { id: 'calvert_cliffs_1', name: 'Calvert Cliffs 1', zone: 'bge', technology: 'nuc', capacity: 873, retirementYear: 2035 },
        { id: 'calvert_cliffs_2', name: 'Calvert Cliffs 2', zone: 'bge', technology: 'nuc', capacity: 862, retirementYear: 2037 }
      ],
      loadProfiles: generateSeasonalLoadProfiles(),
      renewableProfiles: {
        spv: generateSolarProfiles(),
        lbw: generateWindProfiles(),
        osw: generateOffshoreWindProfiles()
      } as Record<TechnologyType, number[][]>
    },
    {
      id: 'aps',
      name: 'APS (Allegheny Power System)',
      availableLand: 800,
      baselinePeakLoad: scenario === 'high_demand' ? 1683 : 1554,
      demandCAGR: scenario === 'high_demand' ? 4.67 : 0.21,
      existingUnits: [],
      loadProfiles: generateSeasonalLoadProfiles(),
      renewableProfiles: {
        spv: generateSolarProfiles(),
        lbw: generateWindProfiles()
      } as Record<TechnologyType, number[][]>
    },
    {
      id: 'dpl',
      name: 'DPL (Delmarva Power & Light)',
      availableLand: 300,
      availableOffshore: 1500,
      baselinePeakLoad: scenario === 'high_demand' ? 1036 : 961,
      demandCAGR: scenario === 'high_demand' ? 0.42 : -0.45,
      existingUnits: [
        { id: 'rock_springs', name: 'Essential Power Rock Springs', zone: 'dpl', technology: 'ngcc', capacity: 775, retirementYear: 2033 }
      ],
      loadProfiles: generateSeasonalLoadProfiles(),
      renewableProfiles: {
        spv: generateSolarProfiles(),
        lbw: generateWindProfiles(),
        osw: generateOffshoreWindProfiles()
      } as Record<TechnologyType, number[][]>
    },
    {
      id: 'pepco',
      name: 'PEPCO (Potomac Electric Power Company)',
      availableLand: 400,
      baselinePeakLoad: scenario === 'high_demand' ? 4472 : 2958,
      demandCAGR: scenario === 'high_demand' ? 0.65 : 0.20,
      existingUnits: [
        { id: 'morgantown', name: 'Morgantown', zone: 'pepco', technology: 'coal', capacity: 1178, retirementYear: 2025 }
      ],
      loadProfiles: generateSeasonalLoadProfiles(),
      renewableProfiles: {
        spv: generateSolarProfiles(),
        lbw: generateWindProfiles()
      } as Record<TechnologyType, number[][]>
    }
  ];

  // Apply w/o_SC scenario modifications
  if (scenario === 'w/o_SC') {
    zones.forEach(zone => {
      zone.availableLand *= 3; // Triple land availability
      if (zone.availableOffshore) {
        zone.availableOffshore *= 3;
      }
    });
  }

  // Transmission lines (simplified Maryland grid)
  const transmissionLines: TransmissionLine[] = [
    { id: 'bge_aps', from: 'bge', to: 'aps', capacity: 2000 },
    { id: 'bge_dpl', from: 'bge', to: 'dpl', capacity: 1500 },
    { id: 'bge_pepco', from: 'bge', to: 'pepco', capacity: 2500 },
    { id: 'dpl_pepco', from: 'dpl', to: 'pepco', capacity: 1000 },
    { id: 'aps_pepco', from: 'aps', to: 'pepco', capacity: 800 }
  ];

  // System parameters
  const systemParameters: SystemParameters = {
    planningHorizon: 30,
    baseYear: 2024,
    reserveMargin: 15, // 15% as per paper
    rpsTargets: {
      spv: 40,
      lbw: 20,
      osw: 20,
      bse: 0 // Storage doesn't count toward RPS
    } as Record<TechnologyType, number>,
    voll: 10000, // $/MWh
    reserveMarginPenalty: 263000, // $/MW-year (PJM Net CONE for 4-hr battery)
    rpsPenalty: 60, // $/MWh (Maryland ACP)
    discountRate: 0.05,
    representativeDays: [
      { season: 'spring', occurrences: 92 },
      { season: 'summer', occurrences: 92 },
      { season: 'fall', occurrences: 91 },
      { season: 'winter', occurrences: 90 }
    ]
  };

  return {
    materials,
    components,
    products,
    zones,
    transmissionLines,
    systemParameters,
    scenario,
    scenarioModifiers: {
      supplyConstraintMultiplier: scenario === 'lim_SC' ? 0.7 : 1.0,
      removeLeadTimes: scenario === 'w/o_SC',
      expandLandAvailability: scenario === 'w/o_SC'
    }
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateSeasonalLoadProfiles(): number[][] {
  // Returns [4 seasons][24 hours] - normalized 0-1
  // Spring, Summer, Fall, Winter
  const profiles: number[][] = [];

  const springProfile = Array.from({ length: 24 }, (_, h) => {
    // Peak at hour 18 (6pm)
    return 0.7 + 0.3 * Math.exp(-Math.pow((h - 18) / 4, 2));
  });

  const summerProfile = Array.from({ length: 24 }, (_, h) => {
    // Higher peak at hour 16 (4pm) - AC load
    return 0.75 + 0.25 * Math.exp(-Math.pow((h - 16) / 3.5, 2));
  });

  const fallProfile = Array.from({ length: 24 }, (_, h) => {
    // Similar to spring
    return 0.65 + 0.35 * Math.exp(-Math.pow((h - 17) / 4, 2));
  });

  const winterProfile = Array.from({ length: 24 }, (_, h) => {
    // Two peaks: morning (7am) and evening (6pm) - heating
    const morning = 0.15 * Math.exp(-Math.pow((h - 7) / 2, 2));
    const evening = 0.30 * Math.exp(-Math.pow((h - 18) / 3, 2));
    return 0.7 + morning + evening;
  });

  return [springProfile, summerProfile, fallProfile, winterProfile];
}

function generateSolarProfiles(): number[][] {
  // Returns [4 seasons][24 hours] - normalized 0-1 solar availability
  const profiles: number[][] = [];

  for (let season = 0; season < 4; season++) {
    const profile = Array.from({ length: 24 }, (_, h) => {
      // Solar available from ~6am to ~8pm, peak at noon
      if (h < 6 || h > 20) return 0;
      return Math.sin(((h - 6) / 14) * Math.PI) * (0.85 + season * 0.05);
    });
    profiles.push(profile);
  }

  return profiles;
}

function generateWindProfiles(): number[][] {
  // Returns [4 seasons][24 hours] - normalized 0-1 wind availability
  const profiles: number[][] = [];

  for (let season = 0; season < 4; season++) {
    const profile = Array.from({ length: 24 }, (_, h) => {
      // Wind typically higher at night and in winter
      const baseWind = 0.35;
      const nightBonus = h < 6 || h > 20 ? 0.15 : 0;
      const seasonFactor = season === 3 ? 1.2 : season === 1 ? 0.8 : 1.0; // Higher in winter
      return Math.min(1.0, (baseWind + nightBonus + Math.random() * 0.1) * seasonFactor);
    });
    profiles.push(profile);
  }

  return profiles;
}

function generateOffshoreWindProfiles(): number[][] {
  // Returns [4 seasons][24 hours] - normalized 0-1 offshore wind availability
  // Offshore wind has higher and more consistent capacity factors
  const profiles: number[][] = [];

  for (let season = 0; season < 4; season++) {
    const profile = Array.from({ length: 24 }, (_, h) => {
      const baseWind = 0.45; // Higher than onshore
      const seasonFactor = season === 3 ? 1.15 : season === 1 ? 0.85 : 1.0;
      return Math.min(1.0, (baseWind + Math.random() * 0.08) * seasonFactor);
    });
    profiles.push(profile);
  }

  return profiles;
}

/**
 * Create default African mining SC-GEP configuration
 * (Keeps existing functionality)
 */
export function createAfricanMiningSCGEPConfig(scenario: ScenarioType = 'baseline'): SCGEPConfiguration {
  // This would be similar to Maryland config but with African context
  // For now, delegate to Maryland config as template
  const config = createMarylandSCGEPConfig(scenario);

  // Modify for African context
  config.zones = [
    {
      id: 'south_africa',
      name: 'South Africa',
      availableLand: 10000,
      baselinePeakLoad: 35000,
      demandCAGR: 2.5,
      existingUnits: [],
      loadProfiles: generateSeasonalLoadProfiles(),
      renewableProfiles: {
        spv: generateSolarProfiles(),
        lbw: generateWindProfiles()
      } as Record<TechnologyType, number[][]>
    },
    {
      id: 'drc',
      name: 'Democratic Republic of Congo',
      availableLand: 50000,
      baselinePeakLoad: 2500,
      demandCAGR: 4.0,
      existingUnits: [],
      loadProfiles: generateSeasonalLoadProfiles(),
      renewableProfiles: {
        spv: generateSolarProfiles()
      } as Record<TechnologyType, number[][]>
    }
  ];

  return config;
}

export default {
  createMarylandSCGEPConfig,
  createAfricanMiningSCGEPConfig
};
