import React from 'react';
import { motion } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Brain, 
  Zap, 
  Target, 
  Clock, 
  BarChart3, 
  Award,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Cpu
} from 'lucide-react';
import { Heading, Text } from '@/src/components/DesignSystem/Typography';
import { Card } from '@/src/components/DesignSystem/Card';
import { Button } from '@/src/components/DesignSystem/Button';
import { cn } from '@/src/lib/utils';

const velocityData = [
  { day: 'Mon', value: 45 },
  { day: 'Tue', value: 52 },
  { day: 'Wed', value: 48 },
  { day: 'Thu', value: 61 },
  { day: 'Fri', value: 55 },
  { day: 'Sat', value: 67 },
  { day: 'Sun', value: 72 },
];

const distributionData = [
  { name: 'Physics', value: 85, color: '#ff2d55' },
  { name: 'AI/ML', value: 92, color: '#a855f7' },
  { name: 'Biology', value: 65, color: '#f59e0b' },
  { name: 'Ethics', value: 78, color: '#10b981' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const Insights = () => {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-light pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-pink">
             <Brain className="w-5 h-5" />
             <span className="text-xs font-mono font-bold uppercase tracking-[0.3em]">Cognitive Intelligence</span>
          </div>
          <Heading as="h1" className="text-text-primary">Performance <span className="text-gradient">Insights</span></Heading>
          <Text className="text-text-secondary max-w-2xl">
            Deep analysis of your neural synchronization indices and academic velocity.
          </Text>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-2xl border border-border-light">
           <Button variant="secondary" size="sm" className="bg-white shadow-sm border-gray-200">Weekly</Button>
           <Button variant="ghost" size="sm">Monthly</Button>
           <Button variant="ghost" size="sm">Yearly</Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Learning Velocity', value: '+12.5%', icon: TrendingUp, trend: 'up', desc: 'Growth in retention rate' },
           { label: 'Focus Index', value: '88/100', icon: Target, trend: 'up', desc: 'Time spent in flow state' },
           { label: 'Neural Rank', value: 'Top 4%', icon: Award, trend: 'up', desc: 'Global percentile standing' },
         ].map((stat, i) => (
           <motion.div key={i} variants={itemVariants}>
              <Card className="p-6">
                <div className="flex justify-between items-start mb-4">
                   <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-text-primary border border-border-light">
                      <stat.icon className="w-5 h-5" />
                   </div>
                   <div className={cn(
                     "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                     stat.trend === 'up' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                   )}>
                      {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {stat.trend === 'up' ? 'Increasing' : 'Decreasing'}
                   </div>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{stat.label}</p>
                   <p className="text-3xl font-display font-bold text-text-primary">{stat.value}</p>
                   <p className="text-xs text-text-secondary/60">{stat.desc}</p>
                </div>
              </Card>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Learning Velocity Chart */}
        <motion.div variants={itemVariants}>
          <Card className="h-[400px] flex flex-col p-8">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <Heading as="h3" className="text-lg">Velocity <span className="text-gradient">Optimization</span></Heading>
                  <Text className="text-xs">Retention efficiency over the last 7 cycles</Text>
               </div>
               <BarChart3 className="w-5 h-5 text-text-secondary/20" />
            </div>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={velocityData}>
                  <defs>
                    <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff2d55" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ff2d55" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '12px', 
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#ff2d55" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#velocityGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Knowledge Distribution */}
        <motion.div variants={itemVariants}>
          <Card className="h-[400px] flex flex-col p-8">
             <div className="flex items-center justify-between mb-8">
               <div>
                  <Heading as="h3" className="text-lg">Specialization <span className="text-gradient">Vectors</span></Heading>
                  <Text className="text-xs">Your academic DNA strength distribution</Text>
               </div>
               <Cpu className="w-5 h-5 text-text-secondary/20" />
            </div>
            <div className="flex-1 space-y-6">
               {distributionData.map((item) => (
                 <div key={item.name} className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                       <span className="text-text-secondary">{item.name}</span>
                       <span className="text-text-primary">{item.value}/100</span>
                    </div>
                    <div className="h-3 bg-gray-50 border border-border-light rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         whileInView={{ width: `${item.value}%` }}
                         transition={{ duration: 1, ease: "easeOut" }}
                         className="h-full rounded-full shadow-sm"
                         style={{ backgroundColor: item.color }}
                       />
                    </div>
                 </div>
               ))}
            </div>
            <div className="mt-8 p-4 rounded-xl bg-brand-purple/5 border border-brand-purple/10 flex items-center gap-4">
               <Sparkles className="w-5 h-5 text-brand-purple" />
               <p className="text-xs text-brand-purple font-medium italic">
                 AI Hint: You are showing 92nd percentile growth in AI/ML neural mapping. Consider taking a lab specialized in Advanced Heuristics.
               </p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Actionable Insights */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex items-center gap-6 p-6 border-l-4 border-l-brand-pink group hover:bg-gray-50 transition-all cursor-pointer">
           <div className="w-12 h-12 rounded-full bg-brand-pink/5 flex items-center justify-center border border-brand-pink/10 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6 text-brand-pink" />
           </div>
           <div>
              <Heading as="h4" className="text-base">Focus Optimization</Heading>
              <Text className="text-xs line-clamp-1">Your peak cognitive performance occurs between 08:00 and 10:00.</Text>
           </div>
           <Button variant="ghost" size="sm" className="ml-auto text-brand-pink">Sync Calendar</Button>
        </Card>
        
        <Card className="flex items-center gap-6 p-6 border-l-4 border-l-brand-purple group hover:bg-gray-50 transition-all cursor-pointer">
           <div className="w-12 h-12 rounded-full bg-brand-purple/5 flex items-center justify-center border border-brand-purple/10 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-brand-purple" />
           </div>
           <div>
              <Heading as="h4" className="text-base">Concept Drift Detected</Heading>
              <Text className="text-xs line-clamp-1">Quantum Logic retention is dipping. Quick refresh recommended.</Text>
           </div>
           <Button variant="ghost" size="sm" className="ml-auto text-brand-purple">Refresh Now</Button>
        </Card>
      </motion.div>
    </motion.div>
  );
};
