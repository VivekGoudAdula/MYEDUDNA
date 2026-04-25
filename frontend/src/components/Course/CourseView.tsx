import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  FileText, 
  CheckCircle2, 
  Target, 
  Sparkles, 
  ArrowLeft, 
  Clock, 
  ChevronRight, 
  BookOpen, 
  Youtube, 
  Lightbulb, 
  Code,
  MessageSquare,
  Award
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Heading, Text } from '../DesignSystem/Typography';
import { Button } from '../DesignSystem/Button';
import { Card } from '../DesignSystem/Card';
import { PageTransition } from '../DesignSystem/Transitions';
import { api } from '@/src/lib/api';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'quiz' | 'lab';
  duration: string;
  completed: boolean;
  content?: string | null;
  questions?: Array<Record<string, unknown>> | null;
}

interface CourseViewProps {
  courseTitle: string;
  phaseTitle: string;
  description: string;
  lessons: Lesson[];
  onBack: () => void;
}

export const CourseView = ({ courseTitle, phaseTitle, description, lessons, onBack }: CourseViewProps) => {
  const [activeLesson, setActiveLesson] = useState(lessons[0]);
  const [activeTab, setActiveTab] = useState<'content' | 'quiz' | 'assignment'>('content');

  const youtubeQuery = React.useMemo(() => {
    const query = `${courseTitle} ${activeLesson.title}`.trim();
    return encodeURIComponent(query);
  }, [courseTitle, activeLesson.title]);

  const youtubeSearchUrl = React.useMemo(() => `https://www.youtube.com/results?search_query=${youtubeQuery}`, [youtubeQuery]);

  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    const loadVideo = async () => {
      if (activeLesson.type !== 'video') return;
      setVideoError(null);
      setVideoId(null);
      try {
        const query = `${courseTitle} ${activeLesson.title}`.trim();
        const result = await api.youtubeSearch({ query });
        setVideoId(result.video_id);
      } catch (err) {
        setVideoError(err instanceof Error ? err.message : 'Failed to load YouTube video.');
      }
    };
    void loadVideo();
  }, [activeLesson.type, activeLesson.title, courseTitle]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 md:px-6">
      <PageTransition>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Main Area: Player & Content (LEFT) */}
          <div className="lg:w-2/3 space-y-8">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-text-secondary hover:text-text-primary"
                onClick={onBack}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Text className="text-[10px] uppercase text-brand-pink font-bold tracking-[0.2em]">{phaseTitle}</Text>
            </div>

            <div className="space-y-2">
              <Heading as="h2" className="text-text-primary">{courseTitle}</Heading>
              <Text className="text-sm text-text-secondary">{description}</Text>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-4 border-b border-border-light pb-2">
               {['content', 'quiz', 'assignment'].map((tab) => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab as any)}
                   className={cn(
                     "px-4 py-2 text-sm font-bold uppercase tracking-widest transition-all relative",
                     activeTab === tab ? "text-brand-pink" : "text-text-secondary/60 hover:text-text-primary"
                   )}
                 >
                   {tab}
                   {activeTab === tab && (
                     <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-brand-pink rounded-full" />
                   )}
                 </button>
               ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'content' && (
                <motion.div 
                  key="content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Media Content Area */}
                  {activeLesson.type === 'video' ? (
                    <Card className="aspect-video w-full overflow-hidden border-border-light shadow-2xl rounded-[2.5rem]">
                      {videoId ? (
                        <iframe
                          className="w-full h-full"
                          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
                          title={activeLesson.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <div className="text-center space-y-2">
                            <Text className="text-text-secondary">
                              {videoError ? 'Video unavailable in embed.' : 'Loading video...'}
                            </Text>
                            <a
                              href={youtubeSearchUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-bold text-brand-pink hover:underline"
                            >
                              Open on YouTube
                            </a>
                          </div>
                        </div>
                      )}
                    </Card>
                  ) : (
                    <Card className="p-12 bg-white border-border-light shadow-xl rounded-[2.5rem] min-h-[400px] flex flex-col items-center justify-center text-center space-y-6">
                       <div className="w-20 h-20 rounded-3xl bg-brand-purple/5 flex items-center justify-center border border-brand-purple/10">
                          {activeLesson.type === 'reading' && <FileText className="w-10 h-10 text-brand-purple" />}
                          {activeLesson.type === 'lab' && <Code className="w-10 h-10 text-emerald-500" />}
                       </div>
                       <Heading as="h2">{activeLesson.title}</Heading>
                       {activeLesson.content ? (
                         <Text className="max-w-2xl mx-auto text-base text-text-secondary whitespace-pre-wrap leading-relaxed">
                           {activeLesson.content}
                         </Text>
                       ) : (
                         <Text className="max-w-md mx-auto text-text-secondary">
                           Content for this lesson is not available yet.
                         </Text>
                       )}
                    </Card>
                  )}

                  {/* Text Content */}
                  <div className="space-y-12">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <Lightbulb className="w-8 h-8 text-brand-pink" />
                        <Heading as="h2" className="text-text-primary">Session <span className="text-gradient">Briefing</span></Heading>
                      </div>
                      
                      <div className="space-y-6 text-text-secondary leading-relaxed text-lg">
                         <p>
                           Welcome to <strong>{activeLesson.title}</strong>. In this session, we'll dive deep into the core mechanics of <em>{courseTitle}</em>.
                         </p>
                         <p>
                           Our AI model suggests focusing on the connection between architectural patterns and practical implementation. This aligns with your historical performance in the {phaseTitle} phase.
                         </p>

                         {activeLesson.content && (
                           <Card className="p-8 rounded-4xl bg-white border border-border-light shadow-sm">
                             <Heading as="h3" className="text-text-primary text-xl mb-4">Lesson Content</Heading>
                             <div className="space-y-4 text-base text-text-secondary whitespace-pre-wrap leading-relaxed">
                               {activeLesson.content}
                             </div>
                           </Card>
                         )}
                         
                         <div className="p-8 rounded-4xl bg-gray-50 border border-border-light my-8 relative overflow-hidden shadow-sm">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                              <Sparkles className="w-20 h-20 text-brand-purple" />
                            </div>
                            <h4 className="font-bold text-brand-purple mb-4 uppercase text-[10px] tracking-[0.3em]">AI Insight Cluster</h4>
                            <p className="italic font-medium text-text-primary text-xl leading-relaxed">
                              "The key to mastering {courseTitle} isn't just memorization—it's understanding the underlying DNA of the system structure. Pay close attention to how nodes synchronize."
                            </p>
                         </div>

                         <Heading as="h3" className="text-text-primary pt-4 text-2xl">Key Takeaways</Heading>
                         <ul className="space-y-4 list-none">
                            {[
                              'Understand the foundational synchronization nodes.',
                              'Identify bottlenecks in the neural architecture.',
                              'Implement basic fail-safe mechanisms for better stability.'
                            ].map((item, i) => (
                              <li key={i} className="flex items-center gap-4 text-base bg-white p-4 rounded-2xl border border-border-light">
                                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-[10px] font-bold">✓</div>
                                {item}
                              </li>
                            ))}
                         </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'quiz' && (
                <motion.div 
                  key="quiz"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-8"
                >
                  <Card className="p-10 space-y-8 bg-white border-border-light shadow-2xl rounded-[2.5rem]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-red/5 flex items-center justify-center border border-brand-red/10">
                        <Target className="w-6 h-6 text-brand-red" />
                      </div>
                      <div>
                        <Heading as="h3">Knowledge <span className="text-brand-red">Verification</span></Heading>
                        <Text className="text-xs">Based on {activeLesson.title}</Text>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {Array.isArray(activeLesson.questions) && activeLesson.questions.length ? (
                        <>
                          <Text className="text-xl font-bold text-text-primary leading-tight">Quiz</Text>
                          <div className="space-y-6">
                            {activeLesson.questions.slice(0, 10).map((q, qi) => {
                              const questionText = typeof q.question === 'string' ? q.question : `Question ${qi + 1}`;
                              const options = Array.isArray((q as any).options) ? (q as any).options : [];
                              return (
                                <div key={`${activeLesson.id}-q-${qi}`} className="space-y-3">
                                  <Text className="text-base font-bold text-text-primary">{qi + 1}. {questionText}</Text>
                                  <div className="space-y-3">
                                    {options.map((opt: string, oi: number) => (
                                      <button
                                        key={`${activeLesson.id}-q-${qi}-o-${oi}`}
                                        className="w-full text-left p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-brand-pink/30 hover:shadow-lg transition-all text-sm group flex items-start gap-4"
                                      >
                                        <span className="text-text-secondary/40 font-mono font-bold mt-1">{String.fromCharCode(65 + oi)}</span>
                                        <span className="group-hover:text-text-primary font-medium transition-colors text-base">{opt}</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <Text className="text-text-secondary">
                          No quiz questions in this lesson. Select a quiz lesson from the right panel.
                        </Text>
                      )}
                    </div>

                    <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-border-light">
                       <span className="text-xs text-brand-purple font-bold uppercase tracking-widest underline decoration-brand-purple/20 underline-offset-8 cursor-pointer hover:decoration-brand-purple transition-all">Request AI Hint</span>
                       <Button variant="primary" size="lg" className="px-12 h-14 shadow-xl shadow-brand-pink/20 font-bold uppercase tracking-widest text-xs">Submit Answer</Button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'assignment' && (
                <motion.div 
                  key="assignment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <Card className="p-12 space-y-10 bg-white border-border-light shadow-2xl rounded-[3rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5">
                      <Award className="w-64 h-64 text-brand-purple" />
                    </div>

                    <div className="space-y-4 relative z-10">
                      <div className="w-16 h-16 rounded-3xl bg-brand-purple/5 flex items-center justify-center border border-brand-purple/10">
                        <BookOpen className="w-8 h-8 text-brand-purple" />
                      </div>
                      <Heading as="h1">Practical <span className="text-gradient">Synthesis</span></Heading>
                      <Text className="text-lg text-text-secondary">Project: Build a scalable {courseTitle.split(' ')[0]} node.</Text>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                       <div className="space-y-6">
                          <Heading as="h4" className="text-brand-pink">Requirements</Heading>
                          <ul className="space-y-3">
                             {['Clean architectural layout', 'Latency optimized synchronization', 'Documented node functions'].map((req, i) => (
                               <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] mt-0.5">✓</div>
                                  {req}
                               </li>
                             ))}
                          </ul>
                       </div>
                       <div className="space-y-6">
                          <Heading as="h4" className="text-brand-pink">Submission</Heading>
                          <div className="p-6 rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center text-center space-y-4 hover:bg-white hover:border-brand-pink/30 transition-all cursor-pointer">
                             <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                                <FileText className="w-6 h-6 text-text-secondary" />
                             </div>
                             <div className="space-y-1">
                                <p className="text-xs font-bold text-text-primary">Drop files here</p>
                                <p className="text-[10px] text-text-secondary/60">PDF, ZIP, or Link to Repo</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="pt-10 flex gap-4 relative z-10">
                       <Button variant="secondary" className="flex-1 py-10 gap-3 border-gray-200 text-lg shadow-sm">
                          <FileText className="w-6 h-6 text-brand-pink" /> Download Resource Pack
                       </Button>
                       <Button variant="primary" className="flex-1 py-10 gap-3 shadow-xl shadow-brand-pink/20 text-lg">
                          <Code className="w-6 h-6" /> Open Development Lab
                       </Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Lesson List (RIGHT) */}
          <div className="lg:w-1/3 space-y-6">
            <Card className="p-6 bg-white border-border-light shadow-sm rounded-3xl space-y-4">
              <Heading as="h4" className="text-text-primary">Module Contents</Heading>
              <Text className="text-sm text-text-secondary">
                Choose a lesson to study. Quizzes appear in the Quiz tab automatically.
              </Text>
            </Card>

            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              {lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className={cn(
                    "w-full p-4 rounded-2xl border flex items-center justify-between transition-all group shadow-sm text-left",
                    activeLesson.id === lesson.id
                      ? "bg-white border-brand-pink/30 shadow-lg ring-1 ring-brand-pink/5"
                      : "bg-gray-50/50 border-border-light hover:border-brand-pink/20 hover:bg-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-border-light group-hover:scale-110 transition-transform shadow-sm",
                      activeLesson.id === lesson.id && "border-brand-pink/20"
                    )}>
                      {lesson.type === 'video' && <Youtube className="w-5 h-5 text-brand-pink" />}
                      {lesson.type === 'reading' && <FileText className="w-5 h-5 text-brand-purple" />}
                      {lesson.type === 'quiz' && <Target className="w-5 h-5 text-brand-red" />}
                      {lesson.type === 'lab' && <Code className="w-5 h-5 text-emerald-600" />}
                    </div>
                    <div className="min-w-0">
                      <p className={cn("text-sm font-bold truncate", activeLesson.id === lesson.id ? "text-text-primary" : "text-text-secondary group-hover:text-text-primary")}>
                        {lesson.title}
                      </p>
                      <p className="text-[10px] text-text-secondary/60 uppercase font-bold tracking-wider">{lesson.duration}</p>
                    </div>
                  </div>
                  {lesson.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-200 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <Card className="p-6 bg-brand-purple/5 border-brand-purple/10 space-y-4 shadow-sm rounded-3xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm border border-brand-purple/10">
                  <Sparkles className="w-5 h-5 text-brand-purple" />
                </div>
                <Heading as="h4" className="text-sm text-text-primary">AI Learning Assistant</Heading>
              </div>
              <Text className="text-xs text-text-secondary leading-relaxed">
                I've customized this course experience based on your DNA Profile's preference for {activeLesson.type === 'video' ? 'visual learning' : 'interactive challenges'}.
              </Text>
            </Card>
          </div>
        </div>
      </PageTransition>
    </div>
  );
};
