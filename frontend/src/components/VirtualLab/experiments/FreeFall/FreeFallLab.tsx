import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, ArrowDown } from 'lucide-react';

interface FreeFallLabProps {
  onReadingUpdate: (readings: { height: number; time: number; velocity: number }) => void;
  initialHeight?: number;
}

const FreeFallLab: React.FC<FreeFallLabProps> = ({ onReadingUpdate, initialHeight = 20 }) => {
  const [isFalling, setIsFalling] = useState(false);
  const [time, setTime] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const g = 9.81;

  const height = initialHeight;
  const animationFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const startDrop = () => {
    setIsFalling(true);
    setTime(0);
    setCurrentY(0);
    setVelocity(0);
    startTimeRef.current = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const distance = 0.5 * g * elapsed * elapsed;
      const v = g * elapsed;

      if (distance >= height) {
        const finalTime = Math.sqrt((2 * height) / g);
        setTime(finalTime);
        setCurrentY(height);
        setVelocity(g * finalTime);
        setIsFalling(false);
        cancelAnimationFrame(animationFrameRef.current);
      } else {
        setTime(elapsed);
        setCurrentY(distance);
        setVelocity(v);
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const reset = () => {
    setIsFalling(false);
    setTime(0);
    setCurrentY(0);
    setVelocity(0);
    cancelAnimationFrame(animationFrameRef.current);
  };

  useEffect(() => {
    onReadingUpdate({ height, time: Number(time.toFixed(2)), velocity: Number(velocity.toFixed(2)) });
  }, [time, velocity, height]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
      {/* Main Simulation Area */}
      <div className="relative h-full flex items-center">
         {/* Tower */}
         <div className="relative w-2 h-80 bg-slate-700/50 rounded-full flex justify-center">
            {/* Height Markers */}
            {[...Array(6)].map((_, i) => (
                <div key={i} className="absolute w-4 h-[1px] bg-white/20" style={{ top: `${i * 20}%` }}>
                   <span className="absolute -left-8 -top-2 text-[8px] text-slate-500 font-mono">{(height - (i * (height/5))).toFixed(0)}m</span>
                </div>
            ))}

            {/* Path visualization */}
            <div className="absolute inset-0 bg-indigo-500/10 w-4 -left-1 blur-md h-full"></div>

            {/* Falling Ball */}
            <motion.div 
               className="absolute w-6 h-6 bg-gradient-to-br from-slate-200 to-slate-400 rounded-full shadow-xl z-10 border border-white/20"
               style={{ 
                  top: `calc(${ (currentY / height) * 100 }%)`,
                  translateX: '-50%',
                  marginTop: '-12px'
               }}
            >
               <div className="absolute top-0 right-0 w-2 h-2 bg-white/40 rounded-full blur-[1px]"></div>
               {isFalling && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2"
                  >
                    <ArrowDown className="text-white/50 animate-bounce" size={16} />
                  </motion.div>
               )}
            </motion.div>
         </div>

         {/* Landing Platform */}
         <div className="absolute bottom-[-10px] w-32 h-2 bg-slate-800 rounded-full blur-[1px] -translate-x-1/2 left-1/2"></div>
      </div>

      {/* Control Button */}
      {!isFalling && (
        <div className="absolute bottom-8 flex space-x-4">
           <button 
              onClick={startDrop}
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xl shadow-indigo-500/20 transition-all border border-indigo-400/20"
           >
              <Play size={18} />
              <span>Drop Ball</span>
           </button>
           <button 
              onClick={reset}
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all"
           >
              <RotateCcw size={18} />
           </button>
        </div>
      )}
    </div>
  );
};

export default FreeFallLab;
