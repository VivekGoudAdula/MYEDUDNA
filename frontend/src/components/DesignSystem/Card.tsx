import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
  key?: React.Key;
}

export const Card = ({ children, className, hoverEffect = true, onClick }: CardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hoverEffect ? { 
        y: -4, 
        scale: 1.01,
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
      } : {}}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl p-6 border border-border-light shadow-md transition-all',
        hoverEffect && 'hover:border-brand-pink/20',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const StatsCard = ({ title, value, trend, icon: Icon }: any) => {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-text-secondary text-sm font-medium uppercase tracking-wider">{title}</span>
        {Icon && <Icon className="w-5 h-5 text-brand-pink" />}
      </div>
      <div className="flex items-end gap-2 mt-2">
        <span className="text-3xl font-display font-bold text-text-primary">{value}</span>
        {trend && (
          <span className={cn(
            'text-xs font-medium mb-1',
            trend > 0 ? 'text-emerald-600' : 'text-rose-600'
          )}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </Card>
  );
};
