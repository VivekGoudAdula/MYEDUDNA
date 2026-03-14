import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { Sparkles, Brain, Target, Zap, Loader2 } from 'lucide-react';

const Onboarding = () => {
  const { user, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    careerGoal: '',
    learningStyle: 'Visual',
    skillLevel: 'Beginner'
  });

  const careerGoals = [
    "Full Stack Developer",
    "Data Scientist",
    "AI/ML Engineer",
    "Quantum Computing Specialist",
    "Cybersecurity Analyst",
    "UX/UI Designer",
    "Cloud Architect",
    "Blockchain Developer"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      // 1. Update user profile
      await updateDoc(doc(db, 'users', user.uid), {
        ...formData,
        onboarded: true
      });

      // 2. Call AI endpoint to generate roadmap
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to generate roadmap');
      
      const modules = await response.json();

      // 3. Save roadmap to Firestore
      await setDoc(doc(db, 'roadmaps', user.uid), {
        userId: user.uid,
        careerGoal: formData.careerGoal,
        modules,
        createdAt: new Date().toISOString()
      });

      await refreshUserData();
      navigate('/dashboard');
    } catch (error) {
      console.error("Onboarding error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 text-slate-900">Initialize Your <span className="gradient-text">Learning DNA</span></h1>
        <p className="text-slate-600">Tell us about your goals so our AI can architect your personalized path.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="glass-card text-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <Target size={24} />
          </div>
          <h3 className="font-bold mb-1 text-slate-900">Set Goal</h3>
          <p className="text-xs text-slate-500">Pick your dream career</p>
        </div>
        <div className="glass-card text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
            <Brain size={24} />
          </div>
          <h3 className="font-bold mb-1 text-slate-900">Learning Style</h3>
          <p className="text-xs text-slate-500">How you learn best</p>
        </div>
        <div className="glass-card text-center">
          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-600">
            <Zap size={24} />
          </div>
          <h3 className="font-bold mb-1 text-slate-900">Skill Level</h3>
          <p className="text-xs text-slate-500">Where you are starting</p>
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        className="glass-card max-w-2xl mx-auto space-y-8"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">What is your dream career goal?</label>
          <select
            required
            value={formData.careerGoal}
            onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm"
          >
            <option value="" disabled>Select a career path</option>
            {careerGoals.map(goal => (
              <option key={goal} value={goal}>{goal}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Preferred Learning Style</label>
          <div className="grid grid-cols-3 gap-4">
            {['Visual', 'Text', 'Project Based'].map(style => (
              <button
                key={style}
                type="button"
                onClick={() => setFormData({ ...formData, learningStyle: style })}
                className={`py-3 px-2 rounded-xl border transition-all text-sm ${
                  formData.learningStyle === style
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Current Skill Level</label>
          <div className="grid grid-cols-3 gap-4">
            {['Beginner', 'Intermediate', 'Advanced'].map(level => (
              <button
                key={level}
                type="button"
                onClick={() => setFormData({ ...formData, skillLevel: level })}
                className={`py-3 px-2 rounded-xl border transition-all text-sm ${
                  formData.skillLevel === level
                    ? 'bg-pink-50 border-pink-500 text-pink-700 font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !formData.careerGoal}
          className="w-full btn-primary flex items-center justify-center space-x-2 py-4"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Architecting Your DNA...</span>
            </>
          ) : (
            <>
              <Sparkles size={20} />
              <span>Generate AI Roadmap</span>
            </>
          )}
        </button>
      </motion.form>
    </div>
  );
};

export default Onboarding;
