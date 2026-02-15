/**
 * Earthquake damage estimation model
 * 
 * Converts ground motion intensity to estimated damage percentage
 * using a logistic (sigmoid) function.
 * 
 * This is a simplified model for educational purposes.
 * Real damage assessment requires:
 * - Building vulnerability classes
 * - Construction standards/codes
 * - Building age and maintenance
 * - Soil conditions and amplification
 * - Duration of shaking
 */

/**
 * Damage model parameters
 * 
 * Logistic function: Damage% = 100 / (1 + e^(-k*(I - threshold)))
 * 
 * Where:
 *   I = Intensity value from attenuation model
 *   k = Steepness of damage curve (how quickly damage increases)
 *   threshold = Intensity at which damage becomes significant (50% damage point)
 */
const DAMAGE_PARAMETERS = {
  k: 1.5,           // Steepness factor (higher = sharper transition)
  threshold: 6.0,   // Intensity threshold (~MMI VI, onset of damage)
};

/**
 * Calculate damage percentage using logistic function
 * 
 * @param {number} intensityValue - Intensity from attenuation model
 * @returns {number} Damage percentage (0-100)
 * 
 * @example
 * estimateDamage(7.2)  // MMI VII
 * // Returns: ~76% (considerable damage expected)
 * 
 * estimateDamage(5.0)  // MMI V
 * // Returns: ~18% (minor damage)
 */
export function estimateDamage(intensityValue) {
  if (intensityValue < 0 || isNaN(intensityValue)) {
    return 0;
  }
  
  const { k, threshold } = DAMAGE_PARAMETERS;
  
  // Logistic (sigmoid) function
  const damagePercent = 100 / (1 + Math.exp(-k * (intensityValue - threshold)));
  
  // Clamp to 0-100 range
  return Math.max(0, Math.min(100, damagePercent));
}

/**
 * Get damage severity category
 * 
 * @param {number} damagePercent - Damage percentage (0-100)
 * @returns {Object} Damage category with description
 */
export function getDamageCategory(damagePercent) {
  if (damagePercent < 5) {
    return {
      category: "None",
      description: "No significant damage expected",
      color: "#10B981", // Green
      severity: 0,
    };
  } else if (damagePercent < 15) {
    return {
      category: "Very Light",
      description: "Minor cosmetic damage, no structural issues",
      color: "#84CC16", // Light green
      severity: 1,
    };
  } else if (damagePercent < 30) {
    return {
      category: "Light",
      description: "Some cracks in walls, minor damage to chimneys",
      color: "#FDE047", // Yellow
      severity: 2,
    };
  } else if (damagePercent < 50) {
    return {
      category: "Moderate",
      description: "Damage to chimneys, plaster falls, some structural damage",
      color: "#FB923C", // Orange
      severity: 3,
    };
  } else if (damagePercent < 70) {
    return {
      category: "Heavy",
      description: "Significant structural damage, partial collapse possible",
      color: "#F87171", // Red
      severity: 4,
    };
  } else {
    return {
      category: "Very Heavy",
      description: "Severe structural damage, widespread collapse",
      color: "#DC2626", // Dark red
      severity: 5,
    };
  }
}

/**
 * Estimate affected population
 * 
 * @param {number} totalPopulation - Total population in area
 * @param {number} damagePercent - Damage percentage (0-100)
 * @returns {Object} Affected population statistics
 */
export function estimateAffectedPopulation(totalPopulation, damagePercent) {
  if (totalPopulation < 0 || damagePercent < 0) {
    return {
      total: 0,
      affected: 0,
      displaced: 0,
      percentAffected: 0,
    };
  }
  
  // Estimate percentage of population affected
  // At low damage, fewer people affected; at high damage, more people affected
  const affectedPercent = Math.min(damagePercent * 1.2, 100); // Slightly higher than damage%
  const affected = Math.round((totalPopulation * affectedPercent) / 100);
  
  // Estimate displaced population (severe damage only)
  // Only significant displacement when damage > 40%
  const displacementFactor = Math.max(0, (damagePercent - 40) / 60);
  const displaced = Math.round(affected * displacementFactor);
  
  return {
    total: totalPopulation,
    affected,
    displaced,
    percentAffected: Math.round(affectedPercent * 10) / 10, // Round to 1 decimal
  };
}

/**
 * Get building damage breakdown by construction type
 * 
 * @param {number} intensityValue - Intensity from attenuation model
 * @returns {Object} Damage estimates for different building types
 */
