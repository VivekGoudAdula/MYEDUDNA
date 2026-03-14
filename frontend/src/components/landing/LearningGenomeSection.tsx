import React, { useRef, useState, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Line, MeshDistortMaterial, Text, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

const skills = [
  { id: 'math', name: 'Mathematics', color: '#6366f1', info: 'Algorithmic thinking and statistical modeling for complex AI architectures.' },
  { id: 'science', name: 'Science', color: '#06b6d4', info: 'Applying physics and biological principles to simulated digital environments.' },
  { id: 'prog', name: 'Programming', color: '#8b5cf6', info: 'Low-latency systems and neural network implementation across diverse stacks.' },
  { id: 'creative', name: 'Creativity', color: '#ec4899', info: 'Design systems and intuitive problem solving beyond conventional logic.' },
  { id: 'projects', name: 'Projects', color: '#10b981', info: 'Full-cycle implementation from conceptualization to global scale deployment.' }
];

const SkillNode = ({ skill, position, onSelect }: { skill: any, position: [number, number, number], onSelect: (skill: any) => void }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <Sphere 
          ref={meshRef}
          args={[0.4, 32, 32]} 
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => onSelect(skill)}
        >
          <MeshDistortMaterial 
            color={skill.color} 
            speed={hovered ? 5 : 1} 
            distort={0.4} 
            emissive={skill.color}
            emissiveIntensity={hovered ? 3 : 0.5}
            transparent
            opacity={0.8}
          />
        </Sphere>
        <Text
          position={[0, -0.6, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
        >
          {skill.name}
        </Text>
      </Float>
    </group>
  );
};

const DNAHelixBG = () => {
    const groupRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (groupRef.current) groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    });

    const strands = useMemo(() => {
        const data = [];
        const numPairs = 20;
        const radius = 2;
        const height = 12;
        for (let i = 0; i < numPairs; i++) {
            const p = i / (numPairs - 1);
            const y = p * height - height / 2;
            const angle = p * Math.PI * 4;
            data.push({
                y,
                x1: Math.cos(angle) * radius,
                z1: Math.sin(angle) * radius,
                x2: Math.cos(angle + Math.PI) * radius,
                z2: Math.sin(angle + Math.PI) * radius,
            });
        }
        return data;
    }, []);

    return (
        <group ref={groupRef}>
            {strands.map((s, i) => (
                <React.Fragment key={i}>
                    <Line points={[[s.x1, s.y, s.z1], [s.x2, s.y, s.z2]]} color="#4f46e5" lineWidth={0.5} transparent opacity={0.15} />
                    <Sphere position={[s.x1, s.y, s.z1]} args={[0.05, 8, 8]}>
                        <meshBasicMaterial color="#4f46e5" transparent opacity={0.3} />
                    </Sphere>
                    <Sphere position={[s.x2, s.y, s.z2]} args={[0.05, 8, 8]}>
                        <meshBasicMaterial color="#06b6d4" transparent opacity={0.3} />
                    </Sphere>
                </React.Fragment>
            ))}
        </group>
    );
};

export const LearningGenome = () => {
  const [selected, setSelected] = useState<any>(null);

  return (
    <section className="relative h-screen bg-slate-950 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Suspense fallback={null}>
            <DNAHelixBG />
            {skills.map((skill, i) => (
              <SkillNode 
                key={skill.id} 
                skill={skill} 
                position={[
                  Math.cos((i / skills.length) * Math.PI * 2) * 4,
                  Math.sin((i / skills.length) * Math.PI * 2) * 4,
                  0
                ]}
                onSelect={setSelected}
              />
            ))}
            <Environment preset="night" />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 text-center pointer-events-none px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter"
        >
          The Learning Genome
        </motion.h2>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          Every student possesses a unique intellectual fingerprint. We analyze your cognitive patterns to construct a knowledge genome that evolves as you do.
        </p>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
            className="fixed top-1/2 left-1/2 z-50 w-full max-w-md p-10 rounded-[2.5rem] bg-slate-900/60 backdrop-blur-3xl border border-white/10 shadow-2xl"
          >
            <button 
              onClick={() => setSelected(null)}
              className="absolute top-6 right-8 text-white/30 hover:text-white text-sm font-bold uppercase tracking-widest"
            >
              Close
            </button>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-xl`} style={{ backgroundColor: selected.color }}>
                <span className="text-white text-2xl font-black">{selected.name[0]}</span>
            </div>
            <h3 className="text-4xl font-black text-white mb-6 tracking-tight">{selected.name}</h3>
            <p className="text-slate-300 text-lg leading-relaxed font-light mb-8">
              {selected.info}
            </p>
            <p className="text-slate-500 text-xs italic uppercase tracking-[0.2em] border-t border-white/5 pt-6">
               “MyEduDNA builds a personalized learning genome by analyzing how each student learns.”
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 opacity-50">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Scroll to Explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
};
