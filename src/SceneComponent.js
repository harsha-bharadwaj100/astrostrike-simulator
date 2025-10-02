// src/SceneComponent.js
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, Stars } from "@react-three/drei";

const SceneComponent = ({ details }) => {
  return (
    <div className="scene-container">
      <h3>Trajectory Visualization</h3>
      <Canvas style={{ height: "400px", width: "100%", background: "#000" }}>
        <Stars />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        {/* Earth Sphere */}
        <Sphere args={[2, 32, 32]}>
          <meshStandardMaterial color="royalblue" />
        </Sphere>
        {/* We will add the asteroid trajectory here on Day 3 */}
      </Canvas>
    </div>
  );
};

export default SceneComponent;
