import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera, Float } from '@react-three/drei';
import { DNAHelix } from '../components/DNAHelix';
import { ParticleBackground } from '../components/ParticleBackground';

// Sections
import { ProblemSection }   from '../components/landing/ProblemSection';
import { FeaturePanels }    from '../components/landing/FeaturePanels';
import { HowItWorks }       from '../components/landing/HowItWorks';
import { VirtualLabs3D }    from '../components/landing/VirtualLabs3D';
import { CommunityMap }     from '../components/landing/CommunityMap';
import { DashboardScroll }  from '../components/landing/DashboardScroll';
import { PricingSection }   from '../components/landing/PricingSection';
import { Testimonials }     from '../components/landing/Testimonials';
import { FinalCTA }         from '../components/landing/FinalCTA';
import { Footer }           from '../components/landing/Footer';

import { ArrowRight, Play, Moon, Sun, Monitor, Network, Sparkles } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Theme Toggle ────────────────────────────────────────────────────────────
const ThemeToggle = ({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) => (
  <button
    onClick={toggleTheme}
    className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all"
    aria-label="Toggle theme"
  >
    {isDark ? <Sun size={16} /> : <Moon size={16} />}
  </button>
);

// ─── Nav Link ────────────────────────────────────────────────────────────────
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="relative text-[13px] font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors duration-200 after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-indigo-600 after:transition-all hover:after:w-full"
  >
    {children}
  </a>
);

// ─── Landing Page ────────────────────────────────────────────────────────────
const Landing = () => {
  const { scrollYProgress } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax
  const heroOpacity  = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const heroY        = useTransform(scrollYProgress, [0, 0.18], [0, 80]);
  const dnaScale     = useTransform(scrollYProgress, [0, 0.2], [1, 0.85]);

  return (
    <div className="relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass border border-slate-200 text-xs font-medium text-emerald-600 mb-6">
            <Sparkles size={14} />
            <span>Powered by Groq & LLaMA 3.3</span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
            <Link
              to="/auth"
              className="hidden sm:block text-[13px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/auth"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-semibold transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-slate-950 pt-20">

        {/* 3-D canvas — right half only, behind all text */}
        <motion.div
          style={{ scale: dnaScale }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
            <ambientLight intensity={isDark ? 0.4 : 0.9} />
            <directionalLight position={[10, 10, 10]}  intensity={isDark ? 2.5 : 1.2} color={isDark ? '#818cf8' : '#6366f1'} />
            <directionalLight position={[-10, -10, -10]} intensity={1.5} color="#22d3ee" />
            <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.4}>
              <DNAHelix isDark={isDark} />
            </Float>
            {isDark && <ParticleBackground />}
            <Environment preset={isDark ? 'city' : 'apartment'} />
          </Canvas>

          {/* Gradient mask so the left (text) side stays readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-white/0 dark:from-slate-950 dark:via-slate-950/60 dark:to-slate-950/0" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-white dark:from-slate-950 to-transparent" />
        </motion.div>

        {/* Content */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 max-w-6xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center py-24"
        >
          <div className="glass-card max-w-4xl mx-auto aspect-video flex items-center justify-center overflow-hidden group bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative border-slate-200">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10"></div>
            
            {/* AI visualization elements replacing dummy image */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="w-[400px] h-[400px] border border-indigo-500/20 rounded-full flex items-center justify-center animate-[spin_60s_linear_infinite]">
                 <div className="w-[300px] h-[300px] border border-indigo-500/30 rounded-full flex items-center justify-center animate-[spin_40s_linear_infinite_reverse]">
                    <div className="w-[200px] h-[200px] border border-indigo-500/40 rounded-full animate-ping"></div>
                 </div>
              </div>
            </div>
            <div className="absolute bottom-8 left-8 text-left z-20">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                <span className="text-xs font-bold text-emerald-600">AI SYSTEM ACTIVE</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">Personalized Roadmap #4829</h3>
              <p className="text-sm font-bold text-slate-500">Quantum Computing Specialist Path</p>
            </div>
          </div>

          {/* Right — floating UI cards (replaces duplicate DNA, sits over the canvas) */}
          <div className="hidden lg:flex items-center justify-center relative h-[500px]">

            {/* Floating pill labels */}
            {[
              { text: 'AI Curriculum',       pos: 'top-[8%]  right-[5%]',   color: 'text-indigo-600 dark:text-indigo-400', delay: 0 },
              { text: 'Virtual Labs',         pos: 'top-[42%] right-[-4%]',  color: 'text-cyan-600 dark:text-cyan-400',    delay: 0.5 },
              { text: 'Mentorship Network',   pos: 'bottom-[18%] left-[2%]', color: 'text-violet-600 dark:text-violet-400', delay: 1 },
            ].map((label, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, i % 2 === 0 ? -10 : 10, 0] }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: label.delay }}
                className={`absolute ${label.pos} px-4 py-2 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-md text-[11px] font-semibold ${label.color} z-20`}
              >
                {label.text}
              </motion.div>
            ))}

            {/* Status card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="absolute top-[22%] right-[8%] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/8 shadow-xl p-5 flex items-center gap-4 z-20 max-w-[220px]"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shrink-0">
                <Monitor size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">Status</p>
                <p className="text-[13px] font-semibold text-slate-900 dark:text-white leading-tight">Curriculum Sequencing</p>
              </div>
            </motion.div>

            {/* Status card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="absolute bottom-[22%] left-[5%] bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-500/30 p-5 flex items-center gap-4 z-20 max-w-[210px]"
            >
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <Network size={18} />
              </div>
              <div>
                <p className="text-[10px] text-indigo-200 font-medium uppercase tracking-wider mb-0.5">Global Mesh</p>
                <p className="text-[13px] font-semibold leading-tight">2.4k Peers Syncing</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 pointer-events-none">
          <div className="w-px h-10 bg-gradient-to-b from-indigo-500 to-transparent" />
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-400">Scroll</span>
        </div>
      </section>

      {/* ── Sections ────────────────────────────────────────────────────────── */}
      <ProblemSection />
      <FeaturePanels />
      <HowItWorks />
      <VirtualLabs3D />
      <CommunityMap />
      <DashboardScroll />
      <PricingSection />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Landing;
