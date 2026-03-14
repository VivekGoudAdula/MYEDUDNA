import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const FinalCTA = () => {
  return (
    <section className="relative py-32 bg-slate-950 overflow-hidden flex flex-col items-center justify-center">
      {/* Animated gradient */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 30%, rgba(79,70,229,0.15) 0%, transparent 40%)",
              "radial-gradient(circle at 80% 70%, rgba(6,182,212,0.15) 0%, transparent 40%)",
              "radial-gradient(circle at 20% 30%, rgba(79,70,229,0.15) 0%, transparent 40%)"
            ]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="w-full h-full"
        />
      </div>

      <div className="relative z-10 text-center max-w-2xl px-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-5"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 block">Get Started Today</span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: '"Playfair Display", "Times New Roman", Georgia, serif' }}
          >
            Discover your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Learning DNA</span>
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
            Start a personalised learning journey powered by AI. Join 2,400+ learners across 40 countries.
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/auth"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/25"
          >
            Start Learning Free
            <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
          <button className="px-6 py-3 rounded-xl border border-white/15 text-white text-sm font-semibold hover:bg-white/5 transition-all">
            Request School Demo
          </button>
        </div>
      </div>
    </section>
  );
};
