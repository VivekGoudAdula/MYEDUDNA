import React from 'react';
import { motion } from 'framer-motion';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area, Cell
} from 'recharts';
import { BarChart3, TrendingUp, Target, Award, Zap, Brain } from 'lucide-react';

const Analytics = () => {
  const skillData = [
    { subject: 'Frontend', A: 120, fullMark: 150 },
    { subject: 'Backend', A: 98, fullMark: 150 },
    { subject: 'DevOps', A: 86, fullMark: 150 },
    { subject: 'Design', A: 99, fullMark: 150 },
    { subject: 'Soft Skills', A: 85, fullMark: 150 },
    { subject: 'Testing', A: 65, fullMark: 150 },
  ];

  const learningVelocity = [
    { name: 'Jan', hours: 40, modules: 4 },
    { name: 'Feb', hours: 55, modules: 6 },
    { name: 'Mar', hours: 45, modules: 5 },
    { name: 'Apr', hours: 70, modules: 8 },
    { name: 'May', hours: 65, modules: 7 },
    { name: 'Jun', hours: 85, modules: 10 },
  ];

  const stats = [
    { label: "Learning Velocity", value: "+24%", icon: Zap, color: "text-yellow-600" },
    { label: "Career Readiness", value: "82/100", icon: Target, color: "text-indigo-600" },
    { label: "Modules Completed", value: "28", icon: Award, color: "text-emerald-600" },
    { label: "Cognitive Score", value: "94", icon: Brain, color: "text-pink-600" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">Learning <span className="gradient-text">DNA Analytics</span></h1>
        <p className="text-slate-600">Deep dive into your cognitive growth and career readiness metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6"
          >
            <stat.icon className={`${stat.color} mb-4`} size={24} />
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skill DNA Radar */}
        <div className="glass-card">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900">Skill DNA Distribution</h3>
            <BarChart3 size={18} className="text-slate-500" />
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar
                  name="Skills"
                  dataKey="A"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.6}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Learning Velocity Area Chart */}
        <div className="glass-card">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900">Learning Velocity (Hours)</h3>
            <TrendingUp size={18} className="text-slate-500" />
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={learningVelocity}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#6366f1" fillOpacity={1} fill="url(#colorHours)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Module Completion Bar Chart */}
        <div className="glass-card lg:col-span-2">
          <h3 className="font-bold mb-8 text-slate-900">Module Completion Efficiency</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={learningVelocity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b' }}
                />
                <Bar dataKey="modules" fill="#a855f7" radius={[4, 4, 0, 0]}>
                  {learningVelocity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 5 ? '#ec4899' : '#a855f7'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
