/**
 * Modified Mercalli Intensity (MMI) Scale
 * 
 * Converts numerical intensity values to the MMI scale (I-XII)
 * with qualitative descriptions and observed effects.
 * 
 * Reference: USGS Earthquake Intensity Scale
 * https://www.usgs.gov/programs/earthquake-hazards/modified-mercalli-intensity-scale
 */

/**
 * MMI scale definitions with thresholds, descriptions, and effects
 * 
 * Intensity thresholds are mapped from our attenuation model's output
 */
const MMI_SCALE = [
  {
    level: "I",
    numericLevel: 1,
    minIntensity: 0,
    maxIntensity: 1.5,
    name: "Not felt",
    description: "Not felt except by a very few under especially favorable conditions.",
    shaking: "Not felt",
    damage: "None",
    color: "#FFFFFF",
  },
  {
    level: "II",
    numericLevel: 2,
    minIntensity: 1.5,
    maxIntensity: 2.5,
    name: "Weak",
    description: "Felt only by a few persons at rest, especially on upper floors of buildings.",
    shaking: "Weak",
    damage: "None",
    color: "#ACD8E9",
  },
  {
    level: "III",
    numericLevel: 3,
    minIntensity: 2.5,
    maxIntensity: 3.5,
    name: "Weak",
    description: "Felt quite noticeably by persons indoors. Many people do not recognize it as an earthquake. Standing motor cars may rock slightly.",
    shaking: "Weak",
    damage: "None",
    color: "#ACD8E9",
  },
  {
    level: "IV",
    numericLevel: 4,
    minIntensity: 3.5,
    maxIntensity: 4.5,
    name: "Light",
    description: "Felt indoors by many, outdoors by few. Sensation like heavy truck striking building. Dishes, windows, doors disturbed.",
    shaking: "Light",
    damage: "None",
    color: "#7BC5A6",
  },
  {
    level: "V",
    numericLevel: 5,
    minIntensity: 4.5,
    maxIntensity: 5.5,
    name: "Moderate",
    description: "Felt by nearly everyone; many awakened. Some dishes, windows broken. Unstable objects overturned.",
    shaking: "Moderate",
    damage: "Very light",
    color: "#FDE357",
  },
  {
    level: "VI",
    numericLevel: 6,
    minIntensity: 5.5,
    maxIntensity: 6.5,
    name: "Strong",
    description: "Felt by all, many frightened. Some heavy furniture moved; a few instances of fallen plaster. Damage slight.",
    shaking: "Strong",
    damage: "Light",
    color: "#FDB462",
  },
  {
    level: "VII",
    numericLevel: 7,
    minIntensity: 6.5,
    maxIntensity: 7.5,
    name: "Very strong",
    description: "Damage negligible in buildings of good design and construction; slight to moderate in well-built ordinary structures; considerable damage in poorly built or badly designed structures.",
    shaking: "Very strong",
    damage: "Moderate",
    color: "#FB923C",
  },
  {
    level: "VIII",
    numericLevel: 8,
    minIntensity: 7.5,
    maxIntensity: 8.5,
    name: "Severe",
    description: "Damage slight in specially designed structures; considerable damage in ordinary substantial buildings with partial collapse. Damage great in poorly built structures. Heavy furniture overturned.",
    shaking: "Severe",
    damage: "Moderate to heavy",
    color: "#F87171",
  },
  {
    level: "IX",
    numericLevel: 9,
    minIntensity: 8.5,
    maxIntensity: 9.5,
    name: "Violent",
    description: "Damage considerable in specially designed structures; well-designed frame structures thrown out of plumb. Buildings shifted off foundations. Ground cracked conspicuously.",
    shaking: "Violent",
    damage: "Heavy",
    color: "#DC2626",
  },
  {
    level: "X",
    numericLevel: 10,
    minIntensity: 9.5,
    maxIntensity: 10.5,
    name: "Extreme",
    description: "Some well-built wooden structures destroyed; most masonry and frame structures destroyed with foundations. Rails bent.",
    shaking: "Extreme",
    damage: "Very heavy",
    color: "#991B1B",
  },
  {
    level: "XI",
    numericLevel: 11,
    minIntensity: 10.5,
    maxIntensity: 11.5,
    name: "Extreme",
    description: "Few, if any structures remain standing. Bridges destroyed. Rails bent greatly.",
    shaking: "Extreme",
    damage: "Very heavy",
    color: "#7F1D1D",
  },
  {
    level: "XII",
    numericLevel: 12,
    minIntensity: 11.5,
    maxIntensity: Infinity,
    name: "Extreme",
    description: "Total damage. Waves seen on ground surfaces. Objects thrown into the air.",
    shaking: "Extreme",
    damage: "Very heavy",
    color: "#450A0A",
  },
];

/**
 * Convert intensity value to MMI level with full details
 * 
 * @param {number} intensityValue - Intensity from attenuation model
 * @returns {Object} MMI information including level, name, description, effects
 * 
 * @example
 * getMMI(7.2)
 * // Returns: { level: "VII", numericLevel: 7, name: "Very strong", ... }
 */
export function getMMI(intensityValue) {
  // Handle edge cases
  if (intensityValue < 0 || isNaN(intensityValue)) {
    return MMI_SCALE[0]; // Return MMI I for invalid/negative values
  }
  
  // Find the appropriate MMI level
  for (let i = 0; i < MMI_SCALE.length; i++) {
    const level = MMI_SCALE[i];
    if (intensityValue >= level.minIntensity && intensityValue < level.maxIntensity) {
      return { ...level, intensityValue };
    }
  }
  
  // If intensity is extremely high, return MMI XII
  return { ...MMI_SCALE[MMI_SCALE.length - 1], intensityValue };
}

