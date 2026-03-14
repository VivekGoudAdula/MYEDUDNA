import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Battery, Zap, AlertCircle } from 'lucide-react';

interface OhmsLawLabProps {
  onReadingUpdate: (readings: { voltage: number; resistance: number; current: number }) => void;
  initialResistance?: number;
}

const OhmsLawLab: React.FC<OhmsLawLabProps> = ({ onReadingUpdate, initialResistance = 50 }) => {
  const [voltage, setVoltage] = useState(10);
  const [isOpen, setIsOpen] = useState(true);

  const resistance = initialResistance;
  const current = isOpen ? 0 : +(voltage / resistance).toFixed(3);

  useEffect(() => {
    onReadingUpdate({ voltage, resistance, current });
  }, [voltage, resistance, current]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-12">
      {/* Circuit Area */}
      <div className="relative w-[600px] h-[400px] border border-white/5 bg-black/40 rounded-3xl p-8 overflow-hidden shadow-inner">
         {/* Circuit Glow Overlay */}
         {!isOpen && (
            <div className="absolute inset-0 bg-yellow-500/5 transition-opacity duration-500"></div>
         )}

         <svg viewBox="0 0 500 300" className="w-full h-full">
            {/* Wires Outline */}
            <path 
                d="M100 150 L100 50 L400 50 L400 150 M100 150 L100 250 L400 250 L400 150" 
                fill="none" 
                stroke="white" 
                strokeWidth="2" 
                strokeOpacity="0.1" 
            />

            {/* Active Current Flow Animation */}
            {!isOpen && (
               <motion.path 
                  d="M100 150 L100 50 L400 50 L400 150 L400 250 L100 250 L100 150" 
                  fill="none" 
                  stroke="#fbbf24" 
                  strokeWidth="4" 
                  strokeDasharray="20 40"
                  animate={{ strokeDashoffset: [200, 0] }}
                  transition={{ duration: 2 / (current + 0.1), repeat: Infinity, ease: "linear" }}
               />
            )}

            {/* Battery Component */}
            <g transform="translate(60, 110)">
                <rect x="0" y="0" width="80" height="80" rx="12" fill="#3b82f6" fillOpacity="0.9" />
                <Battery className="text-white absolute" style={{ transform: 'translate(20px, 20px) scale(1.5)' }} />
                <text x="40" y="95" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">9V - 12V DC</text>
            </g>

            {/* Resistor Component */}
            <g transform="translate(360, 110)">
               <rect x="0" y="0" width="80" height="80" rx="12" fill="#ef4444" fillOpacity="0.9" />
               <Zap className="text-white absolute" style={{ transform: 'translate(25px, 20px) scale(1.5)' }} />
               <text x="40" y="95" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">RESISTOR</text>
            </g>

            {/* Switch Component */}
            <g transform="translate(210, 30)">
               <rect x="0" y="0" width="80" height="40" rx="8" fill="#475569" fillOpacity="0.8" />
               <motion.line 
                  x1="20" y1="20" 
                  x2="60" y2={isOpen ? "5" : "20"} 
                  stroke="white" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
               />
               <circle cx="20" cy="20" r="4" fill="white" />
               <circle cx="60" cy="20" r="4" fill="white" />
               <rect 
                  x="0" y="0" width="80" height="40" 
                  fill="transparent" 
                  className="cursor-pointer" 
                  onClick={() => setIsOpen(!isOpen)} 
               />
            </g>
         </svg>

      </div>

      {/* Info Warning */}
      <AnimatePresence>
        {current > 0.5 && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 flex items-center space-x-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-200 text-xs"
            >
                <AlertCircle size={14} />
                <span>High current detected! Components may overheat.</span>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OhmsLawLab;
