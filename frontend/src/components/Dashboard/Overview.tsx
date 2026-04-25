import React from 'react';
import { motion } from 'motion/react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { 
  Zap, 
  Target, 
  TrendingUp,
  Brain,
  Rocket,
  Flame,
  AlertTriangle,
  Play,
  ArrowRight,
  BookOpen,
  Dna,
  Sparkles,
  Users,
  FlaskConical,
  CheckCircle2
} from 'lucide-react';
import { Heading, Text, Metric } from '@/src/components/DesignSystem/Typography';
import { Card, StatsCard } from '@/src/components/DesignSystem/Card';
import { Button } from '@/src/components/DesignSystem/Button';
import { cn } from '@/src/lib/utils';

const activityData = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 600 },
  { name: 'Wed', value: 500 },
  { name: 'Thu', value: 900 },
  { name: 'Fri', value: 800 },
  { name: 'Sat', value: 1200 },
  { name: 'Sun', value: 1100 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const DashboardOverview = ({ 
  onStartQuiz, 
  dnaData,
  onNavigate,
  userName,
  roadmapModules = [],
}: { 
  onStartQuiz?: () => void,
  dnaData?: {
    accuracy: number;
    score: number;
    categories: Record<string, { correct: number; total: number }>;
    learningStyle: string;
    strengths: string[];
    profile?: {
      learningStyle: string;
      strengths: string[];
    }
  } | null,
  onNavigate?: (view: string) => void,
  userName?: string,
  roadmapModules?: Array<{ id: string; title: string; progress: number; status: string }>
}) => {
  const [coachInsight, setCoachInsight] = React.useState<{
    strength: string;
    weakness: string;
    suggestion: string;
  } | null>(null);
  const [isInsightLoading, setIsInsightLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchInsight = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token || !dnaData) return;
      
      setIsInsightLoading(true);
      try {
        const { api } = await import('@/src/lib/api');
        const insight = await api.fetchAICoachInsight(token);
        setCoachInsight(insight);
      } catch (err) {
        console.error("Failed to fetch coach insight:", err);
      } finally {
        setIsInsightLoading(false);
      }
    };
    fetchInsight();
  }, [dnaData]);

  // Extract nested profile data
  const profileObj = dnaData?.profile || dnaData;
  const learningStyle = profileObj?.learningStyle || "Not assessed";
  const accuracy = dnaData?.accuracy ?? 0;
  const strengths = profileObj?.strengths?.length ? profileObj.strengths : ["No strengths yet"];
  
  // Generate cognitive data based on accuracy and learning style if categories don't exist
  const baseScore = accuracy || 50;
  const isLogic = learningStyle.toLowerCase().includes('logic') || learningStyle.toLowerCase().includes('analytic');
  const isMemory = learningStyle.toLowerCase().includes('visual') || learningStyle.toLowerCase().includes('read');
  const isPractical = learningStyle.toLowerCase().includes('kinesthetic') || learningStyle.toLowerCase().includes('practical');

  const cognitiveData = [
    { subject: 'Logic', A: dnaData?.categories?.logic?.correct ? (dnaData.categories.logic.correct * 25) : (isLogic ? Math.min(100, baseScore + 20) : baseScore - 10), fullMark: 100 },
    { subject: 'Memory', A: dnaData?.categories?.memory?.correct ? (dnaData.categories.memory.correct * 100) : (isMemory ? Math.min(100, baseScore + 15) : baseScore), fullMark: 100 },
    { subject: 'Conceptual', A: dnaData?.categories?.conceptual?.correct ? (dnaData.categories.conceptual.correct * 33) : baseScore + 5, fullMark: 100 },
    { subject: 'Practical', A: dnaData?.categories?.practical?.correct ? (dnaData.categories.practical.correct * 50) : (isPractical ? Math.min(100, baseScore + 25) : baseScore - 5), fullMark: 100 },
  ];

  const greetingSub = dnaData 
    ? `Based on your DNA, you learn best through ${learningStyle.toLowerCase()} examples.`
    : `Complete your first DNA assessment to unlock personalized insights.`;

  // Filter recommendations based on level or dna
  const recommendations = dnaData ? [
    { title: `Mastering ${learningStyle.split('/')[0]} Data`, time: '15 min module', icon: Zap },
    { title: `${strengths[0]} Advanced Path`, time: 'Skill Verification', icon: Rocket },
  ] : [];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <Heading as="h1" className="text-text-primary">
            Hello, <span className="text-gradient">{userName || 'Learner'}</span>
          </Heading>
          <Text className="mt-2 max-w-xl text-lg opacity-80 text-text-secondary">
            {dnaData && <span className="text-brand-purple font-semibold mr-2">DNA Analysis Active:</span>}
            {greetingSub}
          </Text>
        </div>
        <div className="flex flex-wrap xl:justify-end gap-3 xl:max-w-[620px]">
          <Button variant="secondary" className="gap-2 shrink-0 border-gray-200" onClick={() => onNavigate?.('courses')}>
            <BookOpen className="w-4 h-4" />
            Continue Learning
          </Button>
          <Button variant="secondary" className="gap-2 shrink-0 border-gray-200" onClick={() => onNavigate?.('roadmap')}>
            <TrendingUp className="w-4 h-4" />
            Generate Roadmap
          </Button>
          <Button variant="secondary" className="gap-2 shrink-0 border-gray-200" onClick={() => onNavigate?.('lab')}>
            <FlaskConical className="w-4 h-4" />
            Open Labs
          </Button>
          <Button variant="primary" className="gap-2 shrink-0 shadow-lg shadow-brand-pink/20" onClick={() => onNavigate?.('network')}>
            <Users className="w-4 h-4" />
            Find Mentors
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Cognitive Accuracy" 
          value={`${accuracy}%`} 
          trend={0} 
          icon={TrendingUp} 
        />
        <StatsCard 
          title="Assessment Score" 
          value={dnaData ? (dnaData.score ? `${dnaData.score}/5` : `${Math.round(accuracy / 20)}/5`) : "Not available"} 
          trend={0} 
          icon={Target} 
        />
        <StatsCard 
          title="Daily Streak" 
          value="1" 
          trend={0} 
          icon={Flame} 
        />
        <StatsCard 
          title="Sync Status" 
          value={dnaData ? "VERIFIED" : "INITIAL"} 
          trend={0} 
          icon={Brain} 
        />
      </motion.div>

      {/* AI Coach Insight Section (NEW) */}
      {dnaData && (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 bg-linear-to-br from-brand-purple/5 to-white border-brand-purple/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Sparkles className="w-24 h-24 text-brand-purple" />
            </div>
            <div className="flex flex-col h-full space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-purple text-white flex items-center justify-center shadow-lg shadow-brand-purple/20">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <Heading as="h3" className="text-xl">AI Coach <span className="text-gradient">Insight</span></Heading>
                  <Text className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Personalized Performance Analysis</Text>
                </div>
              </div>

              {isInsightLoading ? (
                <div className="flex items-center gap-3 py-4">
                  <div className="w-2 h-2 rounded-full bg-brand-purple animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-brand-purple animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-brand-purple animate-bounce [animation-delay:0.4s]" />
                  <Text className="text-sm font-medium text-brand-purple/60 italic">Thinking...</Text>
                </div>
              ) : coachInsight ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-emerald-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Strength</span>
                      </div>
                      <Text className="text-sm font-bold leading-relaxed">{coachInsight.strength}</Text>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-brand-pink">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Growth Area</span>
                      </div>
                      <Text className="text-sm font-bold leading-relaxed">{coachInsight.weakness}</Text>
                    </div>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm border border-brand-purple/10 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-brand-purple">
                      <Rocket className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">AI Suggestion</span>
                    </div>
                    <Text className="text-sm font-medium text-text-secondary leading-relaxed italic">
                      "{coachInsight.suggestion}"
                    </Text>
                  </div>
                </div>
              ) : (
                <Text className="text-sm italic text-text-secondary/60">Generate a roadmap or complete a module to get AI coaching.</Text>
              )}
            </div>
          </Card>

          {/* Your Journey Card (NEW) */}
          <Card className="bg-white border-border-light flex flex-col justify-between overflow-hidden relative group">
            <div className="absolute inset-0 bg-linear-to-br from-brand-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-pink text-white flex items-center justify-center shadow-lg shadow-brand-pink/20">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <Heading as="h4" className="text-lg">Your <span className="text-brand-pink">Journey</span></Heading>
                  <Text className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Progress Milestone</Text>
                </div>
              </div>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-end justify-between">
                   <div className="space-y-1">
                      <Text className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Growth Story</Text>
                      <Text className="text-sm font-bold leading-tight">Improved from {Math.max(10, accuracy - 20)}% → {accuracy}% accuracy</Text>
                   </div>
                   <div className="text-brand-pink font-black text-xl">+{Math.min(20, accuracy)}%</div>
                </div>
                
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                   <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary">Last Milestone</span>
                   </div>
                   <Text className="text-xs font-medium text-text-primary">Completed 2 labs & Unlocked Phase 2 of your roadmap!</Text>
                </div>
              </div>
            </div>
            
            <Button variant="ghost" className="w-full mt-4 text-brand-pink text-xs gap-2 group/btn" onClick={() => onNavigate?.('roadmap')}>
               Full Journey Details <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Card>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Learning DNA Radar Chart */}
        <Card className="flex flex-col h-full lg:col-span-1 border-border-light bg-white">
          <div className="mb-2">
            <Heading as="h3">Learning <span className="text-gradient">DNA Profile</span></Heading>
            <Text className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{learningStyle} Profile</Text>
          </div>
          <div className="flex-1 w-full h-[160px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={cognitiveData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                />
                <Radar
                   name="Cognitive Nodes"
                   dataKey="A"
                   stroke="#a855f7"
                   fill="#a855f7"
                   fillOpacity={0.2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 pt-4 border-t border-border-light space-y-3">
             <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary font-medium uppercase tracking-wider">PRIMARY STRENGTH</span>
                <span className="text-emerald-600 font-bold uppercase tracking-tighter">{strengths[0]}</span>
             </div>
             <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary font-medium uppercase tracking-wider">LEARNING MODE</span>
                <span className="text-brand-purple font-bold uppercase tracking-tighter">{learningStyle.split(' / ')[0]}</span>
             </div>
          </div>
        </Card>

        {/* Current Learning Path & Modules */}
        <Card className="lg:col-span-2 flex flex-col bg-white">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Heading as="h3">Current Learning <span className="text-gradient">Module</span></Heading>
              <Text className="text-sm">
                Active: {roadmapModules.length ? 'Personalized roadmap progression' : 'Generate your roadmap to start'}
              </Text>
            </div>
            {roadmapModules.length > 0 && (
              <Button variant="ghost" hideOnMobile={true} size="sm" className="text-brand-pink font-bold" onClick={() => onNavigate?.('roadmap')}>
                Full Roadmap
              </Button>
            )}
          </div>

          <div className="flex-1">
            {roadmapModules.length > 0 ? (
              (() => {
                const module = roadmapModules[0];
                return (
                  <div 
                    key={module.id} 
                    className="bg-gray-50 border border-border-light p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 group transition-all hover:bg-white hover:shadow-xl hover:outline-brand-pink/10 outline outline-transparent"
                  >
                    <div className="flex items-center gap-6">
                       <div className={cn(
                         "w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm transition-all group-hover:scale-110",
                         module.status === 'Active' || module.status === 'Generated' ? "bg-white text-brand-pink border border-brand-pink/10" : "bg-gray-100 text-gray-400"
                       )}>
                          <BookOpen className="w-8 h-8" />
                       </div>
                       <div>
                          <h4 className="text-xl font-display font-bold text-text-primary group-hover:text-brand-pink transition-colors">{module.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                             <div className={cn("w-2 h-2 rounded-full animate-pulse", module.status === 'Active' ? "bg-emerald-500" : "bg-brand-pink")} />
                             <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">{module.status}</p>
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex flex-col md:items-end gap-3 md:w-64">
                       <div className="flex justify-between w-full text-[10px] font-black text-text-secondary uppercase tracking-widest">
                          <span>Course Progress</span>
                          <span className="text-text-primary">{module.progress}%</span>
                       </div>
                       <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${module.progress}%` }}
                            className={cn(
                              "h-full rounded-full transition-all duration-1000 shadow-sm",
                              module.progress > 50 || module.status === 'Generated' ? "bg-gradient-premium" : "bg-gray-400"
                            )}
                          />
                       </div>
                    </div>

                    <Button variant="primary" size="sm" className="hidden md:flex px-8 h-12 shadow-lg shadow-brand-pink/20" onClick={() => onNavigate?.('courses')}>
                       Continue Learning
                    </Button>
                  </div>
                );
              })()
            ) : (
              <div className="p-12 rounded-[2.5rem] border border-dashed border-border-light text-center space-y-4">
                 <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto">
                    <Rocket className="w-8 h-8 text-gray-300" />
                 </div>
                 <Text className="text-sm text-text-secondary max-w-xs mx-auto">
                    Your personalized learning modules will appear here once you generate your DNA Roadmap.
                 </Text>
                 <Button variant="secondary" size="sm" onClick={() => onNavigate?.('roadmap')}>
                    Generate Roadmap
                 </Button>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
