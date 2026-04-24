import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { Boxes, Info, ArrowUpRight } from 'lucide-react';
import { Button } from '../../DesignSystem/Button';
import { Card } from '../../DesignSystem/Card';
import { Text } from '../../DesignSystem/Typography';
import { cn } from '@/src/lib/utils';
import * as THREE from 'three';
import { ThreeElement } from '@react-three/fiber';

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        mesh: ThreeElement<typeof THREE.Mesh>;
        sphereGeometry: ThreeElement<typeof THREE.SphereGeometry>;
        meshStandardMaterial: ThreeElement<typeof THREE.MeshStandardMaterial>;
        meshPhysicalMaterial: ThreeElement<typeof THREE.MeshPhysicalMaterial>;
        cylinderGeometry: ThreeElement<typeof THREE.CylinderGeometry>;
        group: ThreeElement<typeof THREE.Group>;
      }
    }
  }
}

const Sphere = ({ position, color, size = 0.5 }: { position: [number, number, number]; color: string; size?: number }) => (
  <mesh position={position} castShadow receiveShadow>
    <sphereGeometry args={[size, 64, 64]} />
    <meshPhysicalMaterial 
      color={color} 
      roughness={0.1} 
      metalness={0.2}
      transmission={0.4}
      thickness={0.5}
      ior={1.5}
      envMapIntensity={1.5}
    />
  </mesh>
);

const Bond = ({ start, end }: { start: [number, number, number]; end: [number, number, number] }) => {
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const midPoint = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
  const distance = startVec.distanceTo(endVec);
  const direction = new THREE.Vector3().subVectors(endVec, startVec);
  const axis = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction.clone().normalize());

  return (
    <mesh position={midPoint} quaternion={quaternion} castShadow receiveShadow>
      <cylinderGeometry args={[0.08, 0.08, distance, 32]} />
      <meshPhysicalMaterial 
        color="#e2e8f0" 
        opacity={0.8} 
        transparent 
        roughness={0.1} 
        metalness={0.8}
        transmission={0.2}
      />
    </mesh>
  );
};

const molecules = {
  H2O: {
    name: 'Water',
    formula: 'H₂O',
    atoms: [
      { type: 'O', pos: [0, 0, 0], color: '#ff2d55', size: 0.6 },
      { type: 'H', pos: [0.8, 0.6, 0], color: '#bae6fd', size: 0.35 },
      { type: 'H', pos: [-0.8, 0.6, 0], color: '#bae6fd', size: 0.35 },
    ],
    bonds: [
      { start: [0, 0, 0], end: [0.8, 0.6, 0] },
      { start: [0, 0, 0], end: [-0.8, 0.6, 0] },
    ]
  },
  CO2: {
    name: 'Carbon Dioxide',
    formula: 'CO₂',
    atoms: [
      { type: 'C', pos: [0, 0, 0], color: '#334155', size: 0.5 },
      { type: 'O', pos: [1.2, 0, 0], color: '#ff2d55', size: 0.6 },
      { type: 'O', pos: [-1.2, 0, 0], color: '#ff2d55', size: 0.6 },
    ],
    bonds: [
      { start: [0, 0, 0], end: [1.2, 0, 0] },
      { start: [0, 0, 0], end: [-1.2, 0, 0] },
    ]
  },
  CH4: {
    name: 'Methane',
    formula: 'CH₄',
    atoms: [
      { type: 'C', pos: [0, 0, 0], color: '#334155', size: 0.5 },
      { type: 'H', pos: [0.7, 0.7, 0.7], color: '#bae6fd', size: 0.35 },
      { type: 'H', pos: [-0.7, -0.7, 0.7], color: '#bae6fd', size: 0.35 },
      { type: 'H', pos: [0.7, -0.7, -0.7], color: '#bae6fd', size: 0.35 },
      { type: 'H', pos: [-0.7, 0.7, -0.7], color: '#bae6fd', size: 0.35 },
    ],
    bonds: [
      { start: [0, 0, 0], end: [0.7, 0.7, 0.7] },
      { start: [0, 0, 0], end: [-0.7, -0.7, 0.7] },
      { start: [0, 0, 0], end: [0.7, -0.7, -0.7] },
      { start: [0, 0, 0], end: [-0.7, 0.7, -0.7] },
    ]
  }
};

