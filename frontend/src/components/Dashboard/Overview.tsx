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
  FlaskConical
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
  } | null,
  onNavigate?: (view: string) => void,
  userName?: string,
  roadmapModules?: Array<{ id: string; title: string; progress: number; status: string }>
}) => {
  // Use DNA data to personalize or fallback to defaults
  const learningStyle = dnaData?.learningStyle || "Not assessed";
  const accuracy = dnaData?.accuracy ?? 0;
  const strengths = dnaData?.strengths?.length ? dnaData.strengths : ["No strengths yet"];
  
  const cognitiveData = dnaData ? [
    { subject: 'Logic', A: (dnaData.categories.logic?.correct || 0) * 25, fullMark: 100 },
    { subject: 'Memory', A: (dnaData.categories.memory?.correct || 0) * 100, fullMark: 100 },
    { subject: 'Conceptual', A: (dnaData.categories.conceptual?.correct || 0) * 33, fullMark: 100 },
    { subject: 'Practical', A: (dnaData.categories.practical?.correct || 0) * 50, fullMark: 100 },
  ] : [
    { subject: 'Logic', A: 0, fullMark: 100 },
    { subject: 'Memory', A: 0, fullMark: 100 },
    { subject: 'Conceptual', A: 0, fullMark: 100 },
    { subject: 'Practical', A: 0, fullMark: 100 },
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
          value={dnaData ? `${dnaData.score}/5` : "Not available"} 
          trend={0} 
          icon={Target} 
        />
        <StatsCard 
          title="Daily Streak" 
          value="--" 
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

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Learning DNA Radar Chart */}
        <Card className="flex flex-col h-full lg:col-span-1 border-border-light bg-white">
          <div className="mb-6">
            <Heading as="h3">Learning <span className="text-gradient">DNA Profile</span></Heading>
            <Text className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{learningStyle} Profile</Text>
          </div>
          <div className="flex-1 w-full min-h-[250px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={cognitiveData}>
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
          <div className="mt-4 pt-4 border-t border-border-light space-y-3">
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
              <Heading as="h3">Current Learning <span className="text-gradient">Path</span></Heading>
              <Text className="text-sm">
                Pathway: {roadmapModules.length ? 'Personalized roadmap active' : 'Generate your first roadmap'}
              </Text>
            </div>
            {roadmapModules.length > 0 && (
              <Button variant="ghost" size="sm" className="text-brand-pink font-bold" onClick={() => onNavigate?.('roadmap')}>
                View All
              </Button>
            )}
          </div>

          <div className="space-y-3 flex-1">
            {roadmapModules.map((module) => (
              <div 
                key={module.id} 
                className="bg-gray-50 border border-border-light p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 group transition-all hover:bg-white hover:shadow-lg hover:outline-brand-pink/10 outline outline-transparent"
              >
                <div className="flex items-center gap-4">
                   <div className={cn(
                     "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm",
                     module.status === 'Active' ? "bg-white text-brand-pink border border-brand-pink/10" : "bg-gray-100 text-gray-400"
                   )}>
                      <BookOpen className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="font-display font-semibold text-text-primary group-hover:text-brand-pink transition-colors">{module.title}</h4>
                      <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">{module.status}</p>
                   </div>
                </div>
                
                <div className="flex flex-col md:items-end gap-2 md:w-48">
                   <div className="flex justify-between w-full text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                      <span>Progress</span>
                      <span className="text-text-primary">{module.progress}%</span>
                   </div>
                   <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${module.progress}%` }}
                        className={cn(
                          "h-full rounded-full transition-all duration-1000 shadow-sm",
                          module.progress > 50 ? "bg-gradient-premium" : "bg-gray-400"
                        )}
                      />
                   </div>
                </div>

                <Button variant="secondary" size="sm" className="hidden md:flex opacity-0 group-hover:opacity-100 transition-all border-gray-200 shadow-none">
                   Continue
                </Button>
              </div>
            ))}
          </div>
          {!dnaData && (
            <div className="p-4 rounded-xl border border-dashed border-border-light text-sm text-text-secondary">
              No learning modules yet. Complete DNA assessment and generate a roadmap.
            </div>
          )}
        </Card>
      </motion.div>

      {/* AI Recommendations Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        <Card className="md:col-span-2 space-y-6 bg-white">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-brand-purple/5 flex items-center justify-center border border-brand-purple/10">
                <Brain className="w-4 h-4 text-brand-purple" />
             </div>
             <Heading as="h3">AI <span className="text-gradient">Recommended</span></Heading>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {recommendations.map((rec) => (
                <div key={rec.title} className="p-4 rounded-2xl border border-border-light hover:border-brand-purple/30 bg-gray-50 cursor-pointer group transition-all hover:bg-white hover:shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                     <rec.icon className="w-4 h-4 text-brand-purple" />
                     <span className="text-[10px] font-bold uppercase tracking-widest text-brand-purple">{rec.time}</span>
                  </div>
                  <Heading as="h4" className="text-sm group-hover:text-brand-purple transition-colors text-text-primary">{rec.title}</Heading>
                </div>
             ))}
             {!recommendations.length && (
               <div className="md:col-span-2 p-4 rounded-2xl border border-dashed border-border-light text-sm text-text-secondary">
                 Complete DNA assessment to unlock AI recommendations.
               </div>
             )}
          </div>
        </Card>

        <Card className="bg-linear-to-br from-brand-purple/5 to-white border-brand-purple/10 flex flex-col items-center justify-center text-center p-8 space-y-6 shadow-md">
           <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border border-brand-purple/10 shadow-sm">
              <Sparkles className="w-8 h-8 text-brand-purple" />
           </div>
           <div>
             <Heading as="h4" className="mb-2 text-text-primary">{dnaData ? "Retake DNA Map" : "Daily Sync"}</Heading>
             <Text className="text-sm text-text-secondary">
               {dnaData ? "Check for neural growth since your last sync." : "Validate today's neuro-optimization to maintain your streak."}
             </Text>
           </div>
           <Button variant="primary" className="w-full bg-brand-purple shadow-lg shadow-brand-purple/20 h-12" onClick={onStartQuiz}>
             {dnaData ? "Restart Assessment" : "Start Now"}
           </Button>
        </Card>
      </motion.div>
    </motion.div>
  );
};
