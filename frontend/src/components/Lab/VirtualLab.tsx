import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Beaker, 
  Zap, 
  RotateCcw, 
  ChevronRight, 
  Database, 
  Activity, 
  Cpu, 
  Terminal,
  AlertCircle,
  Atom,
  Timer,
  Brain,
  Sparkles,
  ArrowLeft,
  X,
  Clock,
  BookOpen,
  Layers
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Heading, Text } from '../DesignSystem/Typography';
import { Button } from '../DesignSystem/Button';
import { Card } from '../DesignSystem/Card';

// Import Experiments
import { ProjectileMotion } from './experiments/ProjectileMotion';
import { SimplePendulum } from './experiments/SimplePendulum';
import { AcidBaseTitration } from './experiments/AcidBaseTitration';
import { MolecularVisualizer } from './experiments/MolecularVisualizer';
import { CircuitBuilder } from './experiments/CircuitBuilder';
import { OhmsLaw } from './experiments/OhmsLaw';
import { SortingVisualizer } from './experiments/SortingVisualizer';
import { BinarySimulator } from './experiments/BinarySimulator';

type LabCategory = 'Physics' | 'Chemistry' | 'Electronics' | 'Computer Science';

interface Experiment {
  id: string;
  name: string;
  category: LabCategory;
  difficulty: 'Basic' | 'Advanced';
  estimatedTime: string;
  instructions: string[];
  simulationKey: string;
  desc: string;
}

const labCategories: { name: LabCategory; icon: any; color: string; desc: string; gradient: string }[] = [
  { 
    name: 'Physics', 
    icon: Atom, 
    color: 'text-blue-400', 
    gradient: 'from-blue-500/20 to-transparent',
    desc: 'Mechanics, kinematics, and gravitational field simulations.' 
  },
  { 
    name: 'Chemistry', 
    icon: Beaker, 
    color: 'text-emerald-400', 
    gradient: 'from-emerald-500/20 to-transparent',
    desc: 'Molecular bonding, acid-base equilibrium, and stoichiometry.' 
  },
  { 
    name: 'Electronics', 
    icon: Cpu, 
    color: 'text-amber-400', 
    gradient: 'from-amber-500/20 to-transparent',
    desc: 'Circuit architecture, semiconductors, and electronic logic.' 
  },
  { 
    name: 'Computer Science', 
    icon: Terminal, 
    color: 'text-brand-purple', 
    gradient: 'from-brand-purple/20 to-transparent',
    desc: 'Algorithmic optimization, binary systems, and hardware logic.' 
  },
];

