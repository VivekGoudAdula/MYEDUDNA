import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Beaker, Zap, Ruler, Flame, TestTube, Thermometer, Magnet, Sliders, Info } from 'lucide-react';
import LabLayout from '../components/VirtualLab/LabLayout';

// Experiment Components
import TitrationLab from '../components/VirtualLab/experiments/AcidBaseTitration/TitrationLab';
import ElectrolysisLab from '../components/VirtualLab/experiments/Electrolysis/ElectrolysisLab';
import OhmsLawLab from '../components/VirtualLab/experiments/OhmsLaw/OhmsLawLab';
import FreeFallLab from '../components/VirtualLab/experiments/FreeFall/FreeFallLab';

const EXPERIMENTS = [
  {
    id: 'titration',
    name: 'Acid Base Titration',
    category: 'Chemistry',
    icon: <FlaskConical size={18} />,
    apparatus: [
      { id: 'burette', name: 'Burette', icon: <TestTube size={20} /> },
      { id: 'flask', name: 'Conical Flask', icon: <FlaskConical size={20} /> },
      { id: 'indicator', name: 'Indicator', icon: <Flame size={20} /> },
      { id: 'phmeter', name: 'pH Meter', icon: <Thermometer size={20} /> }
    ],
    graphConfig: {
      xAxis: 'volume',
      yAxis: 'ph',
      xLabel: 'NaOH Added',
      yLabel: 'pH',
      color: '#ec4899'
    }
  },
  {
    id: 'electrolysis',
    name: 'Electrolysis of Water',
    category: 'Chemistry',
    icon: <Beaker size={18} />,
    apparatus: [
      { id: 'powersupply', name: 'DC Supply', icon: <Zap size={20} /> },
      { id: 'electrodes', name: 'Electrodes', icon: <Magnet size={20} /> },
      { id: 'tubes', name: 'Collection Tubes', icon: <TestTube size={20} /> }
    ],
    graphConfig: {
      xAxis: 'time',
      yAxis: 'hydrogen',
      xLabel: 'Time (s)',
      yLabel: 'Vol H₂',
      color: '#3b82f6'
    }
  },
  {
    id: 'ohmslaw',
    name: "Ohm's Law Verification",
    category: 'Physics',
    icon: <Zap size={18} />,
    apparatus: [
      { id: 'battery', name: 'Battery', icon: <Zap size={20} /> },
      { id: 'resistor', name: 'Resistor', icon: <TestTube size={20} /> },
      { id: 'multimeter', name: 'Multimeter', icon: <Thermometer size={20} /> }
    ],
    graphConfig: {
      xAxis: 'voltage',
      yAxis: 'current',
      xLabel: 'Voltage (V)',
      yLabel: 'Current (I)',
      color: '#fbbf24'
    }
  },
  {
    id: 'freefall',
    name: 'Free Fall Motion',
    category: 'Physics',
    icon: <Ruler size={18} />,
    apparatus: [
      { id: 'tower', name: 'Drop Tower', icon: <Ruler size={20} /> },
      { id: 'sensor', name: 'Timer Sensor', icon: <Zap size={20} /> }
    ],
    graphConfig: {
      xAxis: 'time',
      yAxis: 'velocity',
      xLabel: 'Time (s)',
      yLabel: 'Velocity',
      color: '#6366f1'
    }
  }
];

