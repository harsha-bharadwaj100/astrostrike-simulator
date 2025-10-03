// --- SIMULATION CONSTANTS (scaled for our 3D scene) ---
export const G = 6.6743e-11; // Gravitational constant
export const M_EARTH = 5.972e24; // Mass of Earth in kg

// Scaling factors to make the simulation visible and manageable
const DISTANCE_SCALE = 1 / 3e6; // 1 unit in 3D space = 3,000 km in real life
const TIME_SCALE = 60 * 30; // 1 second of real time = 30 minutes of simulation time

// Initial state for the Earth (which is static at the origin in our scene)
export const earth = {
  mass: M_EARTH,
  position: { x: 0, y: 0, z: 0 },
};

// --- IMPACT CALCULATION FUNCTIONS (retained for the 2D panel) ---
const DENSITY_ASTEROID = 3000; // kg/m^3 (a reasonable average for stony asteroids)
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

// --- The core physics update function ---
export const updateAsteroid = (asteroid, dt) => {
  // 1. Calculate distance and direction vector from asteroid to Earth
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

  // 2. Calculate gravitational force magnitude
  const realDistance = distance / DISTANCE_SCALE;
  const forceMagnitude =
    (G * earth.mass * asteroid.mass) / (realDistance * realDistance);

  // 3. Calculate acceleration vector
  const acceleration = {
    x: (forceDirection.x * forceMagnitude) / asteroid.mass,
    y: (forceDirection.y * forceMagnitude) / asteroid.mass,
    z: (forceDirection.z * forceMagnitude) / asteroid.mass,
  };

  // 4. Update velocity (scaled for time)
  const timeStep = dt * TIME_SCALE;
  asteroid.velocity.x += acceleration.x * timeStep * DISTANCE_SCALE;
  asteroid.velocity.y += acceleration.y * timeStep * DISTANCE_SCALE;
  asteroid.velocity.z += acceleration.z * timeStep * DISTANCE_SCALE;

  // 5. Update position
  asteroid.position.x += asteroid.velocity.x * timeStep;
  asteroid.position.y += asteroid.velocity.y * timeStep;
  asteroid.position.z += asteroid.velocity.z * timeStep;

  return asteroid;
};