const experiments: Experiment[] = [
  {
    id: 'projectile',
    name: 'Projectile Motion Analysis',
    category: 'Physics',
    difficulty: 'Basic',
    estimatedTime: '3 min',
    simulationKey: 'projectile',
    desc: 'Analyze trajectory arcs, range, and height based on launch vectors.',
    instructions: [
      'Set the launch angle to 45° for maximum range.',
      'Adjust velocity to observe impact force changes.',
      'Initialize simulation to capture flight duration.',
      'Compare results with theoretical calculations.'
    ]
  },
  {
    id: 'pendulum',
    name: 'Simple Harmonic Pendulum',
    category: 'Physics',
    difficulty: 'Basic',
    estimatedTime: '4 min',
    simulationKey: 'pendulum',
    desc: 'Explore period oscillation and gravitational effects on a mass.',
    instructions: [
      'Set string length to 150 units.',
      'Select gravitational environment (Earth, Moon, or Jupiter).',
      'Release the bob and track period completion.',
      'Analyze the impact of G-force on oscillation speed.'
    ]
  },
  {
    id: 'titration',
    name: 'Acid-Base Titration',
    category: 'Chemistry',
    difficulty: 'Advanced',
    estimatedTime: '6 min',
    simulationKey: 'titration',
    desc: 'Perform volumetric analysis to find solution neutralization points.',
    instructions: [
      'Fill burette with titrant solution.',
      'Deliver drops incrementally into the acid flask.',
      'Observe color transition at the equivalence point.',
      'Capture final volume and calculate molarity.'
    ]
  },
  {
    id: 'molecule',
    name: 'Molecular 3D Visualizer',
    category: 'Chemistry',
    difficulty: 'Basic',
    estimatedTime: '2 min',
    simulationKey: 'molecule',
    desc: 'Explore complex molecular structures in full 3D space.',
    instructions: [
      'Select a molecule from the configuration panel.',
      'Rotate and zoom to analyze covalent bonding angles.',
      'Identify different atom types by color decoding.',
      'Verify bond counts for the selected structure.'
    ]
  },
  {
    id: 'circuits',
    name: 'Circuit Logic Builder',
    category: 'Electronics',
    difficulty: 'Advanced',
    estimatedTime: '5 min',
    simulationKey: 'circuits',
    desc: 'Build and test electronic circuits with real-time current flow.',
    instructions: [
      'Drag components from the repository to the breadboard.',
      'Ensure a complete loop from source to output.',
      'Initialize power test to verify circuit integrity.',
      'If LED glows, neural bridge is established.'
    ]
  },
  {
    id: 'ohmslaw',
    name: 'Ohm’s Law Analyzer',
    category: 'Electronics',
    difficulty: 'Basic',
    estimatedTime: '3 min',
    simulationKey: 'ohmslaw',
    desc: 'Visualize the relationship between Voltage, Resistance, and Current.',
    instructions: [
      'Vary source voltage using the primary slider.',
      'Increase resistance to observe current impedance.',
      'Note the real-time calculation in Amperes.',
      'Analyze the linear relationship on the trend graph.'
    ]
  },
  {
    id: 'sorting',
    name: 'Algorithm Optimization',
    category: 'Computer Science',
    difficulty: 'Advanced',
    estimatedTime: '4 min',
    simulationKey: 'sorting',
    desc: 'Visualize sorting algorithms and their computational complexity.',
    instructions: [
      'Generate a new randomized array sequence.',
      'Select the Bubble Sort optimization protocol.',
      'Initialize sorting and watch block alignment.',
      'Analyze O(n²) time complexity traces.'
    ]
  },
  {
    id: 'binary',
    name: 'Binary Register Simulator',
    category: 'Computer Science',
    difficulty: 'Basic',
    estimatedTime: '2 min',
    simulationKey: 'binary',
    desc: 'Encode decimal values into 8-bit binary registers.',
    instructions: [
      'Input a decimal value in the base-10 interface.',
      'Notice the bitwise conversion across the 8-bit sector.',
      'Learn how base-2 logic powers neural hardware.',
      'Test overflow limits and register capacity.'
    ]
  }
];

