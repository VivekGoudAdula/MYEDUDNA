import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  MessageSquare, 
  Calendar, 
  UserPlus, 
  Sparkles, 
  Filter, 
  ChevronRight, 
  CheckCircle2, 
  Clock,
  ShieldCheck,
  Zap,
  Target,
  Briefcase,
  Star
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Heading, Text } from '../DesignSystem/Typography';
import { Button } from '../DesignSystem/Button';
import { Card } from '../DesignSystem/Card';

interface Mentor {
  id: string;
  name: string;
  domain: string;
  experience: string;
  company: string;
  bio: string;
  interests: string[];
  dnaType: string[]; // Matching keywords
  avatar: string;
  verified: boolean;
  matchScore: number;
}

const mentors: Mentor[] = [
  {
    id: 'm1',
    name: 'Dr. Sarah Chen',
    domain: 'Neural Engineering',
    experience: '12 Years',
    company: 'Neural Dynamics',
    bio: 'Pioneering work in brain-computer interfaces and neural plasticity.',
    interests: ['AI', 'Neuroscience', 'Deep Learning'],
    dnaType: ['Analytical', 'Practical', 'Technical'],
    avatar: 'https://picsum.photos/seed/sarah2/200/200',
    verified: true,
    matchScore: 0 // Will be calculated
  },
  {
    id: 'm2',
    name: 'Marcus Thorne',
    domain: 'Software Architecture',
    experience: '15 Years',
    company: 'Google Cloud',
    bio: 'Specialist in distributed systems and large-scale cloud infrastructure.',
    interests: ['Coding', 'Architecture', 'Cloud'],
    dnaType: ['Practical', 'Logical', 'Theoretical'],
    avatar: 'https://picsum.photos/seed/marcus2/200/200',
    verified: true,
    matchScore: 0
  },
  {
    id: 'm3',
    name: 'Elena Rodriguez',
    domain: 'UX & Product Design',
    experience: '8 Years',
    company: 'Adobe',
    bio: 'Crafting intuitive digital experiences through cognitive psychology.',
    interests: ['Design', 'UX', 'Psychology'],
    dnaType: ['Creative', 'Visual', 'Empathetic'],
    avatar: 'https://picsum.photos/seed/elena2/200/200',
    verified: true,
    matchScore: 0
  },
  {
    id: 'm4',
    name: 'James Wilson',
    domain: 'Data Science',
    experience: '10 Years',
    company: 'Meta',
    bio: 'Uncovering patterns in massive datasets using advanced statistical models.',
    interests: ['Math', 'Coding', 'Analytics'],
    dnaType: ['Analytical', 'Logical', 'Technical'],
    avatar: 'https://picsum.photos/seed/james/200/200',
    verified: false,
    matchScore: 0
  },
  {
    id: 'm5',
    name: 'Aisha Gupta',
    domain: 'Cybersecurity',
    experience: '9 Years',
    company: 'CrowdStrike',
    bio: 'Protecting digital assets from advanced persistent threats.',
    interests: ['Security', 'Coding', 'Networking'],
    dnaType: ['Logical', 'Tactical', 'Critical'],
    avatar: 'https://picsum.photos/seed/aisha/200/200',
    verified: true,
    matchScore: 0
  }
];

interface MentorshipPageProps {
  dnaData?: {
    strengths: string[];
    learningStyle: string;
  } | null;
}

