import React, { useRef } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Make sure to place an Earth texture in your /public folder
// and name it earth_texture.jpg
const Earth = () => {
  const earthTexture = useLoader(THREE.TextureLoader, "/earth_texture.jpg");
  const earthRef = useRef();

  useFrame(({ clock }) => {
    // Simple rotation
    earthRef.current.rotation.y = clock.getElapsedTime() / 10;
  });

  return (
    <mesh ref={earthRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        map={earthTexture}
        metalness={0.4}
        roughness={0.7}
      />
    </mesh>
  );
};

export default Earth;