export const VirtualLab = () => {
  const [view, setView] = useState<'hub' | 'list' | 'simulation'>('hub');
  const [selectedCategory, setSelectedCategory] = useState<LabCategory | null>(null);
  const [activeExp, setActiveExp] = useState<Experiment | null>(null);
  const [simStatus, setSimStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [activeStep, setActiveStep] = useState(0);
  const [isAssistantOpen, setIsAssistantOpen] = useState(true);
  const [captureHistory, setCaptureHistory] = useState<any[]>([]);

  const filteredExperiments = experiments.filter(e => e.category === selectedCategory);

  const handleCapture = React.useCallback((results: any) => {
    setCaptureHistory(prev => [...prev, { timestamp: new Date(), ...results }]);
    setSimStatus('completed');
  }, []);

  const renderSimulation = () => {
    if (!activeExp) return null;
    switch (activeExp.simulationKey) {
      case 'projectile': return <ProjectileMotion onCaptureResults={handleCapture} />;
      case 'pendulum': return <SimplePendulum onCaptureResults={handleCapture} />;
      case 'titration': return <AcidBaseTitration onCaptureResults={handleCapture} />;
      case 'molecule': return <MolecularVisualizer />;
      case 'circuits': return <CircuitBuilder />;
      case 'ohmslaw': return <OhmsLaw onCaptureResults={handleCapture} />;
      case 'sorting': return <SortingVisualizer />;
      case 'binary': return <BinarySimulator />;
      default: return <div className="p-20 text-center text-text-secondary/40">Simulation Module Pending Integration...</div>;
    }
  };

  if (view === 'hub') {
    return (
      <div className="max-w-6xl mx-auto py-8 md:py-12 px-4 md:px-6 space-y-12">
         <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple/5 border border-brand-purple/10 text-brand-purple text-[10px] font-bold uppercase tracking-[0.3em]">
               <Sparkles className="w-3 h-3" /> MyEduDNA Virtual Research Lab
            </div>
            <Heading as="h1" className="text-3xl md:text-5xl text-text-primary leading-tight">Future-Ready <span className="text-gradient">Sim Sandbox</span></Heading>
            <Text className="text-text-secondary max-w-xl mx-auto text-sm md:text-base">Explore high-fidelity interactive simulations designed to optimize your neural learning profile.</Text>
         </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {labCategories.map((cat) => (
              <Card 
                key={cat.name} 
                className={cn(
                  "group relative hover:scale-[1.04] active:scale-95 transition-all duration-500 cursor-pointer p-8 md:p-12 overflow-hidden flex flex-col items-center text-center space-y-8 border-border-light bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] rounded-[3rem]"
                )}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setView('list');
                }}
              >
                 <div className={cn("absolute inset-0 bg-gradient-to-b opacity-0 group-hover:opacity-20 transition-opacity duration-700", cat.gradient)} />
                 <div className={cn("relative z-10 w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] md:rounded-[3.5rem] bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-white group-hover:rotate-6 transition-all duration-700 shadow-sm", cat.color)}>
                    <cat.icon className="w-10 h-10 md:w-16 md:h-16" />
                 </div>
                 <div className="relative z-10 space-y-3">
                    <Heading as="h3" className="text-xl md:text-2xl font-display font-bold tracking-tight text-text-primary">{cat.name}</Heading>
                    <Text className="text-xs md:text-sm text-text-secondary leading-relaxed px-4 opacity-70">{cat.desc}</Text>
                 </div>
                 <div className={cn("relative z-10 py-3 px-6 rounded-2xl bg-gray-50 font-bold group-hover:bg-white transition-all text-[10px] md:text-xs tracking-[0.3em] uppercase", cat.color)}>
                    Initialize Hub
                 </div>
              </Card>
            ))}
          </div>
      </div>
    );
  }

  if (view === 'list' && selectedCategory) {
    return (
      <div className="max-w-4xl mx-auto py-8 md:py-12 px-4 md:px-6 space-y-8 md:space-y-10">
         <Button 
           variant="ghost" 
           size="sm" 
           className="gap-2 text-text-secondary hover:text-text-primary mb-2"
           onClick={() => setView('hub')}
         >
           <ArrowLeft className="w-4 h-4" /> Back to Research Hub
         </Button>

         <div className="flex items-center gap-4 md:gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] bg-white flex items-center justify-center border border-border-light shadow-md shrink-0">
               {(() => {
                 const cat = labCategories.find(c => c.name === selectedCategory);
                 const Icon = cat?.icon;
                 return Icon ? <Icon className={cn("w-8 h-8 md:w-10 md:h-10", cat.color)} /> : null;
               })()}
            </div>
            <div>
               <Heading as="h2" className="text-2xl md:text-4xl text-text-primary">{selectedCategory} <span className="text-gradient">Simulations</span></Heading>
               <Text className="text-[9px] md:text-[10px] uppercase font-bold tracking-[0.2em] md:tracking-[0.3em] text-text-secondary">Select an experimental sequence below</Text>
            </div>
         </div>

         <div className="grid grid-cols-1 gap-4 md:gap-6">
            {filteredExperiments.map((exp) => (
              <Card 
                key={exp.id}
                className="group hover:border-brand-purple/30 transition-all cursor-pointer p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 bg-white border-border-light shadow-md hover:shadow-xl"
                onClick={() => {
                  setActiveExp(exp);
                  setView('simulation');
                  setSimStatus('idle');
                  setActiveStep(0);
                }}
              >
                 <div className="flex items-center gap-4 md:gap-8">
                    <div className="w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-2xl border border-border-light flex items-center justify-center bg-gray-50 group-hover:border-brand-purple/20 group-hover:bg-white transition-all shadow-sm shrink-0">
                       <Layers className="w-6 h-6 md:w-8 md:h-8 text-text-secondary group-hover:text-brand-purple group-hover:rotate-12 transition-all" />
                    </div>
                    <div>
                       <h4 className="text-base md:text-xl font-bold text-text-primary group-hover:text-brand-purple transition-colors mb-1">{exp.name}</h4>
                       <Text className="text-xs md:text-sm text-text-secondary max-w-md leading-relaxed">{exp.desc}</Text>
                       <div className="flex items-center gap-4 md:gap-6 mt-3 md:mt-4">
                          <span className="text-[9px] md:text-[10px] font-bold px-2 md:px-3 py-1 rounded-lg bg-brand-purple/5 border border-brand-purple/10 text-brand-purple uppercase tracking-widest">{exp.difficulty}</span>
                          <span className="text-[9px] md:text-[10px] text-text-secondary uppercase tracking-[0.2em] flex items-center gap-1.5 md:gap-2 font-bold">
                             <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-pink" /> {exp.estimatedTime}
                          </span>
                       </div>
                    </div>
                 </div>
                 <Button variant="primary" className="md:group-hover:scale-105 transition-all w-full md:w-auto px-10 h-12 md:h-14 shadow-lg shadow-brand-purple/20 font-bold bg-brand-purple mt-2 md:mt-0">
                    Initialize Sim
                 </Button>
              </Card>
            ))}
         </div>
      </div>
    );
  }

  if (view === 'simulation' && activeExp) {
    return (
      <div className="h-full flex flex-col bg-bg-light text-text-primary relative overflow-hidden">
         {/* Top Header */}
         <div className="px-4 md:px-8 py-4 md:py-5 border-b border-border-light flex items-center justify-between bg-white/80 backdrop-blur-xl z-[40] shadow-sm">
            <div className="flex items-center gap-4 md:gap-8">
               <div className="flex items-center gap-2">
                  <button 
                   onClick={() => setView('list')}
                   className="w-8 h-8 md:w-9 md:h-9 rounded-lg border border-border-light flex items-center justify-center hover:bg-gray-100 transition-all group bg-white shadow-sm"
                  >
                     <ArrowLeft className="w-3.5 h-3.5 text-text-secondary group-hover:text-text-primary" />
                  </button>
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-brand-purple/5 border border-brand-purple/10 flex items-center justify-center">
                    <img src="/image.png" alt="Logo" className="w-6 h-auto" />
                  </div>
               </div>
               <div className="min-w-0 border-l border-border-light pl-4 md:pl-8">
                  <h2 className="text-xs md:text-sm font-display font-bold uppercase tracking-[0.2em] text-text-primary truncate">{activeExp.name}</h2>
                  <div className="flex items-center gap-2 md:gap-4 text-[7px] md:text-[8px] font-bold text-text-secondary/60">
                     <span className="flex items-center gap-1 uppercase shrink-0 px-1.5 py-0.5 rounded-md bg-gray-100"><Terminal className="w-2.5 h-2.5" /> SEQ_{activeExp.id.toUpperCase().slice(0, 4)}</span>
                     <span className="flex items-center gap-1 text-emerald-600 uppercase tracking-widest shrink-0"><Activity className="w-2.5 h-2.5" /> System Stable</span>
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn("gap-2 font-bold uppercase tracking-widest text-[8px] md:text-[9px] h-8 md:h-9", isAssistantOpen ? "text-brand-purple bg-brand-purple/5" : "text-text-secondary")}
                  onClick={() => setIsAssistantOpen(!isAssistantOpen)}
                >
                   <Brain className="w-3 h-3 md:w-3.5 md:h-3.5" /> <span className="hidden sm:inline">AI Assistant</span>
                </Button>
                <div className="h-5 md:h-6 w-px bg-border-light hidden md:block" />
                <Button variant="ghost" size="sm" className="w-8 h-8 md:w-9 md:h-9 p-0 rounded-lg border border-border-light bg-white hover:bg-gray-50 shadow-sm" onClick={() => setView('hub')}>
                   <X className="w-3.5 h-3.5 text-text-secondary" />
                </Button>
            </div>
         </div>

         {/* Simulation Immersive Layout */}
         <div className="flex-1 flex flex-col min-h-0 relative bg-gray-50/50 overflow-hidden">
            {/* Main Lab Canvas Area */}
            <div className={cn(
              "flex-1 flex flex-col transition-all duration-500 ease-in-out p-4 md:p-8 lg:p-10",
              isAssistantOpen ? "lg:mr-[450px]" : "mr-0"
            )}>
               <div className="flex-1 rounded-3xl md:rounded-[3.5rem] border-2 border-white/50 bg-white overflow-hidden relative shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] ring-1 ring-black/5 flex flex-col">
                  <div className="flex-1 relative">
                    {renderSimulation()}
                  </div>
                  
                  {/* Bottom Results Integrated Console */}
                  <AnimatePresence>
                    {captureHistory.length > 0 && (
                       <motion.div 
                         initial={{ y: 20, opacity: 0 }}
                         animate={{ y: 0, opacity: 1 }}
                         className="border-t border-border-light bg-white/80 backdrop-blur-md p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                       >
                          <div className="flex items-center gap-4 md:gap-8">
                             <div className="flex flex-col">
                                <span className="text-[8px] md:text-[10px] uppercase font-bold text-text-secondary/40 tracking-[0.2em] mb-1">Live Telemetry</span>
                                <span className="text-[10px] md:text-xs font-bold text-brand-purple uppercase tracking-widest">Data Stream Active</span>
                             </div>
                             <div className="h-8 w-px bg-border-light" />
                             <div className="flex flex-wrap gap-6 md:gap-10">
                                {Object.entries(captureHistory[captureHistory.length - 1]).filter(([k]) => k !== 'timestamp' && k !== 'endpoint').map(([key, val]) => (
                                  <div key={key} className="flex flex-col">
                                     <span className="text-[8px] md:text-[9px] uppercase font-bold text-text-secondary/30 tracking-wider mb-0.5">{key}</span>
                                     <span className="text-xs md:text-base font-display font-bold text-text-primary">{val as any}</span>
                                   </div>
                                ))}
                             </div>
                          </div>
                          <Button variant="outline" size="sm" className="text-brand-purple border-brand-purple/20 gap-2 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-brand-purple/5 px-6 rounded-xl h-10">
                             Download Dataset <ChevronRight className="w-3 h-3" />
                          </Button>
                       </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </div>

            {/* RIGHT: Steps & AI */}
            <AnimatePresence>
              {isAssistantOpen && (
                <motion.div 
                  initial={{ x: 400 }}
                  animate={{ x: 0 }}
                  exit={{ x: 400 }}
                  className="fixed inset-y-0 right-0 w-full sm:w-[320px] md:w-[380px] border-l border-border-light p-4 md:p-6 flex flex-col bg-white z-[50] overflow-y-auto custom-scrollbar shadow-[-20px_0_40px_rgba(0,0,0,0.05)]"
                >
                   <div className="space-y-6 md:space-y-8">
                      <div>
                         <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-brand-purple">
                               <Brain className="w-4 h-4 md:w-5 md:h-5" />
                               <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]">AI Lab Partner</span>
                            </div>
                            <Button variant="ghost" size="sm" className="md:hidden border border-border-light w-7 h-7 p-0 rounded-lg" onClick={() => setIsAssistantOpen(false)}>
                               <X className="w-3.5 h-3.5 text-text-secondary" />
                            </Button>
                         </div>
                         <div className="p-4 rounded-xl bg-gray-50 border border-border-light text-[10px] md:text-xs leading-relaxed italic text-text-secondary font-medium shadow-sm">
                            "I've optimized the {activeExp.name} module for your DNA profile. Follow the steps precisely."
                         </div>
                      </div>

                      <div className="space-y-4 md:space-y-6">
                         <div className="flex items-center gap-2 px-2">
                            <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4 text-text-secondary/40" />
                            <h4 className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-text-secondary font-bold">Procedure Steps</h4>
                         </div>
                         <div className="space-y-2 md:space-y-3">
                            {activeExp.instructions.map((step, i) => (
                              <div key={i} className={cn(
                                "flex gap-3 group p-3 md:p-4 rounded-xl transition-all border shadow-sm",
                                activeStep === i ? "bg-white border-brand-purple/30 shadow-md ring-1 ring-brand-purple/5" : "bg-gray-50/50 border-transparent hover:bg-white hover:border-gray-200"
                              )}>
                                 <div className={cn(
                                   "w-5 h-5 md:w-6 md:h-6 rounded-lg border flex items-center justify-center font-bold text-[9px] md:text-[10px] shrink-0 transition-all shadow-sm",
                                   activeStep === i ? "bg-brand-purple border-brand-purple text-white" : "bg-white border-border-light text-text-secondary/40"
                                 )}>
                                    {i + 1}
                                 </div>
                                 <p className={cn(
                                   "text-[10px] md:text-[12px] leading-relaxed transition-colors font-medium",
                                   activeStep === i ? "text-text-primary" : "text-text-secondary"
                                 )}>{step}</p>
                              </div>
                            ))}
                         </div>
                         
                         {activeStep < activeExp.instructions.length - 1 && (
                           <Button 
                            variant="secondary" 
                            size="sm" 
                            className="w-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest h-10 md:h-12 border-gray-200 hover:border-brand-purple/40 hover:text-brand-purple rounded-xl shadow-sm"
                            onClick={() => setActiveStep(prev => prev + 1)}
                           >
                              Next Step ({activeStep + 1})
                           </Button>
                         )}
                      </div>

                      <Card className="p-6 md:p-8 bg-brand-pink/5 border-brand-pink/10 space-y-4 md:space-y-5 rounded-2xl md:rounded-3xl shadow-sm">
                         <Heading as="h4" className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-brand-pink font-bold">Lab Note</Heading>
                         <div className="flex items-start gap-3 md:gap-4">
                            <AlertCircle className="w-4 h-4 text-brand-pink shrink-0 mt-0.5" />
                            <p className="text-[10px] md:text-[11px] text-text-secondary leading-relaxed font-bold">
                               Data captures are synced to your DNA profile. Focus tracks against your 'Velocity'.
                            </p>
                         </div>
                      </Card>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
         </div>

         {/* Background Subtle Accents */}
         <div className="fixed top-0 right-0 w-[1000px] h-[1000px] bg-brand-pink/5 rounded-full blur-[200px] -z-10 pointer-events-none" />
         <div className="fixed bottom-0 left-0 w-[800px] h-[800px] bg-brand-purple/5 rounded-full blur-[180px] -z-10 pointer-events-none" />
      </div>
    );
  }

  return null;
};
