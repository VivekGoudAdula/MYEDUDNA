/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
import { Heading, Text } from './components/DesignSystem/Typography';
import { Button } from './components/DesignSystem/Button';
import { Input } from './components/DesignSystem/Input';
import { Card } from './components/DesignSystem/Card';
import { CourseView } from './components/Course/CourseView';

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard' | 'login' | 'signup' | 'quiz' | 'roadmap' | 'lab' | 'network' | 'settings' | 'courses'>('landing');
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
  const goToQuiz = () => setView('quiz');
  const goToRoadmap = () => setView('roadmap');

  const handleNavigate = (v: string) => {
    if (v === 'landing') goToLanding();
    else setView(v as any);
  };

  if (view === 'landing') {
    return <LandingPage onEnterApp={goToLogin} />;
  }

  if (view === 'login') {
    return <LoginPage onSwitch={goToSignup} onLogin={goToDashboard} />;
  }

  if (view === 'signup') {
    return <SignupPage onSwitch={goToLogin} onSignup={(level) => goToAssessment(level)} />;
  }

  const renderDashboardView = () => {
    switch (view) {
      case 'dashboard':
        return (
          <PageTransition key="dashboard">
            <div className="flex justify-between items-center mb-8">
              <Button variant="ghost" onClick={goToLanding} size="sm" className="gap-2">
                 ← Log Out
              </Button>
            </div>
            <DashboardOverview onStartQuiz={goToQuiz} dnaData={dnaData} onNavigate={handleNavigate} />
            

          </PageTransition>
        );
      case 'quiz':
        return (
          <PageTransition key="quiz">
            <QuizInterface onComplete={goToDashboard} userLevel={userLevel} />
          </PageTransition>
        );
      case 'roadmap':
        return (
          <PageTransition key="roadmap">
            <CareerRoadmap />
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
            <MentorshipPage dnaData={dnaData} />
          </PageTransition>
        );
      case 'courses':
        return (
          <PageTransition key="courses">
            <div className="space-y-8">
               <Heading as="h1">Available <span className="text-gradient">Courses</span></Heading>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    { id: 'c1', title: 'Neural Architecture 101', phase: 'Phase 1', desc: 'Understanding the fundamentals of neural sync.' },
                    { id: 'c2', title: 'Quantum Logic Systems', phase: 'Phase 2', desc: 'Advanced logic gates and quantum computing basics.' },
                    { id: 'c3', title: 'Bio-Digital Interface Design', phase: 'Phase 3', desc: 'Designing interfaces for biological data streams.' },
                  ].map(course => (
                    <Card key={course.id} className="p-8 space-y-4 hover:shadow-xl transition-all cursor-pointer border-border-light bg-white" onClick={() => setView('roadmap')}>
                       <div className="w-12 h-12 rounded-xl bg-brand-pink/5 flex items-center justify-center border border-brand-pink/10">
                          <BookOpen className="w-6 h-6 text-brand-pink" />
                       </div>
                       <div>
                          <Text className="text-[10px] font-bold text-brand-pink uppercase tracking-widest">{course.phase}</Text>
                          <Heading as="h3" className="text-xl">{course.title}</Heading>
                       </div>
                       <Text className="text-sm text-text-secondary">{course.desc}</Text>
                       <Button variant="outline" className="w-full">View Details</Button>
                    </Card>
                  ))}
               </div>
            </div>
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
        <DashboardLayout currentView={view} onNavigate={handleNavigate}>
          <AnimatePresence mode="wait">
            {renderDashboardView()}
          </AnimatePresence>
        </DashboardLayout>
      )}
    </>
  );
}