export function getBuildingDamageByType(intensityValue) {
  const baseDamage = estimateDamage(intensityValue);
  
  return {
    // Modern engineered buildings (better resistance)
    modern: {
      type: "Modern/Engineered",
      damage: Math.max(0, baseDamage * 0.4), // 60% more resistant
      description: "Reinforced concrete, seismic design",
    },
    
    // Standard construction (average)
    standard: {
      type: "Standard Construction",
      damage: baseDamage,
      description: "Well-built ordinary structures",
    },
    
    // Older/unreinforced buildings (more vulnerable)
    unreinforced: {
      type: "Unreinforced Masonry",
      damage: Math.min(100, baseDamage * 1.6), // 60% more vulnerable
      description: "Older buildings, no seismic design",
    },
    
    // Informal/poor construction (most vulnerable)
    informal: {
      type: "Informal Construction",
      damage: Math.min(100, baseDamage * 2.0), // 100% more vulnerable
      description: "Poor quality, non-engineered",
    },
  };
}

/**
 * Calculate expected economic losses (very rough estimate)
 * 
 * @param {number} damagePercent - Damage percentage (0-100)
 * @param {number} totalPopulation - Total population in area
 * @param {number} gdpPerCapita - GDP per capita in USD (optional)
 * @returns {Object} Economic loss estimates
 */
export function estimateEconomicLoss(damagePercent, totalPopulation, gdpPerCapita = 15000) {
  // Very simplified model
  // Assumes average building value per person and damage correlation
  
  const averageBuildingValuePerPerson = gdpPerCapita * 3; // Rough multiplier
  const totalBuildingValue = totalPopulation * averageBuildingValuePerPerson;
  
  // Loss increases non-linearly with damage
  const lossFactor = Math.pow(damagePercent / 100, 1.3); // Exponential factor
  const directLoss = totalBuildingValue * lossFactor;
  
  // Indirect losses (economic disruption)
  const indirectLoss = directLoss * 0.3; // ~30% of direct losses
  
  return {
    directLoss: Math.round(directLoss),
    indirectLoss: Math.round(indirectLoss),
    totalLoss: Math.round(directLoss + indirectLoss),
    percentOfGDP: Math.round((directLoss + indirectLoss) / (totalPopulation * gdpPerCapita) * 1000) / 10,
  };
}

/**
 * Get damage curve for visualization
 * 
 * Returns damage% at various intensity values for plotting
 * 
 * @param {number} minIntensity - Minimum intensity (default: 0)
 * @param {number} maxIntensity - Maximum intensity (default: 12)
 * @param {number} steps - Number of data points (default: 100)
 * @returns {Array<{intensity: number, damage: number}>} Array of intensity-damage pairs
 */
export function getDamageCurve(minIntensity = 0, maxIntensity = 12, steps = 100) {
  const curve = [];
  const stepSize = (maxIntensity - minIntensity) / steps;
  
  for (let i = 0; i <= steps; i++) {
    const intensity = minIntensity + (i * stepSize);
    const damage = estimateDamage(intensity);
    curve.push({ intensity, damage });
  }
  
  return curve;
}

/**
 * Compare damage across multiple scenarios
 * 
 * @param {Array<{magnitude: number, depth: number, distance: number}>} scenarios
 * @param {Function} calculateIntensity - Intensity calculation function
 * @returns {Array<Object>} Damage comparison for each scenario
 */
export function compareDamageScenarios(scenarios, calculateIntensity) {
  return scenarios.map((scenario, index) => {
    const intensity = calculateIntensity(
      scenario.magnitude,
      scenario.depth,
      scenario.distance
    );
    const damage = estimateDamage(intensity);
    const category = getDamageCategory(damage);
    
    return {
      scenarioId: index + 1,
      ...scenario,
      intensity,
      damage,
      category: category.category,
      severity: category.severity,
    };
  });
}

/**
 * Get damage model parameters (for debugging/display)
 * 
 * @returns {Object} Current damage model parameters
 */
export function getDamageParameters() {
  return { ...DAMAGE_PARAMETERS };
}

/**
 * Estimate casualty risk (very rough approximation)
 * 
 * WARNING: This is highly simplified and should be used with extreme caution.
 * Real casualty estimation requires detailed building inventory and population distribution.
 * 
 * @param {number} totalPopulation - Total population in area
 * @param {number} damagePercent - Damage percentage (0-100)
 * @returns {Object} Casualty risk estimates
 */
export function estimateCasualtyRisk(totalPopulation, damagePercent) {
  // Only estimate casualties for severe damage (>60%)
  if (damagePercent < 60) {
    return {
      low: 0,
      medium: 0,
      high: 0,
      description: "Casualties unlikely at this damage level",
    };
  }
  
  // Very rough fatality rate based on historical data
  // Ranges from 0.01% (damage = 60%) to 1% (damage = 100%)
  const fatalityRate = Math.pow((damagePercent - 60) / 40, 2) * 0.01;
  
  const estimated = Math.round(totalPopulation * fatalityRate);
  
  return {
    low: Math.round(estimated * 0.5),
    medium: estimated,
    high: Math.round(estimated * 2),
    description: "Estimated casualties (very rough approximation)",
    warning: "This is a simplified model - actual casualties depend on many factors including time of day, building codes, and emergency response",
  };
}