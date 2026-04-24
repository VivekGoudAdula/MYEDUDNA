import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  ChevronDown, 
  ChevronRight, 
  Play, 
  FileText, 
  Code, 
  CheckCircle2, 
  Target,
  Rocket,
  Lock,
  Compass,
  Zap,
  Star,
  Search,
  BookOpen,
  Trophy,
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Layers,
  Clock,
  Youtube,
  Library,
  Lightbulb,
  CheckCircle,
  XCircle,
  BarChart3
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Heading, Text, Metric } from '../DesignSystem/Typography';
import { Button } from '../DesignSystem/Button';
import { Card } from '../DesignSystem/Card';
import { Input } from '../DesignSystem/Input';
import { PageTransition } from '../DesignSystem/Transitions';
import { CourseView } from '../Course/CourseView';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'quiz' | 'lab';
  duration: string;
  completed: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: Lesson[];
  progress: number;
}

interface Phase {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  modules: Module[];
}

interface RoadmapData {
  title: string;
  goal: string;
  level: string;
  phases: Phase[];
}

// Mock AI Generator logic
const generateRoadmap = (subject: string, goal: string, level: string): RoadmapData => {
  return {
    title: subject,
    goal,
    level,
    phases: [
      {
        id: 'p1',
        title: 'Phase 1: Fundamentals',
        subtitle: `Building the atomic foundation of ${subject}`,
        icon: Library,
        modules: [
          {
            id: 'm1',
            title: `Intro to ${subject}`,
            description: `Core concepts and history of ${subject} in the modern era.`,
            duration: '4 hours',
            progress: 0,
            lessons: [
              { id: 'l1', title: 'The Neural Linkage', type: 'video', duration: '12m', completed: false },
              { id: 'l2', title: 'First Principles', type: 'reading', duration: '8m', completed: false },
              { id: 'l3', title: 'Baselining Quiz', type: 'quiz', duration: '5m', completed: false },
            ]
          },
          {
            id: 'm2',
            title: 'Foundational Mechanics',
            description: 'The math and logic behind the systems.',
            duration: '6 hours',
            progress: 0,
            lessons: [
              { id: 'l4', title: 'Logic Gates v2.0', type: 'video', duration: '22m', completed: false },
              { id: 'l5', title: 'System Constraints', type: 'lab', duration: '15m', completed: false },
            ]
          }
        ]
      },
      {
        id: 'p2',
        title: 'Phase 2: Core Skills',
        subtitle: 'Practical application and architectural patterns',
        icon: Layers,
        modules: [
          {
            id: 'm3',
            title: 'Advanced Implementation',
            description: 'Scaling concepts to real-world applications.',
            duration: '12 hours',
            progress: 0,
            lessons: [
              { id: 'l6', title: 'Scaling Laws', type: 'video', duration: '35m', completed: false }
            ]
          }
        ]
      },
      {
        id: 'p3',
        title: 'Phase 3: Advanced Mastery',
        subtitle: 'Portfolio projects and industrial scaling',
        icon: Rocket,
        modules: [
          {
            id: 'm4',
            title: 'The Final Synthesis',
            description: 'Building a production-ready system.',
            duration: '20 hours',
            progress: 0,
            lessons: [
              { id: 'l7', title: 'Final Review', type: 'quiz', duration: '20m', completed: false }
            ]
          }
        ]
      }
    ]
  };
};