/**
 * Get just the MMI level string (e.g., "VII")
 * 
 * @param {number} intensityValue - Intensity from attenuation model
 * @returns {string} MMI level (I-XII)
 */
export function getMMILevel(intensityValue) {
  return getMMI(intensityValue).level;
}

/**
 * Get numeric MMI level (1-12)
 * 
 * @param {number} intensityValue - Intensity from attenuation model
 * @returns {number} Numeric MMI level
 */
export function getMMINumeric(intensityValue) {
  return getMMI(intensityValue).numericLevel;
}

/**
 * Get color code for intensity visualization
 * 
 * @param {number} intensityValue - Intensity from attenuation model
 * @returns {string} Hex color code
 */
export function getMMIColor(intensityValue) {
  return getMMI(intensityValue).color;
}

/**
 * Check if intensity corresponds to "felt" earthquake (MMI >= III)
 * 
 * @param {number} intensityValue - Intensity from attenuation model
 * @returns {boolean} True if earthquake would be noticeably felt
 */
export function isFelt(intensityValue) {
  return getMMINumeric(intensityValue) >= 3;
}

/**
 * Check if intensity corresponds to damaging earthquake (MMI >= VI)
 * 
 * @param {number} intensityValue - Intensity from attenuation model
 * @returns {boolean} True if earthquake would cause damage
 */
export function isDamaging(intensityValue) {
  return getMMINumeric(intensityValue) >= 6;
}

/**
 * Check if intensity corresponds to severe earthquake (MMI >= VIII)
 * 
 * @param {number} intensityValue - Intensity from attenuation model
 * @returns {boolean} True if earthquake would cause severe damage
 */
export function isSevere(intensityValue) {
  return getMMINumeric(intensityValue) >= 8;
}

/**
 * Get all MMI scale definitions (for UI display)
 * 
 * @returns {Array<Object>} Complete MMI scale array
 */
export function getMMIScale() {
  return MMI_SCALE.map(level => ({ ...level }));
}

/**
 * Get human-readable description of shaking and damage
 * 
 * @param {number} intensityValue - Intensity from attenuation model
 * @returns {Object} Simplified description object
 */
export function getShakingDescription(intensityValue) {
  const mmi = getMMI(intensityValue);
  
  return {
    level: mmi.level,
    numericLevel: mmi.numericLevel,
    shaking: mmi.shaking,
    damage: mmi.damage,
    description: mmi.description,
    color: mmi.color,
  };
}

/**
 * Get intensity range for a given MMI level (inverse lookup)
 * 
 * @param {string|number} mmiLevel - MMI level ("VII" or 7)
 * @returns {Object|null} Intensity range or null if not found
 */
export function getIntensityRangeForMMI(mmiLevel) {
  // Convert to numeric if string
  const numericLevel = typeof mmiLevel === 'string' 
    ? romanToNumeric(mmiLevel)
    : mmiLevel;
  
  const level = MMI_SCALE.find(l => l.numericLevel === numericLevel);
  
  if (!level) return null;
  
  return {
    min: level.minIntensity,
    max: level.maxIntensity,
    level: level.level,
  };
}

/**
 * Convert Roman numeral MMI to numeric (helper function)
 * 
 * @param {string} roman - Roman numeral (I-XII)
 * @returns {number} Numeric value (1-12)
 */
function romanToNumeric(roman) {
  const romanMap = {
    'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6,
    'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10, 'XI': 11, 'XII': 12,
  };
  
  return romanMap[roman.toUpperCase()] || 1;
}

/**
 * Get PGA estimate from MMI (very rough approximation)
 * 
 * PGA = Peak Ground Acceleration
 * This is a simplified conversion, not scientifically rigorous
 * 
 * @param {number} intensityValue - Intensity from attenuation model
 * @returns {number} Estimated PGA in %g (percentage of gravity)
 */
export function estimatePGA(intensityValue) {
  const mmi = getMMINumeric(intensityValue);
  
  // Rough MMI to PGA conversion (Wald et al. 1999)
  // PGA ≈ 10^((MMI - 3.7) / 2.2)
  const pgaInG = Math.pow(10, (mmi - 3.7) / 2.2);
  const pgaPercent = pgaInG * 100;
  
  return Math.max(pgaPercent, 0);
}

/**
 * Get qualitative description based on intensity
 * 
 * @param {number} intensityValue - Intensity from attenuation model
 * @returns {string} Simple one-line description
 */
export function getSimpleDescription(intensityValue) {
  const mmi = getMMINumeric(intensityValue);
  
  if (mmi <= 2) return "Not felt by most people";
  if (mmi === 3) return "Felt by people at rest, indoors";
  if (mmi === 4) return "Felt by most people indoors";
  if (mmi === 5) return "Felt by everyone, minor damage possible";
  if (mmi === 6) return "Slight damage to buildings";
  if (mmi === 7) return "Moderate damage to ordinary buildings";
  if (mmi === 8) return "Considerable damage, buildings may collapse";
  if (mmi === 9) return "Heavy damage, ground cracks visible";
  if (mmi === 10) return "Most buildings destroyed";
  if (mmi >= 11) return "Total devastation";
  
  return "Unknown";
}