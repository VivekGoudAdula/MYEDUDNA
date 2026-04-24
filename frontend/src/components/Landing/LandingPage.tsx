import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  ArrowRight, 
  Dna, 
  Brain, 
  Map as MapIcon, 
  FlaskConical, 
  MessageSquare,
  Globe,
  Sparkles,
  Zap,
  Users,
  LayoutDashboard,
  Bell,
  X,
  Layout
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Heading, Text, Metric } from '../DesignSystem/Typography';
import { Button } from '../DesignSystem/Button';
import { Card } from '../DesignSystem/Card';

import { DNABackground } from './DNABackground';

// Header/Navbar for Landing
const LandingNavbar = ({ onEnterApp }: { onEnterApp: () => void }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-20 border-b border-border-light backdrop-blur-md bg-white/80 px-6 md:px-12 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-premium flex items-center justify-center shadow-md">
          <Dna className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-display font-bold tracking-tight text-text-primary italic">
          Edu<span className="text-gradient font-bold">DNA</span>
        </span>
      </div>
      
      <div className="hidden md:flex items-center gap-8">
        <a href="#features" className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">Features</a>
        <a href="#how-it-works" className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">How it Works</a>
        <a href="#impact" className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">Impact</a>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" className="hidden sm:inline-flex text-sm" onClick={onEnterApp}>Sign In</Button>
        <Button variant="primary" size="sm" onClick={onEnterApp} className="shadow-lg shadow-brand-pink/20">Get Started</Button>
      </div>
    </nav>
  );
};

// Hero Section
const Hero = ({ onEnterApp }: { onEnterApp: () => void }) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 overflow-hidden bg-white">
      {/* Background Animated Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-20">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-brand-pink/[0.05] rounded-full blur-[120px]"
        />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 text-left py-12 lg:py-20 lg:-translate-x-8"
        >
          <Heading className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] leading-[0.88] tracking-tighter flex flex-col text-black">
            <span className="block lg:whitespace-nowrap">Your</span>
            <span className="block lg:whitespace-nowrap">Education</span>
            <span className="block lg:whitespace-nowrap">Should Be</span>
            <span className="block lg:whitespace-nowrap">as Unique as</span>
            <span className="block lg:whitespace-nowrap text-gradient italic font-bold">Your DNA</span>
          </Heading>

          <div className="flex flex-col sm:flex-row items-center gap-8 pt-8">
            <Button variant="primary" size="lg" className="w-full sm:w-auto px-12 h-20 text-xl group shadow-2xl shadow-brand-pink/30 rounded-2xl" onClick={onEnterApp}>
              Get Started <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto px-12 h-20 text-xl border-gray-200 rounded-2xl" onClick={onEnterApp}>
              View Demo
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="hidden lg:block relative h-[700px] w-full lg:translate-x-12"
        >
           <DNABackground className="opacity-70 scale-[1.1]" />
        </motion.div>
      </div>

      {/* Floating Indicators */}
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <div className="w-6 h-10 rounded-full border-2 border-border-light flex justify-center p-1">
          <motion.div 
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-brand-pink rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};

