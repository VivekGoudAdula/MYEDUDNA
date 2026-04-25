import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import { cn } from '@/src/lib/utils';

const DNAStep = ({ position, rotation, color }: { position: [number, number, number], rotation: [number, number, number], color: string }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Helix Base Spheres */}
      <Sphere args={[0.3, 32, 32]} position={[-2.2, 0, 0]}>
        <meshPhongMaterial color={color} emissive={color} emissiveIntensity={0.2} shininess={100} />
      </Sphere>
      <Sphere args={[0.3, 32, 32]} position={[2.2, 0, 0]}>
        <meshPhongMaterial color={color} emissive={color} emissiveIntensity={0.2} shininess={100} />
      </Sphere>
      {/* Connecting Ladder */}
      <Line
        points={[[-2.2, 0, 0], [2.2, 0, 0]]}
        color={color}
        lineWidth={2}
        transparent
        opacity={0.4}
      />
    </group>
  );
};


const DNAHelix = () => {
  const groupRef = useRef<THREE.Group>(null);

  const steps = useMemo(() => {
    const temp = [];
    const count = 30;
    const spacing = 0.5;
    for (let i = 0; i < count; i++) {
      const y = (i - count / 2) * spacing;
      const angle = i * 0.4;
      const color = i % 2 === 0 ? '#ff2d55' : '#a855f7';
      temp.push({
        position: [0, y, 0] as [number, number, number],
        rotation: [0, angle, 0] as [number, number, number],
        color
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      {steps.map((step, i) => (
        <DNAStep key={i} {...step} />
      ))}
    </group>
  );
};

export const DNABackground = ({ className }: { className?: string }) => {
  return (
    <div className={cn("w-full h-full pointer-events-none", className)}>
      <Canvas camera={{ position: [0, 0, 18], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <directionalLight position={[-10, 10, 5]} intensity={0.8} />
          <DNAHelix />
        </Suspense>
      </Canvas>
    </div>
  );
};
