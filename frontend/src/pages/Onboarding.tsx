import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Bot, Sparkles, ChevronRight, CheckCircle2, Search, Brain, Clock, Zap, Target, BookOpen, Map, BookMarked } from 'lucide-react';

const steps = [
  'Welcome',
  'Career Goal',
  'Current Skill Level',
  'Learning Style',
  'Interests',
  'Commitment Level',
  'AI Analysis',
  'Your Roadmap'
];

interface RoadmapModule {
  title: string;
  description: string;
  skills_learned: string[];
  technologies_used: string[];
  difficulty_level: string;
  estimated_duration: string;
}

export default function Onboarding() {
  const { user, refreshUserData } = useAuth();
  const navigate = useNavigate();

  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState({
    career_goal: '',
    skill_level: '',
    learning_style: '',
    interests: '',
    weekly_commitment: ''
  });

  const [aiSteps, setAiSteps] = useState(0);
  const [roadmap, setRoadmap] = useState<{ modules: RoadmapModule[] } | null>(null);

  // Constants
  const careers = ['AI Engineer', 'Doctor', 'Robotics Engineer', 'Climate Scientist', 'Game Developer', 'Data Scientist', 'Full Stack Developer', 'Cloud Architect'];
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced'];
  const learningStyles = ['Visual (videos, diagrams)', 'Text-based (reading)', 'Hands-on (projects)'];
  const interestTags = ['AI', 'Space', 'Robotics', 'Medicine', 'Environment', 'Programming', 'Finance', 'Design'];
  const commitments = ['5 hours', '10 hours', '20 hours'];

  const nextStep = () => {
    if (stepIndex < steps.length - 1) setStepIndex(stepIndex + 1);
  };

  const handleInterestToggle = (tag: string) => {
    const current = formData.interests.split(',').map(s => s.trim()).filter(Boolean);
    if (current.includes(tag)) {
      setFormData({ ...formData, interests: current.filter(t => t !== tag).join(', ') });
    } else {
      setFormData({ ...formData, interests: [...current, tag].join(', ') });
    }
  };

  useEffect(() => {
    if (stepIndex === 6) {
      const timers = [
        setTimeout(() => setAiSteps(1), 800),
        setTimeout(() => setAiSteps(2), 1600),
        setTimeout(() => setAiSteps(3), 2400),
        setTimeout(() => setAiSteps(4), 3200),
      ];
      generateRoadmap();
      return () => timers.forEach(clearTimeout);
    }
  }, [stepIndex]);

  const generateRoadmap = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.uid || 'temp_user',
          ...formData
        })
      });

      let data;
      if (res.ok) {
        data = await res.json();
      } else {
        const resExp = await fetch('/api/generate-roadmap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            careerGoal: formData.career_goal,
            learningStyle: formData.learning_style,
            skillLevel: formData.skill_level
          })
        });

        if (resExp.ok) {
           const groqRes = await resExp.json();
           data = { 
              modules: groqRes.map((m: any) => ({
                 title: m.title, 
                 description: m.description, 
                 skills_learned: [], 
                 technologies_used: [],
                 difficulty_level: 'Mixed',
                 estimated_duration: '2 weeks'
              })) 
           };
        } else {
           throw new Error('All backend calls failed');
        }
      }

      setRoadmap(data);
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          onboarded: true,
          careerGoal: formData.career_goal,
          skillLevel: formData.skill_level,
          learningStyle: formData.learning_style
        }, { merge: true });

        await setDoc(doc(db, 'roadmaps', user.uid), {
          userId: user.uid,
          careerGoal: formData.career_goal,
          modules: data.modules || data,
          createdAt: new Date().toISOString()
        });
        await refreshUserData();
      }
      setTimeout(() => setStepIndex(7), 1000);
    } catch (e) {
      console.error(e);
      const mock = {
        modules: [
          { title: 'Foundations', description: 'Master the core principles of ' + formData.career_goal, skills_learned: ['Logic', 'Problem Solving'], technologies_used: ['Core Tools'], difficulty_level: 'Beginner', estimated_duration: '2 weeks' },
          { title: 'Skill Building', description: 'Developing practical skills through labs.', skills_learned: ['Implementation', 'Debugging'], technologies_used: ['Advanced Tools'], difficulty_level: 'Intermediate', estimated_duration: '3 weeks' },
          { title: 'Final Project', description: 'Apply your DNA in a capstone project.', skills_learned: ['Architecture', 'Deployment'], technologies_used: ['Production Stack'], difficulty_level: 'Advanced', estimated_duration: '4 weeks' }
        ]
      };
      setRoadmap(mock);
      setTimeout(() => setStepIndex(7), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-hidden flex flex-col items-center justify-center relative">
      {/* Soft Background Accents */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-pink-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header Logo */}
      <div className="absolute top-8 left-8 flex items-center space-x-2 text-indigo-600">
        <Sparkles size={24} />
        <span className="font-bold text-xl tracking-wider text-slate-900">MyEduDNA</span>
      </div>

      {/* Progress Indicator */}
      {stepIndex > 0 && stepIndex < 6 && (
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]"
            initial={{ width: `${(stepIndex / 6) * 100}%` }}
            animate={{ width: `${(stepIndex / 6) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      {/* Content Area */}
      <div className="w-full max-w-2xl px-6 relative z-10">
        <AnimatePresence mode="wait">
          
          {stepIndex === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="text-center"
            >
              <div className="w-24 h-24 mx-auto bg-indigo-50 border border-indigo-100 rounded-[2rem] flex items-center justify-center mb-10 rotate-3 transition-transform hover:rotate-0 shadow-sm">
                <Brain className="text-indigo-600 w-12 h-12" />
              </div>
              <h1 className="text-5xl font-black mb-6 tracking-tight">
                Welcome to <span className="gradient-text">MyEduDNA</span>
              </h1>
              <p className="text-xl text-slate-500 mb-12 font-medium">Let's design your high-performance learning journey.</p>
              <button 
                onClick={nextStep}
                className="btn-primary flex items-center mx-auto space-x-3"
              >
                <span>Start Discovery</span>
                <ChevronRight size={20} />
              </button>
            </motion.div>
          )}

          {stepIndex === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <h2 className="text-4xl font-black mb-10 text-center tracking-tight">What do you want to become?</h2>
              <div className="relative mb-8">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search career fields..."
                  value={formData.career_goal}
                  onChange={e => setFormData({...formData, career_goal: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-6 pl-14 pr-6 text-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                />
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                {careers.map(c => (
                  <button 
                    key={c}
                    onClick={() => { setFormData({...formData, career_goal: c}); nextStep(); }}
                    className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all text-sm font-semibold text-slate-600 shadow-sm"
                  >
                    {c}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={nextStep}
                disabled={!formData.career_goal}
                className="mt-12 w-full btn-primary disabled:opacity-30"
              >
                Continue
              </button>
            </motion.div>
          )}

          {stepIndex === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <h2 className="text-4xl font-black mb-10 text-center tracking-tight">What is your current level?</h2>
              <div className="grid gap-5">
                {skillLevels.map(level => (
                  <button 
                    key={level}
                    onClick={() => setFormData({...formData, skill_level: level})}
                    className={`p-8 text-left rounded-3xl border-2 transition-all flex items-center justify-between group ${
                      formData.skill_level === level 
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-500/5' 
                      : 'border-slate-100 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className={`text-2xl font-bold ${formData.skill_level === level ? 'text-indigo-600' : 'text-slate-700'}`}>{level}</span>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${formData.skill_level === level ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200'}`}>
                      {formData.skill_level === level && <CheckCircle2 className="text-white" size={18} />}
                    </div>
                  </button>
                ))}
              </div>
              <button 
                onClick={nextStep}
                disabled={!formData.skill_level}
                className="mt-12 w-full btn-primary disabled:opacity-30"
              >
                Continue
              </button>
            </motion.div>
          )}

          {stepIndex === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <h2 className="text-4xl font-black mb-10 text-center tracking-tight">How do you learn best?</h2>
              <div className="grid gap-5">
                {learningStyles.map((style, i) => (
                  <button 
                    key={style}
                    onClick={() => setFormData({...formData, learning_style: style})}
                    className={`p-8 text-left rounded-3xl border-2 transition-all flex items-center justify-between ${
                      formData.learning_style === style 
                      ? 'border-pink-500 bg-pink-50/50 shadow-lg shadow-pink-500/5' 
                      : 'border-slate-100 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${formData.learning_style === style ? 'bg-pink-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {i === 0 ? <Zap size={24} /> : i === 1 ? <BookOpen size={24} /> : <Target size={24} />}
                      </div>
                      <span className={`text-2xl font-bold ${formData.learning_style === style ? 'text-pink-600' : 'text-slate-700'}`}>{style}</span>
                    </div>
                    {formData.learning_style === style && <CheckCircle2 className="text-pink-500" size={24} />}
                  </button>
                ))}
              </div>
              <button 
                onClick={nextStep}
                disabled={!formData.learning_style}
                className="mt-12 w-full btn-primary disabled:opacity-30"
              >
                Continue
              </button>
            </motion.div>
          )}

          {stepIndex === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <h2 className="text-4xl font-black mb-6 text-center tracking-tight">Your Core Interests</h2>
              <p className="text-center text-slate-500 mb-10 font-medium">Select what fuels your passion.</p>
              <div className="flex flex-wrap gap-4 justify-center">
                {interestTags.map(tag => {
                  const isSelected = formData.interests.includes(tag);
                  return (
                    <button 
                      key={tag}
                      onClick={() => handleInterestToggle(tag)}
                      className={`px-8 py-4 rounded-2xl border-2 transition-all text-xl font-bold ${
                        isSelected 
                        ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-transparent shadow-xl shadow-indigo-500/20 scale-105' 
                        : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
              <button 
                onClick={nextStep}
                disabled={!formData.interests}
                className="mt-12 w-full btn-primary disabled:opacity-30"
              >
                Confirm Interests ({formData.interests.split(',').filter(Boolean).length})
              </button>
            </motion.div>
          )}

          {stepIndex === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <h2 className="text-4xl font-black mb-10 text-center tracking-tight">Commitment Level</h2>
              <div className="grid grid-cols-3 gap-5">
                {commitments.map(time => (
                  <button 
                    key={time}
                    onClick={() => setFormData({...formData, weekly_commitment: time})}
                    className={`py-12 rounded-3xl border-2 transition-all flex flex-col items-center justify-center space-y-4 ${
                      formData.weekly_commitment === time 
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xl shadow-indigo-500/10' 
                      : 'border-slate-100 bg-white hover:border-slate-300'
                    }`}
                  >
                    <Clock size={40} className={formData.weekly_commitment === time ? "text-indigo-600 transition-transform scale-110" : "text-slate-300"} />
                    <span className={`text-xl font-black ${formData.weekly_commitment === time ? 'text-indigo-600' : 'text-slate-700'}`}>{time}</span>
                  </button>
                ))}
              </div>
              <button 
                onClick={nextStep}
                disabled={!formData.weekly_commitment}
                className="mt-12 w-full btn-primary shadow-2xl"
              >
                Assemble DNA
              </button>
            </motion.div>
          )}

          {stepIndex === 6 && (
            <motion.div
              key="step-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-40 h-40 mx-auto relative mb-12">
                <div className="absolute inset-0 bg-indigo-500 rounded-[3rem] animate-ping opacity-10" />
                <div className="absolute inset-4 bg-white border border-indigo-100 rounded-[2.5rem] flex items-center justify-center shadow-2xl">
                  <Bot size={60} className="text-indigo-600 animate-bounce" />
                </div>
              </div>

              <h2 className="text-4xl font-black mb-10 blink tracking-tight">Sequencing your Learning DNA...</h2>

              <div className="max-w-md mx-auto space-y-6">
                {[
                  "Analyzing career requirements",
                  "Mapping required skills",
                  "Generating learning modules",
                  "Designing roadmap"
                ].map((txt, i) => (
                  <div key={i} className="flex items-center space-x-5 text-left p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${aiSteps >= i + 1 ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                      {aiSteps >= i + 1 ? <CheckCircle2 size={18} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-slate-400" />}
                    </div>
                    <span className={`text-lg font-bold transition-colors ${aiSteps >= i + 1 ? "text-slate-900" : "text-slate-400"}`}>{txt}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {stepIndex === 7 && roadmap && (
            <motion.div
              key="step-7"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl w-full"
            >
              <div className="text-center mb-16">
                <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-sm font-bold mb-4">
                  <Sparkles size={16} />
                  <span>AI Architecture Complete</span>
                </div>
                <h2 className="text-5xl font-black mb-4 tracking-tight">
                  Your Learning <span className="gradient-text">DNA</span>
                </h2>
                <p className="text-xl text-slate-500 font-medium">{formData.career_goal} • {formData.weekly_commitment} commitment</p>
              </div>

              <div className="relative border-l-4 border-indigo-100 ml-10 py-6 space-y-16">
                {roadmap.modules.map((mod, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="relative pl-12"
                  >
                    <div className="absolute -left-[14px] top-8 w-6 h-6 bg-white border-4 border-indigo-600 rounded-full z-10 shadow-lg shadow-indigo-200" />

                    <div className="glass-card hover:border-indigo-300 group cursor-pointer">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex-grow">
                          <div className="flex items-center space-x-3 mb-4">
                            <span className="px-4 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-black uppercase tracking-wider">
                              Phase {i + 1}
                            </span>
                            <span className="text-sm text-slate-400 flex items-center font-bold">
                              <Clock size={14} className="mr-1.5" /> {mod.estimated_duration}
                            </span>
                          </div>
                          <h3 className="text-2xl font-black mb-3 group-hover:text-indigo-600 transition-colors tracking-tight">{mod.title}</h3>
                          <p className="text-slate-500 text-lg mb-6 leading-relaxed font-medium">{mod.description}</p>
                          
                          <div className="flex flex-wrap gap-3">
                            {mod.technologies_used?.map((tech, j) => (
                              <span key={j} className="text-sm px-4 py-1.5 bg-slate-50 text-slate-600 rounded-xl font-bold flex items-center border border-slate-100"><Map size={14} className="mr-2 text-indigo-400"/> {tech}</span>
                            ))}
                            {mod.skills_learned?.map((skill, j) => (
                              <span key={j} className="text-sm px-4 py-1.5 bg-slate-50 text-slate-600 rounded-xl font-bold flex items-center border border-slate-100"><BookMarked size={14} className="mr-2 text-pink-400"/> {skill}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="px-4 py-2 rounded-2xl bg-indigo-50 text-indigo-700 text-sm font-black border border-indigo-100 uppercase tracking-widest">
                            {mod.difficulty_level}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-20 text-center pb-20">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="btn-primary"
                >
                  Enter My Personal Dashboard
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
