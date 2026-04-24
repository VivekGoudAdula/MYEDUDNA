import React, { useState, useEffect, Suspense, useMemo, useRef } from 'react';
import { Play, RotateCcw, Droplets, Info } from 'lucide-react';
import { Button } from '../../DesignSystem/Button';
import { Card } from '../../DesignSystem/Card';
import { Text } from '../../DesignSystem/Typography';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Environment, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const LabStand = () => {
  return (
    <group position={[0, -2.5, 0]}>
      {/* Base */}
      <mesh position={[0, 0.05, 0]}>
         <boxGeometry args={[2, 0.1, 1]} />
         <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Rod */}
      <mesh position={[-0.8, 2.5, 0]}>
         <cylinderGeometry args={[0.03, 0.03, 5, 16]} />
         <meshStandardMaterial color="#94a3b8" metalness={1} roughness={0.1} />
      </mesh>
      {/* Clamps */}
      <mesh position={[-0.4, 3.5, 0]} rotation={[0, 0, Math.PI/2]}>
         <cylinderGeometry args={[0.02, 0.02, 0.8, 16]} />
         <meshStandardMaterial color="#64748b" metalness={0.8} />
      </mesh>
      <mesh position={[-0.4, 1.5, 0]} rotation={[0, 0, Math.PI/2]}>
         <cylinderGeometry args={[0.02, 0.02, 0.8, 16]} />
         <meshStandardMaterial color="#64748b" metalness={0.8} />
      </mesh>
    </group>
  );
};

const Burette = ({ drops }: { drops: number }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Outer Glass Tube */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 4, 32]} />
        <meshPhysicalMaterial 
          transparent 
          opacity={0.3} 
          roughness={0} 
          transmission={0.95}
          thickness={0.1}
          envMapIntensity={2}
          color="#ffffff" 
        />
      </mesh>
      {/* Liquid inside */}
      <mesh position={[0, 0.5 + Math.max(0, 2 - (drops/150)), 0]}>
        <cylinderGeometry args={[0.075, 0.075, Math.max(0, 4 - (drops/75)), 32]} />
        <meshStandardMaterial color="#bae6fd" transparent opacity={0.6} roughness={0} />
      </mesh>
      {/* Scale markings */}
      {Array.from({ length: 21 }).map((_, i) => (
        <mesh key={i} position={[0, 0.5 + (i * 0.2), 0.08]} rotation={[0, 0, Math.PI/2]}>
          <boxGeometry args={[0.005, 0.08, 0.005]} />
          <meshStandardMaterial color="#0f172a" opacity={0.4} transparent />
        </mesh>
      ))}
      {/* Stopcock mechanism */}
      <group position={[0, 0.5, 0]}>
         <mesh rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.04, 0.04, 0.3, 16]} />
            <meshStandardMaterial color="#1e293b" />
         </mesh>
         {/* Handle */}
         <mesh position={[0, 0, 0.15]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.2, 16]} />
            <meshStandardMaterial color="#ef4444" />
         </mesh>
      </group>
    </group>
  );
};

const Flask = ({ color }: { color: string }) => {
  return (
    <group position={[0, -2, 0]}>
      {/* Flask Body - Conical */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.12, 0.7, 1.2, 32]} />
        <meshPhysicalMaterial 
          transparent 
          opacity={0.3} 
          roughness={0} 
          transmission={0.9}
          thickness={0.05}
          color="#ffffff" 
        />
      </mesh>
      {/* Liquid Volume */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.1}>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.45, 0.65, 0.5, 32]} />
          <meshStandardMaterial color={color} roughness={0} transparent opacity={0.8} />
        </mesh>
      </Float>
    </group>
  );
};

const AnimatedDrop = () => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = -((state.clock.elapsedTime * 4) % 2);
    }
  });
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color="#bae6fd" />
      </mesh>
    </group>
  );
};

const Drop = ({ active }: { active: boolean }) => {
  if (!active) return null;
  return (
    <group position={[0, 0.5, 0]}>
      <AnimatedDrop />
    </group>
  );
};

