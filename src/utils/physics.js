// src/utils/physics.js

const DENSITY_ASTEROID = 3000; // kg/m^3 (a reasonable average for stony asteroids)
const JOULES_PER_MEGATON_TNT = 4.184e15;

/**
 * Calculates the kinetic energy of an impact.
 * @param {number} diameterMeters - Asteroid diameter in meters.
 * @param {number} velocityKps - Asteroid velocity in kilometers per second.
 * @returns {object} - Contains energy in Joules and Megatons of TNT.
 */
export const calculateImpactEnergy = (diameterMeters, velocityKps) => {
  if (!diameterMeters || !velocityKps) return { joules: 0, megatons: 0 };

  const radius = diameterMeters / 2;
  const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
  const mass = DENSITY_ASTEROID * volume;
  const velocityMps = velocityKps * 1000; // Convert km/s to m/s

  const joules = 0.5 * mass * Math.pow(velocityMps, 2);
  const megatons = joules / JOULES_PER_MEGATON_TNT;

  return { joules, megatons };
};

/**
 * Estimates crater diameter using a simplified scaling law.
 * @param {number} energyJoules - Impact energy in Joules.
 * @returns {number} - Estimated crater diameter in kilometers.
 */
export const calculateCraterDiameter = (energyJoules) => {
  if (energyJoules <= 0) return 0;
  // Simplified approximation for a complex process. This is fine for the hackathon.
  const craterDiameterMeters = 0.08 * Math.pow(energyJoules, 1 / 3.4);
  return craterDiameterMeters / 1000; // convert to km
};

/**
 * Estimates equivalent seismic magnitude (Richter scale).
 * @param {number} energyJoules - Impact energy in Joules.
 * @returns {number} - Estimated magnitude on the Richter scale.
 */
export const calculateSeismicMagnitude = (energyJoules) => {
  if (energyJoules <= 0) return 0;
  // Formula to relate impact energy to seismic magnitude
  const magnitude = (Math.log10(energyJoules) - 4.4) / 1.5;
  return magnitude;
};
