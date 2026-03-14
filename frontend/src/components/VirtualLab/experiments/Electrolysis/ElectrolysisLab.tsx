import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ElectrolysisLabProps {
  onReadingUpdate: (readings: { hydrogen: number; oxygen: number; current: number }) => void;
  initialCurrent?: number;
}

const ElectrolysisLab: React.FC<ElectrolysisLabProps> = ({ onReadingUpdate, initialCurrent = 1.5 }) => {
  const [isActive, setIsActive] = useState(false);
  const [hydrogenVol, setHydrogenVol] = useState(0);
  const [oxygenVol, setOxygenVol] = useState(0);

  const current = isActive ? initialCurrent : 0;
  const [bubbles, setBubbles] = useState<{ id: number; pole: 'left' | 'right'; x: number }[]>([]);

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setHydrogenVol(prev => +(prev + (initialCurrent / 10)).toFixed(1));
        setOxygenVol(prev => +(prev + (initialCurrent / 20)).toFixed(1)); // 2:1 ratio
        
        // Add random bubbles
        for (let i = 0; i < Math.ceil(initialCurrent * 2); i++) {
            const id = Date.now() + Math.random();
            setBubbles(prev => [...prev.slice(-30), { 
                id, 
                pole: Math.random() > 0.6 ? 'left' : 'right',
                x: (Math.random() - 0.5) * 15
            }]);
        }
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isActive, initialCurrent]);

  useEffect(() => {
    onReadingUpdate({ hydrogen: hydrogenVol, oxygen: oxygenVol, current });
  }, [hydrogenVol, oxygenVol, current]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
       <div className="absolute bottom-8 flex justify-center w-full">
            <button 
                onClick={() => setIsActive(!isActive)}
                className={`px-8 py-3 rounded-xl font-bold transition-all border-2 shadow-2xl ${isActive ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-emerald-500/20' : 'bg-red-500/10 border-red-500 text-red-400 shadow-red-500/20'}`}
            >
                {isActive ? 'SHUTDOWN POWER' : 'ENGAGE POWER SOURCE'}
            </button>
       </div>
       <div className="relative w-[400px] h-[300px]">
          {/* Main Beaker */}
          <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-2xl">
             {/* Water */}
             <path d="M50 100 L350 100 L350 280 Q350 290 340 290 L60 290 Q50 290 50 280 Z" fill="rgba(0, 191, 255, 0.15)" />
             {/* Glass Outline */}
             <path d="M50 80 L50 280 Q50 290 60 290 L340 290 Q350 290 350 280 L350 80" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
             
             {/* Tubes */}
             <g transform="translate(100, 40)">
                {/* Left Tube (Hydrogen) */}
                <rect x="20" y="0" width="40" height="220" rx="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                <motion.rect 
                    x="20" y="0" width="40" 
                    animate={{ height: `${Math.min(220, hydrogenVol * 5)}` }}
                    fill="rgba(255,255,255,0.1)" 
                />
                <text x="40" y="-10" fill="rgba(255,255,255,0.4)" fontSize="10" textAnchor="middle" fontWeight="bold">H₂ (CATHODE)</text>
             </g>

             <g transform="translate(240, 40)">
                {/* Right Tube (Oxygen) */}
                <rect x="0" y="0" width="40" height="220" rx="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                <motion.rect 
                    x="0" y="0" width="40" 
                    animate={{ height: `${Math.min(220, oxygenVol * 5)}` }}
                    fill="rgba(255,255,255,0.1)" 
                />
                <text x="20" y="-10" fill="rgba(255,255,255,0.4)" fontSize="10" textAnchor="middle" fontWeight="bold">O₂ (ANODE)</text>
             </g>

             {/* Electrodes */}
             <rect x="135" y="180" width="10" height="100" fill="rgba(100,100,100,0.8)" rx="2" />
             <rect x="255" y="180" width="10" height="100" fill="rgba(100,100,100,0.8)" rx="2" />

             {/* Bubbles Simulation */}
             <AnimatePresence>
                {bubbles.map(b => (
                    <motion.circle
                        key={b.id}
                        initial={{ cx: b.pole === 'left' ? 140 + b.x : 260 + b.x, cy: 260, r: 0, opacity: 0 }}
                        animate={{ cy: 100, r: 2 + Math.random() * 3, opacity: [0, 1, 0.5, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "linear" }}
                        fill="rgba(255,255,255,0.6)"
                    />
                ))}
             </AnimatePresence>

             {/* Wires */}
             <motion.path 
                d="M140 280 Q140 320 300 320" 
                fill="none" 
                stroke={isActive ? "#fbbf24" : "rgba(255,255,255,0.1)"} 
                strokeWidth="3"
                animate={isActive ? { strokeDasharray: [10, 5], strokeDashoffset: [0, -15] } : {}}
             />
             <motion.path 
                d="M260 280 Q260 350 350 350 L350 130" 
                fill="none" 
                stroke={isActive ? "#f87171" : "rgba(255,255,255,0.1)"} 
                strokeWidth="3"
                animate={isActive ? { strokeDasharray: [10, 5], strokeDashoffset: [0, 15] } : {}}
             />
          </svg>
       </div>
    </div>
  );
};

export default ElectrolysisLab;
