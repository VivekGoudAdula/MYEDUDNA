import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Video, 
  Clock, 
  ExternalLink, 
  Zap
} from 'lucide-react';
import { Heading, Text } from '../DesignSystem/Typography';
import { Card } from '../DesignSystem/Card';
import { Button } from '../DesignSystem/Button';
import { api, MentorshipSession } from '@/src/lib/api';
import { cn } from '@/src/lib/utils';

export const MySessionsPage = ({ authToken, onNavigate }: { authToken: string | null, onNavigate?: (v: string) => void }) => {
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      if (!authToken) return;
      try {
        const data = await api.fetchMySessions(authToken);
        setSessions(data);
      } catch (err) {
        console.error('Failed to load sessions', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadSessions();
  }, [authToken]);

  return (
    <div className="max-w-5xl mx-auto py-8 md:py-12 px-4 md:px-8 space-y-10">
      <div className="space-y-3">
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/5 border border-brand-purple/10 text-brand-purple text-[10px] font-bold uppercase tracking-[0.2em]">
            <Clock className="w-3 h-3" /> Scheduled Neural Syncs
         </div>
         <Heading as="h1" className="text-4xl md:text-5xl">My <span className="text-gradient">Sessions</span></Heading>
         <Text className="text-text-secondary max-w-lg">Manage your ongoing and upcoming mentorship sessions. Check your status and join live meetings.</Text>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
           <div className="w-12 h-12 rounded-2xl bg-brand-purple/5 border border-brand-purple/10 flex items-center justify-center animate-spin">
              <Zap className="w-6 h-6 text-brand-purple" />
           </div>
           <Text className="text-text-secondary font-bold animate-pulse">Syncing session history...</Text>
        </div>
      ) : sessions.length === 0 ? (
        <Card className="p-16 text-center space-y-6 bg-gray-50/50 border-dashed border-2">
           <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto shadow-sm">
              <Calendar className="w-8 h-8 text-gray-300" />
           </div>
           <div className="space-y-2">
              <Heading as="h3">No Active Sessions</Heading>
              <Text className="text-text-secondary max-w-sm mx-auto">You haven't requested any mentorship sessions yet. Visit the Mentors page to find your perfect match.</Text>
           </div>
           <Button variant="primary" onClick={() => onNavigate?.('network')}>Find a Mentor</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {sessions.map((session) => (
            <Card key={session._id} className="group p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl transition-all border-border-light bg-white">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-premium flex items-center justify-center text-white text-2xl font-display font-bold shadow-lg">
                    {session.mentor_name.charAt(0)}
                 </div>
                 <div className="space-y-1.5">
                    <Heading as="h3" className="text-xl md:text-2xl">{session.mentor_name}</Heading>
                    <div className="flex flex-wrap items-center gap-4 md:gap-6">
                       <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-secondary/50">
                          <Calendar className="w-3.5 h-3.5 text-brand-purple/40" /> {new Date(session.created_at).toLocaleDateString()}
                       </span>
                       {session.preferred_slot && (
                        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-purple">
                           <Clock className="w-3.5 h-3.5 text-brand-purple/40" /> {session.preferred_slot}
                        </span>
                       )}
                       <span className={cn(
                         "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5",
                         session.status === 'accepted' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                       )}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", session.status === 'accepted' ? "bg-emerald-500" : "bg-amber-500 animate-pulse")} />
                          {session.status}
                       </span>
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-3">
                 {session.status === 'accepted' && session.meeting_link ? (
                   <Button 
                    variant="primary" 
                    className="gap-2 h-12 md:h-14 px-8 shadow-lg shadow-brand-purple/20 font-bold"
                    onClick={() => window.open(session.meeting_link!, '_blank')}
                   >
                      <Video className="w-4 h-4" /> Join Google Meet
                   </Button>
                 ) : session.status === 'accepted' ? (
                    <div className="px-6 py-3 rounded-xl bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                       Link Generating...
                    </div>
                 ) : (
                   <div className="px-6 py-3 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-bold text-text-secondary/40 uppercase tracking-widest">
                      Awaiting Mentor Approval
                   </div>
                 )}
                 <button 
                  className="w-12 h-12 md:w-14 md:h-14 rounded-xl border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all text-text-secondary/40 hover:text-text-primary"
                  onClick={() => session.meeting_link && window.open(session.meeting_link, '_blank')}
                 >
                    <ExternalLink className="w-5 h-5" />
                 </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
