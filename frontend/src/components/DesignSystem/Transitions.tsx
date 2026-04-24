import React from 'react';
import { motion } from 'motion/react';

interface PageTransitionProps {
  children: React.ReactNode;
  key?: React.Key;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
      transition={{ 
        duration: 0.4, 
        ease: [0.23, 1, 0.32, 1] // Custom cubic-bezier for a "premium" feel
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export const NeuralLoading = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-dark">
      <div className="relative">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 rounded-full border border-brand-pink/20 blur-xl"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
           <motion.div
             animate={{ rotateY: 360 }}
             transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
             className="w-12 h-12 rounded-xl bg-gradient-premium flex items-center justify-center shadow-[0_0_20px_rgba(255,45,85,0.4)]"
           >
              <div className="w-6 h-6 border-2 border-white rounded-sm animate-pulse" />
           </motion.div>
           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className="text-[10px] font-mono uppercase tracking-[0.5em] text-brand-pink"
           >
             Syncing DNA...
           </motion.p>
        </div>
      </div>
    </div>
  );
};
