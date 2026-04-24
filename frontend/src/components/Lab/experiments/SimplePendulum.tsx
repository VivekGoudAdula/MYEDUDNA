import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Play, RotateCcw, Activity, Info, BarChart3 } from 'lucide-react';
import { Button } from '../../DesignSystem/Button';
import { Card } from '../../DesignSystem/Card';
import { Text } from '../../DesignSystem/Typography';
import { motion, AnimatePresence } from 'motion/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import { cn } from '@/src/lib/utils';

const PendulumModel = ({ length, gravity, isSimulating }: { length: number; gravity: number; isSimulating: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [angle, setAngle] = useState(Math.PI / 4);
  const [angleV, setAngleV] = useState(0);
  const dt = 0.08;

  useFrame((state, delta) => {
    if (isSimulating) {
      const angleA = (-1 * gravity / (length / 20)) * Math.sin(angle);
      const nextV = (angleV + angleA * dt) * 0.999;
      const nextAngle = angle + nextV * dt;
      setAngle(nextAngle);
      setAngleV(nextV);
    } else {
      setAngle(Math.PI / 4);
      setAngleV(0);
    }

    if (groupRef.current) {
      groupRef.current.rotation.z = angle;
    }
  });

  return (
    <group ref={groupRef} position={[0, 2, 0]}>
      {/* Pivot Socket */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshPhysicalMaterial color="#334155" metalness={0.8} roughness={0.1} />
      </mesh>
      {/* Structural Rod */}
      <mesh position={[0, -length / 40, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, length / 20, 16]} />
        <meshPhysicalMaterial color="#94a3b8" metalness={1} roughness={0.1} transparent opacity={0.6} />
      </mesh>
      {/* Pendulum Bob */}
      <mesh position={[0, -length / 20, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.45, 64, 64]} />
        <meshPhysicalMaterial 
           color="#8b5cf6" 
           roughness={0} 
           metalness={0.5} 
           emissive="#8b5cf6" 
           emissiveIntensity={0.1}
           transmission={0.4}
           thickness={0.5}
        />
        <pointLight color="#8b5cf6" intensity={1} distance={5} />
      </mesh>
    </group>
  );
};

export const SimplePendulum = ({ onCaptureResults }: { onCaptureResults: (res: any) => void }) => {
  const [length, setLength] = useState(150);
  const [gravity, setGravity] = useState(9.81);
  const [isSimulating, setIsSimulating] = useState(false);
  const [period, setPeriod] = useState<number | null>(null);

  const startSim = () => {
    setIsSimulating(true);
    const calculatedPeriod = 2 * Math.PI * Math.sqrt((length / 20) / gravity);
    setPeriod(calculatedPeriod);
    onCaptureResults({ period: calculatedPeriod.toFixed(4) + 's', length, gravity });
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-8 p-6 bg-gray-50/50">
      <div className="flex-1 min-h-[500px] border border-border-light rounded-[2.5rem] bg-white relative overflow-hidden shadow-2xl">
        <Canvas shadows gl={{ antialias: true }}>
          <Suspense fallback={null}>
            <Environment preset="studio" />
            <ambientLight intensity={0.5} />
            <spotLight position={[5, 10, 5]} intensity={1.5} castShadow />
            
            <PendulumModel length={length} gravity={gravity} isSimulating={isSimulating} />

            <ContactShadows position={[0, -3.5, 0]} opacity={0.25} scale={15} blur={3} far={10} />
            <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.8} enableDamping />
            <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={35} />
          </Suspense>
        </Canvas>

        {/* HUD Control Layer */}
        <div className="absolute top-8 left-8 flex flex-col gap-6 p-8 bg-white/90 backdrop-blur-xl border border-border-light rounded-3xl w-80 z-10 shadow-2xl">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 rounded-xl bg-brand-purple/5 flex items-center justify-center border border-brand-purple/10 shadow-sm">
                <Activity className="w-6 h-6 text-brand-purple" />
             </div>
             <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary">Harmonic Motion</span>
                <h4 className="text-sm font-bold text-text-primary">System Config</h4>
             </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <Text className="text-[11px] uppercase font-bold text-text-primary tracking-tighter">Cord length (px)</Text>
                <span className="text-sm font-mono font-bold text-brand-purple bg-brand-purple/5 px-3 py-1 rounded-lg">{length}</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="300" 
                value={length} 
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                disabled={isSimulating}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <Text className="text-[11px] uppercase font-bold text-text-primary tracking-tighter">Atmosphere Target</Text>
              </div>
              <select 
                value={gravity} 
                onChange={(e) => setGravity(Number(e.target.value))}
                className="w-full bg-gray-50 border border-border-light rounded-2xl py-3 px-5 text-sm text-text-primary font-bold focus:ring-2 focus:ring-brand-purple/20 outline-none transition-all cursor-pointer shadow-sm"
                disabled={isSimulating}
              >
                <option value={9.81}>Earth Surface [9.81 m/s²]</option>
                <option value={1.62}>Lunar Base [1.62 m/s²]</option>
                <option value={24.79}>Jupiter Core [24.79 m/s²]</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              variant="primary" 
              className="flex-1 h-14 bg-brand-purple shadow-xl shadow-brand-purple/20 rounded-2xl gap-3 text-xs font-bold uppercase tracking-widest transition-all hover:scale-[1.02]" 
              onClick={startSim}
              disabled={isSimulating}
            >
              <Play className="w-5 h-5 fill-current" /> Release Bob
            </Button>
            
            <Button 
              variant="secondary" 
              className="w-14 h-14 p-0 bg-white border-gray-200 hover:bg-gray-50 rounded-2xl shadow-sm" 
              onClick={() => {
                setIsSimulating(false);
                setPeriod(null);
              }}
            >
              <RotateCcw className="w-5 h-5 text-text-secondary" />
            </Button>
          </div>
        </div>

        {/* Dynamic Telemetry Banner */}
        <AnimatePresence>
          {period && (
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="absolute top-8 right-8 p-8 bg-white/90 backdrop-blur-xl border border-brand-purple/10 rounded-[2.5rem] w-64 text-center z-10 shadow-2xl"
            >
              <Text className="text-[10px] uppercase font-bold tracking-[0.25em] text-brand-purple mb-3">Analysis Period</Text>
              <div className="text-4xl font-mono font-bold text-text-primary tracking-tight leading-none mb-1">{period.toFixed(3)} <small className="text-sm text-text-secondary font-sans font-medium uppercase">S</small></div>
              <div className="mt-6 p-4 rounded-2xl bg-brand-purple/5 border border-brand-purple/10 text-[10px] text-text-secondary leading-relaxed font-bold border-t">
                 T = 2π√(L/g) synced with neural DNA profile.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full lg:w-80 flex flex-col gap-6">
        <Card className="p-8 bg-white border-border-light shadow-xl space-y-6">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-purple/5 flex items-center justify-center border border-brand-purple/10 shadow-sm">
                <BarChart3 className="w-6 h-6 text-brand-purple" />
              </div>
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest leading-none">Sim telemetry</h4>
           </div>
           
           <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-2xl bg-gray-50 border border-gray-100">
                 <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Oscillations</span>
                 <span className="text-lg font-mono font-bold text-text-primary">{isSimulating ? 'Active' : 'Idle'}</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-2xl bg-gray-50 border border-gray-100">
                 <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Damping</span>
                 <span className="text-lg font-mono font-bold text-text-primary">0.1%</span>
              </div>
           </div>
        </Card>

        <Card className="p-8 bg-brand-pink/5 border-brand-pink/10 flex items-start gap-4 shadow-sm rounded-[2rem]">
           <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-brand-pink/10">
              <Info className="w-6 h-6 text-brand-pink" />
           </div>
           <div>
              <Text className="text-[10px] uppercase font-bold text-brand-pink tracking-[0.2em] mb-1">Knowledge Node</Text>
              <p className="text-[11px] text-text-secondary leading-relaxed font-bold">
                 The mass of the bob does not affect the period of a simple pendulum. Only the length and gravity dictate the frequency.
              </p>
           </div>
        </Card>
      </div>
    </div>
  );
};