// Features Section
const Features = () => {
  const features = [
    {
      title: 'Learning DNA AI',
      desc: 'Our proprietary algorithms analyze 50+ cognitive data points to map your unique learning signature.',
      icon: Brain,
      color: 'from-brand-pink to-brand-red'
    },
    {
      title: 'Career Roadmap',
      desc: 'dynamic learning paths that shift in real-time as industry demands evolve.',
      icon: MapIcon,
      color: 'from-brand-red to-brand-purple'
    },
    {
      title: 'Virtual Labs',
      desc: 'Immersive holographic simulations for engineering and molecular biology.',
      icon: FlaskConical,
      color: 'from-brand-purple to-brand-pink'
    },
    {
      title: 'AI Mentorship',
      desc: '24/7 hyper-personalized assistance that understands your current level and goals.',
      icon: MessageSquare,
      color: 'from-brand-pink to-brand-purple'
    }
  ];

  return (
    <section id="features" className="py-24 px-6 max-w-7xl mx-auto space-y-16">
      <div className="text-center space-y-4">
        <Heading as="h2">Engineered for <span className="text-gradient">Potential</span></Heading>
        <Text className="max-w-2xl mx-auto">Beyond traditional courses, we deliver a scientific approach to personal growth.</Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="h-full flex flex-col group p-8 bg-white border-border-light shadow-md hover:shadow-xl transition-all">
              <div className={cn('w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 shadow-lg shadow-brand-pink/10 group-hover:scale-110 transition-transform', f.color)}>
                <f.icon className="text-white w-7 h-7" />
              </div>
              <Heading as="h4" className="mb-4 text-text-primary">{f.title}</Heading>
              <Text className="text-sm leading-relaxed text-text-secondary">{f.desc}</Text>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// How It Works Section
const HowItWorks = () => {
  const steps = [
    { label: 'Student', desc: 'Scan Your Interests', icon: Users },
    { label: 'AI Mapping', desc: 'DNA Profile Creation', icon: Brain },
    { label: 'Personalized Path', desc: 'Adaptive Curriculum', icon: Zap },
    { label: 'Career Launch', desc: 'Project-Based Success', icon: Rocket }
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 max-w-5xl mx-auto relative">
      <div className="text-center mb-20">
        <Heading as="h2">The <span className="text-gradient">Blueprint</span> for Success</Heading>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
        {/* Connection Line */}
        <div className="absolute top-14 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-pink/10 to-transparent hidden md:block" />
        
        {steps.map((step, i) => (
          <div key={step.label} className="relative z-10 flex flex-col items-center text-center space-y-4">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center border border-border-light shadow-lg"
            >
              <step.icon className="w-8 h-8 text-text-primary" />
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-premium flex items-center justify-center text-xs font-bold border-4 border-bg-light text-white shadow-sm">
                {i + 1}
              </div>
            </motion.div>
            <div className="space-y-1">
              <Heading as="h4" className="text-text-primary">{step.label}</Heading>
              <Text className="text-[10px] font-bold uppercase tracking-widest text-brand-pink">{step.desc}</Text>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Impact Section
const Impact = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeScene, setActiveScene] = useState(0);

  // Auto-cycle scenes when playing
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      setActiveScene(0);
      interval = setInterval(() => {
        setActiveScene(prev => (prev + 1) % 4);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const scenes = [
    {
      title: "MAPPING HUMAN POTENTIAL",
      subtitle: "Initializing Neural Sequence 01..09",
      icon: Dna
    },
    {
      title: "DNA SYNC NETWORK",
      subtitle: "Connecting 54+ Global Nodes",
      icon: Globe
    },
    {
      title: "VIRTUAL COGNITIVE LAB",
      subtitle: "Running 12.4M Simulation Iterations",
      icon: FlaskConical
    },
    {
      title: "WELCOME TO EDUDNA",
      subtitle: "The Future of Intelligent Learning",
      icon: Sparkles
    }
  ];

  return (
    <section id="impact" className="py-24 px-6 max-w-7xl mx-auto relative overflow-hidden bg-white">
       <div className="absolute inset-0 bg-brand-pink/5 -skew-y-3 -z-10" />
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <Heading as="h2" className="leading-tight">Global Impact Through <span className="text-gradient">Intelligent</span> Design</Heading>
            <Text className="text-lg">
              We are bridging the educational divide by delivering high-tier intelligence tools to every student, 
              regardless of their geographical location or economic background.
            </Text>
            
            <div className="grid grid-cols-2 gap-8 pt-8">
               <div className="space-y-1">
                  <Metric className="text-4xl text-brand-pink font-display font-bold">98%</Metric>
                  <Text className="text-xs uppercase font-bold tracking-wider">Learner Satisfaction</Text>
               </div>
               <div className="space-y-1">
                  <Metric className="text-4xl text-brand-purple font-display font-bold">120K+</Metric>
                  <Text className="text-xs uppercase font-bold tracking-wider">Active Students</Text>
               </div>
               <div className="space-y-1">
                  <Metric className="text-4xl text-brand-red font-display font-bold">40K+</Metric>
                  <Text className="text-xs uppercase font-bold tracking-wider">Rural Outreach</Text>
               </div>
               <div className="space-y-1">
                  <Metric className="text-4xl text-text-primary font-display font-bold">15M+</Metric>
                  <Text className="text-xs uppercase font-bold tracking-wider">API Insights</Text>
               </div>
            </div>
          </div>

          <div className="relative group">
             {/* Coded "Neural Video" Interface */}
             <Card className="aspect-video relative overflow-hidden p-0 border border-border-light shadow-2xl bg-slate-950 rounded-3xl cursor-default">
                <AnimatePresence mode="wait">
                  {!isPlaying ? (
                    <motion.div 
                      key="preview"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0"
                    >
                      {/* Background Dynamic Gradients */}
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.1, 1],
                          opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute inset-0 bg-gradient-to-tr from-brand-pink/20 via-brand-purple/20 to-transparent"
                      />
                      
                      {/* Global Neural Network Visualization */}
                      <div className="absolute inset-0 flex items-center justify-center p-12">
                        <div className="relative w-full h-full flex items-center justify-center">
                            <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-0 border border-white/5 rounded-full"
                            />
                            <motion.div 
                              animate={{ rotate: -360 }}
                              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-4 border border-white/5 rounded-full border-dashed"
                            />
                            
                            {/* Pulse Central Node */}
                            <div className="relative z-10 text-center space-y-4">
                                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-premium flex items-center justify-center shadow-[0_0_40px_rgba(236,72,153,0.5)] animate-pulse">
                                  <Globe className="text-white w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                  <div className="text-[10px] font-mono text-brand-pink font-bold tracking-[0.3em] uppercase">Status: Live Sync</div>
                                  <div className="text-white/60 text-[8px] font-mono tracking-tighter">GLOBAL NEURAL LOAD: 42.8 TFLOPS</div>
                                </div>
                            </div>

                            {/* Random Connection Lines & Nodes */}
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                              <motion.div 
                                key={i}
                                animate={{ 
                                  opacity: [0.2, 1, 0.2],
                                  scale: [0.8, 1.2, 0.8]
                                }}
                                transition={{ 
                                  duration: Math.random() * 3 + 2, 
                                  repeat: Infinity,
                                  delay: Math.random() * 2 
                                }}
                                className="absolute w-2 h-2 bg-brand-pink rounded-full blur-[1px]"
                                style={{
                                  top: `${Math.random() * 100}%`,
                                  left: `${Math.random() * 100}%`
                                }}
                              />
                            ))}
                        </div>
                      </div>

                      {/* Overlay UI */}
                      <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                        <div className="space-y-2">
                            <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 inline-flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-pulse" />
                              <span className="text-[10px] text-white font-bold tracking-widest uppercase">Streaming Synchronization</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-10 h-1 bg-white/20 rounded-full" />
                            <div className="w-4 h-1 bg-brand-pink rounded-full" />
                        </div>
                      </div>

                      {/* Play Button Decor */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setIsPlaying(true)}
                          className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center cursor-pointer shadow-2xl z-50"
                        >
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center pl-1">
                              <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-brand-pink border-b-[8px] border-b-transparent" />
                            </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="video"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-slate-950 flex items-center justify-center overflow-hidden"
                    >
                      {/* Coded Motion Graphic "Video" */}
                      <div className="relative w-full h-full flex items-center justify-center">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`scene-${activeScene}`}
                            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 1.2, filter: "blur(40px)" }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center"
                          >
                             <motion.div 
                               animate={{ 
                                 rotateY: [0, 180, 360],
                                 scale: [1, 1.1, 1]
                               }}
                               transition={{ duration: 3, repeat: Infinity }}
                               className="w-24 h-24 rounded-[2rem] bg-gradient-premium flex items-center justify-center mb-10 shadow-[0_0_60px_rgba(236,72,153,0.3)] border border-white/10"
                             >
                                {(() => {
                                  const Icon = scenes[activeScene].icon;
                                  return Icon ? <Icon className="text-white w-10 h-10" /> : null;
                                })()}
                             </motion.div>
                             
                             <motion.div
                               initial={{ y: 20, opacity: 0 }}
                               animate={{ y: 0, opacity: 1 }}
                               transition={{ delay: 0.2 }}
                               className="space-y-4"
                             >
                                <Heading className="text-white text-3xl md:text-5xl leading-tight tracking-[0.05em] uppercase font-bold">
                                   {scenes[activeScene].title.split(' ').map((word, i) => (
                                     <span key={i} className={i === 1 ? "text-gradient italic" : ""}>{word} </span>
                                   ))}
                                </Heading>
                                <div className="h-1 w-12 bg-white/20 rounded-full mx-auto" />
                                <Text className="text-brand-pink font-mono text-[10px] font-bold tracking-[0.4em] uppercase">
                                   {scenes[activeScene].subtitle}
                                </Text>
                             </motion.div>
                          </motion.div>
                        </AnimatePresence>

                        {/* Particle Grid Background */}
                        <div className="absolute inset-0 pointer-events-none grid grid-cols-12 gap-px opacity-10">
                           {[...Array(144)].map((_, i) => (
                             <motion.div
                               key={i}
                               animate={{ opacity: [0.1, 0.4, 0.1] }}
                               transition={{ duration: 4, repeat: Infinity, delay: i * 0.05 }}
                               className="aspect-square bg-white/10 rounded-sm"
                             />
                           ))}
                        </div>

                        {/* Kinetic Typography "Data Rain" alternative */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                           {[...Array(6)].map((_, i) => (
                             <motion.div
                               key={i}
                               animate={{ 
                                 x: [-1000, 2000]
                               }}
                               transition={{ 
                                 duration: 15, 
                                 repeat: Infinity,
                                 delay: i * 2,
                                 ease: "linear"
                               }}
                               className="absolute text-[8rem] font-black text-white/[0.02] whitespace-nowrap italic pointer-events-none"
                               style={{ top: `${i * 20}%` }}
                             >
                               EDUDNA SYNC INTELLIGENCE NEURAL ARCHITECTURE
                             </motion.div>
                           ))}
                        </div>
                      </div>

                      <button 
                        onClick={() => setIsPlaying(false)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors z-50 border border-white/10"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      {/* Video-style Progress Bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/5">
                         <motion.div 
                           key={isPlaying ? 'playing' : 'stopped'}
                           initial={{ width: 0 }}
                           animate={{ width: "100%" }}
                           transition={{ duration: 10, ease: "linear" }}
                           onAnimationComplete={() => setIsPlaying(false)}
                           className="h-full bg-gradient-brand shadow-[0_0_15px_rgba(236,72,153,0.5)]"
                         />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
             </Card>

             <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-white border border-border-light shadow-2xl rounded-2xl flex flex-col items-center justify-center p-5 z-20">
                <Metric className="text-xl text-brand-pink font-bold mb-1">54</Metric>
                <span className="text-[8px] text-text-secondary text-center font-bold tracking-widest uppercase leading-tight">Countries<br/>Connected</span>
                <div className="mt-3 flex -space-x-2">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 overflow-hidden">
                        <img src={`https://picsum.photos/seed/${i + 20}/50/50`} alt="User" className="w-full h-full object-cover" />
                     </div>
                   ))}
                </div>
             </div>
          </div>
       </div>
    </section>
  );
};

// Demo Preview
const DemoPreview = () => {
  return (
    <section className="py-24 px-6 overflow-hidden bg-gray-50/50">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4">
           <Heading as="h2">The <span className="text-gradient">Unified</span> Operating System</Heading>
           <Text className="max-w-2xl mx-auto">One command center for your entire academic and career journey.</Text>
        </div>

        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="relative px-4"
        >
          {/* Mock UI Frame */}
          <div className="bg-white border border-border-light rounded-[2.5rem] p-3 md:p-6 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden max-w-6xl mx-auto ring-1 ring-black/5">
            <div className="flex items-center gap-2 mb-6 px-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="ml-8 h-8 w-full max-w-md bg-gray-50 rounded-xl border border-border-light flex items-center px-4">
                <div className="w-3 h-3 rounded-full bg-brand-pink/20 mr-3 animate-pulse" />
                <span className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">https://core.edudna.ai/dashboard</span>
              </div>
            </div>
            
            {/* Inner Dashboard View Mockup */}
            <div className="bg-bg-light rounded-[1.5rem] border border-border-light min-h-[500px] flex overflow-hidden">
               {/* Mock Sidebar */}
               <div className="w-20 md:w-56 border-r border-border-light bg-white p-4 hidden sm:flex flex-col gap-6">
                  <div className="flex items-center gap-2 px-2">
                    <div className="w-6 h-6 rounded bg-gradient-premium flex items-center justify-center">
                       <Dna className="text-white w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-xs italic hidden md:block">Edu<span className="text-gradient">DNA</span></span>
                  </div>
                  <div className="space-y-1">
                    {[
                      { icon: LayoutDashboard, label: 'Dashboard' },
                      { icon: MapIcon, label: 'Roadmap' },
                      { icon: FlaskConical, label: 'Virtual Lab' },
                      { icon: Users, label: 'Network' },
                      { icon: Sparkles, label: 'Insights' }
                    ].map((item, i) => (
                      <div key={i} className={cn("flex items-center gap-3 p-2 rounded-lg transition-colors group cursor-pointer", i === 0 ? "bg-brand-pink/10 text-brand-pink" : "text-text-secondary hover:bg-gray-50")}>
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-wider hidden md:block">{item.label}</span>
                      </div>
                    ))}
                  </div>
               </div>

               {/* Mock Dashboard Content */}
               <div className="flex-1 p-6 md:p-8 space-y-8 bg-gray-50/30 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-text-primary uppercase tracking-widest">Cognitive State: Optimized</h4>
                      <p className="text-[10px] text-text-secondary font-mono">NEURAL SYNC STABILITY: 98.4%</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <Bell className="w-4 h-4 text-text-secondary" />
                       <div className="w-8 h-8 rounded-full bg-gradient-premium border-2 border-white shadow-sm overflow-hidden p-0.5">
                          <img src="https://picsum.photos/seed/edu/100/100" alt="User" className="w-full h-full object-cover rounded-full" />
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { title: 'Brain Power', val: '840', sub: 'NEURAL SCORE', icon: Brain, color: 'brand-pink' },
                      { title: 'Sync Speed', val: '1.2s', sub: 'LATENCY RATE', icon: Zap, color: 'brand-purple' },
                      { title: 'Career Velocity', val: '92%', sub: 'TRAJECTORY', icon: Rocket, color: 'emerald-500' }
                    ].map((stat, i) => (
                      <div key={i} className="bg-white p-6 rounded-2xl border border-border-light shadow-sm space-y-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className={cn("w-10 h-10 rounded-xl bg-opacity-10 flex items-center justify-center", `bg-${stat.color} text-${stat.color}`)}>
                             <stat.icon className="w-5 h-5" />
                          </div>
                          <div className="text-[8px] font-mono text-text-secondary uppercase tracking-widest">{stat.sub}</div>
                        </div>
                        <div className="space-y-1">
                          <Metric className="text-2xl font-bold text-text-primary leading-none">{stat.val}</Metric>
                          <p className="text-[10px] font-bold text-text-secondary opacity-60 uppercase">{stat.title}</p>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                           <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: i === 0 ? "75%" : i === 1 ? "50%" : "66%" }}
                            transition={{ duration: 1.5, delay: 0.2 }}
                            className={cn("h-full rounded-full", `bg-${stat.color}`)} 
                           />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white p-8 rounded-3xl border border-border-light shadow-sm flex flex-col md:flex-row gap-8 relative overflow-hidden group">
                     <div className="space-y-6 flex-1 relative z-10">
                        <div className="flex items-center gap-2">
                           <Sparkles className="w-4 h-4 text-brand-pink" />
                           <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest">AI Roadmap Insights</h4>
                        </div>
                        <div className="space-y-4">
                           {[
                             'Molecular Biology Path Unlocked',
                             'Neural Network Optimization Complete',
                             'Quantum Computing Preview Available'
                           ].map((item, j) => (
                             <div key={j} className="flex items-center gap-4">
                               <div className="w-2 h-2 rounded-full bg-brand-pink shadow-[0_0_8px_rgba(236,72,153,0.4)]" />
                               <span className="text-[10px] font-medium text-text-secondary uppercase tracking-wider">{item}</span>
                             </div>
                           ))}
                        </div>
                        <div className="pt-4">
                           <Button variant="primary" size="sm" className="h-10 text-[10px] uppercase font-bold tracking-[0.2em] px-8">Sync Profile</Button>
                        </div>
                     </div>
                     <div className="flex-1 h-40 md:h-auto bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center group-hover:bg-brand-pink/[0.02] transition-colors">
                        <div className="relative text-center">
                           <Dna className="w-16 h-16 text-brand-pink/20 animate-pulse mx-auto" />
                           <div className="absolute inset-0 bg-brand-pink/5 blur-2xl" />
                           <div className="mt-2 text-[8px] font-mono text-brand-pink/60 uppercase tracking-[0.2em] font-bold">DNA Sequence Validated</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
          
          {/* Accent Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-pink/5 blur-[150px] -z-10" />
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="border-t border-border-light py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 sm:gap-8">
        <div className="col-span-1 md:col-span-1 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-premium flex items-center justify-center shadow-md">
              <Dna className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-display font-bold text-text-primary italic">
              Edu<span className="text-gradient font-bold">DNA</span>
            </span>
          </div>
          <Text className="text-sm">Mapping human potential through AI-driven educational insights.</Text>
        </div>

        <div className="space-y-4">
          <h5 className="text-sm font-bold uppercase tracking-widest text-text-primary">Product</h5>
          <ul className="space-y-2">
            <li><a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">DNA Tech</a></li>
            <li><a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Features</a></li>
            <li><a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Pricing</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h5 className="text-sm font-bold uppercase tracking-widest text-text-primary">Company</h5>
          <ul className="space-y-2">
            <li><a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">About Us</a></li>
            <li><a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Careers</a></li>
            <li><a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Contact</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h5 className="text-sm font-bold uppercase tracking-widest text-text-primary">Legal</h5>
          <ul className="space-y-2">
            <li><a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Privacy</a></li>
            <li><a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Terms</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-border-light flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-text-secondary/60 font-mono">© 2026 MYEDUDNA INTELLIGENCE SYSTEMS INC.</p>
        <div className="flex gap-6">
          <a href="#" className="text-text-secondary hover:text-brand-pink transition-colors text-xs font-mono">TWITTER</a>
          <a href="#" className="text-text-secondary hover:text-brand-pink transition-colors text-xs font-mono">GITHUB</a>
          <a href="#" className="text-text-secondary hover:text-brand-pink transition-colors text-xs font-mono">LINKEDIN</a>
        </div>
      </div>
    </footer>
  );
};

export const LandingPage = ({ onEnterApp }: { onEnterApp: () => void }) => {
  return (
    <div className="bg-bg-light text-text-primary selection:bg-brand-pink/20">
      <LandingNavbar onEnterApp={onEnterApp} />
      <Hero onEnterApp={onEnterApp} />
      <Features />
      <HowItWorks />
      <DemoPreview />
      <Impact />
      <Footer />
    </div>
  );
};
