import React from 'react';
import { RotateCcw, Maximize, X, Beaker } from 'lucide-react';

interface LabHeaderProps {
  title: string;
  category: string;
  onReset: () => void;
  onExit?: () => void;
}

const LabHeader: React.FC<LabHeaderProps> = ({ title, category, onReset, onExit }) => {
  return (
    <header className="h-[60px] bg-slate-900/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-8 z-50">
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
          <Beaker size={18} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white leading-tight">{title}</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">{category} Lab</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button 
          onClick={onReset}
          className="flex items-center space-x-2 px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold text-white transition-all"
        >
          <RotateCcw size={14} />
          <span>Reset Lab</span>
        </button>
        <button className="p-2 text-slate-400 hover:text-white transition-colors">
          <Maximize size={18} />
        </button>
        {onExit && (
          <button 
            onClick={onExit}
            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </header>
  );
};

export default LabHeader;
