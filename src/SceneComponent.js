// src/SceneComponent.js
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Line, Sphere, Decal } from "@react-three/drei";
import * as THREE from "three";
import { updateAsteroid } from "./utils/physics";
import Earth from "./Earth";

const TRAIL_LENGTH = 200;

// This component will generate the crater texture and project it onto the Earth
const ImpactCrater = ({ earthRef, impactVector, craterSize }) => {
  // Generate a dynamic crater texture using a canvas
  const craterTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    const size = 256;
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");

    const gradient = context.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );

    // Create a crater-like gradient (dark center, bright rim, fading out)
    gradient.addColorStop(0, "rgba(0,0,0,0.8)");
    gradient.addColorStop(0.6, "rgba(50,50,50,0.7)");
    gradient.addColorStop(0.8, "rgba(200,200,200,0.4)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);

    return new THREE.CanvasTexture(canvas);
  }, []);

  // Calculate the rotation so the decal faces away from the center of the Earth
  const rotation = useMemo(() => {
    const matrix = new THREE.Matrix4().lookAt(
      impactVector,
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 1, 0) // Up vector
    );
    return new THREE.Euler().setFromRotationMatrix(matrix);
  }, [impactVector]);

  // Scale the decal based on the crater diameter
  // Earth's radius is 2, so we scale the decal relative to that.
  const scale = craterSize / 1000; // A rough scaling factor, adjust as needed

  return (
    <Decal
      position={impactVector}
      rotation={rotation}
      scale={[scale, scale, scale]}
      map={craterTexture}
      polygonOffset
      polygonOffsetFactor={-1} // Prevents z-fighting
    />
  );
};

// The main simulation logic
const Simulation = ({ details, customParams, mode, mitigation, onImpact }) => {
  const [asteroid, setAsteroid] = useState(null);
  const [trail, setTrail] = useState([]);
  const [isSimulating, setIsSimulating] = useState(true);

  // This effect initializes or resets the simulation
  useEffect(() => {
    let initialVelocity, diameter;
    if (mode === "preset" && details) {
      const vel = details.close_approach_data[0].relative_velocity;
      initialVelocity = {
        x: parseFloat(vel.kilometers_per_second),
        y: 0,
        z: 0,
      };
      diameter = details.estimated_diameter.meters.estimated_diameter_max;
    } else {
      initialVelocity = { x: parseFloat(customParams.velocity), y: 0, z: 0 };
      diameter = customParams.diameter;
    }

    const density = 3000; // kg/m^3
    const radius = diameter / 2;
    const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
    const mass = density * volume;

    const newAsteroid = {
      mass: mass,
      position: { x: -30, y: 2.2, z: 0 },
      velocity: {
        x: (initialVelocity.x * 1000) / 3e6,
        y: (initialVelocity.y * 1000) / 3e6,
        z: (initialVelocity.z * 1000) / 3e6,
      },
    };
    setAsteroid(newAsteroid);
    setTrail([
      new THREE.Vector3(
        newAsteroid.position.x,
        newAsteroid.position.y,
        newAsteroid.position.z
      ),
    ]);
    setIsSimulating(true);
  }, [details, customParams, mode]);

  // This effect applies the impulse from the mitigation slider
  useEffect(() => {
    if (mitigation.isActive && asteroid) {
      setAsteroid((prev) => {
        const newVel = { ...prev.velocity };
        const impulseMagnitude = mitigation.velocityChange * 1e-5;
        newVel.y = impulseMagnitude; // Set velocity directly instead of adding
        return { ...prev, velocity: newVel };
      });
    }
  }, [mitigation.velocityChange]);

  // The main simulation loop
  useFrame((state, delta) => {
    if (isSimulating && asteroid) {
      const updatedAsteroid = updateAsteroid({ ...asteroid }, delta);
      const posVec = new THREE.Vector3(
        updatedAsteroid.position.x,
        updatedAsteroid.position.y,
        updatedAsteroid.position.z
      );

      // Earth radius is 2, so impact occurs when distance is less than 2
      if (posVec.length() < 2) {
        setIsSimulating(false);
        // Call onImpact with the final position vector on the Earth's surface
        onImpact(posVec.normalize().multiplyScalar(2));
      } else {
        setAsteroid(updatedAsteroid);
        setTrail((currentTrail) => {
          const newTrail = [...currentTrail, posVec];
          return newTrail.slice(-TRAIL_LENGTH);
        });
      }
    }
  });

  return (
    <>
      {asteroid && isSimulating && (
        <Sphere
          position={[
            asteroid.position.x,
            asteroid.position.y,
            asteroid.position.z,
          ]}
          args={[0.2, 16, 16]}
        >
          <meshStandardMaterial color="gray" />
        </Sphere>
      )}
      {trail.length > 1 && isSimulating && (
        <Line points={trail} color="#e94560" lineWidth={2} />
      )}
    </>
  );
};

// The main exported component that sets up the scene
const SceneComponent = (props) => {
  const { onImpact, simResults, impactOccurred } = props;
  const earthRef = useRef();
  const [impactVector, setImpactVector] = useState(null);

  // Reset impact vector when a new simulation starts
  useEffect(() => {
    if (!props.mitigation.isActive) {
      setImpactVector(null);
    }
  }, [props.mitigation.isActive]);

  const handleImpact = (vector) => {
    onImpact(); // This tells App.js that an impact happened
    setImpactVector(vector); // Store the 3D vector of the impact
  };

  return (
    <Canvas camera={{ position: [0, 15, 30] }}>
      <Stars
        radius={300}
        depth={60}
        count={20000}
        factor={7}
        saturation={0}
        fade={true}
      />
      <ambientLight intensity={1} />
      <pointLight position={[100, 100, 100]} intensity={2} />
      <OrbitControls />
      <Earth ref={earthRef}>
        {/* Conditionally render the crater decal on the Earth mesh */}
        {impactOccurred && impactVector && simResults && (
          <ImpactCrater
            earthRef={earthRef}
            impactVector={impactVector}
            craterSize={simResults.craterDiameterKm}
          />
        )}
      </Earth>
      <Simulation {...props} onImpact={handleImpact} />
    </Canvas>
  );
};

export default SceneComponent;
