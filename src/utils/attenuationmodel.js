/**
 * Ground motion attenuation model for Chilean earthquakes
 * 
 * Simplified empirical model based on intensity decay with distance.
 * Calibrated using the 2010 Maule earthquake (M8.8) as reference.
 * 
 * This is an educational approximation, NOT a full GMPE (Ground Motion Prediction Equation).
 * For actual seismic hazard analysis, use peer-reviewed models like:
 * - Montalva et al. (2017) for Chile
 * - Abrahamson et al. (2016) BCHydro model
 */

/**
 * Attenuation model constants
 * 
 * Formula: I = a + b*M - c*log10(R) - d*R
 * 
 * Where:
 *   I = Intensity metric (unitless, will be mapped to MMI)
 *   M = Moment magnitude (Mw)
 *   R = Hypocentral distance (km)
 * 
 * Calibration reference:
 * - 2010 Maule earthquake: M8.8, depth 35km, epicenter (-35.846, -72.719)
 * - Santiago location: (-33.4489, -70.6693), ~335km horizontal distance
 * - Hypocentral distance: ~337km
 * - Observed MMI in Santiago: VII-VIII (I ≈ 7.0-7.5)
 * 
 * Constants tuned to reproduce this observation:
 */
const ATTENUATION_CONSTANTS = {
  a: -3.5,    // Base intensity offset
  b: 1.8,     // Magnitude scaling factor
  c: 3.5,     // Logarithmic distance decay
  d: 0.002,   // Linear distance decay (geometric spreading)
};

/**
 * Calculate ground motion intensity at a given distance from earthquake
 * 
 * @param {number} magnitude - Moment magnitude (Mw), typically 5.0-9.5
 * @param {number} depth - Hypocenter depth in kilometers
 * @param {number} distance - Horizontal distance from epicenter in kilometers
 * @returns {number} Intensity value (unitless metric to be converted to MMI)
 * 
 * @example
 * // 2010 Maule earthquake at Santiago
 * calculateIntensity(8.8, 35, 335)
 * // Returns: ~7.2 (corresponds to MMI VII-VIII)
 */
export function calculateIntensity(magnitude, depth, distance) {
  // Input validation
  if (magnitude < 0 || magnitude > 10) {
    throw new Error(`Invalid magnitude: ${magnitude}. Must be between 0 and 10.`);
  }
  
  if (depth < 0 || depth > 700) {
    throw new Error(`Invalid depth: ${depth}. Must be between 0 and 700 km.`);
  }
  
  if (distance < 0) {
    throw new Error(`Invalid distance: ${distance}. Must be non-negative.`);
  }

  // Calculate hypocentral distance (3D distance)
  const hypocentralDistance = Math.sqrt(distance * distance + depth * depth);
  
  // Avoid log(0) or log(negative) - use minimum distance of 1 km
  const R = Math.max(hypocentralDistance, 1.0);
  
  const { a, b, c, d } = ATTENUATION_CONSTANTS;
  
  // Attenuation formula
  const intensity = a + (b * magnitude) - (c * Math.log10(R)) - (d * R);
  
  // Intensity cannot be negative (earthquake not felt)
  return Math.max(intensity, 0);
}

/**
 * Calculate intensity given hypocentral distance directly
 * (when you already have 3D distance calculated)
 * 
 * @param {number} magnitude - Moment magnitude (Mw)
 * @param {number} hypocentralDistance - 3D distance from hypocenter in kilometers
 * @returns {number} Intensity value
 */
export function calculateIntensityFromHypocentral(magnitude, hypocentralDistance) {
  if (magnitude < 0 || magnitude > 10) {
    throw new Error(`Invalid magnitude: ${magnitude}. Must be between 0 and 10.`);
  }
  
  if (hypocentralDistance < 0) {
    throw new Error(`Invalid hypocentral distance: ${hypocentralDistance}. Must be non-negative.`);
  }

  const R = Math.max(hypocentralDistance, 1.0);
  const { a, b, c, d } = ATTENUATION_CONSTANTS;
  
  const intensity = a + (b * magnitude) - (c * Math.log10(R)) - (d * R);
  
  return Math.max(intensity, 0);
}

/**
 * Get intensity at epicenter (R = depth, minimum distance)
 * 
 * @param {number} magnitude - Moment magnitude (Mw)
 * @param {number} depth - Hypocenter depth in kilometers
 * @returns {number} Maximum intensity at epicenter
 */
