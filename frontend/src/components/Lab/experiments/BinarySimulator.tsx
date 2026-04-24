import React, { useState, useEffect } from 'react';
import { Terminal, Database, ArrowRight, Info, Layers } from 'lucide-react';
import { Button } from '../../DesignSystem/Button';
import { Card } from '../../DesignSystem/Card';
import { Text } from '../../DesignSystem/Typography';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export const BinarySimulator = () => {
  const [decimal, setDecimal] = useState(42);
  const [binary, setBinary] = useState<string>('');

  useEffect(() => {
    setBinary(decimal.toString(2).padStart(8, '0'));
  }, [decimal]);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-8 p-6 bg-gray-50/50">
      <div className="flex-1 bg-white border border-border-light rounded-[2.5rem] flex flex-col items-center justify-center p-12 space-y-16 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-purple/20 to-transparent" />
        
        <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
           <div className="p-10 bg-white border border-border-light rounded-[2rem] shadow-xl text-center group transition-all hover:scale-105 min-w-[180px]">
              <div className="text-7xl font-display font-bold text-text-primary tracking-tight">{decimal}</div>
              <div className="w-12 h-1 bg-brand-purple/20 mx-auto mt-4 rounded-full" />
              <Text className="text-[10px] uppercase font-bold text-text-secondary mt-4 tracking-[0.2em] px-1 overflow-hidden whitespace-nowrap">Decimal Base-10</Text>
           </div>
           
           <motion.div 
             animate={{ x: [0, 8, 0], scale: [1, 1.1, 1] }}
             transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
             className="text-brand-purple p-4 bg-brand-purple/5 rounded-full border border-brand-purple/10 shadow-sm"
           >
              <ArrowRight className="w-8 h-8" />
           </motion.div>

           <div className="p-10 bg-white border border-brand-purple/20 rounded-[2.5rem] shadow-2xl shadow-brand-purple/5 relative">
              <div className="flex gap-3">
                 {binary.split('').map((bit, i) => (
                   <motion.div
                     key={i}
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     transition={{ delay: i * 0.05 }}
                     className={cn(
                       "w-12 h-20 rounded-2xl flex items-center justify-center text-3xl font-mono font-bold transition-all duration-500",
                       bit === '1' 
                         ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/30 scale-105" 
                         : "bg-gray-50 text-text-secondary/20 border border-border-light"
                     )}
                   >
                     {bit}
                   </motion.div>
                 ))}
              </div>
              <Text className="text-[10px] uppercase font-bold text-brand-purple mt-8 text-center tracking-[0.3em]">Binary Base-2 (8-Bit Register)</Text>
           </div>
        </div>

        {/* Decoder Logic Viz */}
        <div className="w-full max-w-3xl p-10 bg-gray-50/50 border border-border-light rounded-[2.5rem] shadow-sm">
           <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm border border-border-light">
                    <Terminal className="w-5 h-5 text-brand-purple" />
                 </div>
                 <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-text-secondary">Logic Weight Distribution</span>
              </div>
              <div className="px-4 py-1.5 rounded-full bg-white border border-border-light text-[10px] font-bold text-brand-purple shadow-sm">
                 Active Bits: {binary.split('').filter(b => b === '1').length}
              </div>
           </div>
           <div className="grid grid-cols-8 gap-4">
              {[128, 64, 32, 16, 8, 4, 2, 1].map((p, i) => {
                const isActive = (decimal & p) !== 0;
                return (
                  <div key={p} className="flex flex-col items-center gap-4">
                     <div className={cn(
                       "w-full py-4 rounded-xl border text-xs font-mono font-bold text-center transition-all shadow-sm",
                       isActive 
                        ? "border-brand-purple/30 text-brand-purple bg-white ring-1 ring-brand-purple/5" 
                        : "border-border-light text-text-secondary/30 bg-white"
                     )}>
                        {p}
                     </div>
                     <div className={cn(
                        "w-2.5 h-2.5 rounded-full shadow-sm transition-all duration-500", 
                        isActive ? "bg-brand-purple scale-125" : "bg-gray-200"
                     )} />
                  </div>
                );
              })}
           </div>
        </div>
      </div>

      <div className="w-full lg:w-80 space-y-8">
        <Card className="p-8 space-y-8 bg-white border-border-light shadow-xl">
           <div>
              <div className="flex justify-between mb-4 items-center">
                 <Text className="text-[10px] uppercase font-bold text-text-secondary tracking-widest px-1">Value Injection</Text>
                 <span className="text-sm font-mono font-bold text-brand-purple bg-brand-purple/5 px-3 py-1 rounded-lg">{decimal}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="255" 
                value={decimal} 
                onChange={(e) => setDecimal(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-purple"
              />
           </div>

           <div className="space-y-4">
              <Text className="text-[10px] uppercase font-bold text-text-secondary tracking-widest px-1">Neural Presets</Text>
              <div className="grid grid-cols-3 gap-3">
                 {[0, 1, 42, 64, 128, 255].map(v => (
                   <button 
                     key={v}
                     onClick={() => setDecimal(v)}
                     className={cn(
                        "py-3 rounded-2xl border text-xs font-mono font-bold transition-all shadow-sm",
                        decimal === v 
                          ? "bg-brand-purple border-brand-purple text-white shadow-brand-purple/20" 
                          : "bg-white border-border-light text-text-secondary hover:border-brand-purple/30 hover:bg-gray-50"
                     )}
                   >
                     {v}
                   </button>
                 ))}
              </div>
           </div>
        </Card>

        <Card className="p-8 bg-brand-pink/5 border-brand-pink/10 flex items-start gap-5 shadow-sm rounded-[2rem]">
           <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-brand-pink/10">
              <Database className="w-6 h-6 text-brand-pink shadow-sm" />
           </div>
           <div>
              <Text className="text-[10px] uppercase font-bold text-brand-pink tracking-[0.2em] mb-2">Binary Insight</Text>
              <p className="text-[11px] text-text-secondary leading-relaxed font-bold italic">
                 "In 8-bit registers, values range from 0 to 255. This basic unit is a 'Byte', the building block of your neural DNA data streams."
              </p>
           </div>
        </Card>

        <Card className="p-8 bg-white border-border-light shadow-md flex items-center gap-4 group cursor-pointer hover:border-brand-purple/40">
           <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-border-light group-hover:bg-brand-purple/5">
              <Layers className="w-5 h-5 text-brand-purple" />
           </div>
           <div className="flex-1">
              <p className="text-[11px] font-bold text-text-primary uppercase tracking-tight">Register Trace</p>
              <p className="text-[9px] text-text-secondary font-medium">Capture bit-level state analysis</p>
           </div>
        </Card>
      </div>
    </div>
  );
};
