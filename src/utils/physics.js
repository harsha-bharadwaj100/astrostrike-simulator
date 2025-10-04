// --- SIMULATION CONSTANTS (scaled for our 3D scene) ---
export const G = 6.6743e-11; // Gravitational constant
export const M_EARTH = 5.972e24; // Mass of Earth in kg

const DISTANCE_SCALE = 1 / 3e6;
const TIME_SCALE = 60 * 30;

export const earth = {
  mass: M_EARTH,
  position: { x: 0, y: 0, z: 0 },
};

// --- IMPACT CALCULATION FUNCTIONS ---
const DENSITY_ASTEROID = 3000;
const JOULES_PER_MEGATON_TNT = 4.184e15;

export const calculateImpactEnergy = (diameterMeters, velocityKps) => {
  if (!diameterMeters || !velocityKps) return { joules: 0, megatons: 0 };
  const radius = diameterMeters / 2;
  const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
  const mass = DENSITY_ASTEROID * volume;
  const velocityMps = velocityKps * 1000;
  const joules = 0.5 * mass * Math.pow(velocityMps, 2);
  const megatons = joules / JOULES_PER_MEGATON_TNT;
  return { joules, megatons };
};

export const calculateCraterDiameter = (energyJoules) => {
  if (energyJoules <= 0) return 0;
  const craterDiameterMeters = 0.08 * Math.pow(energyJoules, 1 / 3.4);
  return craterDiameterMeters / 1000;
};

export const calculateSeismicMagnitude = (energyJoules) => {
  if (energyJoules <= 0) return 0;
  const magnitude = (Math.log10(energyJoules) - 4.4) / 1.5;
  return magnitude;
};

// --- NEW FUNCTIONS ---
export const calculateEnergyDistribution = (energyMegatons, velocityKps) => {
  // This model simulates how energy shifts from airburst to ground impact.
  // We create a "ground coupling" factor. High velocity & energy = high coupling.
  const velocityFactor = Math.min(velocityKps / 40, 1); // Normalize velocity up to 40 km/s
  const energyFactor = Math.min(energyMegatons / 100000, 1); // Normalize energy up to 100,000 MT

  // Combine factors, giving more weight to energy
  const groundCoupling = Math.min(
    0.1 + velocityFactor * 0.3 + energyFactor * 0.6,
    1
  );

  // Partition energy based on this coupling factor
  const seismic = 5 + 25 * groundCoupling;
  const cratering = 2 + 20 * groundCoupling;
  const thermal = 40 - 20 * groundCoupling;
  const airBlast = 100 - seismic - cratering - thermal;

  return { airBlast, thermal, seismic, cratering };
};

export const haversineDistance = (coords1, coords2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(coords2.lat - coords1.lat);
  const dLon = toRad(coords2.lng - coords1.lng);
  const lat1 = toRad(coords1.lat);
  const lat2 = toRad(coords2.lat);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// --- The core physics update function ---
export const updateAsteroid = (asteroid, dt) => {
  const dx = earth.position.x - asteroid.position.x;
  const dy = earth.position.y - asteroid.position.y;
  const dz = earth.position.z - asteroid.position.z;
  const distanceSq = dx * dx + dy * dy + dz * dz;
  const distance = Math.sqrt(distanceSq);
  const forceDirection = {
    x: dx / distance,
    y: dy / distance,
    z: dz / distance,
  };
  const realDistance = distance / DISTANCE_SCALE;
  const forceMagnitude =
    (G * earth.mass * asteroid.mass) / (realDistance * realDistance);
  const acceleration = {
    x: (forceDirection.x * forceMagnitude) / asteroid.mass,
    y: (forceDirection.y * forceMagnitude) / asteroid.mass,
    z: (forceDirection.z * forceMagnitude) / asteroid.mass,
  };
  const timeStep = dt * TIME_SCALE;
  asteroid.velocity.x += acceleration.x * timeStep * DISTANCE_SCALE;
  asteroid.velocity.y += acceleration.y * timeStep * DISTANCE_SCALE;
  asteroid.velocity.z += acceleration.z * timeStep * DISTANCE_SCALE;
  asteroid.position.x += asteroid.velocity.x * timeStep;
  asteroid.position.y += asteroid.velocity.y * timeStep;
  asteroid.position.z += asteroid.velocity.z * timeStep;
  return asteroid;
};
