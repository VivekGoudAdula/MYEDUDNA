import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Play, RotateCcw, Target, Zap, Activity, Info } from 'lucide-react';
import { Button } from '../../DesignSystem/Button';
import { Card } from '../../DesignSystem/Card';
import { Text } from '../../DesignSystem/Typography';
import { motion, AnimatePresence } from 'motion/react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Line, Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { cn } from '@/src/lib/utils';

interface ProjectileMotionProps {
  onCaptureResults: (results: any) => void;
}

const Cannon = ({ angle }: { angle: number }) => {
  return (
    <group position={[-10, 0, 0]}>
      {/* Base */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[1.5, 0.5, 1.2]} />
        <meshPhysicalMaterial color="#334155" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Barrel Mounting */}
      <mesh position={[0, 0.7, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.4, 32]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} />
      </mesh>
      {/* Barrel */}
      <group rotation={[0, 0, (angle * Math.PI) / 180]}>
        <mesh position={[1, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.2, 0.3, 2, 32]} />
          <meshPhysicalMaterial color="#1e293b" roughness={0.1} metalness={1} transmission={0} />
        </mesh>
        {/* Glow Tip */}
        <mesh position={[2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.1, 32]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={1} />
        </mesh>
      </group>
    </group>
  );
};

const Projectile = ({ position, active }: { position: [number, number, number]; active: boolean }) => {
  if (!active) return null;
  return (
    <mesh position={position} castShadow>
      <sphereGeometry args={[0.25, 32, 32]} />
      <meshPhysicalMaterial color="#ff2d55" emissive="#ff2d55" emissiveIntensity={2} roughness={0} metalness={1} />
      <pointLight color="#ff2d55" intensity={2} distance={8} />
    </mesh>
  );
};