export const CareerRoadmap = () => {
  const [view, setView] = useState<'generator' | 'roadmap' | 'course'>('generator');
  const [formData, setFormData] = useState({ subject: '', goal: '', level: 'Beginner' });
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [expandedPhase, setExpandedPhase] = useState<string | null>('p1');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setRoadmap(generateRoadmap(formData.subject, formData.goal, formData.level));
      setView('roadmap');
      setIsGenerating(false);
    }, 2500);
  };

  const openCourse = (phase: Phase, module: Module) => {
    setSelectedPhase(phase);
    setSelectedModule(module);
    setView('course');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (view === 'generator') {
    return (
      <div className="max-w-xl mx-auto py-20 px-6 space-y-12">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 rounded-3xl bg-gradient-premium flex items-center justify-center mx-auto shadow-xl shadow-brand-pink/20"
          >
            <Sparkles className="text-white w-10 h-10" />
          </motion.div>
          <Heading as="h1" className="text-text-primary">Forge Your <span className="text-gradient">Path</span></Heading>
          <Text className="text-text-secondary">Tell us where you want to go. Our AI will synthesize a custom educational DNA strand for you.</Text>
        </div>

        <Card className="p-8 space-y-8 bg-white border-border-light shadow-xl">
           <div className="space-y-6">
              <Input 
                label="Learning Objective" 
                placeholder="e.g. Quantum Computing, AI Ethics, Fine Arts"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              />
              <Input 
                label="Ultimate Goal" 
                placeholder="e.g. Become a Lead Architect, Pass AWS Exam"
                value={formData.goal}
                onChange={(e) => setFormData({...formData, goal: e.target.value})}
              />
              <div className="space-y-3">
                 <label className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Experience Level</label>
                 <div className="grid grid-cols-2 gap-4">
                    {['Beginner', 'Intermediate'].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setFormData({...formData, level: lvl})}
                        className={cn(
                          "py-3 rounded-2xl border transition-all text-sm font-bold",
                          formData.level === lvl 
                            ? "bg-brand-pink/5 border-brand-pink text-brand-pink shadow-md" 
                            : "bg-gray-50 border-gray-100 text-text-secondary hover:border-gray-200"
                        )}
                      >
                        {lvl}
                      </button>
                    ))}
                 </div>
              </div>
           </div>

           <Button 
             variant="primary" 
             className="w-full h-16 text-lg group shadow-xl shadow-brand-pink/20"
             onClick={handleGenerate}
             disabled={!formData.subject || isGenerating}
           >
             {isGenerating ? (
               <div className="flex items-center gap-3">
                 <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                 Synthesizing DNA...
               </div>
             ) : (
               <>
                 Generate Neural Roadmap
                 <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </>
             )}
           </Button>
        </Card>
      </div>
    );
  }

  if (view === 'roadmap' && roadmap) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 text-text-secondary hover:text-text-primary"
              onClick={() => setView('generator')}
            >
              <ArrowLeft className="w-4 h-4" /> Change Path
            </Button>
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 rounded-2xl bg-brand-pink/5 flex items-center justify-center border border-brand-pink/10 shadow-sm">
                  <GraduationCap className="w-8 h-8 text-brand-pink" />
               </div>
                <div>
                  <Heading as="h1" className="text-text-primary">{roadmap.title} <span className="text-gradient font-bold">Mastery</span></Heading>
                  <Text className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/60 mt-1">{roadmap.level} • {roadmap.goal}</Text>
               </div>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-white rounded-3xl border border-border-light shadow-md flex items-center gap-6">
             <div className="flex flex-col">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Global Progress</span>
                <span className="text-xl font-bold font-mono text-text-primary">0%</span>
             </div>
             <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <div className="h-full w-0 bg-gradient-premium" />
             </div>
          </div>
        </div>

        <div className="space-y-12">
          {roadmap.phases.map((phase, pIdx) => (
            <div key={phase.id} className="space-y-6">
              {/* Phase Header (Accordion Style) */}
              <button 
                onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                className={cn(
                  "w-full flex items-center justify-between p-6 rounded-[2rem] border transition-all text-left group",
                  expandedPhase === phase.id ? "bg-white border-brand-pink/20 shadow-lg" : "bg-gray-50/50 border-border-light hover:bg-white"
                )}
              >
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-all",
                    expandedPhase === phase.id ? "bg-brand-pink text-white scale-110" : "bg-white text-text-secondary"
                  )}>
                    <phase.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text-primary group-hover:text-brand-pink transition-colors">{phase.title}</h3>
                    <p className="text-xs text-text-secondary font-medium">{phase.subtitle}</p>
                  </div>
                </div>
                <div className={cn("transition-transform duration-300", expandedPhase === phase.id ? "rotate-180" : "")}>
                  <ChevronDown className="w-6 h-6 text-text-secondary" />
                </div>
              </button>

              <AnimatePresence>
                {expandedPhase === phase.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pl-4 pr-4 pb-4">
                      {phase.modules.map((module) => (
                        <Card 
                          key={module.id}
                          className="group hover:shadow-2xl transition-all cursor-pointer p-8 bg-white border-border-light flex flex-col justify-between"
                          onClick={() => openCourse(phase, module)}
                        >
                          <div>
                            <div className="flex items-center gap-4 mb-6">
                              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:border-brand-pink/30 group-hover:bg-white transition-all shadow-sm">
                                <BookOpen className="w-6 h-6 text-text-secondary group-hover:text-brand-pink transition-colors" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-text-primary text-base group-hover:text-brand-pink transition-colors">{module.title}</h4>
                                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-[0.2em]">{module.duration}</p>
                              </div>
                            </div>
                            <Text className="text-sm line-clamp-3 mb-6 text-text-secondary group-hover:text-text-primary transition-colors">{module.description}</Text>
                          </div>
                          
                          <div className="pt-6 border-t border-border-light flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-gray-200" />
                              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">{module.lessons.length} lessons</span>
                            </div>
                            <Button variant="ghost" size="sm" className="h-9 px-5 text-[10px] font-bold text-brand-pink group-hover:bg-brand-pink group-hover:text-white rounded-xl">
                              OPEN COURSE
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'course' && selectedModule && selectedPhase) {
    return (
      <CourseView 
        courseTitle={selectedModule.title}
        phaseTitle={selectedPhase.title}
        description={selectedModule.description}
        lessons={selectedModule.lessons}
        onBack={() => setView('roadmap')}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 space-y-12 pb-32">
      {/* Fallback View */}
      <div className="text-center py-20 bg-white rounded-[3rem] border border-border-light shadow-xl">
        <div className="w-24 h-24 rounded-full bg-brand-pink/5 flex items-center justify-center mx-auto mb-8 border border-brand-pink/10 shadow-sm">
          <Rocket className="w-12 h-12 text-brand-pink animate-pulse" />
        </div>
        <Heading as="h2" className="text-text-primary mb-4">Initializing <span className="text-gradient">Trajectory</span></Heading>
        <Text className="text-text-secondary max-w-md mx-auto">Please generate your DNA-linked roadmap to continue your hyper-personalized learning journey.</Text>
        <Button variant="primary" size="lg" className="mt-10 px-12 h-16 shadow-xl shadow-brand-pink/20 font-bold" onClick={() => setView('generator')}>Start Generator</Button>
      </div>
    </div>
  );
};
