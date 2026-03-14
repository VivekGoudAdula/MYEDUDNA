import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Target, Code, Brain, Rocket, Award } from 'lucide-react';

const milestones = [
    { title: "Foundations", desc: "Mastering core logic, mathematical structures, and the building blocks of systematic thought.", icon: <Target className="w-8 h-8" /> },
    { title: "Implementation", desc: "Translating concepts into clean, scalable architecture through rigorous programming projects.", icon: <Code className="w-8 h-8" /> },
    { title: "Specialization", desc: "Diving deep into Artificial Intelligence, Data Science, or specialized Research paths.", icon: <Brain className="w-8 h-8" /> },
    { title: "Realization", desc: "Collaborating with industry partners on high-stakes projects with tangible global impact.", icon: <Rocket className="w-8 h-8" /> },
    { title: "Mastery", desc: "Becoming a specialist who drives innovation and educates the next generation of learners.", icon: <Award className="w-8 h-8" /> },
];

export const CareerPathSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });

    return (
        <section ref={containerRef} className="py-64 bg-slate-950 px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-32 text-center">
                    <h2 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter">Your Career Architecture</h2>
                    <p className="text-slate-500 text-xl font-light max-w-2xl mx-auto">We don't just teach courses; we sequence your professional DNA with precision milestones designed for mastery.</p>
                </div>

                <div className="relative">
                    {/* The Path Line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2 hidden md:block" />
                    <motion.div 
                        style={{ height: useTransform(scrollYProgress, [0.4, 0.8], ["0%", "100%"]) }}
                        className="absolute left-1/2 top-0 w-[2px] bg-gradient-to-b from-indigo-500 to-cyan-400 -translate-x-1/2 hidden md:block origin-top"
                    />

                    <div className="space-y-40">
                        {milestones.map((m, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className={`flex flex-col md:flex-row items-center gap-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                            >
                                <div className="flex-1 text-center md:text-left">
                                    <div className={`flex flex-col ${i % 2 === 0 ? 'md:items-end' : 'md:items-start'}`}>
                                        <h3 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">{m.title}</h3>
                                        <p className={`text-slate-400 text-lg font-light leading-relaxed max-w-md ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                            {m.desc}
                                        </p>
                                    </div>
                                </div>

                                <div className="relative z-20">
                                    <div className="w-20 h-20 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center text-indigo-500 shadow-2xl">
                                        {m.icon}
                                    </div>
                                </div>

                                <div className="flex-1 hidden md:block" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Background Narrative Decoration */}
            <div className="absolute top-[20%] left-[-10%] opacity-10 pointer-events-none">
                <span className="text-[200px] font-black text-white/10 select-none">ARCHITECTURE</span>
            </div>
            <div className="absolute bottom-[10%] right-[-10%] opacity-10 pointer-events-none">
                <span className="text-[200px] font-black text-white/10 select-none">EVOLUTION</span>
            </div>
        </section>
    );
};
