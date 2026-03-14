import React from 'react';
import { motion } from 'framer-motion';
import { Beaker, Zap, Microscope } from 'lucide-react';

const labs = [
  { icon: <Beaker size={20} />, title: "Chemistry Titration", desc: "Precise molar calculations with real-time reaction visualisers.", image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=250&fit=crop" },
  { icon: <Zap size={20} />, title: "Physics Circuits", desc: "Interact with electron flow and resistance in real time.", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop" },
  { icon: <Microscope size={20} />, title: "Biology Microsim", desc: "Explore cellular architecture and genomic sequencing in high fidelity.", image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=250&fit=crop" }
];

export const VirtualLabs3D = () => {
  return (
    <section id="labs" className="py-24 bg-white dark:bg-slate-950 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500 block">Virtual Labs</span>
            <h2
              className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight"
              style={{ fontFamily: '"Playfair Display", "Times New Roman", Georgia, serif' }}
            >
              Remote labs,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">real results</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
              Our virtual laboratories use high-fidelity physics engines to simulate real-world experiments. Immersive, accurate, and accessible from anywhere.
            </p>
            <button className="mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
              Launch Lab Demo
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800"
          >
            <img
              src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=500&fit=crop"
              alt="Virtual lab environment"
              className="w-full h-64 object-cover"
            />
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {labs.map((lab, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden group hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-[3/2] overflow-hidden">
                <img src={lab.image} alt={lab.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400">{lab.icon}</div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{lab.title}</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{lab.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
