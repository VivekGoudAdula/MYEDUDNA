import React, { useState, Suspense, useMemo } from 'react';
import { Zap, Activity, Info } from 'lucide-react';
import { Button } from '../../DesignSystem/Button';
import { Card } from '../../DesignSystem/Card';
import { Text } from '../../DesignSystem/Typography';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Environment, Text as DreiText, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import { cn } from '@/src/lib/utils';

const Multimeter = ({ value }: { value: string }) => {
  return (
    <group>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <group>
          {/* Multimeter Body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[4, 6, 0.8]} />
            <meshPhysicalMaterial color="#facc15" roughness={0.1} metalness={0.1} />
          </mesh>
          {/* Outer Protective Shell */}
          <mesh position={[0, 0, -0.1]}>
            <boxGeometry args={[4.2, 6.2, 0.6]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* LCD Screen */}
          <mesh position={[0, 1.8, 0.41]}>
            <boxGeometry args={[3.2, 1.6, 0.05]} />
            <meshPhysicalMaterial color="#064e3b" roughness={0} transmission={0.2} />
          </mesh>
          {/* Digital Text Emissive */}
          <DreiText
            position={[0, 1.8, 0.45]}
            fontSize={0.8}
            color="#10b981"
          >
            {value}
          </DreiText>
          <DreiText
            position={[1.2, 1.3, 0.45]}
            fontSize={0.3}
            color="#10b981"
          >
            A
          </DreiText>

          {/* Selector Dial */}
          <group position={[0, -0.8, 0.41]}>
             <mesh rotation={[Math.PI/2, 0, 0]}>
                <cylinderGeometry args={[1, 1, 0.15, 32]} />
                <meshStandardMaterial color="#334155" />
             </mesh>
             <mesh position={[0, 0.4, 0.1]}>
                <boxGeometry args={[0.1, 0.8, 0.05]} />
                <meshStandardMaterial color="#ffffff" />
             </mesh>
          </group>

          {/* Ports */}
          <group position={[0, -2.2, 0.41]}>
             <mesh position={[-0.8, 0, 0]}>
                <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
                <meshStandardMaterial color="#ef4444" />
             </mesh>
             <mesh position={[0.8, 0, 0]}>
                <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
                <meshStandardMaterial color="#111" />
             </mesh>
          </group>
        </group>
      </Float>
    </group>
  );
};

export const OhmsLaw = ({ onCaptureResults }: { onCaptureResults: (res: any) => void }) => {
  const [voltage, setVoltage] = useState(12);
  const [resistance, setResistance] = useState(10);
  
  const current = useMemo(() => voltage / resistance, [voltage, resistance]);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-8 p-6 bg-gray-50/50">
      <div className="flex-1 min-h-[500px] border border-border-light rounded-[2.5rem] bg-white relative overflow-hidden shadow-2xl">
        <Canvas shadows gl={{ antialias: true }}>
          <Suspense fallback={null}>
            <Environment preset="studio" />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} castShadow />
            
            <Multimeter value={current.toFixed(2)} />

            <ContactShadows position={[0, -3.5, 0]} opacity={0.3} scale={10} blur={2.5} far={4} />
            <OrbitControls makeDefault minPolarAngle={Math.PI/4} maxPolarAngle={Math.PI/1.5} enableDamping />
            <PerspectiveCamera makeDefault position={[5, 2, 10]} fov={35} />
          </Suspense>
        </Canvas>

        {/* Digital Readout Float */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-40 pointer-events-none text-center">
           <Text className="text-[10px] uppercase font-bold tracking-[0.4em] text-emerald-600/40 mb-3 uppercase">Real-time Amperage</Text>
           <div className="text-8xl font-mono font-bold text-emerald-500 drop-shadow-xl">
              {current.toFixed(2)}
           </div>
           <Text className="text-[11px] font-bold text-emerald-600/60 mt-2 tracking-[0.3em]">UNIT: AMPERES (A)</Text>
        </div>

        <div className="absolute bottom-8 left-8 p-6 min-w-[240px] bg-white/90 backdrop-blur-xl border border-border-light rounded-3xl shadow-xl flex flex-col gap-3">
           <Text className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-1 border-b border-gray-100 pb-2">Active Calibration</Text>
           <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border border-gray-100">
              <span className="text-[11px] font-bold text-text-secondary uppercase">Voltage (V)</span>
              <span className="text-lg font-mono font-bold text-brand-purple">{voltage}<small className="text-[10px] ml-1">V</small></span>
           </div>
           <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border border-gray-100">
              <span className="text-[11px] font-bold text-text-secondary uppercase">Resistance (Ω)</span>
              <span className="text-lg font-mono font-bold text-brand-pink">{resistance}<small className="text-[10px] ml-1">Ω</small></span>
           </div>
        </div>
      </div>

      <div className="w-full lg:w-80 flex flex-col gap-6">
        <Card className="p-8 space-y-8 bg-white border-border-light shadow-xl">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-purple/5 flex items-center justify-center border border-brand-purple/10 shadow-sm">
                <Zap className="w-5 h-5 text-brand-purple" />
              </div>
              <div>
                 <Text className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">Source Tuning</Text>
                 <h4 className="text-sm font-bold text-text-primary">Source Calibration</h4>
              </div>
           </div>

           <div className="space-y-8">
              <div className="space-y-4">
                 <div className="flex justify-between items-center px-1">
                    <Text className="text-[11px] uppercase font-bold text-text-primary tracking-tighter">Potential Difference</Text>
                    <span className="text-sm font-mono font-bold text-brand-purple bg-brand-purple/5 px-3 py-1 rounded-lg">{voltage}V</span>
                 </div>
                 <input 
                   type="range" 
                   min="1" 
                   max="48" 
                   value={voltage} 
                   onChange={(e) => setVoltage(Number(e.target.value))}
                   className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                 />
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-center px-1">
                    <Text className="text-[11px] uppercase font-bold text-text-primary tracking-tighter">Load Resistance</Text>
                    <span className="text-sm font-mono font-bold text-brand-pink bg-brand-pink/5 px-3 py-1 rounded-lg">{resistance}Ω</span>
                 </div>
                 <input 
                   type="range" 
                   min="1" 
                   max="100" 
                   value={resistance} 
                   onChange={(e) => setResistance(Number(e.target.value))}
                   className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-pink"
                 />
              </div>
           </div>

           <div className="pt-6 border-t border-gray-100">
              <Button 
                 variant="primary" 
                 className="w-full h-16 bg-brand-purple shadow-xl shadow-brand-purple/20 rounded-[1.25rem] gap-4 text-xs font-bold uppercase tracking-[0.2em] transition-all hover:scale-[1.02]"
                 onClick={() => onCaptureResults({ voltage, resistance, current: current.toFixed(4) })}
              >
                 <Activity className="w-5 h-5" /> Capture State
              </Button>
           </div>
        </Card>

        <Card className="p-8 bg-gray-50 border-border-light shadow-sm flex flex-col gap-4 rounded-[2rem]">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shadow-sm">
                <Info className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">Lab Principle</span>
           </div>
           <p className="text-xs text-text-secondary leading-relaxed font-medium">
              Ohm's Law: Current (I) is directly proportional to Voltage (V) and inversely proportional to Resistance (R). 
              <span className="block mt-4 py-3 px-4 rounded-xl bg-white border border-gray-200 text-center font-mono font-bold text-text-primary shadow-sm">
                 V = I × R
              </span>
           </p>
        </Card>
      </div>
    </div>
  );
};
