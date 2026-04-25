import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Settings, 
  Bell, 
  Search, 
  Menu, 
  X,
  Dna,
  FlaskConical,
  GraduationCap,
  LogOut,
  TrendingUp,
  BarChart3,
  Video
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: BookOpen, label: 'Roadmap', id: 'roadmap' },
  { icon: GraduationCap, label: 'Courses', id: 'courses' },
  { icon: FlaskConical, label: 'Labs', id: 'lab' },
  { icon: Users, label: 'Mentors', id: 'network' },
  { icon: Video, label: 'Sessions', id: 'sessions' },
  { icon: Settings, label: 'Profile', id: 'settings' },
];

export const DashboardLayout = ({ 
  children, 
  currentView = 'dashboard',
  onNavigate,
  userName,
  userEmail,
}: { 
  children: React.ReactNode;
  currentView?: string;
  onNavigate?: (view: string) => void;
  userName?: string;
  userEmail?: string;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const items = navItems;

  return (
    <div className="flex h-screen bg-bg-light overflow-hidden font-sans text-text-primary">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-60 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className={cn(
              "fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-border-light flex flex-col z-70 h-full overflow-y-auto shadow-xl lg:shadow-sm"
            )}
          >
            <div className="p-8 flex items-center justify-between lg:justify-start gap-3">
              <div className="flex items-center gap-3">
                <img 
                  src="/image.png" 
                  alt="EduDNA Logo" 
                  className="h-16 w-auto cursor-pointer"
                  onClick={() => onNavigate?.('landing')}
                />
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-text-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
              {items.map((item, i) => {
                const isActive = currentView === item.id;
                return (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => {
                      onNavigate?.(item.id);
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group',
                      isActive 
                        ? 'bg-gradient-premium text-white shadow-md' 
                        : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
                    )}
                  >
                    <item.icon className={cn('w-5 h-5', isActive ? 'text-white' : 'text-text-secondary group-hover:text-text-primary')} />
                    <span className="font-semibold">{item.label}</span>
                  </motion.button>
                );
              })}
            </nav>

            <div className="p-4 mt-auto border-t border-border-light">
              <button 
                onClick={() => onNavigate?.('landing')}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group text-text-secondary hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-semibold">Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden h-full w-full">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-border-light px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg text-text-secondary transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div id="search-bar" className="relative hidden md:block group">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary transition-colors group-focus-within:text-brand-pink" />
              <input 
                type="text" 
                placeholder="Find courses, labs..." 
                className="bg-gray-50 border border-border-light rounded-xl pl-12 pr-4 py-2 text-sm w-80 outline-none focus:ring-2 focus:ring-brand-pink/20 focus:bg-white transition-all placeholder:text-text-secondary/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button id="notifications-btn" className="relative p-2 hover:bg-gray-100 rounded-full text-text-secondary transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-pink rounded-full border-2 border-white shadow-sm" />
            </button>
            <div className="h-8 w-px bg-border-light mx-1 md:mx-2" />
            
            <div id="user-profile" className="flex items-center gap-2 md:gap-3 pl-2 pr-1 py-1 rounded-full border border-border-light bg-gray-50/50">
              <div className="text-right hidden sm:block">
                <h4 className="text-[10px] md:text-xs font-bold text-text-primary leading-none mb-1">
                  {userName || 'New User'}
                </h4>
                <p className="text-[8px] text-text-secondary font-mono tracking-tighter uppercase leading-none">
                  {userEmail || 'Complete your profile'}
                </p>
              </div>
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-linear-to-tr from-brand-purple to-brand-pink p-px shadow-sm cursor-pointer hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-white border border-border-light overflow-hidden">
                   <img src="https://picsum.photos/seed/edu/100/100" alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative custom-scrollbar">
          {/* Subtle Light Accents */}
          <div className="fixed top-[20%] right-[10%] w-[500px] h-[500px] bg-brand-pink/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
          <div className="fixed bottom-[10%] left-[5%] w-[400px] h-[400px] bg-brand-purple/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
          
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
