/**
 * Geographic utility functions for earthquake distance calculations
 * 
 * All distances returned in kilometers
 */

const EARTH_RADIUS_KM = 6371;

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate great-circle distance between two points using Haversine formula
 * 
 * @param {number} lat1 - Latitude of point 1 (degrees, negative for South)
 * @param {number} lon1 - Longitude of point 1 (degrees, negative for West)
 * @param {number} lat2 - Latitude of point 2 (degrees, negative for South)
 * @param {number} lon2 - Longitude of point 2 (degrees, negative for West)
 * @returns {number} Horizontal distance in kilometers
 * 
 * @example
 * // Distance from Santiago to Valparaíso
 * calculateDistance(-33.4489, -70.6693, -33.0472, -71.6127)
 * // Returns: ~119 km
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = EARTH_RADIUS_KM * c;

  return distance;
}

/**
 * Calculate hypocentral distance (3D distance from earthquake focus to surface point)
 * 
 * This is the actual distance seismic waves travel from the earthquake hypocenter
 * to a location on the surface, accounting for depth.
 * 
 * Formula: R = sqrt(horizontal_distance² + depth²)
 * 
 * @param {number} epicenterLat - Latitude of epicenter (degrees, negative for South)
 * @param {number} epicenterLon - Longitude of epicenter (degrees, negative for West)
 * @param {number} siteLat - Latitude of site (degrees, negative for South)
 * @param {number} siteLon - Longitude of site (degrees, negative for West)
 * @param {number} depth - Earthquake depth in kilometers (positive value)
 * @returns {number} Hypocentral distance in kilometers
 * 
 * @example
 * // 2010 Maule earthquake felt in Santiago
 * // Epicenter: -35.846, -72.719, depth: 35 km
 * // Santiago: -33.4489, -70.6693
 * calculateHypocentralDistance(-35.846, -72.719, -33.4489, -70.6693, 35)
 * // Returns: ~337 km
 */
export function calculateHypocentralDistance(
  epicenterLat,
  epicenterLon,
  siteLat,
  siteLon,
  depth
) {
  const horizontalDistance = calculateDistance(
    epicenterLat,
    epicenterLon,
    siteLat,
    siteLon
  );

  const hypocentralDistance = Math.sqrt(
    Math.pow(horizontalDistance, 2) + Math.pow(depth, 2)
  );

  return hypocentralDistance;
}

/**
 * Get bearing from point 1 to point 2 (for visualization purposes)
 * 
 * @param {number} lat1 - Latitude of point 1 (degrees)
 * @param {number} lon1 - Longitude of point 1 (degrees)
 * @param {number} lat2 - Latitude of point 2 (degrees)
 * @param {number} lon2 - Longitude of point 2 (degrees)
 * @returns {number} Bearing in degrees (0-360, where 0 is North)
 */
export function calculateBearing(lat1, lon1, lat2, lon2) {
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δλ = toRadians(lon2 - lon1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) -
            Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const θ = Math.atan2(y, x);
  const bearing = ((θ * 180 / Math.PI) + 360) % 360;

  return bearing;
}

/**
 * Validate geographic coordinates
 * 
 * @param {number} lat - Latitude (must be between -90 and 90)
 * @param {number} lon - Longitude (must be between -180 and 180)
 * @returns {boolean} True if coordinates are valid
 */
export function isValidCoordinate(lat, lon) {
  return (
    typeof lat === 'number' &&
    typeof lon === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180 &&
    !isNaN(lat) &&
    !isNaN(lon)
  );
}

/**
 * Validate depth value
 * 
 * @param {number} depth - Depth in kilometers
 * @returns {boolean} True if depth is valid (positive number, reasonable range)
 */
export function isValidDepth(depth) {
  return (
    typeof depth === 'number' &&
    depth >= 0 &&
    depth <= 700 && // Maximum reasonable earthquake depth
    !isNaN(depth)
  );
}