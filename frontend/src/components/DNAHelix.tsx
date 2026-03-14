import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere, Line, Preload } from '@react-three/drei';
import * as THREE from 'three';

export const DNAHelix = ({ isDark = true }: { isDark?: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  const numPairs = 30;
  const radius = 1.2;
  const height = 10;
  const twist = Math.PI * 4;

  const strands = useMemo(() => {
    const data = [];
    for (let i = 0; i < numPairs; i++) {
      const y = (i / numPairs) * height - height / 2;
      const angle = (i / numPairs) * twist;
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;
      
      data.push({ x1, y, z1, x2, z2 });
    }
    return data;
  }, []);

  return (
    <group ref={groupRef} scale={[0.8, 0.8, 0.8]}>
      {/* Central connections */}
      {strands.map((strand, i) => (
        <React.Fragment key={`pair-${i}`}>
          <Line 
            points={[[strand.x1, strand.y, strand.z1], [strand.x2, strand.y, strand.z2]]} 
            color={isDark ? "#4f46e5" : "#6366f1"} 
            lineWidth={2}
            transparent
            opacity={isDark ? 0.4 : 0.6}
          />
          {/* Backbone 1 */}
          <Sphere position={[strand.x1, strand.y, strand.z1]} args={[0.15, 16, 16]}>
            <meshStandardMaterial color="#8b5cf6" emissive="#6d28d9" emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
          </Sphere>
          {/* Backbone 2 */}
          <Sphere position={[strand.x2, strand.y, strand.z2]} args={[0.15, 16, 16]}>
            <meshStandardMaterial color="#06b6d4" emissive="#0891b2" emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
          </Sphere>
        </React.Fragment>
      ))}

      {/* Floating particles around DNA */}
      {Array.from({ length: 40 }).map((_, i) => (
        <Float key={`particle-${i}`} speed={2} rotationIntensity={2} floatIntensity={2}>
          <Sphere 
            position={[
              (Math.random() - 0.5) * 6,
              (Math.random() - 0.5) * height,
              (Math.random() - 0.5) * 6
            ]} 
            args={[Math.random() * 0.05 + 0.02, 8, 8]}
          >
            <meshBasicMaterial color={i % 2 === 0 ? "#8b5cf6" : "#06b6d4"} transparent opacity={isDark ? 0.6 : 0.4} />
          </Sphere>
        </Float>
      ))}
      <Preload all />
    </group>
  );
};
