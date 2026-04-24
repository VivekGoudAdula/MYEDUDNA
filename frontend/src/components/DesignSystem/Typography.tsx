import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const Heading = ({ children, className, as: Component = 'h1' }: TypographyProps) => {
  const styles = {
    h1: 'text-4xl md:text-6xl font-display font-bold tracking-tight text-text-primary',
    h2: 'text-3xl md:text-4xl font-display font-semibold tracking-tight text-text-primary',
    h3: 'text-2xl font-display font-semibold text-text-primary',
    h4: 'text-xl font-display font-medium text-text-primary',
  };
  
  const baseStyle = styles[Component as keyof typeof styles] || styles.h1;
  const Element = Component as any;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <Element className={cn(baseStyle, className)}>
        {children}
      </Element>
    </motion.div>
  );
};

export const Text = ({ children, className, as: Component = 'p' }: TypographyProps) => {
  const Element = Component as any;
  return (
    <Element className={cn('text-text-secondary leading-relaxed', className)}>
      {children}
    </Element>
  );
};

export const Metric = ({ children, className }: TypographyProps) => {
  return (
    <span className={cn('font-mono text-xl font-medium tracking-tight', className)}>
      {children}
    </span>
  );
};
