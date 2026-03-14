import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Sphere, Line, PerspectiveCamera, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

const NetworkGlobe = () => {
    const groupRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (groupRef.current) groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    });

    const connections = useMemo(() => {
        const data = [];
        const numPoints = 12;
        const radius = 3;
        for (let i = 0; i < numPoints; i++) {
            const phi = Math.acos(-1 + (2 * i) / numPoints);
            const theta = Math.sqrt(numPoints * Math.PI) * phi;
            const x1 = radius * Math.sin(phi) * Math.cos(theta);
            const y1 = radius * Math.sin(phi) * Math.sin(theta);
            const z1 = radius * Math.cos(phi);

            // Connect to a random other point
            const j = (i + 1 + Math.floor(Math.random() * (numPoints - 1))) % numPoints;
            const phi2 = Math.acos(-1 + (2 * j) / numPoints);
            const theta2 = Math.sqrt(numPoints * Math.PI) * phi2;
            const x2 = radius * Math.sin(phi2) * Math.cos(theta2);
            const y2 = radius * Math.sin(phi2) * Math.sin(theta2);
            const z2 = radius * Math.cos(phi2);

            data.push({ p1: [x1, y1, z1], p2: [x2, y2, z2] });
        }
        return data;
    }, []);

    // Particles for the globe surface
    const particles = useMemo(() => {
        const temp = new Float32Array(3000 * 3);
        const radius = 3;
        for (let i = 0; i < 3000; i++) {
            const phi = Math.acos(-1 + (2 * i) / 3000);
            const theta = Math.sqrt(3000 * Math.PI) * phi;
            temp[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            temp[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            temp[i * 3 + 2] = radius * Math.cos(phi);
        }
        return temp;
    }, []);

    return (
        <group ref={groupRef}>
            <Points positions={particles}>
                <PointMaterial transparent color="#4f46e5" size={0.02} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} />
            </Points>
            {connections.map((c, i) => (
                <Line
                    key={i}
                    points={[c.p1, c.p2]}
                    color="#6366f1"
                    lineWidth={0.5}
                    transparent
                    opacity={0.3}
                />
            ))}
            {connections.slice(0, 5).map((c, i) => (
                <Float key={`node-${i}`} position={c.p1 as any} speed={2} rotationIntensity={1} floatIntensity={1}>
                    <Sphere args={[0.1, 16, 16]}>
                        <meshBasicMaterial color="#06b6d4" />
                    </Sphere>
                </Float>
            ))}
        </group>
    );
};

export const GlobalNetworkSection = () => {
    return (
        <section className="relative h-screen bg-black overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 z-0">
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                    <ambientLight intensity={0.5} />
                    <NetworkGlobe />
                    <Environment preset="night" />
                </Canvas>
            </div>
            
            <div className="relative z-10 text-center max-w-4xl px-6 pointer-events-none">
                <h2 className="text-4xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] mb-12">
                    A Global Knowledge <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">Mesh.</span>
                </h2>
                <p className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed">
                    MyEduDNA connects learners, mentors, and institutions globally. Our decentralized network sequences collective intelligence into personalized outcomes.
                </p>
            </div>
            
            <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center space-x-4 opacity-30">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Live Connection Sync</span>
            </div>
        </section>
    );
};
