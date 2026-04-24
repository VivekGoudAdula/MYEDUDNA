import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MessageSquare, 
  Search, 
  UserPlus, 
  Send, 
  MoreVertical, 
  ChevronRight,
  Award, 
  Zap, 
  Globe,
  Star,
  ShieldCheck,
  Hash,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Heading, Text } from '../DesignSystem/Typography';
import { Button } from '../DesignSystem/Button';
import { Card } from '../DesignSystem/Card';
import { Input } from '../DesignSystem/Input';

interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  match: number;
  tags: string[];
  avatar: string;
  verified: boolean;
}

interface PeerGroup {
  id: string;
  name: string;
  members: number;
  activity: string;
  type: 'public' | 'private' | 'dna-locked';
}

const mockMentors: Mentor[] = [
  {
    id: 'm1',
    name: 'Dr. Sarah Chen',
    role: 'Principal Researcher',
    company: 'Neural Dynamics Inc.',
    match: 98,
    tags: ['Machine Learning', 'Ethics', 'Neuroscience'],
    avatar: 'https://picsum.photos/seed/sarah/100/100',
    verified: true
  },
  {
    id: 'm2',
    name: 'Marcus Thorne',
    role: 'Lead AI Architect',
    company: 'OpenNexus',
    match: 92,
    tags: ['Distributed Systems', 'LLMs', 'Scalability'],
    avatar: 'https://picsum.photos/seed/marcus/100/100',
    verified: true
  },
  {
    id: 'm3',
    name: 'Elena Rodriguez',
    role: 'Quantum Developer',
    company: 'Aether Computing',
    match: 87,
    tags: ['Quantum Circuits', 'Algorithm Design'],
    avatar: 'https://picsum.photos/seed/elena/100/100',
    verified: false
  }
];

const mockGroups: PeerGroup[] = [
  { id: 'g1', name: 'Neural Network Enthusiasts', members: 1240, activity: 'High', type: 'public' },
  { id: 'g2', name: 'Quantum Devs Alpha', members: 342, activity: 'Medium', type: 'dna-locked' },
  { id: 'g3', name: 'Ethics in AI Research', members: 890, activity: 'High', type: 'public' },
];

