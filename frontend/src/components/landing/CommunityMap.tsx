import React from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, Lightbulb, Code2 } from 'lucide-react';

const members = [
  { name: "Dr. Sarah Chen", role: "AI Research Lead", avatar: "https://i.pravatar.cc/100?u=sarah", type: "Mentor" },
  { name: "Marcus Johnson", role: "CS Student", avatar: "https://i.pravatar.cc/100?u=marcus", type: "Student" },
  { name: "Prof. Aisha Patel", role: "Physics Faculty", avatar: "https://i.pravatar.cc/100?u=aisha", type: "Researcher" },
  { name: "Jake Rivera", role: "Full-Stack Dev", avatar: "https://i.pravatar.cc/100?u=jake", type: "Developer" },
  { name: "Emily Zhang", role: "Biology Major", avatar: "https://i.pravatar.cc/100?u=emily", type: "Student" },
  { name: "Dr. Raj Mehta", role: "Data Scientist", avatar: "https://i.pravatar.cc/100?u=raj", type: "Mentor" }
];

const typeIcon: Record<string, React.ReactNode> = {
  Mentor: <Lightbulb size={12} />,
  Student: <GraduationCap size={12} />,
  Researcher: <Users size={12} />,
  Developer: <Code2 size={12} />
};

const typeColor: Record<string, string> = {
  Mentor: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
  Student: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400",
  Researcher: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
  Developer: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400"
};

export const CommunityMap = () => {
  return (
    <section id="mentorship" className="py-24 bg-slate-50 dark:bg-slate-900 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-4 block">Community</span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight max-w-2xl mx-auto"
            style={{ fontFamily: '"Playfair Display", "Times New Roman", Georgia, serif' }}
          >
            Learn together with global mentors
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 max-w-lg mx-auto">
            Connect with a worldwide network of students, educators, researchers, and industry professionals.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 p-4 flex items-center gap-4 hover:shadow-md transition-all duration-300 group"
            >
              <img
                src={m.avatar}
                alt={m.name}
                className="w-11 h-11 rounded-full border-2 border-slate-100 dark:border-slate-700 shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{m.name}</p>
                <p className="text-xs text-slate-400 truncate">{m.role}</p>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold ${typeColor[m.type]}`}>
                {typeIcon[m.type]}
                {m.type}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: "2,400+", label: "Active learners" },
            { value: "350+", label: "Expert mentors" },
            { value: "40+", label: "Countries" },
            { value: "98%", label: "Satisfaction rate" }
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center py-6 bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800"
            >
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{s.value}</p>
              <p className="text-xs text-slate-400 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
