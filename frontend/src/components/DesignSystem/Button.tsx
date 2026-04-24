import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
};

export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: ButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-brand-pink/50 disabled:opacity-50 disabled:pointer-events-none active:scale-95';
  
  const variants = {
    primary: 'bg-gradient-premium text-white shadow-md hover:shadow-lg',
    secondary: 'bg-white border border-border-light text-text-primary hover:bg-gray-50 shadow-sm',
    outline: 'bg-transparent border border-border-light text-text-primary hover:bg-gray-50',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-gray-50',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props as any}
    >
      {children}
    </motion.button>
  );
};
