import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Calendar, Globe, Star, Award, Search } from 'lucide-react';

const Mentorship = () => {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/mentors')
      .then(res => res.json())
      .then(data => {
        setMentors(data);
        setLoading(false);
      });
  }, []);

  const filteredMentors = mentors.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.expertise.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center">Finding your perfect mentors...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-slate-900">Global <span className="gradient-text">Mentorship</span></h1>
          <p className="text-slate-600">Connect with industry experts to accelerate your learning DNA.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search by expertise or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMentors.map((mentor, idx) => (
          <motion.div
            key={mentor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="relative">
                <img 
                  src={mentor.avatar} 
                  alt={mentor.name} 
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/20 group-hover:border-indigo-500 transition-colors"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></div>
              </div>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={12} className="fill-yellow-500 text-yellow-500" />
                ))}
              </div>
            </div>

            <h3 className="text-xl font-bold mb-1 text-slate-900">{mentor.name}</h3>
            <p className="text-indigo-600 text-sm font-medium mb-4">{mentor.expertise}</p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center text-xs text-slate-500">
                <Calendar size={14} className="mr-2" />
                <span>Available: {mentor.availability}</span>
              </div>
              <div className="flex items-center text-xs text-slate-500">
                <Globe size={14} className="mr-2" />
                <span>Global Timezone Friendly</span>
              </div>
              <div className="flex items-center text-xs text-slate-500">
                <Award size={14} className="mr-2" />
                <span>10+ Years Experience</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="btn-secondary py-2 px-0 text-xs flex items-center justify-center space-x-2">
                <MessageSquare size={14} />
                <span>Message</span>
              </button>
              <button className="btn-primary py-2 px-0 text-xs flex items-center justify-center space-x-2">
                <Calendar size={14} />
                <span>Book Session</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 glass-card bg-gradient-to-r from-indigo-600/5 to-purple-600/5 border-indigo-500/10 text-center py-12">
        <Users size={48} className="mx-auto text-indigo-600 mb-6" />
        <h2 className="text-2xl font-bold mb-4 text-slate-900">Become a Mentor</h2>
        <p className="text-slate-600 max-w-xl mx-auto mb-8">
          Share your knowledge and help shape the next generation of experts. Join our global community of mentors.
        </p>
        <button className="btn-secondary">Apply to Mentor</button>
      </div>
    </div>
  );
};

export default Mentorship;
