import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Brain, 
  Sparkles,
  RotateCcw,
  Zap,
  Target,
  Dna,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Heading, Text, Metric } from '../DesignSystem/Typography';
import { Button } from '../DesignSystem/Button';
import { Card } from '../DesignSystem/Card';
import { PageTransition } from '../DesignSystem/Transitions';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  topic: string;
  category: 'logic' | 'memory' | 'conceptual' | 'practical';
}

const questionsPool: Record<'School' | 'Undergraduate', Question[]> = {
  School: [
    { id: 1, question: "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies.", options: ["True", "False"], correctAnswer: 0, topic: "Logical Reasoning", category: 'logic' },
    { id: 2, question: "What is the primary function of Mitochondria in a cell?", options: ["Protein synthesis", "Energy production (ATP)", "Waste disposal", "DNA replication"], correctAnswer: 1, topic: "Biology", category: 'conceptual' },
    { id: 3, question: "Which of these is a prime number?", options: ["15", "21", "29", "33"], correctAnswer: 2, topic: "Mathematics", category: 'logic' },
    { id: 4, question: "Read this: 7 3 9 1 5. What was the second number?", options: ["9", "3", "1", "5"], correctAnswer: 1, topic: "Memory", category: 'memory' },
    { id: 5, question: "If you heat ice, it turns into water. This is a:", options: ["Chemical change", "Physical change", "Nuclear change", "Biological change"], correctAnswer: 1, topic: "Physics", category: 'conceptual' },
    { id: 6, question: "Which shape has the most sides?", options: ["Hexagon", "Pentagon", "Octagon", "Heptagon"], correctAnswer: 2, topic: "Geometry", category: 'conceptual' },
    { id: 7, question: "Complete the pattern: 2, 4, 8, 16, ?", options: ["24", "30", "32", "64"], correctAnswer: 2, topic: "Pattern Recognition", category: 'logic' },
    { id: 8, question: "Who is known as the father of modern computers?", options: ["Newton", "Einstein", "Alan Turing", "Darwin"], correctAnswer: 2, topic: "Computer Science", category: 'memory' },
    { id: 9, question: "Which of these is used to measure electric current?", options: ["Voltmeter", "Ammeter", "Thermometer", "Barometer"], correctAnswer: 1, topic: "Physics", category: 'practical' },
    { id: 10, question: "If today is Monday, what day was it 3 days ago?", options: ["Friday", "Saturday", "Sunday", "Thursday"], correctAnswer: 0, topic: "Time Logic", category: 'logic' },
  ],
  Undergraduate: [
    { id: 1, question: "Which data structure uses LIFO (Last In First Out)?", options: ["Queue", "Stack", "Linked List", "Tree"], correctAnswer: 1, topic: "Data Structures", category: 'logic' },
    { id: 2, question: "What is the time complexity of binary search?", options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"], correctAnswer: 2, topic: "Algorithms", category: 'logic' },
    { id: 3, question: "In thermodynamics, the second law states that entropy of an isolated system always:", options: ["Decreases", "Increases", "Stays constant", "Becomes zero"], correctAnswer: 1, topic: "Thermodynamics", category: 'conceptual' },
    { id: 4, question: "Which of these is not a characteristic of OOP?", options: ["Encapsulation", "Polymorphism", "Recursion", "Inheritance"], correctAnswer: 2, topic: "Software Engineering", category: 'conceptual' },
    { id: 5, question: "Remember these words: Neural, Quantum, Ethics, Sync. Which word was third?", options: ["Neural", "Quantum", "Ethics", "Sync"], correctAnswer: 2, topic: "Memory", category: 'memory' },
    { id: 6, question: "Which protocol is used for secure communication over the internet?", options: ["HTTP", "FTP", "HTTPS", "SMTP"], correctAnswer: 2, topic: "Networking", category: 'practical' },
    { id: 7, question: "What is the result of 10-bit binary 1010101010 in decimal?", options: ["512", "682", "1024", "256"], correctAnswer: 1, topic: "Binary Logic", category: 'logic' },
    { id: 8, question: "Which cloud service model provides a virtualized computing environment?", options: ["SaaS", "PaaS", "IaaS", "BaaS"], correctAnswer: 2, topic: "Cloud Computing", category: 'practical' },
    { id: 9, question: "Integrate x^2 from 0 to 1:", options: ["1/2", "1/3", "1", "2"], correctAnswer: 1, topic: "Calculus", category: 'logic' },
    { id: 10, question: "What is the main advantage of a NoSQL database?", options: ["Fixed schema", "Scalability", "ACID compliance", "SQL support"], correctAnswer: 1, topic: "Databases", category: 'conceptual' },
  ]
};

export const QuizInterface = ({ 
  onComplete, 
  userLevel = 'Undergraduate' 
}: { 
  onComplete: (results?: any) => void, 
  userLevel?: 'School' | 'Undergraduate' 
}) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'active' | 'analyzing' | 'results'>('intro');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(7);
  const [resultsByCategory, setResultsByCategory] = useState<Record<string, { correct: number, total: number }>>({});

  const mockQuestions = questionsPool[userLevel as keyof typeof questionsPool] || questionsPool.Undergraduate;
  const currentQuestion = mockQuestions[currentQuestionIdx];

  // Timer logic
  useEffect(() => {
    let timer: any;
    if (currentStep === 'active' && !isAnswered && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswer(-1); // Time out
    }
    return () => clearInterval(timer);
  }, [currentStep, isAnswered, timeLeft]);

  const handleStart = () => {
    setCurrentStep('active');
    setTimeLeft(7);
  };

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQuestion.correctAnswer;
    if (isCorrect) setScore((s) => s + 1);

    // Update category stats
    setResultsByCategory((prev) => {
      const category = currentQuestion.category;
      const current = prev[category] || { correct: 0, total: 0 };
      return {
        ...prev,
        [category]: {
          correct: current.correct + (isCorrect ? 1 : 0),
          total: current.total + 1
        }
      };
    });
  };

  const handleNext = () => {
    if (currentQuestionIdx < mockQuestions.length - 1) {
      setCurrentQuestionIdx((idx) => idx + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(7);
    } else {
      setCurrentStep('analyzing');
      setTimeout(() => {
        setCurrentStep('results');
      }, 3000);
    }
  };

  if (currentStep === 'intro') {
    return (
      <div className="max-w-2xl mx-auto py-20 px-6">
        <PageTransition>
          <Card className="text-center p-12 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-premium" />
            <div className="w-20 h-20 rounded-full bg-brand-pink/10 flex items-center justify-center mx-auto border border-brand-pink/20">
              <Dna className="w-10 h-10 text-brand-pink animate-pulse" />
            </div>
            <div className="space-y-4">
              <Heading as="h1" className="text-4xl md:text-5xl font-bold">Start Your <span className="text-gradient">DNA Mapping</span></Heading>
              <Text className="text-lg text-text-secondary">
                This assessment analyzes your cognitive strengths, learning style, and synchronization rate.
              </Text>
            </div>
            <div className="grid grid-cols-2 gap-4 text-left pt-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-border-light flex items-center gap-3">
                <Target className="w-5 h-5 text-brand-pink" />
                <div>
                  <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">Type</p>
                  <p className="text-sm font-semibold text-text-primary">{userLevel} Assessment</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-border-light flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-brand-purple" />
                <div>
                  <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">Format</p>
                  <p className="text-sm font-semibold text-text-primary">10 Adaptive Tasks</p>
                </div>
              </div>
            </div>
            <Button variant="primary" className="w-full py-4 text-lg" onClick={handleStart}>
              Initialize Mapping
            </Button>
          </Card>
        </PageTransition>
      </div>
    );
  }

  if (currentStep === 'analyzing') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-xl">
        <div className="text-center space-y-8">
           <motion.div 
             animate={{ 
               scale: [1, 1.2, 1],
               rotate: [0, 180, 360],
             }}
             transition={{ duration: 2, repeat: Infinity }}
             className="w-24 h-24 rounded-full border-4 border-t-brand-pink border-gray-100 mx-auto"
           />
           <div className="space-y-2">
              <Heading as="h2" className="text-2xl animate-pulse">Analyzing Your <span className="text-gradient">Learning DNA</span></Heading>
              <Text className="text-text-secondary font-mono text-xs uppercase tracking-[0.5em]">Synchronizing Cognitive Clusters...</Text>
           </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'active') {
    const progress = ((currentQuestionIdx + 1) / mockQuestions.length) * 100;

    return (
      <div className="max-w-3xl mx-auto py-12 px-6">
        <PageTransition>
          <div className="space-y-8">
            {/* Header Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center border border-border-light">
                    <span className="text-brand-pink font-bold font-mono">{currentQuestionIdx + 1}/{mockQuestions.length}</span>
                 </div>
                 <div>
                    <h4 className="text-text-primary font-bold text-sm tracking-wide uppercase">{currentQuestion.topic}</h4>
                    <p className="text-xs text-text-secondary">Task Node: {currentQuestionIdx + 1}</p>
                 </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-border-light shadow-sm">
                 <Clock className="w-4 h-4 text-brand-pink" />
                 <span className={cn(
                   "font-mono font-bold w-6",
                   timeLeft <= 5 ? "text-rose-500 animate-bounce" : "text-text-primary"
                 )}>
                   {timeLeft}s
                 </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-premium shadow-[0_0_10px_rgba(255,45,85,0.2)]"
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="p-8 md:p-12 space-y-12 min-h-[400px]">
                  <Heading as="h2" className="text-2xl md:text-3xl leading-snug">
                    {currentQuestion.question}
                  </Heading>

                  <div className="grid grid-cols-1 gap-4">
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = selectedAnswer === idx;
                      
                      let bgStyle = "bg-gray-50 hover:bg-gray-100 border-border-light text-text-primary";
                      if (isAnswered) {
                        const isCorrect = idx === currentQuestion.correctAnswer;
                        if (isCorrect) bgStyle = "bg-emerald-50 border-emerald-200 text-emerald-700";
                        else if (isSelected) bgStyle = "bg-rose-50 border-rose-200 text-rose-700";
                        else bgStyle = "opacity-40 grayscale";
                      } else if (isSelected) {
                        bgStyle = "bg-brand-pink/5 border-brand-pink/30 text-brand-pink";
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isAnswered}
                          onClick={() => handleAnswer(idx)}
                          className={cn(
                            "w-full text-left p-6 rounded-2xl border transition-all flex items-center justify-between group",
                            bgStyle
                          )}
                        >
                          <span className="text-lg font-medium">{option}</span>
                          {!isAnswered && <div className="w-5 h-5 rounded-full border border-gray-300 group-hover:border-brand-pink/50 transition-colors" />}
                        </button>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end pt-4"
                >
                  <Button variant="primary" size="lg" className="px-10 h-16 group shadow-premium" onClick={handleNext}>
                    {currentQuestionIdx < mockQuestions.length - 1 ? 'Next Step' : 'Finalize DNA'}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </PageTransition>
      </div>
    );
  }

  // Results / AI Analysis view
  const logicScore = resultsByCategory.logic?.correct || 0;
  const memoryScore = resultsByCategory.memory?.correct || 0;
  const conceptualScore = resultsByCategory.conceptual?.correct || 0;
  const practicalScore = resultsByCategory.practical?.correct || 0;

  const getLearningStyle = () => {
    if (practicalScore > conceptualScore) return 'Practical / Hands-on';
    if (conceptualScore > logicScore) return 'Theoretical / Conceptual';
    return 'Logical / Analytical';
  };

  const getStrengths = () => {
    const list = [];
    if (logicScore > 2) list.push('Logical Reasoning');
    if (memoryScore > 0) list.push('Rapid Information Recall');
    if (conceptualScore > 2) list.push('Abstract Problem Solving');
    if (list.length === 0) return ['Cross-Disciplinary Potential'];
    return list;
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 space-y-8">
      <PageTransition>
        <div className="text-center space-y-6 mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 rounded-xl bg-gradient-premium flex items-center justify-center mx-auto border border-white/10 shadow-[0_0_30px_rgba(255,45,85,0.4)]"
          >
            <Zap className="text-white w-10 h-10" />
          </motion.div>
          <div className="space-y-2">
            <Heading as="h1">Learning <span className="text-gradient">DNA Profile</span> Generated</Heading>
            <Text className="text-text-secondary font-mono text-xs uppercase tracking-widest">Calibration Level Index: 4.8.21</Text>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Visuals Card */}
          <Card className="lg:col-span-2 space-y-12 p-10">
             <div className="flex items-center justify-between">
                <div>
                   <Heading as="h3">Cognitive <span className="text-gradient">Signature</span></Heading>
                   <Text className="text-xs text-text-secondary">Neural alignment across primary nodes</Text>
                </div>
                <div className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                   <span className="text-emerald-600 text-xs font-bold font-mono">STATUS: SYNCED</span>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Stats Gauges */}
                <div className="space-y-8">
                   {[
                     { label: 'Logic & Reasoning', val: logicScore, max: 4, color: 'brand-pink' },
                     { label: 'Conceptual Clarity', val: conceptualScore, max: 3, color: 'brand-purple' },
                     { label: 'Practical Application', val: practicalScore, max: 2, color: 'emerald-400' },
                   ].map((stat) => (
                     <div key={stat.label} className="space-y-3">
                        <div className="flex justify-between items-end">
                           <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">{stat.label}</span>
                           <span className="text-sm font-bold text-text-primary font-mono">{Math.round((stat.val / stat.max) * 100)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${(stat.val / stat.max) * 100}%` }}
                             transition={{ duration: 1.5, ease: "easeOut" }}
                             className={cn("h-full rounded-full", stat.color === 'emerald-400' ? "bg-emerald-400" : `bg-${stat.color}`)}
                           />
                        </div>
                     </div>
                   ))}
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-border-light flex flex-col items-center justify-center text-center space-y-4">
                   <div className="w-16 h-16 rounded-full bg-brand-pink/10 flex items-center justify-center border border-brand-pink/20">
                      <Target className="w-8 h-8 text-brand-pink animate-pulse" />
                   </div>
                   <div>
                      <h4 className="font-bold text-text-secondary uppercase text-xs tracking-widest mb-1">Learning Style</h4>
                      <p className="text-xl font-display font-semibold text-gradient">{getLearningStyle()}</p>
                   </div>
                </div>
             </div>
          </Card>

          {/* AI Insights Card */}
          <Card className="flex flex-col space-y-8 p-10">
             <div className="flex items-center gap-3">
                <Brain className="w-6 h-6 text-brand-purple" />
                <Heading as="h4">Core Strengths</Heading>
             </div>
             
             <div className="space-y-4 flex-1">
                {getStrengths().map((strength) => (
                   <div key={strength} className="p-4 rounded-xl border border-border-light bg-gray-50 flex items-center gap-3 group hover:border-brand-purple/30 transition-all">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-sm font-medium text-text-primary">{strength}</span>
                   </div>
                ))}
             </div>

             <div className="pt-6 border-t border-border-light space-y-4">
                <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.3em]">Growth Vector</h4>
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-100">
                   <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-3 h-3 text-rose-500" />
                      <span className="text-[10px] font-bold text-rose-500 uppercase">Attention Required</span>
                   </div>
                   <p className="text-xs text-text-secondary leading-relaxed font-medium">Memory node indexing showing slight lag. Recommend mnemonic-based learning tracks.</p>
                </div>
             </div>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 pt-12 items-center justify-center">
           <div className="flex gap-2">
              <Button variant="outline" className="gap-2 px-8" onClick={() => {
                setCurrentStep('intro');
                setCurrentQuestionIdx(0);
                setScore(0);
                setResultsByCategory({});
              }}>
                <RotateCcw className="w-4 h-4" /> Recalibrate DNA
              </Button>
           </div>
           <Button 
             variant="primary" 
             className="gap-2 px-12 py-5 text-lg shadow-premium" 
             onClick={() => onComplete({
               accuracy: Math.round((score / mockQuestions.length) * 100),
               score,
               categories: resultsByCategory,
               learningStyle: getLearningStyle(),
               strengths: getStrengths()
             })}
           >
             Initialize Dashboard <ArrowRight className="w-5 h-5" />
           </Button>
        </div>
      </PageTransition>
    </div>
  );
};
