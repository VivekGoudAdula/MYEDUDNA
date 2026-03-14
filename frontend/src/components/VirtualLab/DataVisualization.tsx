import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface DataVisualizationProps {
  data: any[];
  config: {
    xAxis: string;
    yAxis: string;
    xLabel: string;
    yLabel: string;
    color: string;
  };
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ data, config }) => {
  return (
    <div className="w-full flex flex-col h-[280px]">
       <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Real-time Stream</h3>
          <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
             <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[8px] font-mono text-emerald-500 font-bold uppercase tracking-tighter">Connected</span>
          </div>
       </div>
       
       <div className="flex-1 glass shadow-inner rounded-2xl border-white/5 bg-white/5 p-4 overflow-hidden relative min-h-[220px]">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
             <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          </div>
          
          <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                   <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={config.color} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={config.color} stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                   dataKey={config.xAxis} 
                   stroke="rgba(255,255,255,0.3)" 
                   fontSize={8} 
                   tickLine={false}
                   axisLine={false}
                   hide={false}
                   label={{ value: config.xLabel, position: 'insideBottom', offset: -5, fill: 'rgba(255,255,255,0.3)', fontSize: 7, fontWeight: 'bold' }}
                />
                <YAxis 
                   stroke="rgba(255,255,255,0.3)" 
                   fontSize={8} 
                   tickLine={false}
                   axisLine={false}
                   label={{ value: config.yLabel, angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.3)', fontSize: 7, fontWeight: 'bold', offset: 10 }}
                />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px' }}
                   itemStyle={{ color: config.color, fontSize: 10, fontWeight: 'bold' }}
                   labelStyle={{ display: 'none' }}
                />
                <Area 
                   type="monotone" 
                   dataKey={config.yAxis} 
                   stroke={config.color} 
                   strokeWidth={2} 
                   fillOpacity={1} 
                   fill="url(#colorValue)" 
                   isAnimationActive={false}
                />
             </AreaChart>
          </ResponsiveContainer>
       </div>
    </div>
  );
};

export default DataVisualization;
