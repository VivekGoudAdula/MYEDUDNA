import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { 
  Play, CheckCircle2, Lock, ChevronRight, 
  Video, FileText, Code, HelpCircle, ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

const Roadmap = () => {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<any>(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      if (!user) return;
      const docSnap = await getDoc(doc(db, 'roadmaps', user.uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRoadmap(data);
        setSelectedModule(data.modules[0]);
      }
      setLoading(false);
    };
    fetchRoadmap();
  }, [user]);

  const handleComplete = async (moduleId: string) => {
    if (!user || !roadmap) return;
    
    const updatedModules = roadmap.modules.map((m: any, idx: number) => {
      if (m.id === moduleId) {
        return { ...m, status: 'completed', progress: 100 };
      }
      // Unlock next module
      if (idx > 0 && roadmap.modules[idx-1].id === moduleId) {
        return { ...m, status: 'in-progress' };
      }
      return m;
    });

    // Simple logic to unlock the next one
    const currentIdx = roadmap.modules.findIndex((m: any) => m.id === moduleId);
    if (currentIdx < updatedModules.length - 1) {
      updatedModules[currentIdx + 1].status = 'in-progress';
    }

    const updatedRoadmap = { ...roadmap, modules: updatedModules };
    setRoadmap(updatedRoadmap);
    await updateDoc(doc(db, 'roadmaps', user.uid), { modules: updatedModules });
  };

  if (loading) return <div className="p-8 text-center">Loading your DNA Roadmap...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 flex items-center text-sm mb-2">
            <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Learning <span className="gradient-text">DNA Roadmap</span></h1>
          <p className="text-slate-600">Path: {roadmap?.careerGoal}</p>
        </div>
        <div className="glass px-4 py-2 rounded-full text-sm font-medium text-indigo-600">
          {Math.round((roadmap?.modules?.filter((m: any) => m.status === 'completed').length / roadmap?.modules?.length) * 100)}% Complete
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Module List */}
        <div className="lg:col-span-4 space-y-4">
          {roadmap?.modules?.map((module: any, idx: number) => (
            <motion.button
              key={module.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => module.status !== 'locked' && setSelectedModule(module)}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                selectedModule?.id === module.id 
                  ? 'bg-indigo-50 border-indigo-500 shadow-lg shadow-indigo-500/10' 
                  : 'glass border-slate-100 hover:border-slate-200'
              } ${module.status === 'locked' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    module.status === 'completed' ? 'bg-emerald-500 text-white' :
                    module.status === 'in-progress' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {module.status === 'completed' ? <CheckCircle2 size={16} /> : idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{module.title}</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{module.status}</p>
                  </div>
                </div>
                {module.status === 'locked' && <Lock size={14} className="text-slate-400" />}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Module Content */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedModule && (
              <motion.div
                key={selectedModule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card"
              >
                <div className="aspect-video bg-slate-100 rounded-xl mb-6 flex items-center justify-center relative group overflow-hidden">
                  <img 
                    src={`https://picsum.photos/seed/${selectedModule.id}/800/450`} 
                    alt={selectedModule.title}
                    className="w-full h-full object-cover opacity-80"
                    referrerPolicy="no-referrer"
                  />
                  <button className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
                      <Play size={32} className="text-white ml-1" />
                    </div>
                  </button>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-slate-900">{selectedModule.title}</h2>
                  <p className="text-slate-600 leading-relaxed">{selectedModule.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <button className="flex items-center space-x-3 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100">
                    <Video size={20} className="text-indigo-600" />
                    <span className="text-sm font-medium text-slate-700">Watch Video</span>
                  </button>
                  <button className="flex items-center space-x-3 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100">
                    <FileText size={20} className="text-purple-600" />
                    <span className="text-sm font-medium text-slate-700">Read Notes</span>
                  </button>
                  <button className="flex items-center space-x-3 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100">
                    <Code size={20} className="text-pink-600" />
                    <span className="text-sm font-medium text-slate-700">Practice Project</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                  <div className="flex items-center space-x-2 text-slate-500 text-sm">
                    <HelpCircle size={16} />
                    <span>Stuck? Ask your AI Mentor</span>
                  </div>
                  {selectedModule.status !== 'completed' && (
                    <button 
                      onClick={() => handleComplete(selectedModule.id)}
                      className="btn-primary"
                    >
                      Complete Module
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
