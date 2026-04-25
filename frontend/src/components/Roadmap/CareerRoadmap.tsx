import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { Heading, Text } from '../DesignSystem/Typography';
import { Button } from '../DesignSystem/Button';
import { Card } from '../DesignSystem/Card';
import { Input } from '../DesignSystem/Input';
import { api, RoadmapResponse, UserCourse } from '@/src/lib/api';
import { RoadmapNode, RoadmapNodeStatus } from './RoadmapNode';

type GeneratedModule = {
  id: string;
  title: string;
  phaseTitle: string;
  phaseIndex: number;
  flatIndex: number;
};

export const CareerRoadmap = ({ authToken }: { authToken: string | null }) => {
  const [view, setView] = useState<'generator' | 'roadmap'>('generator');
  const [goal, setGoal] = useState('');
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [coursesByModule, setCoursesByModule] = useState<Record<string, UserCourse>>({});
  const [lockedHintNodeId, setLockedHintNodeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const loadLatestRoadmapAndCourses = async () => {
      if (!authToken) {
        setRoadmap(null);
        setCoursesByModule({});
        setView('generator');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setNotice(null);
      try {
        const [latest, myCourses] = await Promise.all([
          api.fetchLatestRoadmap(authToken),
          api.fetchMyCourses(authToken),
        ]);
        const byModule: Record<string, UserCourse> = {};
        myCourses.courses.forEach((entry) => {
          byModule[entry.module_name] = entry;
        });
        setCoursesByModule(byModule);

        if ('roadmap_id' in latest) {
          setRoadmap(latest);
          setGoal(latest.goal);
          setView('roadmap');
          return;
        }
        setRoadmap(null);
        setView('generator');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load saved roadmap.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadLatestRoadmapAndCourses();
  }, [authToken]);

  const flatModules = useMemo(() => {
    if (!roadmap) return [];
    const modules: GeneratedModule[] = [];
    let idx = 0;
    roadmap.roadmap.phases.forEach((phase, phaseIndex) => {
      phase.modules.forEach((moduleName, moduleIndex) => {
        modules.push({
          id: `${phaseIndex}-${moduleIndex}`,
          title: moduleName,
          phaseTitle: phase.title,
          phaseIndex,
          flatIndex: idx++,
        });
      });
    });
    return modules;
  }, [roadmap, coursesByModule]);

  const completedCount = useMemo(
    () => flatModules.filter((module) => Boolean(coursesByModule[module.title]?.is_completed)).length,
    [flatModules, coursesByModule]
  );

  const currentNodeIndex = useMemo(() => {
    const nextIncomplete = flatModules.findIndex((module) => !coursesByModule[module.title]?.is_completed);
    return nextIncomplete;
  }, [flatModules, coursesByModule]);

  const progressPercent = flatModules.length ? Math.round((completedCount / flatModules.length) * 100) : 0;
  const currentModule = currentNodeIndex >= 0 ? flatModules[currentNodeIndex] : null;

  const handleGenerateRoadmap = async () => {
    if (!authToken) {
      setError('Please login to generate a roadmap.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setNotice(null);
    try {
      const response = await api.generateRoadmap(authToken, {
        goal,
      });
      setRoadmap(response);
      try {
        const myCourses = await api.fetchMyCourses(authToken);
        const byModule: Record<string, UserCourse> = {};
        myCourses.courses.forEach((entry) => {
          byModule[entry.module_name] = entry;
        });
        setCoursesByModule(byModule);
      } catch {
        // Roadmap already generated; if course refresh fails we still show roadmap.
      }
      setView('roadmap');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate roadmap.';
      setError(message);
      if (message.toLowerCase().includes('already exists')) {
        try {
          const latest = await api.fetchLatestRoadmap(authToken);
          if ('roadmap_id' in latest) {
            setRoadmap(latest);
            setGoal(latest.goal);
            setView('roadmap');
          }
        } catch {
          // Keep original message if fallback fetch also fails.
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCourse = async (module: GeneratedModule) => {
    if (!roadmap || !authToken) return;

    const existingCourse = coursesByModule[module.title];
    const isCompleted = Boolean(existingCourse?.is_completed);
    const isLocked = !isCompleted && currentNodeIndex >= 0 && module.flatIndex > currentNodeIndex;

    if (isLocked) {
      setLockedHintNodeId(module.id);
      setTimeout(() => setLockedHintNodeId(null), 1500);
      setError('Complete previous course to unlock this one.');
      setNotice(null);
      return;
    }

    if (existingCourse) {
      setError(null);
      setNotice('Course already generated for this phase. Check it in the Courses section.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await api.generateCourse(authToken, {
        module_name: module.title,
        roadmap_id: roadmap.roadmap_id,
      });
      setCoursesByModule((prev) => ({
        ...prev,
        [module.title]: {
          id: `${roadmap.roadmap_id}-${module.id}`,
          user_id: '',
          module_name: module.title,
          roadmap_id: roadmap.roadmap_id,
          created_at: new Date().toISOString(),
          is_completed: false,
          completed_at: null,
          course: {
            title: `${module.title} Course`,
            lessons: [],
          },
        },
      }));
      setError(null);
      setNotice('Your course for this phase will be ready soon. Please check in the Courses section.');
    } catch (err) {
      setNotice(null);
      setError(err instanceof Error ? err.message : 'Failed to generate course.');
    } finally {
      setIsLoading(false);
    }
  };

  if (view === 'roadmap' && roadmap) {
    return (
      <div className="max-w-6xl mx-auto pt-0 pb-10 px-4 md:px-6 space-y-3">
        <div className="bg-white p-6 space-y-4">
          <Text className="text-xs font-bold uppercase tracking-widest text-brand-pink">Master Your Path</Text>
          <Heading as="h2">
            {currentModule ? `Phase ${currentModule.phaseIndex + 1}: ${currentModule.phaseTitle}` : 'All phases completed'}
          </Heading>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <Text className="text-text-secondary">Progress</Text>
              <Text className="text-text-secondary">{completedCount}/{flatModules.length} ({progressPercent}%)</Text>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                className="h-full bg-linear-to-r from-brand-pink to-brand-purple"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        {error && <Text className="text-red-500">{error}</Text>}
        {notice && <Text className="text-brand-purple">{notice}</Text>}

        <div className="relative bg-transparent py-0">
          <div className="relative overflow-x-auto pb-4">
            <div className="min-w-max px-4">
              <div className="relative h-[560px] flex items-center gap-10">
                <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-[6px] -translate-y-1/2 rounded-full border border-brand-pink/30 bg-brand-pink/10 shadow-inner" />
                <div
                  className="pointer-events-none absolute left-0 top-1/2 h-[6px] -translate-y-1/2 rounded-full bg-linear-to-r from-brand-pink to-brand-pink/70"
                  style={{
                    width:
                      flatModules.length > 1
                        ? `${Math.max(0, Math.min(100, (completedCount / (flatModules.length - 1)) * 100))}%`
                        : `${progressPercent}%`,
                  }}
                />
                {flatModules.map((module, index) => {
                  const hasCourse = Boolean(coursesByModule[module.title]);
                  const isCurrent = currentNodeIndex === index;
                  const isCompleted = Boolean(coursesByModule[module.title]?.is_completed);
                  const isLocked = !isCompleted && currentNodeIndex >= 0 && index > currentNodeIndex;
                  const status: RoadmapNodeStatus = hasCourse
                    ? isCompleted
                      ? 'completed'
                      : isCurrent
                        ? 'current'
                        : 'available'
                    : isCurrent
                      ? 'current'
                      : isLocked
                        ? 'locked'
                        : 'available';

                  return (
                    <RoadmapNode
                      key={module.id}
                      title={module.title}
                      status={status}
                      position={index % 2 === 0 ? 'top' : 'bottom'}
                      stepNumber={index + 1}
                      showHint={(isCurrent && !isLoading) || lockedHintNodeId === module.id}
                      hintText={isCurrent ? 'Start here!' : 'Complete previous module'}
                      onClick={() => handleGenerateCourse(module)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <Text className="text-xs text-text-secondary">Learning Path</Text>
            <Text className="text-xs text-text-secondary">Scroll horizontally to continue</Text>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto py-20 px-6 text-center">
        <Text>Loading your roadmap...</Text>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-20 px-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-gradient-premium flex items-center justify-center mx-auto">
          <Sparkles className="text-white w-10 h-10" />
        </div>
        <Heading as="h1">Generate <span className="text-gradient">Roadmap</span></Heading>
        <Text>Your roadmap is personalized from your DNA profile and career goal.</Text>
      </div>
      <Card className="p-8 space-y-6">
        <Input label="Goal" placeholder="Become AI Engineer" value={goal} onChange={(e) => setGoal(e.target.value)} />
        {error && <Text className="text-red-500">{error}</Text>}
        <Button variant="primary" className="w-full" onClick={handleGenerateRoadmap} disabled={!goal || isLoading}>
          {isLoading ? 'Generating...' : 'Generate Neural Roadmap'}
        </Button>
      </Card>
    </div>
  );
};
