import React from 'react';
import { motion } from 'motion/react';
import { Check, Lock, Play } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export type RoadmapNodeStatus = 'completed' | 'current' | 'locked' | 'available';

type RoadmapNodeProps = {
  title: string;
  status: RoadmapNodeStatus;
  position: 'top' | 'bottom';
  stepNumber: number;
  showHint?: boolean;
  hintText?: string;
  onClick: () => void;
};

export const RoadmapNode = ({ title, status, position, stepNumber, showHint = false, hintText = 'Start here!', onClick }: RoadmapNodeProps) => {
  const isLocked = status === 'locked';
  const isCurrent = status === 'current';
  const isCompleted = status === 'completed';

  return (
    <div
      className={cn(
        'relative flex w-[260px] shrink-0 items-center justify-center',
        position === 'top' ? 'pb-52' : 'pt-52'
      )}
    >
      <motion.button
        whileHover={isLocked ? undefined : { scale: 1.04 }}
        whileTap={isLocked ? undefined : { scale: 0.98 }}
        animate={isCurrent ? { y: [0, -4, 0] } : undefined}
        transition={isCurrent ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : undefined}
        onClick={onClick}
        disabled={isLocked}
        className={cn(
          'relative z-10 w-[230px] rounded-3xl border p-5 text-left shadow-sm transition-all backdrop-blur-[1px]',
          'focus:outline-none focus:ring-2 focus:ring-brand-pink/30',
          isLocked && 'cursor-not-allowed border-gray-200 bg-white text-gray-400 opacity-80',
          isCurrent && 'border-brand-pink/35 bg-white shadow-xl shadow-brand-pink/10',
          isCompleted && 'border-emerald-200 bg-white shadow-md shadow-emerald-100/60',
          status === 'available' && 'border-brand-purple/20 bg-white shadow-md'
        )}
      >
        {showHint && (
          <div
            className={cn(
              'absolute -top-11 left-1/2 -translate-x-1/2 rounded-xl border bg-white px-3 py-1 text-xs font-bold shadow-sm whitespace-nowrap',
              isCurrent ? 'border-brand-pink/20 text-brand-pink' : 'border-gray-300 text-gray-600'
            )}
          >
            {hintText}
          </div>
        )}

        <div
          className={cn(
            'absolute left-1/2 h-36 w-[2px] -translate-x-1/2 border-l-2 border-dashed border-brand-pink/35',
            position === 'top' ? 'top-full' : 'bottom-full'
          )}
        />

        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Step {stepNumber}</p>
            <p className={cn('text-sm font-semibold leading-snug', isLocked ? 'text-gray-500' : 'text-text-primary')}>
              {title}
            </p>
          </div>
          <div
            className={cn(
              'h-11 w-11 shrink-0 rounded-full border flex items-center justify-center',
              isLocked && 'border-gray-300 bg-gray-100',
              isCurrent && 'border-transparent bg-gradient-premium text-white shadow-lg',
              isCompleted && 'border-emerald-200 bg-emerald-500 text-white',
              status === 'available' && 'border-brand-purple/30 bg-brand-purple/10 text-brand-purple'
            )}
          >
            {isLocked ? <Lock className="h-4 w-4" /> : isCompleted ? <Check className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0.25, scale: 0.95 }}
          animate={isCurrent ? { opacity: [0.3, 1, 0.3], scale: [0.95, 1.02, 0.95] } : { opacity: 0.25, scale: 1 }}
          transition={isCurrent ? { duration: 1.8, repeat: Infinity } : undefined}
          className={cn(
            'pointer-events-none absolute -bottom-2 left-6 right-6 h-2 rounded-full blur-sm',
            isCurrent ? 'bg-brand-pink/35' : isCompleted ? 'bg-emerald-300/25' : 'bg-slate-300/20'
          )}
        />
      </motion.button>
    </div>
  );
};
