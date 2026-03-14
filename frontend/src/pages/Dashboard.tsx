import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';
import { 
  TrendingUp, CheckCircle2, Clock, Award, 
  ArrowRight, Play, Beaker, Users, ChevronRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, userData } = useAuth();
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      if (!user) return;
      
      try {
        // 1. Try fetching from FastAPI SQLite backend first
        const res = await fetch(`http://127.0.0.1:8000/roadmap/${user.uid}`);
        if (res.ok) {
          const data = await res.json();
          setRoadmap(data);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.log("FastAPI roadmap fetch failed, trying Firebase...");
      }

      // 2. Fallback to Firebase Firestore
      const docSnap = await getDoc(doc(db, 'roadmaps', user.uid));
      if (docSnap.exists()) {
        setRoadmap(docSnap.data());
      }
      setLoading(false);
    };
    fetchRoadmap();
  }, [user]);

  const skillData = [
    { subject: 'Theory', A: 80, fullMark: 150 },
    { subject: 'Practice', A: 65, fullMark: 150 },
    { subject: 'Logic', A: 90, fullMark: 150 },
    { subject: 'Design', A: 70, fullMark: 150 },
    { subject: 'Speed', A: 55, fullMark: 150 },
    { subject: 'Accuracy', A: 85, fullMark: 150 },
  ];

  const progressData = [
    { name: 'Week 1', progress: 20 },
    { name: 'Week 2', progress: 45 },
    { name: 'Week 3', progress: 30 },
    { name: 'Week 4', progress: 60 },
  ];

  if (loading) return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="h-32 w-full bg-slate-100 animate-pulse rounded-[2rem]"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="h-64 bg-slate-100 animate-pulse rounded-[2rem]"></div>
        <div className="h-64 bg-slate-100 animate-pulse rounded-[2rem]"></div>
        <div className="h-64 bg-slate-100 animate-pulse rounded-[2rem]"></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold mb-2 text-slate-900">Welcome back, {user?.email?.split('@')[0]}!</h1>
        <p className="text-slate-600">You're making great progress on your <span className="text-indigo-600 font-semibold">{userData?.careerGoal}</span> path.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Progress Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <TrendingUp size={120} />
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
                <Clock className="text-indigo-600" size={20} />
                <span>Current Learning Progress</span>
              </h3>
              <div className="flex items-end space-x-4 mb-8">
                <span className="text-5xl font-bold">64%</span>
                <span className="text-slate-600 mb-2">Overall Completion</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mb-8">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '64%' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                ></motion.div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-slate-100">
                  <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Modules</p>
                  <p className="text-xl font-bold">12/18</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-slate-100">
                  <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Hours</p>
                  <p className="text-xl font-bold">42.5</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-slate-100">
                  <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Projects</p>
                  <p className="text-xl font-bold">4</p>
                </div>
              </div>
            </div>
          </div>

          {/* Active Roadmap Preview */}
          <div className="glass-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Next in your Roadmap</h3>
              <Link to="/roadmap" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center">
                View Full Path <ChevronRight size={16} />
              </Link>
            </div>
            <div className="space-y-4">
              {roadmap?.modules?.slice(0, 3).map((module: any, idx: number) => (
                <div key={module.id} className="flex items-center p-4 rounded-xl bg-white border border-slate-100 hover:border-slate-200 transition-all group shadow-sm">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                    module.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 
                    module.status === 'in-progress' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {module.status === 'completed' ? <CheckCircle2 size={20} /> : idx + 1}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold text-sm text-slate-900">{module.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{module.description}</p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-indigo-600">
                    <Play size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Skill Radar */}
          <div className="glass-card h-[350px]">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Skill DNA Radar</h3>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Radar
                    name="Skills"
                    dataKey="A"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Link to="/labs" className="glass-card p-4 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform">
              <Beaker className="text-purple-400 mb-2" size={24} />
              <span className="text-xs font-bold">Virtual Labs</span>
            </Link>
            <Link to="/mentors" className="glass-card p-4 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform">
              <Users className="text-pink-400 mb-2" size={24} />
              <span className="text-xs font-bold">Mentors</span>
            </Link>
          </div>

          {/* Achievements */}
          <div className="glass-card">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Recent Achievements</h3>
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center shadow-lg">
                  <Award size={18} className="text-white" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                +12
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
