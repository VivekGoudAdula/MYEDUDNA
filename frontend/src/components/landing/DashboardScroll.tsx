import React from 'react';
import { motion } from 'framer-motion';
import { Map, BarChart3, MessageSquare, Calendar } from 'lucide-react';

const screens = [
  { icon: <Map size={20} />, title: "Learning Roadmap", desc: "Track your AI-generated knowledge path with milestones and progress indicators.", color: "bg-indigo-500" },
  { icon: <BarChart3 size={20} />, title: "Skill Analytics", desc: "Visualise cognitive growth and proficiency across all learning modules.", color: "bg-purple-500" },
  { icon: <MessageSquare size={20} />, title: "Mentor Chat", desc: "Real-time collaboration with matched industry mentors and peer groups.", color: "bg-blue-500" },
  { icon: <Calendar size={20} />, title: "Lab Schedule", desc: "Book and manage virtual lab sessions with built-in experiment tracking.", color: "bg-cyan-500" }
];

export const DashboardScroll = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-950 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-4 block">Dashboard</span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight max-w-2xl mx-auto"
            style={{ fontFamily: '"Playfair Display", "Times New Roman", Georgia, serif' }}
          >
            Your command centre for learning
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 max-w-lg mx-auto">
            Everything you need in one place — track progress, connect with mentors, and manage labs.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {screens.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 space-y-4 hover:shadow-md transition-all duration-300 group"
            >
              <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                {s.icon}
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{s.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${60 + i * 10}%` }}
                  transition={{ duration: 1.5, delay: i * 0.2 }}
                  className={`h-full ${s.color} rounded-full`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mock dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 rounded-2xl bg-slate-900 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 overflow-hidden shadow-2xl"
        >
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 dark:bg-slate-700 border-b border-slate-700">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="text-[10px] text-slate-500 ml-3 font-medium">MyEduDNA Dashboard — Student View</span>
          </div>
          <div className="p-6 grid grid-cols-3 gap-4">
            <div className="col-span-2 bg-slate-800 dark:bg-slate-900 rounded-xl p-4 space-y-3">
              <p className="text-xs text-slate-500 font-medium">Weekly Progress</p>
              <div className="flex items-end gap-2 h-24">
                {[40, 65, 55, 80, 70, 90, 75].map((h, i) => (
                  <div key={i} className="flex-1 bg-indigo-500/30 rounded-t-md relative">
                    <div className="absolute bottom-0 inset-x-0 bg-indigo-500 rounded-t-md" style={{ height: `${h}%` }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-slate-600">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}
              </div>
            </div>
            <div className="bg-slate-800 dark:bg-slate-900 rounded-xl p-4 space-y-3">
              <p className="text-xs text-slate-500 font-medium">Skills</p>
              {[
                { name: "Mathematics", pct: 85 },
                { name: "Physics", pct: 72 },
                { name: "Programming", pct: 91 },
                { name: "Chemistry", pct: 64 }
              ].map(s => (
                <div key={s.name} className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">{s.name}</span>
                    <span className="text-slate-500">{s.pct}%</span>
                  </div>
                  <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
