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
    <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white overflow-x-hidden min-h-screen transition-colors duration-500">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className={cn(
        'fixed top-0 inset-x-0 z-[100] transition-all duration-400',
        isScrolled
          ? 'py-3 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/70 dark:border-white/8 shadow-sm'
          : 'py-5 bg-transparent'
      )}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between gap-8">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-md group-hover:shadow-indigo-500/40 transition-shadow">
              <span className="text-white font-bold text-sm leading-none">M</span>
            </div>
            <span
              className="text-[15px] font-semibold tracking-tight text-slate-900 dark:text-white"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              MyEduDNA
            </span>
          </Link>

          {/* Centre links */}
          <div className="hidden lg:flex items-center gap-7">
            <NavLink href="#product">Features</NavLink>
            <NavLink href="#labs">Virtual Labs</NavLink>
            <NavLink href="#mentorship">Mentorship</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
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
          {/* Left copy */}
          <div className="space-y-8 max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 text-xs font-medium mb-8">
                <Sparkles size={12} />
                <span>AI-powered personalised learning</span>
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-slate-900 dark:text-white mb-6"
                style={{ fontFamily: '"Playfair Display", "Times New Roman", Georgia, serif' }}
              >
                Your Education,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400">
                  Unique As Your DNA
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-10">
                MyEduDNA designs personalised learning journeys using AI — built around
                your career goals, learning style, and natural curiosity.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/auth"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
                >
                  Start Learning
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-all">
                  <Play size={15} className="text-indigo-500 fill-indigo-500" />
                  Watch Demo
                </button>
              </div>

              {/* Social proof micro-line */}
              <p className="text-xs text-slate-400 dark:text-slate-600 mt-8">
                Trusted by <span className="font-semibold text-slate-600 dark:text-slate-400">2,400+ learners</span> across 40 countries
              </p>
            </motion.div>
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
