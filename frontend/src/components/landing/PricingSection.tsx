import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const tiers = [
  {
    name: "Student",
    price: "0",
    features: ["AI learning roadmap", "Basic lab simulations", "Community access", "Progress tracking"],
    desc: "Perfect for individual lifelong learners."
  },
  {
    name: "Pro",
    price: "29",
    featured: true,
    features: ["Unlimited virtual labs", "AI mentor matching", "Advanced analytics", "Priority support"],
    desc: "For career-focused learners."
  },
  {
    name: "Institution",
    price: "Custom",
    features: ["Teacher dashboards", "Curriculum insights", "Multi-student access", "Custom integrations"],
    desc: "Built for schools and universities."
  }
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 bg-slate-50 dark:bg-slate-900 px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 space-y-4"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500 block">Pricing</span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight"
            style={{ fontFamily: '"Playfair Display", "Times New Roman", Georgia, serif' }}
          >
            Choose your learning plan
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Flexible tiers for individual learners, professionals, and institutions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-5 items-stretch">
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`rounded-2xl border p-6 flex flex-col transition-all duration-300 ${tier.featured
                ? 'bg-slate-900 dark:bg-slate-950 border-indigo-500 text-white shadow-xl relative'
                : 'bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 hover:shadow-md'}`}
            >
              {tier.featured && (
                <div className="absolute top-0 right-5 -translate-y-1/2 px-3 py-1 bg-indigo-500 rounded-full text-[10px] font-semibold text-white">
                  Popular
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{tier.name}</h3>
                <p className={`text-xs mt-1 ${tier.featured ? 'text-slate-400' : 'text-slate-400'}`}>{tier.desc}</p>
              </div>

              <div className="flex items-baseline gap-1 mb-6">
                {tier.price !== 'Custom' && <span className="text-3xl font-bold text-slate-900 dark:text-white">${tier.price}</span>}
                {tier.price !== 'Custom' && <span className="text-sm text-slate-400">/mo</span>}
                {tier.price === 'Custom' && <span className="text-2xl font-bold text-slate-900 dark:text-white">Custom</span>}
              </div>

              <ul className="space-y-3 mb-6 flex-1">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className={tier.featured ? 'text-indigo-400' : 'text-indigo-500'} />
                    <span className={`text-sm ${tier.featured ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${tier.featured
                ? 'bg-white text-slate-900 hover:bg-slate-100'
                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'}`}>
                Get Started <ArrowRight size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
