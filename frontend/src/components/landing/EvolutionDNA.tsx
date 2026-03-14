import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, Sphere, PerspectiveCamera, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const DynamicDNAStrand = ({ scroll }: { scroll: any }) => {
    const groupRef = useRef<THREE.Group>(null);
    
    // Growth logic based on scroll
    const visiblePairs = useTransform(scroll, [0, 0.8], [0, 50]);
    
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
            groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
        }
    });

    const numPairs = 50;
    const radius = 1.8;
    const height = 15;
    const twist = Math.PI * 8;

    const strands = useMemo(() => {
        const data = [];
        for (let i = 0; i < numPairs; i++) {
            const p = i / (numPairs - 1);
            const y = p * height - height / 2;
            const angle = p * twist;
            data.push({
                index: i,
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
            {strands.map((s) => (
                <group key={s.index}>
                    {/* Only show if index < visiblePairs */}
                    <Line 
                        points={[[s.x1, s.y, s.z1], [s.x2, s.y, s.z2]]} 
                        color="#6366f1" 
                        lineWidth={0.5} 
                        transparent 
                        opacity={0.15} 
                    />
                    <Sphere position={[s.x1, s.y, s.z1]} args={[0.08, 16, 16]}>
                        <meshStandardMaterial color="#818cf8" emissive="#4f46e5" emissiveIntensity={2} />
                    </Sphere>
                    <Sphere position={[s.x2, s.y, s.z2]} args={[0.08, 16, 16]}>
                        <meshStandardMaterial color="#22d3ee" emissive="#0891b2" emissiveIntensity={2} />
                    </Sphere>
                </group>
            ))}
        </group>
    );
};

export const EvolutionDNA = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const textOpacity = useTransform(scrollYProgress, [0.4, 0.6, 0.8, 1], [0, 1, 1, 0]);
    const textY = useTransform(scrollYProgress, [0.4, 0.6], [50, 0]);
    const strandScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 1]);

    return (
        <section ref={containerRef} className="relative h-[300vh] bg-slate-950 overflow-hidden">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center">
                {/* 3D Context */}
                <div className="absolute inset-0 z-0">
                    <Canvas>
                        <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={45} />
                        <ambientLight intensity={0.2} />
                        <pointLight position={[10, 10, 15]} intensity={3} color="#4f46e5" />
                        <pointLight position={[-10, -10, 10]} intensity={2} color="#06b6d4" />
                        <group scale={strandScale.get()}>
                             <DynamicDNAStrand scroll={scrollYProgress} />
                        </group>
                    </Canvas>
                </div>
                
                {/* Scrolling Narrative Overlay */}
                <div className="relative z-10 text-center max-w-5xl px-6 pointer-events-none">
                    <motion.div style={{ opacity: textOpacity, y: textY }} className="space-y-12">
                        <h4 className="text-cyan-400 font-black uppercase tracking-[0.8em] text-xs">Biological Intelligence</h4>
                        <h2 className="text-6xl md:text-[10rem] font-black text-white tracking-tighter leading-[0.8] uppercase">
                            Knowledge <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400 font-black">Evolves.</span>
                        </h2>
                        <p className="text-xl md:text-3xl text-slate-400 font-light leading-relaxed max-w-2xl mx-auto">
                            Your learning architecture sequence is dynamic. Growing stronger with every concept mastered, we sequence your intellectual progress into a unique professional fingerprint.
                        </p>
                    </motion.div>
                </div>

                {/* Progress Indicators */}
                <div className="absolute top-24 left-1/2 -translate-x-1/2 flex items-center space-x-12 opacity-30 pointer-events-none">
                     <span className="text-[10px] font-black uppercase tracking-[1em] text-indigo-400">Strand Sequence 0%</span>
                     <div className="w-48 h-px bg-white/20 relative">
                        <motion.div style={{ width: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }} className="absolute inset-0 bg-indigo-500 shadow-[0_0_10px_indigo]" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-[1em] text-cyan-400">100% Optimized</span>
                </div>
            </div>
            
            <div className="absolute bottom-0 inset-x-0 h-96 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
        </section>
    );
};
