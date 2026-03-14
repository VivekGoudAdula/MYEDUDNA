import React from 'react';
import { motion } from 'framer-motion';
import { Route, Brain, Beaker, Users, BarChart3, HelpCircle } from 'lucide-react';

const features = [
  {
    icon: <Route size={22} />,
    title: "AI Career Curriculum",
    description: "Students choose a career path and AI builds a personalised roadmap with structured milestones.",
    image: "/images/feature_curriculum.png"
  },
  {
    icon: <Brain size={22} />,
    title: "Learning Style Intelligence",
    description: "AI adapts lessons for visual, auditory, or kinesthetic learners in real time.",
    image: "/images/feature_learning.png"
  },
  {
    icon: <Beaker size={22} />,
    title: "Virtual STEM Labs",
    description: "Run chemistry, physics, and biology experiments using high-fidelity VR simulations.",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop"
  },
  {
    icon: <Users size={22} />,
    title: "AI Mentor Network",
    description: "Connect with global mentors and peers matched to your career interests and skill level.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
  },
  {
    icon: <BarChart3 size={22} />,
    title: "Progress DNA Analytics",
    description: "Visualise your learning growth as an evolving DNA map — see strengths and skill gaps.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
  },
  {
    icon: <HelpCircle size={22} />,
    title: "Smart Quizzes",
    description: "AI generates adaptive quizzes based on your performance, reinforcing weak areas efficiently.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop"
  }
];

export const FeaturePanels = () => {
  return (
    <section id="product" className="py-24 bg-slate-50 dark:bg-slate-900 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-4 block">Platform Features</span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight max-w-2xl mx-auto"
            style={{ fontFamily: '"Playfair Display", "Times New Roman", Georgia, serif' }}
          >
            Everything you need to learn smarter
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 max-w-lg mx-auto">
            Six powerful modules that work together to create a truly personalised education experience.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
              className="group bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Image */}
              <div className="aspect-[3/2] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={f.image}
                  alt={f.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              {/* Content */}
              <div className="p-5 space-y-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
