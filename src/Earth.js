// src/Earth.js
import React, { forwardRef } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Use forwardRef to allow the parent component to get a ref to the mesh
const Earth = forwardRef(({ children }, ref) => {
  const earthTexture = useLoader(THREE.TextureLoader, "/earth_texture.jpg");

  useFrame(({ clock }) => {
    // Simple rotation
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() / 10;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        map={earthTexture}
        metalness={0.4}
        roughness={0.7}
      />
      {/* The ImpactCrater decal will be rendered as a child here */}
      {children}
    </mesh>
  );
});

export default Earth;
