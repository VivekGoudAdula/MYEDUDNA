import React, { useRef, useState, useMemo, Suspense } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Line, PerspectiveCamera, Text, Environment, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const features = [
  { id: 1, title: "Adaptive Learning DNA", desc: "MyEduDNA analyzes individual learning behavior—pacing, retention, and engagement—to build a personalized knowledge genome that evolves in real-time.", side: 'left' },
  { id: 2, title: "AI Career Architect", desc: "Students define their long-term career ambition, and the AI sequences a custom learning roadmap with modules, labs, and projects aligned to that goal.", side: 'right' },
  { id: 3, title: "Virtual STEM Labs", desc: "Immersive remote laboratories allowing students to perform high-fidelity physics and chemistry experiments from any device, anywhere.", side: 'left' },
  { id: 4, title: "Interest-Driven Content", desc: "The platform intelligently bridges core curriculum with personal interests—teaching physics through robotics or math through music production.", side: 'right' },
  { id: 5, title: "Real-Time AI Tutor", desc: "A constant intellectual companion that answers questions, provides hints during lab work, and offers encouragement exactly when the student needs it.", side: 'left' }
];

const ResearchBook = ({ scroll }: { scroll: any }) => {
  const meshRef = useRef<THREE.Group>(null);
  const outerGroupRef = useRef<THREE.Group>(null);
  
  const openRotation = useTransform(scroll, [0.15, 0.35], [0, -Math.PI / 1.5]);
  const bookY = useTransform(scroll, [0, 0.2, 0.4, 0.6], [5, 0, 0, -10]);
  const bookScale = useTransform(scroll, [0.4, 0.6], [1, 0.8]);

  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y = openRotation.get();
    if (outerGroupRef.current) {
        outerGroupRef.current.position.y = bookY.get();
        const s = bookScale.get();
        outerGroupRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={outerGroupRef}>
      <group ref={meshRef}>
        <mesh position={[0, 0, 0.1]}>
          <boxGeometry args={[3, 4, 0.1]} />
          <meshStandardMaterial color="#2d2d2d" roughness={0.8} />
        </mesh>
        <Text
          position={[0, 0.5, 0.16]}
          fontSize={0.2}
          color="#ffffff"
          maxWidth={2}
          textAlign="center"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
        >
          MyEduDNA{"\n"}Research Log
        </Text>
      </group>
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[3.1, 4.1, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.01, 0, 0]}>
        <boxGeometry args={[2.9, 3.9, 0.05]} />
        <meshStandardMaterial color="#f8f8f8" />
      </mesh>
      <Text
        position={[0.5, 0, 0.06]}
        fontSize={0.12}
        color="#333333"
        maxWidth={2}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
      >
        "Every learner has a{"\n"}unique learning DNA."
      </Text>
    </group>
  );
};

const FeatureDNA = ({ scroll, activeNode, onNodeClick }: { scroll: any; activeNode: number | null; onNodeClick: (id: number) => void }) => {
  const groupRef = useRef<THREE.Group>(null);
  const dnaY = useTransform(scroll, [0.4, 0.6, 0.9], [-5, 0, 2]);
  const dnaScale = useTransform(scroll, [0.4, 0.6], [0.2, 1]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
      groupRef.current.position.y = dnaY.get();
      const s = dnaScale.get();
      groupRef.current.scale.set(s, s, s);
    }
  });

  const numPairs = 25;
  const radius = 1.2;
  const height = 8;
  const twist = Math.PI * 4;

  const strands = useMemo(() => {
    const data = [];
    for (let i = 0; i < numPairs; i++) {
        const p = i / (numPairs - 1);
        const y = p * height - height / 2;
        const angle = p * twist;
        data.push({ y, x1: Math.cos(angle) * radius, z1: Math.sin(angle) * radius, x2: Math.cos(angle + Math.PI) * radius, z2: Math.sin(angle + Math.PI) * radius });
    }
    return data;
  }, []);

  return (
    <group ref={groupRef}>
      {strands.map((s, i) => (
        <React.Fragment key={i}>
          <Line points={[[s.x1, s.y, s.z1], [s.x2, s.y, s.z2]]} color="#6366f1" lineWidth={0.5} transparent opacity={0.2} />
          <Sphere position={[s.x1, s.y, s.z1]} args={[0.06, 8, 8]}>
            <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={0.5} />
          </Sphere>
          <Sphere position={[s.x2, s.y, s.z2]} args={[0.06, 8, 8]}>
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} />
          </Sphere>
        </React.Fragment>
      ))}

      {features.map((f, i) => {
        const yPos = (i / (features.length - 1)) * 6 - 3;
        const angle = (i / (features.length - 1)) * twist;
        const xPos = Math.cos(angle) * radius;
        const zPos = Math.sin(angle) * radius;
        return (
          <group key={f.id} position={[xPos, yPos, zPos]}>
            <Sphere args={[0.2, 32, 32]} onClick={(e) => { e.stopPropagation(); onNodeClick(f.id); }}>
              <MeshDistortMaterial 
                color={activeNode === f.id ? "#ffffff" : "#6366f1"} 
                distort={activeNode === f.id ? 0.6 : 0.3} 
                speed={2} 
                emissive={activeNode === f.id ? "#ffffff" : "#6366f1"}
                emissiveIntensity={activeNode === f.id ? 5 : 1}
              />
            </Sphere>
            <Text position={[0.5, 0, 0]} fontSize={0.15} color="white" anchorX="left" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf">
              {f.title}
            </Text>
          </group>
        );
      })}
    </group>
  );
};

export const StorytellingBookSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const activeFeature = features.find(f => f.id === activeNode);

  return (
    <div ref={containerRef} className="relative h-[500vh] bg-slate-950">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-slate-900 to-black opacity-50" />
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={40} />
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#4f46e5" />
          <Suspense fallback={null}>
            <ResearchBook scroll={scrollYProgress} />
            <FeatureDNA scroll={scrollYProgress} activeNode={activeNode} onNodeClick={setActiveNode} />
            <Environment preset="city" />
          </Suspense>
        </Canvas>

        <AnimatePresence>
          {activeFeature && (
            <motion.div
              key={activeFeature.id}
              initial={{ x: activeFeature.side === 'left' ? -500 : 500, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: activeFeature.side === 'left' ? -500 : 500, opacity: 0 }}
              className={`fixed top-[20%] ${activeFeature.side === 'left' ? 'left-8' : 'right-8'} w-full max-w-sm p-12 rounded-[3rem] bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl z-50`}
            >
              <button onClick={() => setActiveNode(null)} className="absolute top-6 right-8 text-white/30 hover:text-white uppercase text-[10px] font-black tracking-widest">Close</button>
              <h4 className="text-[10px] font-black tracking-[0.4em] uppercase text-indigo-500 mb-6">Scientific Insight</h4>
              <h2 className="text-3xl font-black text-white mb-6 leading-tight">{activeFeature.title}</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10 font-light">{activeFeature.desc}</p>
              <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20">Action Requirement Met</button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="absolute bottom-12 left-12 max-w-xs pointer-events-none">
            <motion.div style={{ opacity: useTransform(scrollYProgress, [0.8, 0.95], [0, 1]) }}>
               <p className="text-slate-500 text-sm font-serif italic">"Education should evolve with every learner."</p>
            </motion.div>
        </div>
      </div>
    </div>
  );
};
