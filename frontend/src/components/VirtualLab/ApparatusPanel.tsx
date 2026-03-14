import React from 'react';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface ApparatusPanelProps {
  tools: Tool[];
}

const ApparatusPanel: React.FC<ApparatusPanelProps> = ({ tools }) => {
  return (
    <div className="flex-1 flex flex-col min-w-[300px]">
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Equipment Toolkit</h3>
      <div className="flex space-x-3 overflow-x-auto pb-2 custom-scrollbar">
        {tools.map((tool) => (
          <motion.div
            key={tool.id}
            whileHover={{ scale: 1.02, y: -2 }}
            className="flex-shrink-0 w-32 glass-card p-3 border-white/5 bg-white/5 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing text-center group"
          >
            <div className="absolute top-2 right-2 text-white/20 group-hover:text-white/40">
              <GripVertical size={12} />
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 mb-2 group-hover:text-indigo-300 transition-colors shadow-inner">
               {tool.icon}
            </div>
            <span className="text-[11px] font-bold text-slate-300">{tool.name}</span>
            <span className="text-[8px] text-slate-500 mt-1 uppercase font-bold">Drag to Lab</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ApparatusPanel;
