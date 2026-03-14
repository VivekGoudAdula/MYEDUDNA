import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const reviews = [
  {
    name: "Alex Rivera",
    role: "Engineering Student",
    quote: "MyEduDNA built a roadmap that actually understood my interest in aerospace and robotics.",
    avatar: "https://i.pravatar.cc/100?u=alex"
  },
  {
    name: "Dr. Elena Vance",
    role: "STEM Educator",
    quote: "Virtual labs transformed how my students interact with complex physics concepts.",
    avatar: "https://i.pravatar.cc/100?u=elena"
  },
  {
    name: "Julian Santos",
    role: "Self-Taught Developer",
    quote: "The AI curriculum knows exactly when to push me towards harder modules.",
    avatar: "https://i.pravatar.cc/100?u=julian"
  },
  {
    name: "Sarah Jenkins",
    role: "High School Senior",
    quote: "I found my passion through the biology labs. The AI mentor helped with university applications.",
    avatar: "https://i.pravatar.cc/100?u=sarah"
  }
];

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-white dark:bg-slate-950 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

        {/* Left */}
        <div className="space-y-5">
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500 block">Testimonials</span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight"
            style={{ fontFamily: '"Playfair Display", "Times New Roman", Georgia, serif' }}
          >
            What our learners say
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
            Join thousands of students and educators building their future with personalised AI-powered learning.
          </p>

          {/* Dot indicators */}
          <div className="flex gap-2 pt-4">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-indigo-500 w-6' : 'bg-slate-300 dark:bg-slate-700'}`}
              />
            ))}
          </div>
        </div>

        {/* Right — Floating Phone */}
        <div className="flex justify-center items-center relative">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-[260px] h-[520px] rounded-[2.5rem] bg-indigo-500/10 p-3 shadow-[0_30px_60px_rgba(79,70,229,0.2)] border border-indigo-500/20"
            style={{ transform: "rotateY(-8deg) rotateZ(3deg) rotateX(5deg)" }}
          >
            {/* Phone body */}
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[2rem] border-[8px] border-slate-900 dark:border-black overflow-hidden relative flex flex-col">

              {/* Notch */}
              <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 dark:bg-black z-20 flex justify-center items-end pb-0.5 rounded-b-2xl w-28 mx-auto">
                <div className="w-8 h-1.5 rounded-full bg-slate-800" />
              </div>

              {/* Screen content */}
              <div className="flex-1 overflow-hidden pt-16 pb-28 px-5 flex flex-col">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.97 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-5"
                  >
                    <img src={reviews[currentIndex].avatar} alt="" className="w-16 h-16 rounded-full border-3 border-indigo-500/20 shadow-md" />
                    <div className="space-y-3">
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                        "{reviews[currentIndex].quote}"
                      </p>
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">{reviews[currentIndex].name}</p>
                        <p className="text-[10px] text-indigo-500 font-medium mt-0.5">{reviews[currentIndex].role}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom accent */}
              <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-indigo-600 to-indigo-500 rounded-t-[40%] flex items-end justify-center pb-6 px-5 z-20">
                <button className="w-full py-2.5 bg-white text-indigo-600 font-semibold rounded-xl shadow-md text-xs hover:scale-105 transition-transform">
                  Get Started
                </button>
              </div>
            </div>

            {/* Side buttons */}
            <div className="absolute top-24 -left-2 w-1.5 h-10 bg-slate-800 dark:bg-black rounded-l-sm" />
            <div className="absolute top-36 -left-2 w-1.5 h-10 bg-slate-800 dark:bg-black rounded-l-sm" />
            <div className="absolute top-28 -right-2 w-1.5 h-14 bg-slate-800 dark:bg-black rounded-r-sm" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
