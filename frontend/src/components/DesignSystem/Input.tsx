import React from 'react';
import { cn } from '@/src/lib/utils';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const Input = ({ label, className, ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-[10px] font-bold text-text-secondary px-1 uppercase tracking-[0.2em]">
          {label}
        </label>
      )}
      <input
        className={cn(
          'bg-gray-50 border border-border-light rounded-xl px-4 py-3 text-text-primary placeholder:text-text-secondary/30 outline-none transition-all w-full',
          'focus:ring-2 focus:ring-brand-pink/20 focus:bg-white focus:border-brand-pink/30',
          className
        )}
        {...props}
      />
    </div>
  );
};
