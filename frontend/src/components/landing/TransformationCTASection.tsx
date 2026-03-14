import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, MeshDistortMaterial } from '@react-three/drei';
import { Link } from 'react-router-dom';
import * as THREE from 'three';

const KnowledgeTree = () => {
    const meshRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (meshRef.current) meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    });

    const branches = Array.from({ length: 40 }).map((_, i) => {
        const angle = (i / 40) * Math.PI * 2;
        const height = (i / 40) * 8 - 4;
        const radius = Math.sin((i / 40) * Math.PI) * 2 + 0.5;
        return {
            x: Math.cos(angle) * radius,
            y: height,
            z: Math.sin(angle) * radius,
            scale: 0.2 + (i / 40) * 0.5
        };
    });

    return (
        <group ref={meshRef}>
            {branches.map((b, i) => (
                <Float key={i} position={[b.x, b.y, b.z]} speed={3} rotationIntensity={2} floatIntensity={1}>
                    <mesh>
                        <sphereGeometry args={[b.scale, 16, 16]} />
                        <MeshDistortMaterial 
                            color={i % 2 === 0 ? "#6366f1" : "#06b6d4"} 
                            distort={0.4} 
                            speed={2} 
                            emissive={i % 2 === 0 ? "#6366f1" : "#06b6d4"}
                            emissiveIntensity={2}
                        />
                    </mesh>
                </Float>
            ))}
            <mesh position={[0, -5, 0]}>
                <cylinderGeometry args={[0.2, 1, 10, 32]} />
                <meshStandardMaterial color="#2d2d2d" metalness={0.5} roughness={0.2} />
            </mesh>
        </group>
    );
};

export const TransformationCTASection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
    
    const treeScale = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);
    const treeOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);

    return (
        <section ref={containerRef} className="relative h-[150svh] bg-black overflow-hidden flex flex-col items-center justify-center">
            <motion.div 
                style={{ scale: treeScale, opacity: treeOpacity }}
                className="absolute inset-0 z-0"
            >
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 12]} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={2} color="#8b5cf6" />
                    <KnowledgeTree />
                    <Environment preset="night" />
                </Canvas>
            </motion.div>

            <div className="relative z-10 text-center max-w-5xl px-6 space-y-12">
                <motion.h2 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-9xl font-black text-white tracking-tighter leading-[0.8] mb-8"
                >
                    Education should <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">evolve with every learner.</span>
                </motion.h2>
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link 
                        to="/auth" 
                        className="group relative inline-flex items-center justify-center px-12 py-6 overflow-hidden font-black text-white bg-indigo-600 rounded-full shadow-2xl transition duration-300 ease-out hover:bg-white hover:text-indigo-600"
                    >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative text-2xl tracking-widest uppercase">Start Your Learning DNA</span>
                    </Link>
                </motion.div>
            </div>

            <div className="absolute bottom-12 text-slate-700 text-[10px] font-black uppercase tracking-[1em]">
               The Biological Blueprint of Knowledge
            </div>
        </section>
    );
};
