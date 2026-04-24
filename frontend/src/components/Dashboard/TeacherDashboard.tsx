import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Brain, 
  ArrowUpRight, 
  Search, 
  ShieldCheck,
  Settings,
  ChevronRight,
  Zap,
  Target
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Heading, Text } from '../DesignSystem/Typography';
import { Card, StatsCard } from '../DesignSystem/Card';
import { Button } from '../DesignSystem/Button';

const performanceData = [
  { topic: 'Quantum Physics', average: 78, difficulty: 85 },
  { topic: 'Neural Nets', average: 82, difficulty: 70 },
  { topic: 'History', average: 91, difficulty: 40 },
  { topic: 'Biology', average: 85, difficulty: 60 },
  { topic: 'Math', average: 74, difficulty: 90 },
];

const students = [
  { id: '1', name: 'Zane Thompson', progress: 92, dnaSync: '98%', status: 'Exceeding', lastActive: '2m ago' },
  { id: '2', name: 'Lila Vance', progress: 45, dnaSync: '72%', status: 'Below Threshold', lastActive: '14m ago' },
  { id: '3', name: 'Kai Rivers', progress: 88, dnaSync: '94%', status: 'On Track', lastActive: '1h ago' },
  { id: '4', name: 'Mila Kosta', progress: 76, dnaSync: '82%', status: 'On Track', lastActive: '4h ago' },
  { id: '5', name: 'Jace Orion', progress: 28, dnaSync: '64%', status: 'Below Threshold', lastActive: '1d ago' },
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

export const TeacherDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const strugglingStudents = students.filter(s => s.status === 'Below Threshold');

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-light pb-10">
        <div>
           <div className="flex items-center gap-2 text-brand-purple mb-1">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Institutional Intelligence // Core-Node</span>
           </div>
           <Heading as="h1" className="text-text-primary">Academic <span className="text-gradient font-bold">Control Center</span></Heading>
           <Text className="text-text-secondary">Comprehensive neural analytics for Cluster-Alpha academic cohorts.</Text>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="border-border-light group text-text-primary">
              <Settings className="w-4 h-4 mr-2 group-hover:text-brand-purple transition-colors" /> Config
           </Button>
           <Button variant="primary" className="bg-brand-purple hover:bg-brand-purple/90 shadow-md shadow-brand-purple/20">Initialize Global Report</Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Avg. Sync Rate" 
          value="84.2%" 
          trend={1.4} 
          icon={Target} 
        />
        <StatsCard 
          title="Active Cohort" 
          value="75" 
          trend={12} 
          icon={Users} 
        />
        <StatsCard 
          title="Critical Alerts" 
          value={strugglingStudents.length.toString()} 
          trend={-2} 
          icon={AlertTriangle} 
          className="border-rose-200 bg-rose-50"
        />
        <StatsCard 
          title="Neural Optimization" 
          value="92" 
          trend={5} 
          icon={Zap} 
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {/* Topic Analysis Chart */}
           <Card className="flex flex-col space-y-8 bg-white border-border-light shadow-md">
              <div className="flex items-center justify-between">
                 <div>
                    <Heading as="h3">Cohort <span className="text-gradient font-bold">Trait Analysis</span></Heading>
                    <Text className="text-xs">Class-wide performance vs topic complexity vectors</Text>
                 </div>
                 <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-brand-purple shadow-sm" />
                       <span className="text-[10px] uppercase font-bold text-text-secondary/40">Mean Success</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-gray-100" />
                       <span className="text-[10px] uppercase font-bold text-text-secondary/40">Vector Weight</span>
                    </div>
                 </div>
              </div>

              <div className="flex-1 w-full min-h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis 
                         dataKey="topic" 
                         axisLine={false} 
                         tickLine={false} 
                         tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                       />
                       <YAxis 
                         axisLine={false} 
                         tickLine={false} 
                         tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                       />
                       <Tooltip 
                         cursor={{ fill: '#f8fafc' }}
                         contentStyle={{ 
                           backgroundColor: '#ffffff', 
                           border: '1px solid #e2e8f0', 
                           borderRadius: '12px',
                           boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                         }}
                       />
                       <Bar dataKey="average" radius={[4, 4, 0, 0]}>
                          {performanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.average < 80 ? '#f59e0b' : '#a855f7'} />
                          ))}
                       </Bar>
                       <Bar dataKey="difficulty" fill="#f1f5f9" radius={[4, 4, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </Card>

           {/* Student Roster */}
           <Card className="p-0 border-border-light overflow-hidden bg-white shadow-md">
             <div className="px-8 py-6 border-b border-border-light flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
                <Heading as="h3">Student <span className="text-brand-purple font-bold">Trajectory</span> Roster</Heading>
                <div className="flex items-center gap-4">
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary/40" />
                      <input 
                        type="text" 
                        placeholder="Search student asset..." 
                        className="bg-white border border-border-light rounded-xl py-2 pl-10 pr-4 text-xs w-64 focus:ring-2 focus:ring-brand-purple/20 outline-none transition-all placeholder:text-text-secondary/30"
                      />
                   </div>
                </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="bg-gray-50/50 border-b border-border-light">
                         <th className="px-8 py-4 text-[10px] uppercase font-bold text-text-secondary/50 tracking-widest">Asset Name</th>
                         <th className="px-8 py-4 text-[10px] uppercase font-bold text-text-secondary/50 tracking-widest">Progress</th>
                         <th className="px-8 py-4 text-[10px] uppercase font-bold text-text-secondary/50 tracking-widest">DNA Sync</th>
                         <th className="px-8 py-4 text-[10px] uppercase font-bold text-text-secondary/50 tracking-widest">Neural Status</th>
                         <th className="px-8 py-4"></th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-border-light">
                      {students.map((student) => (
                        <React.Fragment key={student.id}>
                          <tr className={cn(
                            "hover:bg-gray-50/50 transition-colors group cursor-pointer",
                            selectedStudent === student.id && "bg-brand-purple/5"
                          )} onClick={() => setSelectedStudent(selectedStudent === student.id ? null : student.id)}>
                             <td className="px-8 py-5">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-lg bg-gray-100 border border-border-light flex items-center justify-center p-[2px]">
                                      <img src={`https://picsum.photos/seed/${student.name}/100/100`} alt={student.name} className="w-full h-full rounded-md" referrerPolicy="no-referrer" />
                                   </div>
                                   <span className="text-sm font-bold text-text-primary">{student.name}</span>
                                </div>
                             </td>
                             <td className="px-8 py-5">
                                <div className="flex items-center gap-3 w-32">
                                   <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-brand-purple" style={{ width: `${student.progress}%` }} />
                                   </div>
                                   <span className="text-xs font-mono font-bold text-text-secondary">{student.progress}%</span>
                                </div>
                             </td>
                             <td className="px-8 py-5 text-sm font-mono font-bold text-brand-purple">{student.dnaSync}</td>
                             <td className="px-8 py-5">
                                <span className={cn(
                                  "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border",
                                  student.status === 'Exceeding' ? "border-emerald-200 text-emerald-600 bg-emerald-50" :
                                  student.status === 'On Track' ? "border-brand-purple/20 text-brand-purple bg-brand-purple/5" :
                                  "border-rose-200 text-rose-500 bg-rose-50"
                                )}>
                                  {student.status}
                                </span>
                             </td>
                             <td className="px-8 py-5 text-right">
                                <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold tracking-widest text-text-secondary/30 group-hover:text-brand-purple">
                                   {selectedStudent === student.id ? 'Collapse' : 'DNA Details'}
                                </Button>
                             </td>
                          </tr>
                          <AnimatePresence>
                            {selectedStudent === student.id && (
                              <tr key={`${student.id}-expanded`}>
                                <td colSpan={5} className="p-0 border-b border-border-light bg-gray-50/30">
                                   <motion.div
                                     initial={{ height: 0, opacity: 0 }}
                                     animate={{ height: 'auto', opacity: 1 }}
                                     exit={{ height: 0, opacity: 0 }}
                                     className="overflow-hidden"
                                   >
                                      <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                                         <div className="space-y-4">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/40">Primary Learning Genotype</p>
                                            <div className="flex items-center gap-4">
                                               <div className="w-12 h-12 rounded-xl bg-brand-pink/5 flex items-center justify-center border border-brand-pink/10 text-brand-pink">
                                                  <Brain className="w-6 h-6" />
                                               </div>
                                               <div>
                                                  <h5 className="font-bold text-text-primary font-display">Visual-Practical</h5>
                                                  <p className="text-[10px] text-text-secondary/60 font-mono italic">Dominant Trait Index: 0.88</p>
                                               </div>
                                            </div>
                                         </div>
                                         <div className="space-y-4">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/40">Strength Vectors</p>
                                            <div className="flex flex-wrap gap-2">
                                               {['Spatial Logic', 'Recursive Patterning', 'Rapid Iteration'].map(tag => (
                                                  <span key={tag} className="px-2.5 py-1 rounded-lg bg-white border border-border-light text-[10px] text-text-secondary font-bold uppercase tracking-tight">{tag}</span>
                                               ))}
                                            </div>
                                         </div>
                                         <div className="space-y-4">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/40">Optimization Alerts</p>
                                            <div className="flex items-center gap-2 text-rose-500">
                                               <AlertTriangle className="w-4 h-4" />
                                               <span className="text-xs font-bold uppercase tracking-tight">Struggling with Theoretical Synchronization</span>
                                            </div>
                                         </div>
                                      </div>
                                   </motion.div>
                                </td>
                              </tr>
                            )}
                          </AnimatePresence>
                        </React.Fragment>
                      ))}
                   </tbody>
                </table>
             </div>
           </Card>
        </div>

        {/* Sidebar: Alerts & AI Recommendations */}
        <div className="space-y-8 h-full flex flex-col">
           {/* Struggling Students Alert */}
           <Card className="border-rose-200 bg-rose-50/50 shadow-md">
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-2 text-rose-500">
                    <AlertTriangle className="w-4 h-4" />
                    <Heading as="h4" className="text-xs font-bold uppercase tracking-[0.2em]">Critical Drops</Heading>
                 </div>
                 <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              </div>
              <div className="space-y-4">
                 {strugglingStudents.map(student => (
                    <div key={student.id} className="p-4 rounded-xl bg-white border border-border-light flex items-center justify-between group cursor-pointer hover:border-rose-300 transition-all shadow-sm">
                       <div className="flex items-center gap-3">
                          <img src={`https://picsum.photos/seed/${student.name}/100/100`} className="w-9 h-9 rounded-xl grayscale group-hover:grayscale-0 transition-all shadow-sm" alt={student.name} referrerPolicy="no-referrer" />
                          <div>
                             <p className="text-sm font-bold text-text-primary">{student.name}</p>
                             <p className="text-[10px] text-rose-500 font-bold font-mono tracking-tight uppercase">Sync Failure: {100 - parseInt(student.dnaSync)}%</p>
                          </div>
                       </div>
                       <ChevronRight className="w-4 h-4 text-text-secondary/40 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                    </div>
                 ))}
              </div>
              <Button variant="outline" className="w-full mt-6 border-rose-200 text-rose-600 hover:bg-rose-100/30 text-[10px] h-11 tracking-widest font-bold shadow-sm">Initiate Trauma Protocol</Button>
           </Card>

           {/* AI Teacher Assistant */}
           <Card className="flex flex-col space-y-6 flex-1 bg-brand-purple/5 border-brand-purple/10 shadow-md">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-brand-purple/10 shadow-sm">
                    <Brain className="w-5 h-5 text-brand-purple" />
                 </div>
                 <Heading as="h4" className="text-xs font-bold uppercase tracking-widest text-brand-purple">AI Pedagogical Insight</Heading>
              </div>
              
              <div className="space-y-4 flex-1">
                 {[
                   { title: 'Neural Curriculum Shift', priority: 'Critical', msg: 'System detects a 12% drop in Cohort Logic. Recommendation: Deploy Visual-Algebra Lab sequence.' },
                   { title: 'Adaptive Resync', priority: 'High', msg: '4 students exhibit identical pattern failures in "Quantum Gates". Suggested peer-lock pairing.' },
                   { title: 'Optimization Opportunity', priority: 'Optimized', msg: 'High synchronization in "BioTech" cluster. Unlock Advanced Module 04 immediately.' }
                 ].map((insight) => (
                    <div key={insight.title} className="p-5 rounded-2xl border border-border-light bg-white space-y-3 group hover:border-brand-purple/30 transition-all cursor-pointer shadow-sm hover:shadow-xl">
                       <div className="flex items-center justify-between">
                          <span className={cn(
                            "text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border shadow-sm",
                            insight.priority === 'Critical' ? "bg-rose-50 border-rose-200 text-rose-600" :
                            insight.priority === 'High' ? "bg-amber-50 border-amber-200 text-amber-600" :
                            "bg-emerald-50 border-emerald-200 text-emerald-600"
                          )}>
                            {insight.priority}
                          </span>
                       </div>
                       <h5 className="font-bold text-text-primary text-sm font-display">{insight.title}</h5>
                       <p className="text-[10px] text-text-secondary leading-relaxed italic border-l-2 border-brand-purple/20 pl-3">"{insight.msg}"</p>
                    </div>
                 ))}
              </div>
              
              <Button variant="primary" className="w-full bg-brand-purple hover:bg-brand-purple/90 shadow-xl shadow-brand-purple/20 py-6">
                 Apply Global Optimization
              </Button>
           </Card>
        </div>
      </div>
    </motion.div>
  );
};