export const MolecularVisualizer = () => {
  const [selected, setSelected] = useState<keyof typeof molecules>('H2O');
  const mol = molecules[selected];

  return (
    <div className="flex flex-col lg:flex-row h-full gap-8 p-6 bg-gray-50/50">
      <div className="flex-1 bg-white border border-border-light rounded-[2.5rem] relative overflow-hidden min-h-[500px] shadow-2xl">
        <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
          <Suspense fallback={null}>
            <Environment preset="studio" />
            <ambientLight intensity={0.6} />
            <spotLight position={[10, 10, 10]} intensity={1} castShadow />
            <group>
              {mol.atoms.map((a, i) => (
                <Sphere key={`a-${i}`} position={a.pos as any} color={a.color} size={a.size} />
              ))}
              {mol.bonds.map((b, i) => (
                <Bond key={`b-${i}`} start={b.start as any} end={b.end as any} />
              ))}
            </group>
            <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4} />
            <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} enableDamping />
          </Suspense>
        </Canvas>

        <div className="absolute top-8 left-8 p-4 bg-white/90 backdrop-blur-xl border border-border-light rounded-3xl shadow-xl">
           <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-xl bg-brand-pink/5 flex items-center justify-center border border-brand-pink/10 shadow-sm">
                <Boxes className="w-5 h-5 text-brand-pink" />
              </div>
              <span className="text-xl font-bold text-text-primary tracking-tight">{mol.name} ({mol.formula})</span>
           </div>
           <Text className="text-[10px] text-text-secondary font-bold tracking-[0.2em] uppercase ml-11">3D Structural Analysis</Text>
        </div>
      </div>

      <div className="w-full lg:w-80 space-y-8">
        <div className="space-y-4">
          <Text className="text-[10px] font-bold uppercase tracking-[0.25em] text-text-secondary px-2">Select Structure</Text>
          <div className="flex flex-col gap-3">
            {Object.keys(molecules).map((key) => (
              <button
                key={key}
                onClick={() => setSelected(key as any)}
                className={cn(
                  "p-6 rounded-3xl border text-left transition-all group relative overflow-hidden shadow-sm",
                  selected === key 
                    ? "bg-white border-brand-pink shadow-xl ring-1 ring-brand-pink/5" 
                    : "bg-white border-border-light text-text-secondary hover:border-brand-pink/30 hover:bg-gray-50"
                )}
              >
                <div className="flex items-center justify-between relative z-10">
                   <div>
                      <span className={cn("font-bold text-2xl tracking-tight", selected === key ? "text-text-primary" : "text-text-secondary")}>{key}</span>
                      <p className="text-[10px] uppercase font-bold text-text-secondary/60 tracking-widest mt-1">{molecules[key as keyof typeof molecules].name}</p>
                   </div>
                   <ArrowUpRight className={cn("w-5 h-5 transition-transform", selected === key ? "text-brand-pink scale-110" : "text-gray-300 group-hover:translate-x-1 group-hover:-translate-y-1")} />
                </div>
              </button>
            ))}
          </div>
        </div>

        <Card className="p-8 bg-white border-border-light shadow-xl space-y-6">
           <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-brand-purple/5 flex items-center justify-center shadow-sm">
                <Info className="w-5 h-5 text-brand-purple" />
              </div>
              <Text className="text-[10px] uppercase font-bold text-text-primary tracking-[0.2em]">Molecular Data</Text>
           </div>
           <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                 <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Total Atoms</span>
                 <span className="text-lg font-bold font-mono text-text-primary">{mol.atoms.length}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                 <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Bond Count</span>
                 <span className="text-lg font-bold font-mono text-text-primary">{mol.bonds.length}</span>
              </div>
           </div>
           <div className="pt-4 p-4 rounded-2xl bg-brand-pink/5 border border-brand-pink/10">
              <p className="text-[10px] text-text-secondary leading-relaxed font-bold italic">"Analyze the covalent bonding patterns optimized for your DNA neural compatibility profile."</p>
           </div>
        </Card>
      </div>
    </div>
  );
};
