import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Users, 
  Star, 
  MapPin, 
  MessageSquare, 
  Calendar, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Sparkles,
  Info,
  X,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Heading, Text } from '../DesignSystem/Typography';
import { Button } from '../DesignSystem/Button';
import { Card } from '../DesignSystem/Card';
import { api, MentorMatch } from '@/src/lib/api';
import { cn } from '@/src/lib/utils';
import { createPortal } from 'react-dom';

interface MentorshipPageProps {
  dnaData?: {
    strengths: string[];
    learningStyle: string;
  } | null;
  authToken: string | null;
}

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

export const MentorshipPage = ({ authToken }: MentorshipPageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mentors, setMentors] = useState<MentorMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // User data for auto-fill
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);
  
  // Modal states
  const [selectedMentor, setSelectedMentor] = useState<MentorMatch | null>(null);
  const [viewingMentor, setViewingMentor] = useState<MentorMatch | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      if (!authToken) {
        setError('Please login to fetch mentors.');
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const [mentorsRes, userRes] = await Promise.all([
          api.fetchMatchedMentors(authToken),
          api.fetchMe(authToken)
        ]);
        setMentors(mentorsRes);
        setUserData({ name: userRes.name, email: userRes.email });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data.');
      } finally {
        setIsLoading(false);
      }
    };
    void loadData();
  }, [authToken]);

  const filteredMentors = useMemo(
    () =>
      mentors.filter(
        (mentor) =>
          mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mentor.domain.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [mentors, searchQuery]
  );

  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken || !selectedMentor || !userData) return;

    setIsRequesting(true);
    try {
      await api.requestMentorship(authToken, {
        student_name: userData.name,
        student_email: userData.email,
        mentor_name: selectedMentor.name,
        mentor_email: selectedMentor.email,
        message,
        preferred_slot: `${preferredDate} at ${preferredTime}`
      });
      setRequestSuccess(true);
      setTimeout(() => {
        setSelectedMentor(null);
        setRequestSuccess(false);
        setMessage('');
        setPreferredDate('');
        setPreferredTime('');
      }, 2000);
    } catch (err) {
      alert('Failed to send request. Please try again.');
    } finally {
      setIsRequesting(false);
    }
  };

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 md:py-12 px-4 md:px-8 space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-pink/5 border border-brand-pink/10 text-brand-pink text-[10px] font-bold uppercase tracking-[0.2em]">
             <Sparkles className="w-3 h-3" /> Neural Match Active
           </div>
           <Heading as="h1" className="text-4xl md:text-5xl">Matched <span className="text-gradient">Mentors</span></Heading>
           <Text className="text-text-secondary max-w-lg text-lg">
             Live mentor matches from <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-brand-purple">/mentors/matched</code>.
           </Text>
        </div>
        
        <div className="w-full md:w-96 relative group">
           <div className="absolute inset-0 bg-brand-purple/5 blur-xl group-focus-within:bg-brand-purple/10 transition-all rounded-2xl" />
           <div className="relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/40" />
             <input
               type="text"
               className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border-light bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple/20 transition-all shadow-sm placeholder:text-text-secondary/40 font-medium"
               placeholder="Search mentor or domain..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
           </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
             <div className="w-16 h-16 rounded-3xl bg-brand-purple/5 border border-brand-purple/10 flex items-center justify-center animate-pulse">
                <Users className="w-8 h-8 text-brand-purple" />
             </div>
             <Text className="text-lg font-bold text-text-secondary animate-pulse">Scanning the mentor network...</Text>
          </div>
        ) : error ? (
          <Card className="p-12 text-center bg-rose-50 border-rose-100 space-y-6">
             <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto shadow-sm">
                <ShieldCheck className="w-8 h-8 text-rose-500" />
             </div>
             <div className="space-y-2">
                <Heading as="h3" className="text-rose-900">Network Error</Heading>
                <Text className="text-rose-700/70">{error}</Text>
             </div>
             <Button variant="secondary" className="border-rose-200" onClick={() => window.location.reload()}>Retry Sync</Button>
          </Card>
        ) : filteredMentors.length === 0 ? (
          <Card className="p-20 text-center space-y-8 bg-gray-50/50 border-dashed">
             <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mx-auto shadow-lg border border-gray-100">
                <Search className="w-10 h-10 text-gray-300" />
             </div>
             <div className="space-y-3">
                <Heading as="h2">No Mentors Found</Heading>
                <Text className="max-w-md mx-auto text-lg text-text-secondary">We couldn't find any mentors matching your current criteria or DNA profile results.</Text>
             </div>
             <Button variant="primary" onClick={() => setSearchQuery('')}>Clear Search Filter</Button>
          </Card>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredMentors.map((mentor, i) => (
              <motion.div key={`${mentor.name}-${i}`} variants={itemVariants}>
                <Card className="group p-8 space-y-6 bg-white border-border-light hover:border-brand-purple/30 transition-all hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden">
                  {/* Decorative Gradient */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-purple/5 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                  
                  {/* Card Header: Score & Badge */}
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                       {i === 0 && mentor.match_score > 50 && (
                         <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-purple text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-brand-purple/20">
                            <Sparkles className="w-3 h-3" /> Best Match
                         </div>
                       )}
                       <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100">
                          <Zap className="w-3.5 h-3.5 text-emerald-600 fill-current" />
                          <span className="text-xs font-black text-emerald-700 tracking-tighter">{mentor.match_score}% DNA Match</span>
                       </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-100 border border-white shadow-sm flex items-center justify-center group-hover:bg-brand-purple group-hover:text-white transition-colors cursor-pointer" onClick={() => setViewingMentor(mentor)}>
                       <Info className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Mentor Info */}
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-16 rounded-2xl bg-gradient-premium flex items-center justify-center text-white shadow-lg text-2xl font-display font-bold">
                          {mentor.name.charAt(0)}
                       </div>
                       <div>
                          <Heading as="h4" className="text-xl group-hover:text-brand-purple transition-colors">{mentor.name}</Heading>
                          <div className="flex items-center gap-2 text-brand-pink font-bold text-[10px] uppercase tracking-widest mt-1">
                             <MapPin className="w-3 h-3" /> Expert in {mentor.domain}
                          </div>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <Text className="text-sm text-text-secondary leading-relaxed line-clamp-2">
                          {mentor.experience ? `${mentor.experience} professional experience in ${mentor.domain}.` : `Specialized in neural educational growth and optimization within the ${mentor.domain} sector.`}
                       </Text>
                       <div className="flex flex-wrap gap-2 pt-1">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50/50 px-2 py-1 rounded-lg w-fit border border-emerald-100">
                             <ShieldCheck className="w-3 h-3" />
                             {mentor.match_score > 60 ? "Highly compatible" : "Good compatibility"}
                          </div>
                          {mentor.match_reason && (
                             <div className="flex items-center gap-2 text-[10px] font-bold text-brand-purple bg-brand-purple/5 px-2 py-1 rounded-lg w-fit border border-brand-purple/10">
                                <Sparkles className="w-3 h-3" />
                                {mentor.match_reason}
                             </div>
                          )}
                       </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-gray-100 flex items-center gap-3 relative z-10">
                    <Button 
                      variant="primary" 
                      className="flex-[2] h-12 gap-2 shadow-lg shadow-brand-purple/10"
                      onClick={() => setSelectedMentor(mentor)}
                    >
                       <MessageSquare className="w-4 h-4" /> Connect
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="flex-1 h-12 gap-2 rounded-xl border-gray-200"
                      onClick={() => setViewingMentor(mentor)}
                    >
                       <Info className="w-4 h-4" /> Profile
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Footer Insight */}
      <motion.div variants={itemVariants} initial="hidden" animate="show" className="pt-8">
         <Card className="bg-linear-to-r from-brand-purple/5 to-white border-brand-purple/10 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6 text-center md:text-left">
               <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-md border border-brand-purple/10">
                  <ShieldCheck className="w-8 h-8 text-brand-purple" />
               </div>
               <div>
                  <Heading as="h4">Verified Mentor Network</Heading>
                  <Text className="text-text-secondary">All mentors are verified and matched based on your cognitive DNA score.</Text>
               </div>
            </div>
            <Button variant="outline" className="shrink-0 border-brand-purple/20 text-brand-purple font-bold">Learn More</Button>
         </Card>
      </motion.div>

      {/* Modals rendered via Portals */}
      {isMounted && createPortal(
        <>
          <AnimatePresence>
            {viewingMentor && (
              <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-text-primary/60 backdrop-blur-xl"
                  onClick={() => setViewingMentor(null)}
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border border-border-light overflow-hidden z-[510]"
                >
                  {/* Close Button */}
                  <button 
                    onClick={() => setViewingMentor(null)}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-text-secondary/40 hover:text-text-primary transition-all z-20"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="relative h-32 bg-gradient-premium opacity-10" />
                  
                  <div className="px-8 pb-10 -mt-16 relative z-10 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-end gap-6">
                        <div className="w-32 h-32 rounded-3xl bg-white p-2 shadow-xl border border-gray-50">
                          <div className="w-full h-full rounded-2xl bg-gradient-premium flex items-center justify-center text-white text-5xl font-display font-bold">
                              {viewingMentor.name.charAt(0)}
                          </div>
                        </div>
                        <div className="space-y-2 pb-2">
                          <div className="flex items-center gap-3">
                              <Heading as="h2" className="text-3xl">{viewingMentor.name}</Heading>
                              <div className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 flex items-center gap-1.5 text-blue-600">
                                <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                                <span className="text-[10px] font-black uppercase tracking-wider">Verified</span>
                              </div>
                          </div>
                          <div className="flex items-center gap-4 text-text-secondary font-medium">
                              <div className="flex items-center gap-1.5 text-sm">
                                <Briefcase className="w-4 h-4 text-brand-purple/50" /> {viewingMentor.domain}
                              </div>
                              <div className="flex items-center gap-1.5 text-sm">
                                <MapPin className="w-4 h-4 text-brand-pink/50" /> Global Network
                              </div>
                          </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 p-6 rounded-2xl bg-gray-50/80 border border-gray-100">
                        <div className="text-center space-y-1">
                          <div className="text-brand-purple font-black text-xl">4.9/5</div>
                          <div className="text-[9px] uppercase font-bold text-text-secondary/60 tracking-widest">Rating</div>
                        </div>
                        <div className="text-center space-y-1 border-x border-gray-200">
                          <div className="text-brand-purple font-black text-xl">500+</div>
                          <div className="text-[9px] uppercase font-bold text-text-secondary/60 tracking-widest">Students</div>
                        </div>
                        <div className="text-center space-y-1">
                          <div className="text-brand-purple font-black text-xl">{viewingMentor.experience || '5+ Yrs'}</div>
                          <div className="text-[9px] uppercase font-bold text-text-secondary/60 tracking-widest">Experience</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div className="space-y-3">
                              <Heading as="h4" className="flex items-center gap-2 text-lg">
                                <Award className="w-5 h-5 text-brand-purple" /> Expertise & Skills
                              </Heading>
                              <div className="flex flex-wrap gap-2">
                                {(viewingMentor.skills || ['Leadership', 'Problem Solving', 'Strategic Planning']).map(skill => (
                                  <span key={skill} className="px-3 py-1.5 rounded-xl bg-white border border-gray-100 text-xs font-bold text-text-secondary shadow-sm">
                                      {skill}
                                  </span>
                                ))}
                              </div>
                          </div>
                          <div className="space-y-3">
                              <Heading as="h4" className="flex items-center gap-2 text-lg">
                                <BookOpen className="w-5 h-5 text-brand-pink" /> Learning Focus
                              </Heading>
                              <Text className="text-sm leading-relaxed text-text-secondary">
                                Specialized in helping students with {viewingMentor.domain} mastery, focusing on practical application and neural retention strategies.
                              </Text>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                                    <Zap className="w-4 h-4 fill-current" />
                                </div>
                                <Heading as="h4" className="text-emerald-900 text-base">Neural Compatibility</Heading>
                              </div>
                              <Text className="text-xs font-medium text-emerald-700 leading-relaxed">
                                This mentor matches your DNA profile by <span className="font-bold underline">{viewingMentor.match_score}%</span>. Their teaching style is highly effective for your cognitive pathways.
                              </Text>
                              <div className="w-full h-1.5 bg-emerald-200 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${viewingMentor.match_score}%` }}
                                  transition={{ delay: 0.5, duration: 1 }}
                                  className="h-full bg-emerald-600 rounded-full shadow-lg"
                                />
                              </div>
                          </div>
                          <Button 
                            variant="primary" 
                            className="w-full h-14 text-lg shadow-xl shadow-brand-purple/20"
                            onClick={() => {
                              setSelectedMentor(viewingMentor);
                              setViewingMentor(null);
                            }}
                          >
                              Book a Neural Session
                          </Button>
                        </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {selectedMentor && (
              <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-text-primary/60 backdrop-blur-xl"
                  onClick={() => !isRequesting && setSelectedMentor(null)}
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-border-light overflow-hidden z-[610]"
                >
                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Heading as="h3">Connect with Mentor</Heading>
                          <Text className="text-text-secondary">Send a neural connection request to {selectedMentor.name}.</Text>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-brand-purple/5 flex items-center justify-center text-brand-purple">
                          <MessageSquare className="w-6 h-6" />
                        </div>
                    </div>

                    {requestSuccess ? (
                      <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                            <ShieldCheck className="w-8 h-8" />
                          </div>
                          <Heading as="h4" className="text-emerald-700">Request Sent!</Heading>
                          <Text className="text-emerald-600/70 font-medium">Your mentorship request has been beamed to {selectedMentor.name}.</Text>
                      </div>
                    ) : (
                      <form onSubmit={handleConnect} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/60 ml-1">Your Name</label>
                                <input 
                                  type="text" 
                                  readOnly 
                                  value={userData?.name || ''} 
                                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-border-light text-sm font-medium text-text-secondary cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/60 ml-1">Mentor</label>
                                <input 
                                  type="text" 
                                  readOnly 
                                  value={selectedMentor.name} 
                                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-border-light text-sm font-medium text-brand-purple cursor-not-allowed"
                                />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/60 ml-1">Preferred Date</label>
                                <div className="relative">
                                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-purple" />
                                  <input 
                                    type="date"
                                    required
                                    value={preferredDate}
                                    onChange={(e) => setPreferredDate(e.target.value)}
                                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-white border border-border-light text-xs font-bold text-text-primary focus:ring-2 focus:ring-brand-purple/20 transition-all"
                                  />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/60 ml-1">Preferred Time</label>
                                <div className="relative">
                                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-pink" />
                                  <input 
                                    type="time"
                                    required
                                    value={preferredTime}
                                    onChange={(e) => setPreferredTime(e.target.value)}
                                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-white border border-border-light text-xs font-bold text-text-primary focus:ring-2 focus:ring-brand-purple/20 transition-all"
                                  />
                                </div>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/60 ml-1">Message</label>
                            <textarea 
                              required
                              rows={4}
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder="Tell the mentor about your goals and what you'd like to learn..."
                              className="w-full px-4 py-3 rounded-xl border border-border-light bg-white text-sm font-medium focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple/30 transition-all resize-none"
                            />
                          </div>

                          <div className="pt-4 flex items-center gap-3">
                            <Button 
                              type="button" 
                              variant="secondary" 
                              className="flex-1 h-12 border-gray-200"
                              onClick={() => setSelectedMentor(null)}
                              disabled={isRequesting}
                            >
                                Cancel
                            </Button>
                            <Button 
                              type="submit" 
                              variant="primary" 
                              className="flex-[2] h-12 gap-2 shadow-lg shadow-brand-purple/20"
                              disabled={isRequesting}
                            >
                                {isRequesting ? "Sending..." : <><Zap className="w-4 h-4 fill-current" /> Send Request</>}
                            </Button>
                          </div>
                      </form>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </div>
  );
};
