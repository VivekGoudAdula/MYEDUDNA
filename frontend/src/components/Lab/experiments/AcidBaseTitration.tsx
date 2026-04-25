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
          opacity={0.4} 
          roughness={0.1} 
          transmission={1}
          thickness={0.2}
          envMapIntensity={2}
          color="#f8fafc" 
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
          opacity={0.5} 
          roughness={0.1} 
          transmission={1}
          thickness={0.5}
          color="#e0f2fe" 
        />
      </mesh>
      {/* Liquid Volume */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.1}>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.45, 0.65, 0.5, 32]} />
          <meshStandardMaterial color={color} roughness={0.1} metalness={0.1} transparent opacity={0.9} />
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
    <div className="h-full w-full relative bg-white overflow-hidden">
      {/* Immersive 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas shadows gl={{ antialias: true }}>
          <Suspense fallback={null}>
            <Environment preset="studio" />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <spotLight position={[0, 10, 0]} intensity={0.5} castShadow />
            
            <group position={[0, 0.5, 0]} scale={1.4}>
              <Burette drops={drops} />
              <Flask color={getSolutionColor()} />
              <Drop active={isTitrating} />
              <LabStand />
            </group>

            <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
            <OrbitControls makeDefault minPolarAngle={Math.PI/6} maxPolarAngle={Math.PI/2} enableDamping />
            <PerspectiveCamera makeDefault position={[6, 2, 8]} fov={30} />
          </Suspense>
        </Canvas>
      </div>

      {/* Floating HUD: Telemetry (Top Left) */}
      <div className="absolute top-6 left-6 flex flex-col gap-4 pointer-events-none">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="p-5 bg-white/80 backdrop-blur-md border border-border-light rounded-2xl w-44 shadow-lg ring-1 ring-black/5"
        >
           <Text className="text-[9px] uppercase font-bold tracking-[0.2em] text-text-secondary/60 mb-2">pH Digital Live</Text>
           <div className="text-3xl font-mono font-bold text-text-primary tracking-tighter">
              {endpointReached ? '11.4' : (1 + (drops / 50)).toFixed(1)}
           </div>
           <div className="mt-4 pt-3 border-t border-gray-100/50 flex items-center gap-2">
              <div className={cn("w-2.5 h-2.5 rounded-full", isTitrating ? "bg-emerald-500 animate-pulse" : "bg-gray-300")} />
              <span className="text-[9px] uppercase font-bold text-text-secondary/60 tracking-widest">{isTitrating ? 'Reacting...' : 'System Ready'}</span>
           </div>
        </motion.div>

        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="p-5 bg-white/80 backdrop-blur-md border border-border-light rounded-2xl w-44 shadow-lg ring-1 ring-black/5"
        >
           <Text className="text-[9px] uppercase font-bold tracking-[0.2em] text-text-secondary/60 mb-2">Measured Titrant</Text>
           <div className="text-3xl font-mono font-bold text-text-primary tracking-tighter">
              {(drops / 10).toFixed(2)} <span className="text-xs text-text-secondary/40 font-sans font-medium uppercase">mL</span>
           </div>
        </motion.div>
      </div>

      {/* Floating HUD: Controls (Bottom Left) */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-3 w-44">
        <Button 
          variant="primary" 
          size="sm"
          className={cn("w-full h-12 rounded-xl gap-2 text-[9px] font-bold tracking-[0.2em] uppercase shadow-lg", isTitrating ? "bg-rose-500 hover:bg-rose-600" : "bg-brand-pink")}
          onClick={() => setIsTitrating(!isTitrating)}
          disabled={endpointReached}
        >
           {isTitrating ? <><RotateCcw className="w-4 h-4" /> Stop</> : <><Play className="w-4 h-4 fill-current" /> Start Drops</>}
        </Button>
        <Button 
          variant="secondary" 
          size="sm"
          className="w-full h-10 rounded-xl gap-2 border-gray-200 hover:bg-white text-[9px] font-bold uppercase tracking-widest text-text-secondary bg-white/50 backdrop-blur-sm"
          onClick={() => {
            setDrops(0);
            setEndpointReached(false);
            setIsTitrating(false);
          }}
        >
           <RotateCcw className="w-3.5 h-3.5" /> Clean Apparatus
        </Button>
      </div>

      {/* Lab Note Tip (Bottom Right) */}
      <div className="absolute bottom-6 right-6 max-w-[240px]">
        <div className="p-4 bg-white/60 backdrop-blur-md border border-border-light rounded-2xl shadow-sm">
           <p className="text-[9px] text-text-secondary leading-relaxed font-bold opacity-80 italic">
              Tip: Observe the color change from clear to persistent light pink/purple for the most accurate titration endpoint.
           </p>
        </div>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {endpointReached && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 rounded-3xl border border-emerald-100 bg-white/90 backdrop-blur-2xl shadow-2xl text-center max-w-xs z-50 ring-1 ring-emerald-500/20"
          >
             <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
               <Info className="w-6 h-6 text-emerald-500" />
             </div>
             <h5 className="text-emerald-700 font-bold uppercase tracking-[0.2em] text-xs mb-2">Sync Complete</h5>
             <p className="text-xs text-text-secondary leading-relaxed font-medium">
                Endpoint reached at <strong>{(drops/10).toFixed(2)}mL</strong>. Neural bridge established.
             </p>
             <Button variant="outline" size="sm" className="mt-6 w-full border-emerald-200 text-emerald-600 hover:bg-emerald-50 font-bold text-[9px] uppercase tracking-widest" onClick={() => setEndpointReached(false)}>
                Acknowledge
             </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
