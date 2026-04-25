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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-dark/95 backdrop-blur-md">
      <div className="relative w-[320px] h-[220px] rounded-3xl border border-white/10 bg-black/20 overflow-hidden shadow-2xl">
        <motion.div
          animate={{ x: ['-20%', '120%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-16 left-0 w-32 h-32 rounded-full bg-brand-pink/30 blur-3xl"
        />
        <motion.div
          animate={{ x: ['120%', '-20%'] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-16 right-0 w-36 h-36 rounded-full bg-brand-purple/30 blur-3xl"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
          <div className="relative flex items-center justify-center w-20 h-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-2 border-white/20 border-t-brand-pink"
            />
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-11 h-11 rounded-xl bg-gradient-premium shadow-[0_0_25px_rgba(255,45,85,0.5)]"
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/90"
          >
            Initializing Dashboard...
          </motion.p>

          <div className="w-52 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              animate={{ x: ['-100%', '180%'] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-24 h-full bg-gradient-premium"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
