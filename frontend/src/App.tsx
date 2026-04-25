/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { PageTransition, NeuralLoading } from './components/DesignSystem/Transitions';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { DashboardOverview } from './components/Dashboard/Overview';
import { LandingPage } from './components/Landing/LandingPage';
import { LoginPage, SignupPage } from './components/Auth/AuthPages';
import { QuizInterface } from './components/Quiz/QuizInterface';
import { FeatureTour } from './components/Dashboard/FeatureTour';
import { CareerRoadmap } from './components/Roadmap/CareerRoadmap';
import { VirtualLab } from './components/Lab/VirtualLab';
import { MentorshipPage } from './components/Mentorship/MentorshipPage';
import { SettingsPage } from './components/Settings/SettingsPage';
import { Text } from './components/DesignSystem/Typography';
import { CourseView } from './components/Course/CourseView';
import { CoursesCatalog } from './components/Course/CoursesCatalog';
import { api, RoadmapResponse, UserCourse, UserProfile } from './lib/api';
import { MySessionsPage } from './components/Mentorship/MySessionsPage';

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard' | 'login' | 'signup' | 'quiz' | 'roadmap' | 'lab' | 'network' | 'settings' | 'courses' | 'course-player' | 'sessions'>('landing');
  const [showTour, setShowTour] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [userLevel, setUserLevel] = useState<'School' | 'Undergraduate'>('Undergraduate');
  const [dnaData, setDnaData] = useState<{
    accuracy: number;
    score: number;
    categories: Record<string, { correct: number; total: number }>;
    learningStyle: string;
    strengths: string[];
  } | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [latestRoadmap, setLatestRoadmap] = useState<RoadmapResponse | null>(null);
  const [myCourses, setMyCourses] = useState<UserCourse[]>([]);
  const [activeCourse, setActiveCourse] = useState<UserCourse | null>(null);
  const [isCoursesLoading, setIsCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const appViews = new Set([
    'landing',
    'dashboard',
    'login',
    'signup',
    'quiz',
    'roadmap',
    'lab',
    'network',
    'settings',
    'courses',
    'course-player',
    'sessions',
  ]);

  const goToDashboard = (resultsOrRole?: any) => {
    if (resultsOrRole && typeof resultsOrRole === 'object') {
      setDnaData(resultsOrRole);
    }
    
    setIsSyncing(true);
    setTimeout(() => {
      if (typeof resultsOrRole === 'object') {
        setShowTour(true);
      }
      setView('dashboard');
      setIsSyncing(false);
    }, 1500);
  };
  const goToAssessment = (level?: string) => {
    if (level) setUserLevel(level as any);
    setIsSyncing(true);
    setTimeout(() => {
      setView('quiz');
      setIsSyncing(false);
    }, 1500);
  };
  const goToLogin = () => setView('login');
  const goToSignup = () => setView('signup');
  const goToLanding = () => setView('landing');

  useEffect(() => {
    const loadProfile = async () => {
      if (!authToken) return;
      try {
        const profile = await api.fetchMe(authToken);
        setCurrentUser(profile);
        const roadmapResponse = await api.fetchLatestRoadmap(authToken);
        if ('roadmap' in roadmapResponse && roadmapResponse.roadmap === null) {
          setLatestRoadmap(null);
        } else {
          setLatestRoadmap(roadmapResponse as RoadmapResponse);
        }
      } catch {
        setCurrentUser(null);
        setLatestRoadmap(null);
      }
    };
    loadProfile();
  }, [authToken, view]);

  useEffect(() => {
    const loadCourses = async () => {
      if (!authToken) return;
      setIsCoursesLoading(true);
      setCoursesError(null);
      try {
        const response = await api.fetchMyCourses(authToken);
        setMyCourses(response.courses);
      } catch (err) {
        setCoursesError(err instanceof Error ? err.message : 'Failed to load courses.');
      } finally {
        setIsCoursesLoading(false);
      }
    };
    loadCourses();
  }, [authToken, view]);

  const refreshCourses = async () => {
    if (!authToken) return;
    setIsCoursesLoading(true);
    setCoursesError(null);
    try {
      const response = await api.fetchMyCourses(authToken);
      setMyCourses(response.courses);
    } catch (err) {
      setCoursesError(err instanceof Error ? err.message : 'Failed to load courses.');
    } finally {
      setIsCoursesLoading(false);
    }
  };

  const goToQuiz = () => setView('quiz');
  const goToRoadmap = () => setView('roadmap');

  const handleNavigate = (v: string) => {
    if (v === 'landing') goToLanding();
    else setView(v as any);
  };

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (!hash || !appViews.has(hash)) return;
    setView(hash as typeof view);
  }, []);

  useEffect(() => {
    const nextHash = `#${view}`;
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, '', nextHash);
    }
    
    // Auto-redirect if already logged in and on landing/login/signup
    if (authToken && (view === 'landing' || view === 'login' || view === 'signup')) {
      setView('dashboard');
    }
  }, [view, authToken]);

  if (view === 'landing') {
    return <LandingPage onEnterApp={goToLogin} />;
  }

  if (view === 'login') {
    return <LoginPage onSwitch={goToSignup} onLogin={(token) => {
      localStorage.setItem('auth_token', token);
      setAuthToken(token);
      goToDashboard();
    }} />;
  }

  if (view === 'signup') {
    return <SignupPage onSwitch={goToLogin} onSignup={(token, level) => {
      localStorage.setItem('auth_token', token);
      setAuthToken(token);
      goToAssessment(level);
    }} />;
  }

  const renderDashboardView = () => {
    switch (view) {
      case 'dashboard':
        return (
          <PageTransition key="dashboard">
            <DashboardOverview
              onStartQuiz={goToQuiz}
              dnaData={dnaData}
              onNavigate={handleNavigate}
              userName={currentUser?.name}
              roadmapModules={
                latestRoadmap
                  ? latestRoadmap.roadmap.phases.flatMap((phase, phaseIndex) =>
                      phase.modules.map((module, moduleIndex) => ({
                        id: `${phaseIndex}-${moduleIndex}`,
                        title: module,
                        progress: 0,
                        status: 'Generated',
                      }))
                    )
                  : []
              }
            />
            

          </PageTransition>
        );
      case 'quiz':
        return (
          <PageTransition key="quiz">
            <QuizInterface onComplete={goToDashboard} userLevel={userLevel} authToken={authToken} />
          </PageTransition>
        );
      case 'roadmap':
        return (
          <PageTransition key="roadmap">
            <CareerRoadmap authToken={authToken} />
          </PageTransition>
        );
      case 'lab':
        return (
          <PageTransition key="lab">
            <VirtualLab />
          </PageTransition>
        );
      case 'network':
        return (
          <PageTransition key="network">
            <MentorshipPage dnaData={dnaData} authToken={authToken} />
          </PageTransition>
        );
      case 'courses':
        return (
          <PageTransition key="courses">
            <CoursesCatalog
              courses={myCourses}
              isLoading={isCoursesLoading}
              error={coursesError}
              onOpenRoadmap={() => setView('roadmap')}
              onOpenCourse={(course) => {
                setActiveCourse(course);
                setView('course-player');
              }}
              authToken={authToken}
              onRefreshCourses={refreshCourses}
            />
          </PageTransition>
        );
      case 'course-player': {
        if (!activeCourse) {
          return (
            <PageTransition key="course-player-empty">
              <Text className="text-text-secondary">No course selected.</Text>
            </PageTransition>
          );
        }

        const phaseTitle =
          latestRoadmap?.roadmap.phases.find((phase) => phase.modules.includes(activeCourse.module_name))?.title ||
          'Learning Phase';
        const lessons = activeCourse.course.lessons.map((lesson, idx) => ({
          id: `${activeCourse.id}-${idx}`,
          title: lesson.content?.slice(0, 40) || `${lesson.type} lesson`,
          type: lesson.type === 'quiz' ? 'quiz' : lesson.type === 'video' ? 'video' : 'reading',
          duration: '10m',
          completed: false,
          content: lesson.content,
          questions: lesson.questions ?? null,
        }));

        return (
          <PageTransition key={`course-player-${activeCourse.id}`}>
            <CourseView
              courseTitle={activeCourse.course.title || activeCourse.module_name}
              phaseTitle={phaseTitle}
              description={`Generated from module ${activeCourse.module_name}`}
              lessons={lessons}
              onBack={() => setView('courses')}
            />
          </PageTransition>
        );
      }


      case 'sessions':
        return (
          <PageTransition key="sessions">
            <MySessionsPage authToken={authToken} onNavigate={handleNavigate} />
          </PageTransition>
        );
      case 'settings':
        return (
          <PageTransition key="settings">
            <SettingsPage />
          </PageTransition>
        );
      default:
        return null;
    }
  };

  const isFullPageQuiz = view === 'quiz';

  return (
    <>
      <AnimatePresence>
        {isSyncing && <NeuralLoading key="loading" />}
      </AnimatePresence>
      
      {showTour && view !== 'quiz' && (
        <FeatureTour onComplete={() => setShowTour(false)} />
      )}
      
      {isFullPageQuiz ? (
        <div className="min-h-screen bg-bg-light relative overflow-y-auto pt-10 pb-20">
          {/* Subtle Background Accents */}
          <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[10%] right-[5%] w-[600px] h-[600px] bg-brand-pink/5 rounded-full blur-[140px]" />
            <div className="absolute bottom-[10%] left-[5%] w-[500px] h-[500px] bg-brand-purple/5 rounded-full blur-[120px]" />
          </div>
          
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4">
            <AnimatePresence mode="wait">
              {renderDashboardView()}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <DashboardLayout
          currentView={view}
          onNavigate={handleNavigate}
          userName={currentUser?.name}
          userEmail={currentUser?.email}
        >
          <AnimatePresence mode="wait">
            {renderDashboardView()}
          </AnimatePresence>
        </DashboardLayout>
      )}
    </>
  );
}
