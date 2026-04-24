import React, { useState, useCallback } from 'react';
import { Play, RotateCcw, Battery, Zap, Lightbulb, Box, Power, Info, ChevronRight } from 'lucide-react';
import { Button } from '../../DesignSystem/Button';
import { Card } from '../../DesignSystem/Card';
import { Text } from '../../DesignSystem/Typography';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const COMPONENTS = [
  { id: 'battery', icon: Battery, label: '9V Source', type: 'source', color: '#10b981' },
  { id: 'resistor', icon: Box, label: 'Resistor', type: 'passive', color: '#6366f1' },
  { id: 'led', icon: Lightbulb, label: 'LED Node', type: 'output', color: '#ff2d55' },
];

const GRID_SIZE = 50;

export const CircuitBuilder = () => {
  const [placed, setPlaced] = useState<{ id: string; type: string; x: number; y: number; uid: string }[]>([]);
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [isPowered, setIsPowered] = useState(false);
  const [errorLine, setErrorLine] = useState<string | null>(null);

  const snap = (val: number) => Math.round(val / GRID_SIZE) * GRID_SIZE;

  const handleDrop = (e: React.MouseEvent) => {
    if (!draggedItem) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = snap(e.clientX - rect.left - 30);
    const y = snap(e.clientY - rect.top - 30);
    
    // Check if overlap
    if (placed.some(p => p.x === x && p.y === y)) {
      setErrorLine("Node slot occupied.");
      setTimeout(() => setErrorLine(null), 2000);
      return;
    }

    setPlaced([...placed, { ...draggedItem, x, y, uid: Math.random().toString(36).substr(2, 9) }]);
    setDraggedItem(null);
  };

  const getConnections = useCallback(() => {
    const sorted = [...placed].sort((a, b) => a.x - b.x || a.y - b.y);
    const conns: [number, number][] = [];
    for (let i = 0; i < sorted.length - 1; i++) {
       const dist = Math.abs(sorted[i].x - sorted[i+1].x) + Math.abs(sorted[i].y - sorted[i+1].y);
       if (dist < 200) {
          conns.push([i, i+1]);
       }
    }
    if (sorted.length > 2) {
       const dist = Math.abs(sorted[0].x - sorted[sorted.length-1].x) + Math.abs(sorted[0].y - sorted[sorted.length-1].y);
       if (dist < 250) {
          conns.push([sorted.length - 1, 0]);
       }
    }
    return { sorted, conns };
  }, [placed]);

  const { sorted, conns } = getConnections();

  const checkCircuit = () => {
    const hasBattery = placed.some(p => p.id === 'battery');
    const hasLED = placed.some(p => p.id === 'led');
    const isClosed = conns.length === sorted.length && sorted.length >= 2;

    if (hasBattery && hasLED && isClosed) {
      setIsPowered(true);
    } else {
      setIsPowered(false);
      setErrorLine(!isClosed ? "Open circuit loop." : "Source missing.");
      setTimeout(() => setErrorLine(null), 3000);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-8 p-6 bg-gray-50/50">
      <div className="w-full lg:w-72 flex flex-col gap-6">
        <Card className="p-8 bg-white border-border-light shadow-xl flex flex-col gap-8">
           <div>
              <Text className="text-[10px] font-bold uppercase tracking-[0.25em] text-text-secondary mb-6 block px-1">Circuit Library</Text>
              <div className="grid grid-cols-1 gap-4">
                {COMPONENTS.map(comp => (
                  <div
                    key={comp.id}
                    draggable
                    onDragStart={() => setDraggedItem(comp)}
                    className="p-5 bg-gray-50/50 border border-border-light rounded-2xl cursor-grab active:cursor-grabbing hover:bg-white hover:border-brand-purple/30 hover:shadow-lg transition-all flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white border border-border-light flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <comp.icon className="w-6 h-6" style={{ color: comp.color }} />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-xs font-bold text-text-primary tracking-tight">{comp.label}</span>
                       <span className="text-[9px] uppercase font-bold text-text-secondary/60">{comp.type}</span>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           <div className="pt-8 border-t border-gray-100 mt-auto">
              <div className="flex items-center justify-between mb-4 px-1">
                 <Text className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">Circuit State</Text>
                 <div className={cn("w-3 h-3 rounded-full shadow-sm transition-colors", isPowered ? "bg-emerald-500 animate-pulse" : "bg-gray-200")} />
              </div>
              <div className="space-y-4">
                 <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      animate={{ width: isPowered ? '100%' : '0%' }}
                      className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                    />
                 </div>
                 <p className="text-[10px] text-text-secondary font-mono font-bold text-center tracking-tighter uppercase">
                    {isPowered ? 'Active // Electron Path Stable' : 'Awaiting // Induction Idle'}
                 </p>
              </div>
           </div>
        </Card>

        <Card className="p-6 bg-brand-pink/5 border-brand-pink/10 rounded-[2rem] flex items-start gap-4">
           <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-brand-pink/10">
              <Info className="w-6 h-6 text-brand-pink" />
           </div>
           <p className="text-[10px] text-text-secondary leading-relaxed font-bold italic pt-1">
              "Drag nodes onto the canvas and connect them to create a valid neural circuit loop."
           </p>
        </Card>
      </div>

      <div className="flex-1 relative border border-border-light rounded-[3rem] bg-white shadow-2xl overflow-hidden min-h-[500px]" 
           onDragOver={(e) => e.preventDefault()} 
           onDrop={(e: any) => handleDrop(e)}>
        
        {/* PCB Style Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
             style={{ 
               backgroundImage: `linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)`,
               backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px` 
             }} 
        />

        {/* Neural Wires */}
        <svg className="absolute inset-0 pointer-events-none w-full h-full">
           <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                 <feGaussianBlur stdDeviation="3" result="blur" />
                 <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
           </defs>
           {conns.map(([i, j], idx) => (
             <g key={idx}>
                {/* Visual shadow line */}
                <path
                  d={`M ${sorted[i].x + 35} ${sorted[i].y + 35} L ${sorted[j].x + 35} ${sorted[j].y + 35}`}
                  stroke="rgba(0,0,0,0.03)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                />
               <motion.path
                 d={`M ${sorted[i].x + 35} ${sorted[i].y + 35} L ${sorted[j].x + 35} ${sorted[j].y + 35}`}
                 stroke={isPowered ? "#8b5cf6" : "#e2e8f0"}
                 strokeWidth="4"
                 fill="none"
                 strokeLinecap="round"
                 initial={{ pathLength: 0 }}
                 animate={{ pathLength: 1 }}
                 filter={isPowered ? "url(#glow)" : ""}
               />
               {isPowered && (
                 <motion.circle
                   r="4"
                   fill="#ffffff"
                   initial={{ offset: 0 }}
                   animate={{ 
                     cx: [sorted[i].x+35, sorted[j].x+35],
                     cy: [sorted[i].y+35, sorted[j].y+35]
                   }}
                   transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                   className="shadow-xl"
                 />
               )}
             </g>
           ))}
        </svg>

        {/* Component Display */}
        <AnimatePresence>
          {placed.map((p) => {
            const config = COMPONENTS.find(c => c.id === p.id);
            const Icon = config?.icon || Box;
            return (
              <motion.div
                key={p.uid}
                initial={{ scale: 0, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute w-[70px] h-[70px] cursor-pointer group"
                style={{ left: p.x, top: p.y }}
              >
                 <div className="absolute inset-0 bg-white border border-border-light rounded-3xl shadow-xl group-hover:shadow-2xl transition-all group-hover:scale-105" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className={cn(
                      "w-7 h-7 transition-all duration-700",
                      isPowered && p.id === 'led' ? "text-brand-pink drop-shadow-[0_0_15px_#ff2d55] scale-125" : "text-text-secondary/30",
                      isPowered && p.id === 'battery' ? "text-emerald-500 scale-110" : ""
                    )} />
                 </div>
                 
                 {/* Connection Pins */}
                 <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gray-100 border-2 border-white shadow-sm" />
                 <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gray-100 border-2 border-white shadow-sm" />
              </motion.div>
            );
          })}
        </AnimatePresence>

        <div className="absolute top-10 right-10 flex flex-col items-end gap-6 pointer-events-none">
           <AnimatePresence>
              {errorLine && (
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  className="bg-white/90 backdrop-blur-xl border border-rose-100 px-6 py-3 rounded-full text-[11px] font-bold text-rose-500 uppercase tracking-widest shadow-xl"
                >
                  {errorLine}
                </motion.div>
              )}
           </AnimatePresence>
        </div>

        <div className="absolute bottom-10 right-10 flex gap-4">
          <Button variant="secondary" className="h-14 border-gray-200 bg-white hover:bg-gray-50 px-8 rounded-2xl shadow-lg shadow-black/5 font-bold uppercase tracking-widest text-[10px]" onClick={() => { setPlaced([]); setIsPowered(false); }}>
            <RotateCcw className="w-5 h-5 mr-3" /> Clear Board
          </Button>
          <Button variant="primary" className="h-14 bg-brand-purple shadow-xl shadow-brand-purple/20 px-12 rounded-[1.25rem] font-bold uppercase tracking-widest text-[10px] transition-all hover:scale-105" onClick={checkCircuit}>
            <Zap className="w-5 h-5 mr-3 fill-current" /> Engage Power
          </Button>
        </div>
      </div>
    </div>
  );
};
