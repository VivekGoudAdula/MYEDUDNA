import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TitrationLabProps {
  onReadingUpdate: (readings: { volume: number; ph: number; color: string }) => void;
  speed?: number;
}

const TitrationLab: React.FC<TitrationLabProps> = ({ onReadingUpdate, speed = 0.4 }) => {
  const [volumeAdded, setVolumeAdded] = useState(0);
  const [isDripping, setIsDripping] = useState(false);
  const [hasIndicator, setHasIndicator] = useState(false);
  const [drops, setDrops] = useState<number[]>([]);

  // Constants for titration (Strong Acid HCl 0.1M + Strong Base NaOH 0.1M)
  // Equivalence point at 10ml
  const V_acid = 10;
  const C_acid = 0.1;
  const C_base = 0.1;

  useEffect(() => {
    let interval: any;
    if (isDripping) {
      // Adjusted speed: interval time inversly proportional to speed
      const intervalTime = Math.max(20, 150 - (speed * 120));
      interval = setInterval(() => {
        setVolumeAdded(prev => {
          const newVol = +(prev + 0.1).toFixed(1);
          return newVol;
        });
        setDrops(prev => [...prev.slice(-10), Date.now()]);
      }, intervalTime);
    }
    return () => clearInterval(interval);
  }, [isDripping, speed]);

  useEffect(() => {
    // Calculate pH
    // If V_base < V_equiv: pH = -log10((n_acid - n_base) / (V_total))
    // If V_base = V_equiv: pH = 7
    // If V_base > V_equiv: pOH = -log10((n_base - n_acid) / (V_total)), pH = 14 - pOH
    
    const vAddedLiters = volumeAdded / 1000;
    const vAcidLiters = V_acid / 1000;
    const n_acid = vAcidLiters * C_acid;
    const n_base_added = vAddedLiters * C_base;
    const vTotalLiters = vAcidLiters + vAddedLiters;

    let ph = 7;
    if (n_base_added < n_acid) {
      const conc_h = (n_acid - n_base_added) / vTotalLiters;
      ph = -Math.log10(conc_h);
    } else if (n_base_added > n_acid) {
      const conc_oh = (n_base_added - n_acid) / vTotalLiters;
      const poh = -Math.log10(conc_oh);
      ph = 14 - poh;
    }

    // Determine color
    let color = 'rgba(255, 255, 255, 0.3)'; // Default transparent/watery
    if (hasIndicator) {
      if (ph < 8.2) {
        color = 'rgba(255, 255, 255, 0.3)';
      } else if (ph >= 8.2 && ph < 10) {
        color = 'rgba(255, 182, 193, 0.6)'; // Light pink
      } else {
        color = 'rgba(255, 105, 180, 0.8)'; // Deep pink/magenta
      }
    }

    onReadingUpdate({ volume: volumeAdded, ph: Number(ph.toFixed(2)), color: hasIndicator ? (ph >= 8.2 ? 'Pink' : 'Colorless') : 'Colorless' });
  }, [volumeAdded, hasIndicator]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <div className="relative flex flex-col items-center">
        {/* Burette Stand */}
        <div className="absolute left-[calc(50%+40px)] top-0 bottom-0 w-2 bg-slate-700 rounded-full shadow-2xl">
          <div className="absolute top-20 w-16 h-2 bg-slate-700 -left-12 rounded-full"></div>
          <div className="absolute bottom-0 w-32 h-4 bg-slate-800 -left-15 rounded-t-xl"></div>
        </div>

        {/* Burette */}
        <div className="relative w-8 h-80 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full overflow-hidden mb-20 shadow-xl">
          {/* Liquid level inside burette */}
          <motion.div 
            className="absolute bottom-0 w-full bg-blue-400/30 border-t border-blue-300"
            initial={{ height: '100%' }}
            animate={{ height: `${100 - (volumeAdded / 50) * 100}%` }}
          />
          {/* Graduation lines */}
          {[...Array(21)].map((_, i) => (
            <div key={i} className="absolute w-2 h-[1px] bg-white/30 right-0" style={{ top: `${i * 5}%` }}></div>
          ))}
        </div>

        {/* Burette Valve */}
        <div className="absolute top-[310px] z-20">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDripping(!isDripping)}
            className={`w-10 h-6 rounded-full shadow-lg flex items-center justify-center transition-colors ${isDripping ? 'bg-emerald-500' : 'bg-slate-500'}`}
          >
             <div className="w-1 h-4 bg-white/50 rounded-full"></div>
          </motion.button>
        </div>

        {/* Falling Drops */}
        <div className="absolute top-[330px] w-full flex justify-center h-20 overflow-hidden pointer-events-none">
          <AnimatePresence>
            {drops.map(id => (
              <motion.div
                key={id}
                initial={{ y: 0, opacity: 1, scale: 1 }}
                animate={{ y: 80, opacity: 0, scale: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeIn" }}
                className="absolute w-1.5 h-3 bg-blue-300/60 rounded-full"
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Conical Flask */}
        <div className="relative mt-auto">
          <svg width="180" height="150" viewBox="0 0 180 150">
            {/* Liquid in flask */}
            <motion.path 
              initial={{ d: "M60 20 L120 20 L160 130 Q165 140 150 140 L30 140 Q15 140 20 130 Z" }}
              fill={hasIndicator ? (volumeAdded >= 10 ? 'rgba(255, 105, 180, 0.5)' : 'rgba(255, 255, 255, 0.2)') : 'rgba(255, 255, 255, 0.2)'}
              animate={{ 
                fill: hasIndicator 
                  ? (volumeAdded >= 10.2 ? 'rgba(255, 20, 147, 0.7)' : (volumeAdded >= 10 ? 'rgba(255, 182, 193, 0.5)' : 'rgba(255, 255, 255, 0.2)'))
                  : 'rgba(255, 255, 255, 0.2)',
                d: `M60 ${Math.max(0, 20 - (volumeAdded || 0) * 0.5)} L120 ${Math.max(0, 20 - (volumeAdded || 0) * 0.5)} L160 130 Q165 140 150 140 L30 140 Q15 140 20 130 Z`
              }}
              transition={{ duration: 0.3 }}
            />
            {/* Glass outline */}
            <path d="M60 10 L60 40 L20 130 Q15 140 30 140 L150 140 Q165 140 160 130 L120 40 L120 10" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
            <path d="M60 10 L120 10" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
          </svg>
          
          {/* Action Button: Add Indicator */}
          {!hasIndicator && (
             <div className="absolute -right-32 top-1/2 -translate-y-1/2">
                <button 
                  onClick={() => setHasIndicator(true)}
                  className="px-4 py-2 bg-pink-500/20 hover:bg-pink-500/40 border border-pink-500/50 text-pink-200 text-xs font-bold rounded-lg backdrop-blur-md transition-all flex items-center space-x-2"
                >
                  <div className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></div>
                  <span>Add Indicator</span>
                </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TitrationLab;