export const ProjectileMotion = ({ onCaptureResults }: ProjectileMotionProps) => {
  const [angle, setAngle] = useState(45);
  const [velocity, setVelocity] = useState(20);
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<{ range: number; height: number; time: number } | null>(null);
  const [projectilePos, setProjectilePos] = useState<[number, number, number]>([-10, 0, 0]);
  const [path, setPath] = useState<THREE.Vector3[]>([]);

  const g = 9.81;
  const timer = useRef(0);

  useEffect(() => {
    if (isSimulating) {
      const rad = (angle * Math.PI) / 180;
      const vx = velocity * Math.cos(rad);
      const vy0 = velocity * Math.sin(rad);

      const interval = setInterval(() => {
        timer.current += 0.04;
        const t = timer.current;
        const x = vx * t - 10;
        const y = vy0 * t - 0.5 * g * t * t;

        if (y < 0 && t > 0.1) {
          setIsSimulating(false);
          const maxRange = (velocity * velocity * Math.sin(2 * rad)) / g;
          const maxHeight = (velocity * velocity * Math.sin(rad) * Math.sin(rad)) / (2 * g);
          const totalTime = (2 * velocity * Math.sin(rad)) / g;
          const finalResults = { range: maxRange, height: maxHeight, time: totalTime };
          setResults(finalResults);
          onCaptureResults({ ...finalResults, angle, velocity });
          clearInterval(interval);
          return;
        }

        setProjectilePos([x, y, 0]);
        setPath(prev => [...prev, new THREE.Vector3(x, y, 0)]);
      }, 16);

      return () => clearInterval(interval);
    }
  }, [isSimulating]);

  const startSimulation = () => {
    setPath([]);
    timer.current = 0;
    setResults(null);
    setIsSimulating(true);
  };

  return (
    <div className="flex h-full gap-8 p-6 bg-gray-50/50">
      <div className="flex-1 min-h-[500px] border border-border-light rounded-[2.5rem] bg-white relative overflow-hidden shadow-2xl">
        <Canvas shadows gl={{ antialias: true }}>
          <Suspense fallback={null}>
            <Environment preset="studio" />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 20, 10]} intensity={1.5} castShadow />
            
            <group position={[0, -2, 0]} scale={0.8}>
              <Cannon angle={angle} />
              <Projectile position={projectilePos} active={isSimulating || results !== null} />
              {path.length > 1 && (
                <Line points={path} color="#8b5cf6" lineWidth={3} dashed={false} />
              )}
              {/* Ground Grid Component */}
              <gridHelper args={[100, 50, 0x000000, 0xe2e8f0]} position={[20, -0.05, 0]} />
            </group>

            <ContactShadows position={[0, -2.1, 0]} opacity={0.3} scale={40} blur={2} far={4} />
            <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
            <PerspectiveCamera makeDefault position={[5, 10, 25]} fov={40} />
          </Suspense>
        </Canvas>
        
        {/* HUD Controls Overlay */}
        <div className="absolute top-8 left-8 flex flex-col gap-6 p-8 bg-white/90 backdrop-blur-xl border border-border-light rounded-3xl w-80 z-10 shadow-2xl">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 rounded-xl bg-brand-pink/5 flex items-center justify-center border border-brand-pink/10 shadow-sm">
                <Target className="w-6 h-6 text-brand-pink" />
             </div>
             <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary">Orbital Dynamics</span>
                <h4 className="text-sm font-bold text-text-primary">Launch Sequence</h4>
             </div>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <Text className="text-[11px] uppercase font-bold text-text-primary tracking-tighter">Inclination</Text>
                <span className="text-sm font-mono font-bold text-brand-pink bg-brand-pink/5 px-3 py-1 rounded-lg">{angle}°</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="90" 
                value={angle} 
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full accent-brand-pink h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                disabled={isSimulating}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <Text className="text-[11px] uppercase font-bold text-text-primary tracking-tighter">Impulse Velocity</Text>
                <span className="text-sm font-mono font-bold text-brand-pink bg-brand-pink/5 px-3 py-1 rounded-lg">{velocity} m/s</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="50" 
                value={velocity} 
                onChange={(e) => setVelocity(Number(e.target.value))}
                className="w-full accent-brand-pink h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                disabled={isSimulating}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
             <Button 
               variant="primary" 
               className="flex-1 h-14 bg-brand-pink shadow-xl shadow-brand-pink/20 rounded-2xl gap-3 text-xs font-bold uppercase tracking-widest transition-all hover:scale-[1.02]" 
               onClick={startSimulation}
               disabled={isSimulating}
             >
               <Play className="w-5 h-5 fill-current" /> Initialize
             </Button>
             
             <Button 
               variant="secondary" 
               className="w-14 h-14 p-0 bg-white border-gray-200 hover:bg-gray-50 rounded-2xl shadow-sm" 
               onClick={() => {
                 setResults(null);
                 setPath([]);
                 setProjectilePos([-10, 0, 0]);
               }}
             >
               <RotateCcw className="w-5 h-5 text-text-secondary" />
             </Button>
          </div>
        </div>

        {/* Dynamic Results Tray */}
        <AnimatePresence>
          {results && (
            <motion.div 
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="absolute top-8 right-8 p-8 bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-3xl w-72 space-y-6 z-10 shadow-2xl shadow-emerald-500/10"
            >
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shadow-sm">
                    <Zap className="w-5 h-5 text-emerald-500" />
                 </div>
                 <Text className="text-[10px] uppercase font-bold tracking-[0.2em] text-emerald-600">Telemetry Data</Text>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-gray-100 pb-3">
                  <span className="text-[10px] uppercase font-bold text-text-secondary/40 tracking-tighter">Impact Range</span>
                  <span className="text-xl font-mono font-bold text-text-primary leading-none whitespace-nowrap">{results.range.toFixed(2)} <small className="text-[10px] text-text-secondary font-sans font-medium uppercase ml-1">M</small></span>
                </div>
                <div className="flex justify-between items-end border-b border-gray-100 pb-3">
                  <span className="text-[10px] uppercase font-bold text-text-secondary/40 tracking-tighter">Apogee</span>
                  <span className="text-xl font-mono font-bold text-text-primary leading-none whitespace-nowrap">{results.height.toFixed(2)} <small className="text-[10px] text-text-secondary font-sans font-medium uppercase ml-1">M</small></span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-[10px] uppercase font-bold text-text-secondary/40 tracking-tighter">Flight Time</span>
                  <span className="text-xl font-mono font-bold text-text-primary leading-none whitespace-nowrap">{results.time.toFixed(2)} <small className="text-[10px] text-text-secondary font-sans font-medium uppercase ml-1">S</small></span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
