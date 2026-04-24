import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, ChevronRight, HelpCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '../DesignSystem/Button';
import { Heading, Text } from '../DesignSystem/Typography';

interface TourStep {
  targetId: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const steps: TourStep[] = [
  {
    targetId: 'search-bar',
    title: 'Smart Search',
    description: 'Instantly find peers, courses, and resources.',
    position: 'bottom'
  },
  {
    targetId: 'notifications-btn',
    title: 'Neural Alerts',
    description: 'Stay updated with your synchronization progress.',
    position: 'bottom'
  },
  {
    targetId: 'user-profile',
    title: 'Learning DNA',
    description: 'Manage your profile and track cognitive evolution.',
    position: 'bottom'
  },
  {
    targetId: 'nav-dashboard',
    title: 'Mission Control',
    description: 'Navigate your primary learning dashboard hub.',
    position: 'right'
  },
  {
    targetId: 'nav-roadmap',
    title: 'Career Roadmap',
    description: 'Visualize and plan your professional trajectory.',
    position: 'right'
  },
  {
    targetId: 'nav-lab',
    title: 'Virtual Lab',
    description: 'Access cutting-edge experiments and simulations.',
    position: 'right'
  },
  {
    targetId: 'nav-network',
    title: 'DNA Network',
    description: 'Collaborate with mentors and top-tier peers.',
    position: 'right'
  },
  {
    targetId: 'nav-insights',
    title: 'Cognitive Insights',
    description: 'Analyze deep metrics of your learning performance.',
    position: 'right'
  },
  {
    targetId: 'nav-settings',
    title: 'Node Settings',
    description: 'Configure your account and security preferences.',
    position: 'right'
  }
];

export const FeatureTour = ({ onComplete }: { onComplete: () => void }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const currentStep = steps[currentIdx];

  useEffect(() => {
    const updateRect = () => {
      const el = document.getElementById(currentStep.targetId);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
      }
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, [currentIdx, currentStep.targetId]);

  const handleNext = () => {
    if (currentIdx < steps.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      onComplete();
    }
  };

  if (!targetRect) return null;

  const spotlightStyle: React.CSSProperties = {
    position: 'fixed',
    top: targetRect.top - 8,
    left: targetRect.left - 8,
    width: targetRect.width + 16,
    height: targetRect.height + 16,
    borderRadius: '12px',
    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)',
    zIndex: 100,
    pointerEvents: 'none',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  const popoverStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 101,
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  // Basic popover positioning logic
  if (currentStep.position === 'bottom') {
    popoverStyle.top = targetRect.bottom + 24;
    popoverStyle.left = Math.max(20, Math.min(window.innerWidth - 340, targetRect.left + targetRect.width / 2 - 160));
  } else if (currentStep.position === 'right') {
    popoverStyle.top = targetRect.top;
    popoverStyle.left = targetRect.right + 24;
  }

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      {/* Spotlight */}
      <div style={spotlightStyle} />

      {/* Popover */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          style={popoverStyle}
          className="w-[320px] bg-white rounded-2xl p-5 shadow-2xl border border-brand-pink/20 pointer-events-auto"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-pink/10 flex items-center justify-center">
                 <Sparkles className="w-4 h-4 text-brand-pink" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest">{currentStep.title}</h4>
                <div className="h-0.5 w-8 bg-gradient-premium rounded-full mt-1" />
              </div>
            </div>
            <button 
              onClick={onComplete}
              className="p-1 hover:bg-gray-100 rounded-full text-text-secondary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <Text className="text-sm font-medium text-text-primary mb-6 leading-snug">
            {currentStep.description}
          </Text>

          <div className="flex items-center justify-between gap-4">
             <div className="flex gap-1">
                {steps.map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "h-1 rounded-full transition-all duration-300",
                      i === currentIdx ? "w-4 bg-brand-pink" : "w-1.5 bg-gray-200"
                    )} 
                  />
                ))}
             </div>
             <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-xs px-3" onClick={onComplete}>
                  Skip
                </Button>
                <Button variant="primary" size="sm" className="text-xs px-4" onClick={handleNext}>
                  {currentIdx === steps.length - 1 ? 'Finish' : 'Next'}
                  <ChevronRight className="ml-1 w-3.5 h-3.5" />
                </Button>
             </div>
          </div>

          {/* Arrow */}
          <div 
            className={cn(
              "absolute w-4 h-4 bg-white border-brand-pink/20 rotate-45 -z-10",
              currentStep.position === 'bottom' ? "-top-2 left-1/2 -translate-x-1/2 border-t border-l" : "",
              currentStep.position === 'right' ? "-left-2 top-8 border-b border-l" : ""
            )} 
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