const VirtualLab = () => {
  const [activeExpId, setActiveExpId] = useState(EXPERIMENTS[0].id);
  const [resetKey, setResetKey] = useState(0);
  const [graphData, setGraphData] = useState<any[]>([]);
  const [currentReadings, setCurrentReadings] = useState<any>({});
  
  // Variable States
  const [speed, setSpeed] = useState(0.4);
  const [normality, setNormality] = useState(0.9);
  const [resistance, setResistance] = useState(50);
  const [dropHeight, setDropHeight] = useState(20);

  const activeExp = useMemo(() => 
    EXPERIMENTS.find(e => e.id === activeExpId) || EXPERIMENTS[0]
  , [activeExpId]);

  const handleReset = () => {
    setResetKey(prev => prev + 1);
    setGraphData([]);
    setCurrentReadings({});
  };

  const handleReadingUpdate = (readings: any) => {
    setCurrentReadings(readings);
    
    if (activeExpId === 'titration' && readings.volume !== undefined) {
      setGraphData(prev => {
         const last = prev[prev.length - 1];
         if (last && last.volume === readings.volume) return prev;
         return [...prev.slice(-30), { volume: readings.volume, ph: readings.ph }];
      });
    } else if (activeExpId === 'electrolysis' && readings.hydrogen !== undefined) {
      setGraphData(prev => [...prev.slice(-30), { time: prev.length, hydrogen: readings.hydrogen }]);
    } else if (activeExpId === 'ohmslaw' && readings.voltage !== undefined) {
      setGraphData(prev => [...prev.slice(-30), { voltage: readings.voltage, current: readings.current }]);
    } else if (activeExpId === 'freefall' && readings.time !== undefined && readings.time > 0) {
      setGraphData(prev => [...prev.slice(-50), { time: readings.time, velocity: readings.velocity }]);
    }
  };

  const renderExperiment = () => {
    const key = `${activeExpId}-${resetKey}`;
    switch (activeExpId) {
      case 'titration':
        return <TitrationLab key={key} onReadingUpdate={handleReadingUpdate} speed={speed} />;
      case 'electrolysis':
        return <ElectrolysisLab key={key} onReadingUpdate={handleReadingUpdate} />;
      case 'ohmslaw':
        return <OhmsLawLab key={key} onReadingUpdate={handleReadingUpdate} initialResistance={resistance} />;
      case 'freefall':
        return <FreeFallLab key={key} onReadingUpdate={handleReadingUpdate} initialHeight={dropHeight} />;
      default:
        return null;
    }
  };

  const renderVariableControls = () => {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-left duration-500">
        {activeExpId === 'titration' && (
          <>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-slate-500">
                 <span>Speed of titrant</span>
                 <span className="text-white bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">{speed}</span>
              </div>
              <input 
                type="range" min="0.1" max="1.0" step="0.1" 
                value={speed} onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-slate-500">
                 <span>Normality of titrate</span>
                 <span className="text-white bg-pink-500/20 px-2 py-0.5 rounded border border-pink-500/30">{normality} N</span>
              </div>
              <input 
                type="range" min="0.1" max="2.0" step="0.1" 
                value={normality} onChange={(e) => setNormality(Number(e.target.value))}
                className="w-full accent-pink-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </>
        )}
        {activeExpId === 'electrolysis' && (
           <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-slate-500">
                 <span>Input Current</span>
                 <span className="text-white bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/30">{speed * 2} A</span>
              </div>
              <input 
                type="range" min="0.5" max="5.0" step="0.5" 
                value={speed * 2} onChange={(e) => setSpeed(Number(e.target.value) / 2)}
                className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
           </div>
        )}
        {activeExpId === 'ohmslaw' && (
           <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-slate-500">
                 <span>Resistance</span>
                 <span className="text-white bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">{resistance} Ω</span>
              </div>
              <input 
                type="range" min="10" max="500" step="10" 
                value={resistance} onChange={(e) => setResistance(Number(e.target.value))}
                className="w-full accent-amber-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
           </div>
        )}
        {activeExpId === 'freefall' && (
           <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-slate-500">
                 <span>Height selector</span>
                 <span className="text-white bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">{dropHeight} m</span>
              </div>
              <input 
                type="range" min="10" max="100" step="10" 
                value={dropHeight} onChange={(e) => setDropHeight(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
           </div>
        )}
        
        <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
           <div className="flex items-center space-x-2 mb-2">
              <Info size={14} className="text-indigo-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Lab Assistant</span>
           </div>
           <p className="text-[10px] text-slate-400 leading-relaxed italic">
              Adjust variables on the fly to see how they impact real-time data observations.
           </p>
        </div>
      </div>
    );
  };

  const renderReadings = () => {
    return (
      <div className="space-y-3 mt-4">
        {Object.entries(currentReadings).map(([key, val]: [string, any]) => (
          <motion.div 
              key={key} 
              initial={{ opacity: 0, y: 5 }} 
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-xl group hover:bg-white/10 transition-all"
          >
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-300 transition-colors">{key.replace('_', ' ')}</span>
            <span className="text-xs font-mono font-bold text-indigo-400 tracking-wider">
               {val}
            </span>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-950 z-[100] flex flex-col overflow-hidden">
      {/* Immersive Experiment Switcher Overlay (Top Central Pill) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[110] flex items-center space-x-1 bg-slate-900/50 backdrop-blur-md p-1 border border-white/10 rounded-full shadow-2xl">
         {EXPERIMENTS.map((exp) => (
            <button
               key={exp.id}
               onClick={() => { setActiveExpId(exp.id); handleReset(); }}
               className={`flex items-center space-x-2 px-4 py-1.5 rounded-full transition-all text-xs font-bold ${
                 activeExpId === exp.id 
                   ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                   : 'text-slate-500 hover:text-white hover:bg-white/5'
               }`}
            >
               {exp.icon}
               <span className="hidden sm:inline">{exp.name}</span>
            </button>
         ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={activeExpId}
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 0.5 }}
           className="w-full h-full"
        >
          <LabLayout
            title={activeExp.name}
            category={activeExp.category}
            experimentComponent={renderExperiment()}
            apparatus={activeExp.apparatus}
            graphData={graphData}
            graphConfig={activeExp.graphConfig}
            variableControls={renderVariableControls()}
            numericalReadings={renderReadings()}
            onReset={handleReset}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default VirtualLab;
