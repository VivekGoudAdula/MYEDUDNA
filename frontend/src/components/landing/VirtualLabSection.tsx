import React, { useState } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { Battery, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';

const components = [
  { id: 'battery', icon: <Battery className="w-6 h-6" />, name: "Voltage Source", value: "12V" },
  { id: 'resistor', icon: <Zap className="w-6 h-6" />, name: "Load Resistor", value: "200Ω" },
  { id: 'bulb', icon: <div className="w-4 h-4 rounded-full bg-yellow-400 blur-[2px]" />, name: "Luminescent Node", value: "10W" }
];

export const VirtualLabSection = () => {
    const [items, setItems] = useState(['resistor', 'battery', 'bulb']);
    const isLive = items[0] === 'battery';

    return (
        <section className="py-64 bg-slate-900 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-24">
                <div className="flex-1 space-y-10">
                    <h2 className="text-sm font-black tracking-[0.4em] uppercase text-cyan-400">Virtual Lab Environment</h2>
                    <h3 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter">Experiment with<br/>digital materiality.</h3>
                    <p className="text-xl text-slate-400 font-light leading-relaxed max-w-xl">
                        Our labs use high-fidelity physics engines to simulate outcomes before you touch a physical wire. Drag the components to sequence the power flow.
                    </p>
                    <div className="p-8 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 flex items-start space-x-6 backdrop-blur-xl">
                        <AlertCircle className="text-indigo-500 shrink-0 mt-1" size={24} />
                        <div>
                            <p className="font-black text-white text-lg mb-2">Simulation Protocol</p>
                            <p className="text-slate-500 leading-relaxed font-light">The power source must be placed at the primary node to activate the circuit. Try reordering the components.</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full max-w-lg aspect-square bg-slate-950 rounded-[4rem] border-[12px] border-slate-800 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative p-12 flex flex-col justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    
                    <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-6 relative z-10">
                        {items.map((id) => {
                            const comp = components.find(c => c.id === id)!;
                            return (
                                <Reorder.Item key={id} value={id} className="cursor-grab active:cursor-grabbing">
                                    <motion.div className="p-8 rounded-[2rem] bg-slate-900 border border-white/5 flex items-center justify-between group hover:border-indigo-500/30 transition-colors">
                                        <div className="flex items-center space-x-6">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-indigo-400 shadow-inner group-hover:bg-indigo-500/10 transition-colors">
                                                {comp.icon}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-lg">{comp.name}</p>
                                                <p className="text-[10px] font-black tracking-[0.2em] text-slate-600 uppercase mt-1">{comp.value} Technical Param</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                                        </div>
                                    </motion.div>
                                </Reorder.Item>
                            );
                        })}
                    </Reorder.Group>

                    <div className="mt-16 text-center">
                        <AnimatePresence mode="wait">
                            {isLive ? (
                                <motion.div 
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                    className="inline-flex items-center space-x-4 px-10 py-5 rounded-full bg-green-500 text-white font-black shadow-2xl shadow-green-500/40"
                                >
                                    <CheckCircle2 size={24} />
                                    <span className="uppercase tracking-widest text-sm">Circuit Status: Operational</span>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="idle"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="text-slate-600 text-[10px] font-black uppercase tracking-[0.6em]"
                                >
                                    Waiting for sequence...
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Experimental Glow */}
                    {isLive && (
                        <div className="absolute inset-0 bg-indigo-500/10 animate-pulse pointer-events-none" />
                    )}
                </div>
            </div>
            
            <div className="mt-24 text-center">
                <p className="text-slate-600 font-serif italic text-lg">“Explore full virtual labs inside MyEduDNA.”</p>
            </div>
        </section>
    );
};
