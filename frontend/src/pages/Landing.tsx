import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Compass, Beaker, Users, ArrowRight, Sparkles, Brain, Globe } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      title: "AI Career Planner",
      description: "Our advanced AI analyzes your interests and skills to map out the perfect career path.",
      icon: Brain,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Virtual STEM Labs",
      description: "Experience hands-on learning with interactive simulations in physics, chemistry, and more.",
      icon: Beaker,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Global Mentorship",
      description: "Connect with industry experts and academic leaders from around the world.",
      icon: Globe,
      color: "from-orange-500 to-yellow-500"
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass border border-slate-200 text-xs font-medium text-emerald-600 mb-6">
            <Sparkles size={14} />
            <span>Powered by Groq & LLaMA 3.3</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Design Your Learning <br />
            <span className="gradient-text">DNA with AI</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
            Choose your dream career and let AI generate a personalized learning journey tailored specifically to your learning style and goals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth" className="btn-primary flex items-center space-x-2 group">
              <span>Start Your Journey</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/labs" className="btn-secondary">
              Explore Virtual Labs
            </Link>
          </div>
        </motion.div>

        {/* Hero Illustration Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 relative"
        >
          <div className="glass-card max-w-4xl mx-auto aspect-video flex items-center justify-center overflow-hidden group bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative border-slate-200">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10"></div>
            
            {/* AI visualization elements replacing dummy image */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="w-[400px] h-[400px] border border-indigo-500/20 rounded-full flex items-center justify-center animate-[spin_60s_linear_infinite]">
                 <div className="w-[300px] h-[300px] border border-indigo-500/30 rounded-full flex items-center justify-center animate-[spin_40s_linear_infinite_reverse]">
                    <div className="w-[200px] h-[200px] border border-indigo-500/40 rounded-full animate-ping"></div>
                 </div>
              </div>
            </div>
            <div className="absolute bottom-8 left-8 text-left z-20">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                <span className="text-xs font-bold text-emerald-600">AI SYSTEM ACTIVE</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">Personalized Roadmap #4829</h3>
              <p className="text-sm font-bold text-slate-500">Quantum Computing Specialist Path</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">The Future of Education</h2>
          <p className="text-slate-600">Everything you need to master your chosen field.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
