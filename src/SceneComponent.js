// src/SceneComponent.js
import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, Stars, Line } from "@react-three/drei";
import * as THREE from "three";

const SceneComponent = ({ mitigation }) => {
  // Create a dynamic trajectory path that changes with mitigation
  const trajectory = useMemo(() => {
    const missDistance = 2.1 - mitigation.velocityChange * 0.1; // Base miss distance adjusted by mitigation
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-10, 2, 0),
      new THREE.Vector3(-5, 1.5, 0),
      new THREE.Vector3(0, missDistance, 0), // This point is deflected by mitigation
      new THREE.Vector3(5, 1.5, 0),
      new THREE.Vector3(10, 2, 0),
    ]);
    return curve.getPoints(50);
  }, [mitigation.velocityChange]);

  return (
    <div className="scene-container">
      <h3>Trajectory Visualization</h3>
      <Canvas
        camera={{ position: [0, 0, 10] }}
        style={{ height: "400px", width: "100%", background: "#000" }}
      >
        <Stars />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        <Sphere args={[2, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial color="royalblue" />
        </Sphere>
        <Line points={trajectory} color="red" lineWidth={2} />
      </Canvas>
    </div>
  );
};

export default SceneComponent;
