import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dna, Mail, Lock, ArrowLeft, Brain, Sparkles, User, ShieldCheck } from 'lucide-react';
import { Heading, Text } from '@/src/components/DesignSystem/Typography';
import { Button } from '@/src/components/DesignSystem/Button';
import { Input } from '@/src/components/DesignSystem/Input';
import { Card } from '@/src/components/DesignSystem/Card';
import { cn } from '@/src/lib/utils';
import { api } from '@/src/lib/api';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  illustrationTitle: string;
  illustrationDesc: string;
}

const AuthLayout = ({ children, title, subtitle, illustrationTitle, illustrationDesc }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-white text-text-primary font-sans overflow-hidden">
      {/* Left Side: Illustration & Branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-16 bg-gray-50/50">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-pink/5 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-purple/5 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-80" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <img src="/image.png" alt="EduDNA Logo" className="h-20 w-auto" />
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 space-y-6 max-w-lg"
        >
          <div className="w-20 h-1 bg-gradient-premium rounded-full" />
          <Heading className="text-6xl leading-[1.1] font-display font-bold text-text-primary">
            {illustrationTitle}
          </Heading>
          <Text className="text-xl text-text-secondary leading-relaxed italic">
            "{illustrationDesc}"
          </Text>
          
          <div className="flex gap-4 pt-4">
             {[1, 2, 3].map((i) => (
                <div key={i} className="flex -space-x-4">
                   <img 
                    src={`https://picsum.photos/seed/user${i}/100/100`} 
                    alt="User" 
                    className="w-10 h-10 rounded-full border-2 border-white ring-1 ring-gray-100"
                    referrerPolicy="no-referrer"
                   />
                </div>
             ))}
             <p className="text-sm font-medium text-text-secondary/60 self-center">Joined by 12,000+ pioneers</p>
          </div>
        </motion.div>

        <div className="relative z-10 flex items-center gap-6 text-text-secondary/40 text-[10px] font-mono uppercase tracking-[0.3em] font-bold">
          <span>Encrypted Sync</span>
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <span>Biometric Ready</span>
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <span>v4.0.2-Beta</span>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-12 relative bg-white overflow-y-auto">
        <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2">
            <img src="/image.png" alt="EduDNA Logo" className="h-14 w-auto" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg pt-12 md:pt-0"
        >
          <div className="space-y-2 mb-6 sm:mb-8 text-center lg:text-left">
            <Heading as="h2" className="text-2xl sm:text-3xl md:text-5xl text-text-primary">{title}</Heading>
            <Text className="text-sm sm:text-base text-text-secondary">{subtitle}</Text>
          </div>

          <Card className="p-6 sm:p-8 md:p-10 border-border-light bg-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-pink/5 blur-3xl -z-10 group-hover:bg-brand-pink/10 transition-colors" />
            {children}
          </Card>

          <p className="mt-8 text-center text-sm text-text-secondary">
             By continuing, you agree to our <a href="#" className="text-text-primary hover:text-brand-pink transition-colors underline underline-offset-4">Terms of Service</a> and <a href="#" className="text-text-primary hover:text-brand-pink transition-colors underline underline-offset-4">Privacy Policy</a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export const LoginPage = ({ onSwitch, onLogin }: { onSwitch: () => void, onLogin: (token: string) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await api.login({ email, password });
      onLogin(response.access_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Access Network" 
      subtitle="Enter your credentials to sync your learning DNA."
      illustrationTitle="The Future is Your Inheritance."
      illustrationDesc="Authentication is the first step toward mapping your intellectual legacy in the decentralized web."
    >
      <div className="space-y-6">



        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input 
            label="Neural ID / Email" 
            placeholder="alex@edudna.ai" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="space-y-1">
             <Input 
              label="Security Key" 
              placeholder="••••••••" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex justify-end pt-1">
              <button type="button" className="text-[10px] text-brand-pink hover:text-brand-red transition-colors font-bold uppercase tracking-wider">Reset Access Key?</button>
            </div>
          </div>

          <div className="flex items-center gap-3 py-2">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                id="remember" 
                className="peer appearance-none w-5 h-5 border border-border-light rounded-lg checked:bg-brand-pink checked:border-brand-pink transition-all outline-none" 
              />
              <ShieldCheck className="absolute w-5 h-5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none p-1 transition-opacity" />
            </div>
            <label htmlFor="remember" className="text-sm text-text-secondary cursor-pointer select-none">Persistent Session</label>
          </div>

          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
          <Button variant="primary" className="w-full py-5 text-lg" type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Initialize Sync'}
          </Button>
        </form>

        <p className="text-center text-sm font-medium">
           <span className="text-text-secondary/60">New to the core?</span>{" "}
           <button onClick={onSwitch} className="text-gradient font-bold hover:brightness-110">Initialize New DNA Profile</button>
        </p>
      </div>
    </AuthLayout>
  );
};

export const SignupPage = ({ onSwitch, onSignup }: { onSwitch: () => void, onSignup: (token: string, level: string) => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    educationLevel: '',
    schoolClass: '',
    degree: '',
    year: '',
    language: 'English',
    interests: [] as string[],
    careerGoal: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSignup = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const name = `${formData.firstName} ${formData.lastName}`.trim();
      await api.signup({
        name,
        email: formData.email,
        password: formData.password,
      });
      const loginResponse = await api.login({
        email: formData.email,
        password: formData.password,
      });
      onSignup(loginResponse.access_token, formData.educationLevel);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const steps = [
    { id: 1, title: 'Identity' },
    { id: 2, title: 'Academic' },
    { id: 3, title: 'Profiling' }
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Genotype (First Name)" 
                placeholder="Alex" 
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required 
              />
              <Input 
                label="Phenotype (Last Name)" 
                placeholder="Rivera" 
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required 
              />
            </div>
            <Input 
              label="Primary Email" 
              placeholder="alex@future.com" 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
            <Input 
              label="Create Access Key" 
              placeholder="••••••••" 
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
            <Button 
              variant="primary" 
              className="w-full py-5 text-lg" 
              onClick={nextStep}
              disabled={!formData.firstName || !formData.email || !formData.password}
            >
              Initialize Node
            </Button>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-text-secondary mb-2 block uppercase tracking-[0.2em]">Level of Optimization</label>
              <div className="grid grid-cols-2 gap-4">
                {['School', 'Undergraduate'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({...formData, educationLevel: level})}
                    className={cn(
                      "p-4 rounded-xl border text-sm font-bold transition-all",
                      formData.educationLevel === level 
                        ? "bg-brand-pink/5 border-brand-pink text-brand-pink" 
                        : "bg-gray-50 border-border-light text-text-secondary hover:bg-gray-100"
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {formData.educationLevel === 'School' && (
                <motion.div 
                   key="school"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <label className="text-[10px] font-bold text-text-secondary block uppercase tracking-[0.2em]">Current Class Node</label>
                  <select 
                    className="w-full bg-gray-50 border border-border-light rounded-xl p-4 text-text-primary outline-none focus:ring-1 focus:ring-brand-pink/50"
                    value={formData.schoolClass}
                    onChange={(e) => setFormData({...formData, schoolClass: e.target.value})}
                  >
                    <option value="" disabled className="bg-white">Select Phase</option>
                    {[6, 7, 8, 9, 10, 11, 12].map(num => (
                      <option key={num} value={num} className="bg-white">Class {num}</option>
                    ))}
                  </select>
                </motion.div>
              )}

              {formData.educationLevel === 'Undergraduate' && (
                <motion.div 
                  key="ug"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-secondary block uppercase tracking-[0.2em]">Degree Path</label>
                    <input 
                      placeholder="e.g. B.Tech"
                      className="w-full bg-gray-50 border border-border-light rounded-xl p-4 text-text-primary outline-none focus:ring-1 focus:ring-brand-pink/50 placeholder:text-text-secondary/30"
                      value={formData.degree}
                      onChange={(e) => setFormData({...formData, degree: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-secondary block uppercase tracking-[0.2em]">Year</label>
                    <select 
                      className="w-full bg-gray-50 border border-border-light rounded-xl p-4 text-text-primary outline-none focus:ring-1 focus:ring-brand-pink/50"
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                    >
                      <option value="" disabled className="bg-white">Year</option>
                      {[1, 2, 3, 4].map(y => (
                        <option key={y} value={y} className="bg-white">{y}{y === 1 ? 'st' : y === 2 ? 'nd' : y === 3 ? 'rd' : 'th'} Year</option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-4 pt-4">
              <Button variant="outline" className="flex-1 py-4" onClick={prevStep}>Back</Button>
              <Button 
                variant="primary" 
                className="flex-[2] py-4" 
                onClick={nextStep}
                disabled={!formData.educationLevel || (formData.educationLevel === 'School' && !formData.schoolClass) || (formData.educationLevel === 'Undergraduate' && (!formData.degree || !formData.year))}
              >
                Sync Academy
              </Button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-secondary block uppercase tracking-[0.2em]">Preferred Language</label>
              <select 
                className="w-full bg-gray-50 border border-border-light rounded-xl p-4 text-text-primary outline-none focus:ring-1 focus:ring-brand-pink/50"
                value={formData.language}
                onChange={(e) => setFormData({...formData, language: e.target.value})}
              >
                <option value="English" className="bg-white">English</option>
                <option value="Spanish" className="bg-white">Spanish</option>
                <option value="Hindi" className="bg-white">Hindi</option>
                <option value="Japanese" className="bg-white">Japanese</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-text-secondary block uppercase tracking-[0.2em]">Interest Vectors (Select 3+)</label>
              <div className="flex flex-wrap gap-2">
                {['AI', 'Code', 'BioTech', 'Design', 'Data', 'Space', 'Robotics', 'Web3'].map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={cn(
                      "px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all",
                      formData.interests.includes(interest)
                        ? "bg-brand-purple/5 border-brand-purple text-brand-purple"
                        : "bg-gray-50 border-border-light text-text-secondary hover:bg-gray-100"
                    )}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <Input 
              label="Career Vision (Optional)" 
              placeholder="e.g. Lead Neural Architect" 
              value={formData.careerGoal}
              onChange={(e) => setFormData({...formData, careerGoal: e.target.value})}
            />

            <div className="flex gap-4 pt-4">
              <Button variant="outline" className="flex-1 py-4" onClick={prevStep}>Back</Button>
              <Button 
                variant="primary" 
                className="flex-[2] py-5 text-lg" 
                onClick={handleSignup}
                disabled={formData.interests.length < 3 || isSubmitting}
              >
                {isSubmitting ? 'Creating Profile...' : 'Map My Profile'}
              </Button>
            </div>
            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <AuthLayout 
      title={step === 1 ? "Create Profile" : step === 2 ? "Academic Sync" : "Neural Profiling"} 
      subtitle={step === 1 ? "Begin your evolutionary journey." : step === 2 ? "Mapping your educational trajectory." : "Finalizing your cognitive imprint."}
      illustrationTitle={step === 1 ? "Map Your Potential." : step === 2 ? "Genetic Education." : "Profile Complete."}
      illustrationDesc={step === 1 ? "Join the network of high-intelligence learners." : step === 2 ? "Your past nodes define your future synchronization." : "Sync ready. Preparing your proprietary DNA Assessment."}
    >
      <div className="space-y-8">
        {/* Stepper Progress */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 px-0 sm:px-2">
          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center gap-1.5 md:gap-2">
                <div className={cn(
                  "w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[8px] sm:text-[10px] font-bold transition-all duration-500",
                  step >= s.id ? "bg-gradient-premium text-white shadow-lg" : "bg-gray-100 text-text-secondary/30"
                )}>
                  {step > s.id ? "✓" : s.id}
                </div>
                <span className={cn(
                  "text-[6px] sm:text-[8px] font-bold uppercase tracking-widest",
                  step >= s.id ? "text-brand-pink" : "text-text-secondary/30"
                )}>
                  {s.title}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="h-[1px] flex-1 mx-2 sm:mx-4 bg-gray-100 relative overflow-hidden">
                  <motion.div 
                    initial={{ width: '0%' }}
                    animate={{ width: step > s.id ? '100%' : '0%' }}
                    className="absolute inset-0 bg-brand-pink transition-all duration-500"
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        {step === 1 && (
          <p className="text-center text-sm font-medium pt-2">
            <span className="text-text-secondary/60">Existing signature?</span>{" "}
            <button onClick={onSwitch} className="text-gradient font-bold hover:brightness-110">Access Current Network</button>
          </p>
        )}
      </div>
    </AuthLayout>
  );
};
