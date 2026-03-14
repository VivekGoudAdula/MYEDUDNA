import React from 'react';
import { motion } from 'framer-motion';

const problems = [
  {
    title: "Generic curriculum",
    description: "Students lose interest in static lectures that don't adapt to their pace or curiosity.",
    side: "left",
    image: "/images/problem_curriculum.png",
    stat: "72%",
    statLabel: "of students feel disengaged"
  },
  {
    title: "Lack of real experiments",
    description: "Many schools lack access to STEM labs, limiting hands-on experience in critical fields.",
    side: "right",
    image: "/images/problem_labs.png",
    stat: "54%",
    statLabel: "of schools lack lab facilities"
  },
  {
    title: "Disconnected learning",
    description: "Students rarely interact with mentors who can guide their unique professional growth.",
    side: "left",
    image: "/images/problem_mentors.png",
    stat: "83%",
    statLabel: "want personalised guidance"
  }
];

export const ProblemSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-950 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-4 block">The Problem</span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight max-w-3xl mx-auto"
            style={{ fontFamily: '"Playfair Display", "Times New Roman", Georgia, serif' }}
          >
            Education was never meant to be one-size-fits-all
          </h2>
          <div className="w-12 h-0.5 bg-indigo-500 mx-auto mt-6 rounded-full" />
        </motion.div>

        <div className="space-y-20">
          {problems.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: p.side === 'left' ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: '-60px' }}
              className={`flex flex-col md:flex-row items-center gap-10 ${p.side === 'right' ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="flex-1 space-y-4">
                <span className="text-[11px] font-semibold text-indigo-500 uppercase tracking-widest">Challenge {String(i + 1).padStart(2, '0')}</span>
                <h3
                  className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug"
                  style={{ fontFamily: '"Playfair Display", "Times New Roman", Georgia, serif' }}
                >
                  {p.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                  {p.description}
                </p>
                <div className="flex items-baseline gap-2 pt-2">
                  <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{p.stat}</span>
                  <span className="text-xs text-slate-400">{p.statLabel}</span>
                </div>
              </div>
              <div className="flex-1 w-full max-w-sm">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:shadow-xl transition-shadow duration-500">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
