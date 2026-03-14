import React from 'react';
import LabHeader from './LabHeader';
import ApparatusPanel from './ApparatusPanel';
import DataVisualization from './DataVisualization';
import { ChevronRight, Settings2, BarChart3, Database } from 'lucide-react';

interface LabLayoutProps {
  title: string;
  category: string;
  experimentComponent: React.ReactNode;
  apparatus: any[];
  graphData: any[];
  graphConfig: any;
  variableControls: React.ReactNode;
  numericalReadings: React.ReactNode;
  onReset: () => void;
}

const LabLayout: React.FC<LabLayoutProps> = ({
  title,
  category,
  experimentComponent,
  apparatus,
  graphData,
  graphConfig,
  variableControls,
  numericalReadings,
  onReset,
}) => {
  return (
    <div className="flex flex-col h-screen bg-[#020617] text-white overflow-hidden font-sans">
      {/* Top Header */}
      <LabHeader 
        title={title} 
        category={category} 
        onReset={onReset} 
      />

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR — VARIABLES PANEL */}
        <aside className="w-[300px] bg-slate-900/50 backdrop-blur-xl border-r border-white/5 flex flex-col z-20">
           <div className="p-5 border-b border-white/5 flex items-center justify-between bg-indigo-500/5">
              <div className="flex items-center space-x-2">
                 <Settings2 size={16} className="text-indigo-400" />
                 <h2 className="text-xs font-bold uppercase tracking-widest text-white/90">Variables</h2>
              </div>
              <ChevronRight size={14} className="text-slate-600" />
           </div>
           <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {variableControls}
           </div>
           
           {/* Mini Footer for Left Panel */}
           <div className="p-4 bg-black/20 border-t border-white/5">
              <div className="flex items-center space-x-2 opacity-30">
                 <Database size={12} />
                 <span className="text-[10px] font-mono uppercase">Simulation Engine v4.2</span>
              </div>
           </div>
        </aside>

        {/* CENTER — MAIN LAB CANVAS */}
        <main className="flex-1 relative flex flex-col overflow-hidden bg-[#050510]">
          {/* Subtle grid and glow */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.03),transparent_70%)] pointer-events-none"></div>

          {/* Interactive Lab Area */}
          <div className="flex-1 flex items-center justify-center p-8 relative">
             <div className="w-full h-full relative flex items-center justify-center">
                {experimentComponent}
             </div>
          </div>

          {/* Bottom Apparatus Strip (Docked to Canvas) */}
          <div className="h-[120px] bg-slate-900/40 backdrop-blur-md border-t border-white/5 flex items-center px-8 z-10">
             <ApparatusPanel tools={apparatus} />
          </div>
        </main>

        {/* RIGHT SIDEBAR — REAL-TIME DATA STREAM */}
        <aside className="w-[350px] bg-slate-900/50 backdrop-blur-xl border-l border-white/5 flex flex-col z-20">
           <div className="p-5 border-b border-white/5 flex items-center justify-between bg-pink-500/5">
              <div className="flex items-center space-x-2">
                 <BarChart3 size={16} className="text-pink-400" />
                 <h2 className="text-xs font-bold uppercase tracking-widest text-white/90">Observations</h2>
              </div>
              <div className="flex items-center space-x-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[10px] text-emerald-500 font-mono font-bold">LIVE</span>
              </div>
           </div>
           
           <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar flex flex-col">
              <DataVisualization data={graphData} config={graphConfig} />
              
              <div className="space-y-4 pt-4 border-t border-white/5">
                 <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Numerical Feedback</h3>
                 {numericalReadings}
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default LabLayout;