export const AcidBaseTitration = ({ onCaptureResults }: { onCaptureResults: (res: any) => void }) => {
  const [drops, setDrops] = useState(0);
  const [isTitrating, setIsTitrating] = useState(false);
  const [endpointReached, setEndpointReached] = useState(false);
  
  const endpointDrops = useMemo(() => 245 + Math.floor(Math.random() * 10), []);
  
  useEffect(() => {
    let interval: any;
    if (isTitrating && !endpointReached) {
      interval = setInterval(() => {
        setDrops(prev => prev + 1);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isTitrating, endpointReached]);

  useEffect(() => {
    if (drops >= endpointDrops && !endpointReached) {
      setEndpointReached(true);
      setIsTitrating(false);
      onCaptureResults({ volumeUsed: (drops / 10).toFixed(2) + ' mL', endpoint: true });
    }
  }, [drops, endpointDrops, endpointReached, onCaptureResults]);

  const getSolutionColor = () => {
    if (drops < endpointDrops * 0.9) return '#ffffff';
    if (drops < endpointDrops) {
      return '#ff2d55';
    }
    return '#8b5cf6';
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-8 p-6 bg-gray-50/50">
      <div className="flex-1 min-h-[500px] border border-border-light rounded-[2.5rem] bg-white relative overflow-hidden shadow-2xl">
        <Canvas shadows gl={{ antialias: true }}>
          <Suspense fallback={null}>
            <Environment preset="studio" />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <spotLight position={[0, 10, 0]} intensity={0.5} castShadow />
            
            <group position={[0, 0, 0]} scale={1.2}>
              <Burette drops={drops} />
              <Flask color={getSolutionColor()} />
              <Drop active={isTitrating} />
              <LabStand />
            </group>

            <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
            <OrbitControls makeDefault minPolarAngle={Math.PI/6} maxPolarAngle={Math.PI/2} enableDamping />
            <PerspectiveCamera makeDefault position={[5, 2, 8]} fov={35} />
          </Suspense>
        </Canvas>

        {/* HUD UI overlay */}
        <div className="absolute top-8 left-8 p-6 bg-white/90 backdrop-blur-xl border border-border-light rounded-3xl z-10 w-52 shadow-xl">
           <Text className="text-[10px] uppercase font-bold tracking-[0.2em] text-text-secondary mb-3">pH Digital Live</Text>
           <div className="text-4xl font-mono font-bold text-text-primary">
              {endpointReached ? '11.4' : (1 + (drops / 50)).toFixed(1)}
           </div>
           <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-3">
              <div className={cn("w-3 h-3 rounded-full shadow-sm", isTitrating ? "bg-emerald-500 animate-pulse" : "bg-gray-200")} />
              <span className="text-[10px] uppercase font-bold text-text-secondary tracking-widest">{isTitrating ? 'Reacting...' : 'System Ready'}</span>
           </div>
        </div>
      </div>

      <div className="w-full lg:w-80 flex flex-col gap-6">
        <Card className="p-8 space-y-8 bg-white border-border-light shadow-xl">
           <div className="space-y-2">
              <div className="flex items-center justify-between">
                 <Text className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">Measured Titrant</Text>
                 <Droplets className="w-5 h-5 text-brand-pink" />
              </div>
              <div className="text-4xl font-mono font-bold text-text-primary leading-none">{(drops / 10).toFixed(2)} <span className="text-sm text-text-secondary font-sans font-medium uppercase ml-1">mL</span></div>
           </div>

           <div className="space-y-4">
              <Button 
                variant="primary" 
                className={cn("w-full h-16 rounded-2xl gap-3 text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-xl", isTitrating ? "bg-rose-500 hover:bg-rose-600 shadow-rose-200" : "bg-brand-pink shadow-brand-pink/20")}
                onClick={() => setIsTitrating(!isTitrating)}
                disabled={endpointReached}
              >
                 {isTitrating ? <><RotateCcw className="w-5 h-5" /> Cut Flow</> : <><Play className="w-5 h-5 fill-current" /> Start Drops</>}
              </Button>
              <Button 
                variant="secondary" 
                className="w-full h-14 rounded-2xl gap-3 border-gray-200 hover:bg-gray-50 font-bold uppercase tracking-widest text-[10px]"
                onClick={() => {
                  setDrops(0);
                  setEndpointReached(false);
                  setIsTitrating(false);
                }}
              >
                 <RotateCcw className="w-5 h-5" /> Clean Apparatus
              </Button>
           </div>
        </Card>

        <AnimatePresence>
          {endpointReached && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-[2rem] border border-emerald-100 bg-emerald-50 shadow-lg shadow-emerald-500/5"
            >
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Info className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h5 className="text-emerald-700 font-bold uppercase tracking-widest text-xs">Synthesis Result</h5>
               </div>
               <p className="text-sm text-emerald-800 leading-relaxed font-medium">
                  Endpoint reached at accurately <strong>{(drops/10).toFixed(2)}mL</strong>. The solution has stabilized at a basic pH of 11.4.
               </p>
            </motion.div>
          )}
        </AnimatePresence>

        <Card className="p-6 bg-brand-purple/5 border-brand-purple/10 flex items-start gap-4 shadow-sm">
           <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-brand-purple/10">
              <Info className="w-6 h-6 text-brand-purple" />
           </div>
           <p className="text-[10px] text-text-secondary leading-relaxed font-bold">
              Tip: Observe the color change from clear to persistent light pink/purple for the most accurate titration endpoint.
           </p>
        </Card>
      </div>
    </div>
  );
};
