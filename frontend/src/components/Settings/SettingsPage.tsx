import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Database, 
  Globe, 
  LogOut, 
  Camera, 
  Mail, 
  Key, 
  Fingerprint, 
  AppWindow,
  CreditCard
} from 'lucide-react';
import { Heading, Text } from '@/src/components/DesignSystem/Typography';
import { Card } from '@/src/components/DesignSystem/Card';
import { Button } from '@/src/components/DesignSystem/Button';
import { Input } from '@/src/components/DesignSystem/Input';
import { cn } from '@/src/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

type SettingsTab = 'profile' | 'academic' | 'account' | 'security' | 'billing';

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const tabs: { id: SettingsTab; label: string; icon: any }[] = [
    { id: 'profile', label: 'Persona Profile', icon: User },
    { id: 'academic', label: 'Educational DNA', icon: Database },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'account', label: 'System Preferences', icon: AppWindow },
    { id: 'billing', label: 'Network Access', icon: CreditCard },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto py-10 px-6 space-y-10"
    >
      <div className="border-b border-border-light pb-10">
        <div className="flex items-center gap-2 text-brand-purple mb-2">
           <SettingsIcon className="w-5 h-5" />
           <span className="text-xs font-mono font-bold uppercase tracking-[0.3em]">Neural Configuration</span>
        </div>
        <Heading as="h1" className="text-text-primary">System <span className="text-gradient">Settings</span></Heading>
        <Text className="text-text-secondary max-w-2xl">
          Optimize your interaction parameters and intellectual property settings.
        </Text>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={cn(
                 "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all border",
                 activeTab === tab.id 
                  ? "bg-white border-border-light shadow-md text-brand-pink" 
                  : "bg-transparent border-transparent text-text-secondary hover:bg-gray-50"
               )}
             >
                <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-brand-pink" : "text-text-secondary/40")} />
                {tab.label}
             </button>
           ))}
           <div className="pt-8 px-6 mt-8 border-t border-border-light">
              <button className="flex items-center gap-4 text-rose-500 font-bold text-sm hover:translate-x-2 transition-transform">
                 <LogOut className="w-5 h-5" />
                 Deactivate Neural Link
              </button>
           </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.2 }}
               className="space-y-8"
             >
                {activeTab === 'profile' && (
                  <div className="space-y-8">
                     <Card className="p-10 relative overflow-hidden bg-white">
                        <div className="flex items-center gap-10">
                           <div className="relative group">
                              <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-xl border-4 border-white group-hover:brightness-75 transition-all">
                                 <img src="https://picsum.photos/seed/alex/200/200" alt="Profile" />
                              </div>
                              <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                 <Camera className="w-8 h-8 text-white" />
                              </button>
                           </div>
                           <div className="space-y-2">
                              <Heading as="h3">Alex Rivera</Heading>
                              <p className="text-sm font-mono text-text-secondary bg-gray-50 px-3 py-1 rounded-lg border border-border-light inline-block">ID: 4x2-BR-99</p>
                              <div className="flex gap-3">
                                 <Button variant="secondary" size="sm" className="bg-gray-100 border-transparent">Change Avatar</Button>
                                 <Button variant="ghost" size="sm" className="text-rose-500">Remove</Button>
                              </div>
                           </div>
                        </div>
                     </Card>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Public Name" placeholder="Alex Rivera" />
                        <Input label="Neural Handle" placeholder="@alex.edu" />
                        <div className="md:col-span-2">
                           <Input label="Cognitive Bio" placeholder="Quantum Mechanics enthusiast and AI researcher..." />
                        </div>
                     </div>

                     <div className="pt-6 border-t border-border-light flex justify-end gap-4">
                        <Button variant="secondary" className="border-gray-200">Discard Changes</Button>
                        <Button variant="primary" className="px-8 shadow-lg shadow-brand-pink/20">Sync Profile</Button>
                     </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-8">
                     <div className="grid grid-cols-1 gap-6">
                        <Card className="p-8 flex items-center justify-between border-l-4 border-l-emerald-500 bg-white">
                           <div className="flex items-center gap-6">
                              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                                 <Fingerprint className="w-6 h-6 text-emerald-600" />
                              </div>
                              <div>
                                 <Heading as="h4" className="text-base">Biometric Authentication</Heading>
                                 <Text className="text-xs">Secure your DNA signature with hardware-level biometrics.</Text>
                              </div>
                           </div>
                           <div className="w-12 h-6 bg-emerald-500 rounded-full p-1 cursor-pointer">
                              <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                           </div>
                        </Card>

                        <div className="space-y-4 pt-4">
                           <Heading as="h4" className="text-lg">Credentials</Heading>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <Input label="Current Security Key" type="password" placeholder="••••••••" />
                              <Input label="New Security Key" type="password" placeholder="••••••••" />
                              <div className="md:col-span-2">
                                <Card className="p-4 bg-amber-50 border-amber-100 flex items-start gap-4">
                                   <Shield className="w-5 h-5 text-amber-600 mt-1" />
                                   <div>
                                      <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">High Security Required</p>
                                      <p className="text-xs text-amber-700 mt-1">Changing your master security key will require re-syncing all connected cognitive nodes.</p>
                                   </div>
                                </Card>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-4 pt-8">
                           <div className="flex items-center justify-between">
                             <Heading as="h4" className="text-lg">Sessions</Heading>
                             <Button variant="ghost" size="sm" className="text-rose-500 font-bold uppercase tracking-widest text-[10px]">Kill All Sessions</Button>
                           </div>
                           <div className="space-y-3">
                              {[
                                { device: 'MacBook Pro (Primary)', location: 'Delhi, IN', time: 'Active Now', icon: Globe },
                                { device: 'Neural Interface v2', location: 'Cloud Node 7', time: '2 hours ago', icon: Database },
                              ].map((session, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border-light bg-gray-50/50">
                                   <div className="flex items-center gap-4">
                                      <session.icon className="w-5 h-5 text-text-secondary/40" />
                                      <div>
                                         <p className="text-sm font-bold text-text-primary">{session.device}</p>
                                         <p className="text-[10px] font-medium text-text-secondary uppercase">{session.location} • {session.time}</p>
                                      </div>
                                   </div>
                                   <Button variant="ghost" size="sm" className="text-text-secondary/60">Logoff</Button>
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
                )}

                {(activeTab === 'academic' || activeTab === 'account' || activeTab === 'billing') && (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                     <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center border border-border-light">
                        <Database className="w-10 h-10 text-text-secondary/20 animate-pulse" />
                     </div>
                     <div>
                        <Heading as="h2" className="text-2xl">Configuration <span className="text-gradient">Pending</span></Heading>
                        <Text>We are currently calibrating these high-level parameters for your account.</Text>
                     </div>
                  </div>
                )}
             </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
