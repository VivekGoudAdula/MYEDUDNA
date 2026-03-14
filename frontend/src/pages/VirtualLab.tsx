import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Beaker, Play, Info, Layers, Settings, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const VirtualLab = () => {
  const [labs, setLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLab, setActiveLab] = useState<any>(null);
  const [simData, setSimData] = useState<any[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    fetch('/api/labs')
      .then(res => res.json())
      .then(data => {
        setLabs(data);
        setActiveLab(data[0]);
        setLoading(false);
      });
  }, []);

  const runSimulation = () => {
    setIsSimulating(true);
    setSimData([]);
    let count = 0;
    const interval = setInterval(() => {
      setSimData(prev => [...prev, {
        time: count,
        value: Math.sin(count * 0.5) * 10 + (Math.random() * 2),
        velocity: Math.cos(count * 0.5) * 8
      }]);
      count++;
      if (count > 20) {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 200);
  };

  if (loading) return <div className="p-8 text-center text-slate-600">Loading Virtual Labs...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">Virtual <span className="gradient-text">STEM Labs</span></h1>
        <p className="text-slate-600">Interactive simulations to master complex concepts through experimentation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Lab Sidebar */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">Available Simulations</h3>
          {labs.map((lab) => (
            <button
              key={lab.id}
              onClick={() => setActiveLab(lab)}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                activeLab?.id === lab.id 
                  ? 'bg-indigo-50 border-indigo-500 shadow-sm' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                  <img src={lab.thumbnail} alt="" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className={`font-bold text-sm ${activeLab?.id === lab.id ? 'text-indigo-700' : 'text-slate-900'}`}>{lab.name}</h4>
                  <p className="text-[10px] text-slate-500">{lab.category}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Lab Viewport */}
        <div className="lg:col-span-3 space-y-8">
          <div className="glass-card p-0 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-indigo-600">
                  <Beaker size={18} />
                  <span className="text-sm font-bold">{activeLab?.name}</span>
                </div>
                <div className="h-4 w-[1px] bg-slate-200"></div>
                <span className="text-xs text-slate-500">Status: <span className="text-emerald-600 font-bold">Ready</span></span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors"><Settings size={18} /></button>
                <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors"><Info size={18} /></button>
              </div>
            </div>
            
            <div className="aspect-video bg-slate-900 relative flex items-center justify-center">
              {/* Simulation Visualizer */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              </div>
              
              <div className="relative z-10 text-center">
                {isSimulating ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-indigo-400 font-mono text-sm">CALCULATING VECTORS...</p>
                  </div>
                ) : simData.length > 0 ? (
                  <div className="w-[600px] h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={simData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
                        <YAxis stroke="#94a3b8" fontSize={10} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                          itemStyle={{ color: '#6366f1' }}
                        />
                        <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="velocity" stroke="#ec4899" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Beaker size={64} className="text-slate-700 mb-4" />
                    <p className="text-slate-400 text-sm mb-6">Configure parameters and start simulation</p>
                    <button 
                      onClick={runSimulation}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Play size={18} />
                      <span>Run Experiment</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Lab Controls Overlay */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <div className="flex space-x-2">
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-2 rounded-lg text-[10px] font-mono text-white">
                    <span className="text-slate-300">GRAVITY:</span> 9.81m/s²
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-2 rounded-lg text-[10px] font-mono text-white">
                    <span className="text-slate-300">ANGLE:</span> 45°
                  </div>
                </div>
                <button 
                  onClick={() => setSimData([])}
                  className="bg-white/10 backdrop-blur-md border border-white/10 p-2 rounded-lg text-slate-300 hover:text-white transition-colors"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card">
              <h3 className="font-bold mb-4 flex items-center space-x-2 text-slate-900">
                <Layers size={18} className="text-indigo-600" />
                <span>Experiment Description</span>
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {activeLab?.description} This simulation allows you to explore the fundamental principles of {activeLab?.category} through real-time data visualization and parameter control.
              </p>
            </div>
            <div className="glass-card">
              <h3 className="font-bold mb-4 flex items-center space-x-2 text-slate-900">
                <Info size={18} className="text-purple-600" />
                <span>Learning Objectives</span>
              </h3>
              <ul className="text-sm text-slate-600 space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
                  <span>Understand vector decomposition</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
                  <span>Analyze the impact of initial velocity</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
                  <span>Calculate maximum height and range</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualLab;