export const MentorshipPage = ({ dnaData }: MentorshipPageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [requests, setRequests] = useState<Record<string, 'pending' | 'accepted'>>({});
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'ai-matched'>('ai-matched');

  // Simple Matching Algorithm
  const scoredMentors = useMemo(() => {
    return mentors.map(mentor => {
      let score = 70; // Base score

      if (dnaData) {
        // Boost based on matching DNA types/strengths
        dnaData.strengths.forEach(strength => {
          if (mentor.dnaType.includes(strength)) score += 8;
        });

        // Boost based on learning style
        if (mentor.dnaType.includes(dnaData.learningStyle)) score += 10;
      }

      // Cap at 99
      return { ...mentor, matchScore: Math.min(score, 99) };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [dnaData]);

  const filteredMentors = scoredMentors.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAI = selectedFilter === 'ai-matched' ? m.matchScore > 85 : true;
    return matchesSearch && matchesAI;
  });

  const handleRequest = (id: string) => {
    setRequests(prev => ({ ...prev, [id]: 'pending' }));
    // Simulate acceptance
    setTimeout(() => {
      setRequests(prev => ({ ...prev, [id]: 'accepted' }));
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 md:py-10 px-4 md:px-6 space-y-8 md:space-y-10">
      {/* Hero Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-border-light pb-8 md:pb-10">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-brand-purple">
             <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
             <span className="text-[10px] md:text-xs font-mono font-bold uppercase tracking-[0.3em]">AI Synthesis Cluster</span>
          </div>
          <Heading as="h1" className="text-3xl md:text-5xl text-text-primary leading-tight">Curated <span className="text-gradient">Mentorship</span></Heading>
          <Text className="text-text-secondary max-w-2xl text-sm md:text-base">
            We've analyzed your Learning DNA and career trajectory to map the most compatible nodes for your growth.
          </Text>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-2xl border border-border-light w-full md:w-sm mx-auto md:mx-0">
           <button 
             onClick={() => setSelectedFilter('ai-matched')}
             className={cn(
               "flex-1 px-4 md:px-6 py-2 rounded-xl text-[10px] md:text-xs font-bold transition-all flex items-center justify-center gap-2",
               selectedFilter === 'ai-matched' ? "bg-brand-pink text-white shadow-lg" : "text-text-secondary hover:text-text-primary"
             )}
           >
              <Target className="w-3.5 h-3.5" /> <span className="truncate">AI Best Match</span>
           </button>
           <button 
             onClick={() => setSelectedFilter('all')}
             className={cn(
               "flex-1 px-4 md:px-6 py-2 rounded-xl text-[10px] md:text-xs font-bold transition-all flex items-center justify-center gap-2",
               selectedFilter === 'all' ? "bg-brand-pink text-white shadow-lg" : "text-text-secondary hover:text-text-primary"
             )}
           >
              <span>Explore Network</span>
           </button>
        </div>
      </div>

      {/* Search & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
         <div className="lg:col-span-3">
            <div className="relative group">
               <Search className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-text-secondary/30 group-focus-within:text-brand-pink transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search by name, expertise..." 
                 className="w-full h-14 md:h-16 bg-white pl-12 md:pl-16 pr-6 rounded-2xl border border-border-light shadow-sm outline-none focus:ring-2 focus:ring-brand-pink/20 text-sm md:text-base text-text-primary placeholder:text-text-secondary/30 transition-all font-medium"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
         </div>
         <div className="bg-white flex items-center justify-center p-4 md:p-5 rounded-2xl border border-border-light shadow-sm space-x-6 md:space-x-8">
            <div className="text-center">
               <p className="text-[8px] md:text-[9px] text-text-secondary/40 uppercase tracking-widest font-bold">Matched Pools</p>
               <p className="text-lg md:text-xl font-bold text-text-primary">12</p>
            </div>
            <div className="w-px h-8 bg-border-light" />
            <div className="text-center">
               <p className="text-[8px] md:text-[9px] text-text-secondary/40 uppercase tracking-widest font-bold">DNA Compatibility</p>
               <p className="text-lg md:text-xl font-bold text-brand-pink">88%</p>
            </div>
         </div>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
         <AnimatePresence mode="popLayout">
            {filteredMentors.map((mentor, index) => (
              <motion.div
                key={mentor.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="h-full flex flex-col group hover:shadow-xl transition-all p-0 overflow-hidden bg-white border-border-light">
                  {/* Top Header Card */}
                  <div className="p-6 md:p-8 space-y-5 md:space-y-6 flex-1">
                     <div className="flex justify-between items-start">
                        <div className="relative">
                           <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border border-border-light group-hover:border-brand-pink/30 transition-all shadow-md relative z-10">
                              <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
                           </div>
                           <div className="absolute -top-3 -left-3 w-12 h-12 bg-brand-pink/10 blur-2xl rounded-full group-hover:bg-brand-pink/20 transition-all" />
                        </div>
                        
                        <div className="flex flex-col items-end gap-1">
                           <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600">
                              <Zap className="w-3 md:w-3.5 h-3 md:h-3.5 fill-current" />
                              <span className="text-[10px] md:text-xs font-bold font-mono">{mentor.matchScore}%</span>
                           </div>
                           {mentor.matchScore > 90 && (
                             <div className="flex items-center gap-1 text-[8px] md:text-[9px] text-brand-pink font-bold uppercase tracking-widest animate-pulse">
                                <Sparkles className="w-2.5 h-2.5" /> AI Matched
                             </div>
                           )}
                        </div>
                     </div>

                     <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <h3 className="text-lg md:text-[1.3rem] font-bold text-text-primary group-hover:text-brand-pink transition-colors leading-tight">{mentor.name}</h3>
                           {mentor.verified && <ShieldCheck className="w-4 h-4 text-brand-pink shrink-0" />}
                        </div>
                        <p className="text-[11px] md:text-sm font-semibold text-text-secondary/70">{mentor.domain} at <span className="text-text-primary/80">{mentor.company}</span></p>
                        <div className="flex items-center gap-4 pt-1.5 md:pt-2">
                           <span className="flex items-center gap-1.5 text-[8px] md:text-[10px] text-text-secondary/40 uppercase font-mono font-bold"><Briefcase className="w-3 h-3" /> {mentor.experience}</span>
                           <span className="flex items-center gap-1.5 text-[8px] md:text-[10px] text-text-secondary/40 uppercase font-mono font-bold"><Users className="w-3 h-3" /> 24 Mentees</span>
                        </div>
                     </div>

                     <Text className="text-xs md:text-sm line-clamp-2 text-text-secondary leading-relaxed">
                        {mentor.bio}
                     </Text>

                     <div className="flex flex-wrap gap-2 pt-2">
                        {mentor.interests.concat(mentor.dnaType.slice(0, 1)).map((tag) => (
                           <span key={tag} className="px-2 py-0.5 rounded-lg bg-gray-50 border border-border-light text-[9px] font-bold text-text-secondary/60 uppercase tracking-tight">
                              {tag}
                           </span>
                        ))}
                     </div>
                  </div>

                  {/* Actions Area */}
                  <div className="p-5 md:p-6 border-t border-border-light bg-gray-50/20 grid grid-cols-2 gap-3 mt-auto">
                     {requests[mentor.id] ? (
                       <div className={cn(
                         "col-span-2 py-3 rounded-xl border flex items-center justify-center gap-3 transition-all",
                         requests[mentor.id] === 'pending' ? "bg-amber-50 border-amber-100 text-amber-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"
                       )}>
                          {requests[mentor.id] === 'pending' ? <Clock className="w-4 h-4 animate-spin-slow" /> : <CheckCircle2 className="w-4 h-4" />}
                          <span className="text-xs font-bold uppercase tracking-wider">{requests[mentor.id] === 'pending' ? 'Pending' : 'Sync Active'}</span>
                       </div>
                     ) : (
                       <>
                         <Button 
                           variant="primary" 
                           size="sm" 
                           onClick={() => handleRequest(mentor.id)}
                           className="text-[10px] md:text-xs group/btn h-11 md:h-12 bg-brand-pink"
                         >
                            <span className="truncate">Request Session</span> <UserPlus className="w-3.5 h-3.5 ml-1 md:ml-2 group-hover/btn:scale-110 transition-transform shrink-0" />
                         </Button>
                         <Button variant="outline" size="sm" className="text-[10px] md:text-xs border-border-light text-text-primary h-11 md:h-12">
                            <span>Chat (AI Sync)</span> <MessageSquare className="w-3.5 h-3.5 ml-1 md:ml-2 shrink-0" />
                         </Button>
                       </>
                     )}
                     <Button variant="ghost" className="col-span-2 text-[10px] md:text-xs h-10 border border-transparent hover:border-border-light hover:bg-gray-100 mt-1 text-text-secondary hover:text-text-primary font-bold uppercase">
                        View Network Node Profile
                     </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      {/* Bottom Engagement */}
      <Card className="bg-brand-pink border-none p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 relative overflow-hidden group shadow-2xl shadow-brand-pink/20">
         <div className="absolute inset-0 bg-gradient-to-br from-brand-pink via-brand-pink to-brand-purple opacity-90" />
         <div className="relative z-10 space-y-6 text-center md:text-left max-w-xl">
            <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight">Can't find your <span className="underline decoration-white/40">perfect match?</span></h2>
            <p className="text-white/80 text-sm md:text-base leading-relaxed font-medium">Our neural network is growing daily. Request a specific DNA profile manual match from our academic board cluster.</p>
            <Button variant="outline" className="bg-white text-brand-pink border-white hover:bg-white/90 px-8 h-12 md:h-14 rounded-2xl font-bold shadow-xl">Request Manual Scan</Button>
         </div>
         <div className="relative z-10 shrink-0">
            <div className="w-32 h-32 md:w-48 md:h-48 bg-white/10 rounded-full blur-[60px] animate-pulse" />
            <Users className="w-24 h-24 md:w-40 md:h-40 text-white/20 absolute inset-0 m-auto group-hover:scale-110 transition-transform duration-1000" />
         </div>
         {/* Decorative elements */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rotate-45 translate-x-32 -translate-y-32" />
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 -rotate-45 -translate-x-32 translate-y-32" />
      </Card>
    </div>
  );
};
