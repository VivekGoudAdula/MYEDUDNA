import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { auth } from '../firebase';
import { LogOut, User, LayoutDashboard, Compass, Beaker, Users, BarChart3, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Roadmap', path: '/roadmap', icon: Compass },
    { name: 'Labs', path: '/labs', icon: Beaker },
    { name: 'Mentors', path: '/mentors', icon: Users },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="text-xl font-bold tracking-tight gradient-text">MyEduDNA</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {user && navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-slate-600 hover:text-indigo-600 flex items-center space-x-1 text-sm font-medium transition-colors"
              >
                <link.icon size={16} />
                <span>{link.name}</span>
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="text-slate-600 hover:text-indigo-600 p-2 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                  {user.email?.[0].toUpperCase()}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/auth" className="text-slate-600 hover:text-indigo-600 text-sm font-medium">Login</Link>
                <Link to="/auth" className="btn-primary py-2 px-4 text-sm">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-indigo-600 p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-slate-200 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {user && navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-slate-600 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
                >
                  <link.icon size={18} />
                  <span>{link.name}</span>
                </Link>
              ))}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="text-slate-600 hover:text-indigo-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary block text-center mx-3 my-4"
                >
                  Get Started
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