export const MentorshipCollaboration = () => {
  const [activeTab, setActiveTab] = useState<'network' | 'chat'>('network');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [message, setMessage] = useState('');
  const [chatLogs, setChatLogs] = useState([
    { id: 1, sender: 'system', text: 'Secure encryption enabled. Neural sync ready.', time: '09:00 AM' },
    { id: 2, sender: 'mentor', text: 'Hello! I noticed your progress in "Transformer Architectures". Ready to start the next sequence?', time: '10:15 AM' }
  ]);

  const [isMobileChatListOpen, setIsMobileChatListOpen] = useState(true);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setChatLogs([
      ...chatLogs,
      { id: Date.now(), sender: 'user', text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto py-6 md:py-8 px-4 flex flex-col h-full space-y-6 md:space-y-8">
      {/* Header & Internal Nav */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
           <div className="flex items-center gap-2 text-brand-purple mb-1">
              <Users className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Neural Network // Nodes</span>
           </div>
           <Heading as="h1" className="text-2xl md:text-3xl">Network <span className="text-gradient">& Mentorship</span></Heading>
           <Text className="text-text-secondary">Synchronize with industry leaders and collaborative peer clusters.</Text>
        </div>

        <div className="bg-gray-100 p-1 rounded-2xl flex gap-1 w-full lg:w-auto">
           <button 
             onClick={() => setActiveTab('network')}
             className={cn(
               "flex-1 lg:px-6 py-2 rounded-xl text-sm font-semibold transition-all",
               activeTab === 'network' ? "bg-white text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
             )}
           >
              Discovery
           </button>
           <button 
             onClick={() => setActiveTab('chat')}
             className={cn(
               "flex-1 lg:px-6 py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2",
               activeTab === 'chat' ? "bg-white text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
             )}
           >
              Messages
              <span className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
           </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'network' ? (
          <motion.div 
            key="network"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {/* Main Network Content */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
               {/* Search Interface */}
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-text-secondary" />
                  <input 
                    type="text" 
                    placeholder="Search DNA signatures, names..." 
                    className="w-full bg-white py-3 md:py-4 pl-12 pr-4 rounded-2xl border border-border-light outline-none focus:ring-1 focus:ring-brand-purple/50 transition-all text-text-primary placeholder:text-text-secondary/40 shadow-sm"
                  />
               </div>

               {/* Suggested Mentors Section */}
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <Heading as="h3" className="text-lg">Suggested <span className="text-brand-pink">Neural Synchronizers</span></Heading>
                     <Button variant="ghost" size="sm" className="text-[10px] uppercase tracking-widest text-text-secondary/60 hover:text-text-primary">Expand Pool</Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {mockMentors.map((mentor) => (
                       <Card key={mentor.id} className="group hover:border-brand-pink/50 transition-all p-5 bg-white border-border-light shadow-sm">
                          <div className="flex items-start justify-between mb-4">
                             <div className="relative">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-border-light">
                                   <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
                                </div>
                                {mentor.verified && (
                                  <div className="absolute -bottom-1 -right-1 bg-brand-pink p-1 rounded-lg shadow-sm">
                                     <ShieldCheck className="w-3 h-3 text-white" />
                                  </div>
                                )}
                             </div>
                             <div className="text-right">
                                <div className="flex items-center justify-end gap-1 text-emerald-600">
                                   <Zap className="w-3 h-3 fill-current" />
                                   <span className="text-xs font-bold font-mono">{mentor.match}% Match</span>
                                </div>
                                <Text className="text-[10px] uppercase text-text-secondary/40 tracking-widest font-bold">DNA Sync</Text>
                             </div>
                          </div>
                          <div className="space-y-1 mb-6">
                             <h4 className="font-bold text-text-primary text-lg">{mentor.name}</h4>
                             <p className="text-sm text-text-secondary font-medium">{mentor.role}</p>
                             <p className="text-xs text-brand-pink/70 uppercase tracking-tighter font-bold">{mentor.company}</p>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-6">
                             {mentor.tags.map(tag => (
                               <span key={tag} className="px-2 py-1 rounded-md bg-gray-50 text-[10px] text-text-secondary font-bold border border-border-light">{tag}</span>
                             ))}
                          </div>
                          <Button 
                            variant="outline" 
                            className="w-full group-hover:bg-brand-pink group-hover:text-white group-hover:border-brand-pink transition-all border-border-light shadow-none"
                            onClick={() => {
                                setSelectedMentor(mentor);
                                setActiveTab('chat');
                                setIsMobileChatListOpen(false);
                            }}
                          >
                             Request Sync
                          </Button>
                       </Card>
                     ))}
                  </div>
               </div>

               {/* Secondary Stats/Info Cards */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-brand-purple/5 border-brand-purple/10 p-6">
                     <Globe className="w-8 h-8 text-brand-purple mb-4" />
                     <h4 className="font-bold text-text-primary mb-1">Global Node Reach</h4>
                     <p className="text-sm text-text-secondary">Your DNA is 14% more active than average in the European Cluster.</p>
                  </Card>
                  <Card className="bg-brand-pink/5 border-brand-pink/10 p-6">
                     <Award className="w-8 h-8 text-brand-pink mb-4" />
                     <h4 className="font-bold text-text-primary mb-1">Credibility Index</h4>
                     <p className="text-sm text-text-secondary">Complete 2 more lab sessions to unlock Senior Mentor matching.</p>
                  </Card>
               </div>
            </div>

            {/* Sidebar: Hubs/Groups */}
            <div className="space-y-6 md:space-y-8">
               <Card className="border-border-light space-y-6 bg-white shadow-sm">
                  <Heading as="h4" className="text-[10px] uppercase tracking-widest text-text-secondary/40 font-bold">Active Hubs</Heading>
                  <div className="space-y-4">
                     {mockGroups.map((group) => (
                       <div key={group.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-lg bg-gray-50 border border-border-light flex items-center justify-center text-text-secondary/40 group-hover:text-brand-purple transition-colors shadow-sm">
                                <Hash className="w-5 h-5" />
                             </div>
                             <div>
                                <p className="text-sm font-bold text-text-primary">{group.name}</p>
                                <div className="flex items-center gap-2">
                                   <span className="text-[10px] text-text-secondary/60">{group.members} Nodes</span>
                                   <span className={cn(
                                     "text-[8px] font-bold uppercase tracking-widest",
                                     group.activity === 'High' ? "text-emerald-500" : "text-amber-500"
                                   )}>{group.activity} Activity</span>
                                </div>
                             </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-text-secondary/20 group-hover:text-text-primary group-hover:translate-x-1 transition-all" />
                       </div>
                     ))}
                  </div>
                  <Button variant="outline" className="w-full border-dashed border-border-light hover:border-brand-purple text-xs font-bold tracking-widest shadow-none h-11">
                     Discover All Hubs
                  </Button>
               </Card>

               <Card className="border-brand-purple/20 bg-gradient-to-br from-brand-purple/5 to-white relative overflow-hidden group p-6 shadow-sm">
                  <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-brand-purple/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                  <Star className="w-8 h-8 text-brand-purple mb-4" />
                  <h4 className="font-bold text-text-primary mb-2">Beta Access: Neural Voice</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">Join the early adopter group for real-time voice synchronization with AI mentors.</p>
                  <Button variant="ghost" className="p-0 text-brand-purple mt-4 hover:bg-transparent h-auto font-bold text-xs">
                    Register Interest <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </Button>
               </Card>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="chat"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex-1 bg-white border border-border-light rounded-3xl overflow-hidden flex h-[600px] shadow-2xl relative"
          >
             {/* Chat Sidebar: Contacts */}
             <div className={cn(
               "w-full md:w-80 border-r border-border-light flex flex-col transition-all",
               !isMobileChatListOpen && "hidden md:flex"
             )}>
                <div className="p-6 border-b border-border-light">
                   <h3 className="font-bold text-text-primary mb-4">Active Syncs</h3>
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-text-secondary/40" />
                      <input type="text" placeholder="Search..." className="w-full bg-gray-50 border border-border-light rounded-lg py-1.5 pl-8 pr-4 text-xs outline-none focus:ring-1 focus:ring-brand-pink/30 transition-all font-medium" />
                   </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                   <div 
                    onClick={() => setIsMobileChatListOpen(false)}
                    className="p-3 rounded-2xl bg-brand-pink/5 border border-brand-pink/10 flex items-center gap-3 cursor-pointer"
                   >
                      <img src={selectedMentor?.avatar || mockMentors[0].avatar} className="w-10 h-10 rounded-xl shadow-sm" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-center">
                            <h4 className="text-sm font-bold text-text-primary truncate">{selectedMentor?.name || mockMentors[0].name}</h4>
                            <span className="text-[8px] text-text-secondary/50 font-bold font-mono">10:15 AM</span>
                         </div>
                         <p className="text-[10px] text-text-secondary/60 truncate font-medium">Neural sync ready...</p>
                      </div>
                   </div>
                   {mockMentors.filter(m => m.id !== (selectedMentor?.id || mockMentors[0].id)).map(m => (
                      <div 
                        key={m.id} 
                        className="p-3 rounded-2xl hover:bg-gray-50 flex items-center gap-3 cursor-pointer opacity-60 transition-opacity"
                        onClick={() => {
                          setSelectedMentor(m);
                          setIsMobileChatListOpen(false);
                        }}
                      >
                         <img src={m.avatar} className="w-10 h-10 rounded-xl grayscale" referrerPolicy="no-referrer" />
                         <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-text-primary truncate">{m.name}</h4>
                            <p className="text-[10px] text-text-secondary/40 truncate font-medium">Offline</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             {/* Main Chat Area */}
             <div className={cn(
               "flex-1 flex flex-col relative transition-all bg-white",
               isMobileChatListOpen && "hidden md:flex"
             )}>
                {/* Chat Header */}
                <div className="h-20 border-b border-border-light px-4 md:px-8 flex items-center justify-between bg-white/80 backdrop-blur-sm z-10">
                   <div className="flex items-center gap-3 md:gap-4">
                      <button 
                        onClick={() => setIsMobileChatListOpen(true)}
                        className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-text-secondary"
                      >
                         <ChevronRight className="w-5 h-5 rotate-180" />
                      </button>
                      <div className="relative">
                         <img src={selectedMentor?.avatar || mockMentors[0].avatar} className="w-10 h-10 rounded-xl shadow-sm" referrerPolicy="no-referrer" />
                         <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white shadow-sm" />
                      </div>
                      <div className="min-w-0">
                         <h4 className="font-bold text-text-primary truncate">{selectedMentor?.name || mockMentors[0].name}</h4>
                         <p className="text-[9px] text-emerald-600 uppercase font-mono font-bold tracking-widest flex items-center gap-1 leading-none pt-0.5">
                            <Zap className="w-2.5 h-2.5 fill-current" /> Active Link
                         </p>
                      </div>
                   </div>
                   <div className="flex gap-1 md:gap-2">
                       <Button variant="ghost" size="sm" className="w-9 h-9 md:w-10 md:h-10 rounded-full hover:bg-gray-100 text-text-secondary/40"><MessageSquare className="w-4 h-4 md:w-5 md:h-5" /></Button>
                       <Button variant="ghost" size="sm" className="w-9 h-9 md:w-10 md:h-10 rounded-full hover:bg-gray-100 text-text-secondary/40"><MoreVertical className="w-4 h-4 md:w-5 md:h-5" /></Button>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6 flex flex-col custom-scrollbar bg-gray-50/30">
                   {chatLogs.map((log) => (
                      <div 
                        key={log.id} 
                        className={cn(
                          "max-w-[85%] md:max-w-[70%] flex flex-col",
                          log.sender === 'user' ? "self-end items-end" : "self-start items-start"
                        )}
                      >
                         <div className={cn(
                           "px-4 md:px-5 py-2.5 md:py-3 rounded-2xl text-[13px] md:text-sm leading-relaxed shadow-sm",
                           log.sender === 'user' ? "bg-brand-pink text-white rounded-tr-none shadow-brand-pink/10" : 
                           log.sender === 'system' ? "bg-white border border-border-light text-text-secondary/60 italic text-[11px] w-full text-center" : 
                           "bg-white border border-border-light text-text-primary rounded-tl-none shadow-sm"
                         )}>
                            {log.text}
                         </div>
                         <span className="text-[8px] text-text-secondary/40 mt-1 uppercase font-mono font-bold tracking-widest">{log.time}</span>
                      </div>
                   ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 md:p-6 border-t border-border-light bg-white">
                   <div className="flex items-center gap-2 md:gap-3">
                      <Button variant="ghost" size="sm" className="text-text-secondary/30 hover:text-text-primary hidden sm:flex"><UserPlus className="w-5 h-5" /></Button>
                      <div className="flex-1 relative">
                         <input 
                           type="text" 
                           value={message}
                           onChange={(e) => setMessage(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                           placeholder="Transmit message..." 
                           className="w-full bg-gray-50 border border-border-light rounded-2xl py-3 px-5 text-sm outline-none focus:ring-1 focus:ring-brand-pink/50 transition-all text-text-primary placeholder:text-text-secondary/30 shadow-inner"
                         />
                      </div>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl shadow-lg shadow-brand-pink/20 bg-brand-pink shrink-0"
                        onClick={handleSendMessage}
                      >
                         <Send className="w-4 h-4 md:w-5 md:h-5" />
                      </Button>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
