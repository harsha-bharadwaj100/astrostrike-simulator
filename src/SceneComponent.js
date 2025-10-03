// src/SceneComponent.js
import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Line, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { updateAsteroid } from "./utils/physics";
import Earth from "./Earth";

const TRAIL_LENGTH = 200;

// ✨ New inner component to hold all the simulation logic and objects
// This component will be placed INSIDE the Canvas
const Simulation = ({ details, customParams, mode, mitigation, onImpact }) => {
  const [asteroid, setAsteroid] = useState(null);
  const [trail, setTrail] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);

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
      position: { x: -30, y: 2.2, z: 0 }, // Start far away
      velocity: {
        x: (initialVelocity.x * 1000) / 3e6, // Scale velocity
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
    if (mitigation.isActive && asteroid && mitigation.velocityChange > 0) {
      setAsteroid((prev) => {
        const newVel = { ...prev.velocity };
        const impulseMagnitude = mitigation.velocityChange * 1e-4;
        newVel.y += impulseMagnitude;
        return { ...prev, velocity: newVel };
      });
      mitigation.velocityChange = 0;
    }
  }, [mitigation, asteroid]);

  // The main simulation loop, now correctly inside a component that will be within Canvas
  useFrame((state, delta) => {
    if (isSimulating && asteroid) {
      const updatedAsteroid = updateAsteroid({ ...asteroid }, delta);
      const posVec = new THREE.Vector3(
        updatedAsteroid.position.x,
        updatedAsteroid.position.y,
        updatedAsteroid.position.z
      );

      if (posVec.length() < 2) {
        setIsSimulating(false);
        onImpact();
      } else {
        setAsteroid(updatedAsteroid);
        setTrail((currentTrail) => {
          const newTrail = [...currentTrail, posVec];
          return newTrail.slice(-TRAIL_LENGTH);
        });
      }
    }
  });

  // Return the 3D objects to be rendered
  return (
    <>
      {asteroid && (
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
      {trail.length > 1 && (
        <Line points={trail} color="#e94560" lineWidth={2} />
      )}
    </>
  );
};

// ✨ The main exported component is now much simpler.
// It just sets up the Canvas and renders the Simulation component inside it.
const SceneComponent = (props) => {
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
      <Earth />
      <Simulation {...props} />{" "}
      {/* Pass all the props down to the inner component */}
    </Canvas>
  );
};

export default SceneComponent;