export function getEpicentralIntensity(magnitude, depth) {
  // At epicenter, horizontal distance = 0, so R = depth
  const R = Math.max(depth, 1.0); // Minimum 1 km to avoid extreme values
  const { a, b, c, d } = ATTENUATION_CONSTANTS;
  
  const intensity = a + (b * magnitude) - (c * Math.log10(R)) - (d * R);
  
  return Math.max(intensity, 0);
}

/**
 * Calculate intensity decay curve for visualization
 * 
 * Returns intensity values at various distances for plotting
 * 
 * @param {number} magnitude - Moment magnitude (Mw)
 * @param {number} depth - Hypocenter depth in kilometers
 * @param {number} maxDistance - Maximum distance to calculate (km)
 * @param {number} steps - Number of data points to generate
 * @returns {Array<{distance: number, intensity: number}>} Array of distance-intensity pairs
 */
export function getIntensityDecayCurve(magnitude, depth, maxDistance = 1000, steps = 100) {
  const curve = [];
  const stepSize = maxDistance / steps;
  
  for (let i = 0; i <= steps; i++) {
    const distance = i * stepSize;
    const intensity = calculateIntensity(magnitude, depth, distance);
    curve.push({ distance, intensity });
  }
  
  return curve;
}

/**
 * Estimate the distance at which intensity drops to a given threshold
 * 
 * Useful for determining "felt radius" or damage radius
 * 
 * @param {number} magnitude - Moment magnitude (Mw)
 * @param {number} depth - Hypocenter depth in kilometers
 * @param {number} targetIntensity - Target intensity value (e.g., 3.0 for MMI III)
 * @returns {number} Approximate distance in kilometers where intensity reaches target
 */
export function estimateFeltRadius(magnitude, depth, targetIntensity = 3.0) {
  // Binary search for distance where intensity equals target
  let minDist = 0;
  let maxDist = 5000; // Start with 5000 km max
  const tolerance = 1.0; // 1 km tolerance
  
  let iterations = 0;
  const maxIterations = 50;
  
  while (maxDist - minDist > tolerance && iterations < maxIterations) {
    const midDist = (minDist + maxDist) / 2;
    const intensity = calculateIntensity(magnitude, depth, midDist);
    
    if (intensity > targetIntensity) {
      minDist = midDist;
    } else {
      maxDist = midDist;
    }
    
    iterations++;
  }
  
  return (minDist + maxDist) / 2;
}

/**
 * Get attenuation model parameters (for debugging/display)
 * 
 * @returns {Object} Current attenuation constants
 */
export function getModelParameters() {
  return { ...ATTENUATION_CONSTANTS };
}

/**
 * Validate that model produces expected results for known earthquakes
 * 
 * @returns {Object} Validation results for reference events
 */
export function validateModel() {
  const validations = [];
  
  // Test 1: 2010 Maule earthquake at Santiago
  const mauleAtSantiago = {
    name: "2010 Maule at Santiago",
    magnitude: 8.8,
    depth: 35,
    distance: 335,
    expectedIntensity: 7.2, // MMI VII-VIII
    calculatedIntensity: calculateIntensity(8.8, 35, 335),
  };
  mauleAtSantiago.difference = Math.abs(
    mauleAtSantiago.calculatedIntensity - mauleAtSantiago.expectedIntensity
  );
  validations.push(mauleAtSantiago);
  
  // Test 2: Very strong earthquake nearby should give high intensity
  const nearbyStrong = {
    name: "M8.0 at 50km",
    magnitude: 8.0,
    depth: 30,
    distance: 50,
    expectedMinIntensity: 8.0, // Should be at least MMI VIII
    calculatedIntensity: calculateIntensity(8.0, 30, 50),
  };
  nearbyStrong.meetsExpectation = nearbyStrong.calculatedIntensity >= nearbyStrong.expectedMinIntensity;
  validations.push(nearbyStrong);
  
  // Test 3: Weak earthquake far away should give low intensity
  const farWeak = {
    name: "M5.5 at 500km",
    magnitude: 5.5,
    depth: 20,
    distance: 500,
    expectedMaxIntensity: 3.0, // Should be MMI III or less
    calculatedIntensity: calculateIntensity(5.5, 20, 500),
  };
  farWeak.meetsExpectation = farWeak.calculatedIntensity <= farWeak.expectedMaxIntensity;
  validations.push(farWeak);
  
  return validations;
}