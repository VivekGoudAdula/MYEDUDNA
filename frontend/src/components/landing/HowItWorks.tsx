import React from 'react';
import { motion } from 'framer-motion';
import { Target, Route, BookOpen, Users, BarChart3 } from 'lucide-react';

const steps = [
  { icon: <Target size={20} />, title: "Choose Your Dream Career", desc: "Select your future path — engineering, medicine, design, data science, and more." },
  { icon: <Route size={20} />, title: "AI Builds Your Roadmap", desc: "Our AI generates a personalised curriculum tailored to your goals and style." },
  { icon: <BookOpen size={20} />, title: "Learn With Videos + Labs", desc: "Study through interactive videos, adaptive quizzes, and hands-on virtual labs." },
  { icon: <Users size={20} />, title: "Connect With Mentors", desc: "Get matched with industry mentors and collaborate with peers globally." },
  { icon: <BarChart3 size={20} />, title: "Track Your Growth", desc: "Visualise your progress with learning DNA analytics and skill mapping." }
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-950 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-4 block">How It Works</span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight max-w-xl mx-auto"
            style={{ fontFamily: '"Playfair Display", "Times New Roman", Georgia, serif' }}
          >
            Five steps to your personalised education
          </h2>
        </motion.div>

        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800" />

          <div className="space-y-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex items-start gap-6 md:gap-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Content */}
                <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className={`bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5 inline-block hover:shadow-md transition-shadow duration-300 ${i % 2 === 0 ? 'md:ml-auto' : ''}`}>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{step.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">{step.desc}</p>
                  </div>
                </div>

                {/* Centre dot */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-md z-10 shrink-0">
                  {step.icon}
                </div>

                {/* Empty spacer on the other side */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
