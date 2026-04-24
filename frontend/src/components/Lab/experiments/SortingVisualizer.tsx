import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, BarChart2, Zap, LayoutGrid, Info } from 'lucide-react';
import { Button } from '../../DesignSystem/Button';
import { Card } from '../../DesignSystem/Card';
import { Text } from '../../DesignSystem/Typography';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export const SortingVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [algorithm, setAlgorithm] = useState<'bubble' | 'selection'>('bubble');
  const [comparing, setComparing] = useState<number[]>([]);

  const generateArray = () => {
    const newArr = Array.from({ length: 25 }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArr);
    setComparing([]);
  };

  useEffect(() => {
    generateArray();
  }, []);

  const bubbleSort = async () => {
    setIsSorting(true);
    let arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setComparing([j, j + 1]);
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
        }
        await new Promise(r => setTimeout(r, 40));
      }
    }
    setComparing([]);
    setIsSorting(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-8 p-6 bg-gray-50/50">
      <div className="flex-1 bg-white border border-border-light rounded-[2.5rem] flex items-end justify-center p-12 gap-1.5 min-h-[450px] shadow-2xl relative overflow-hidden">
        {/* Background Subtle Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ 
               backgroundImage: `linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)`,
               backgroundSize: `40px 40px` 
             }} 
        />

        {array.map((val, i) => (
          <motion.div
            key={i}
            layout
            initial={false}
            animate={{ 
              height: `${val}%`,
              backgroundColor: comparing.includes(i) ? '#ff2d55' : '#8b5cf6',
              boxShadow: comparing.includes(i) ? '0 0 20px rgba(255,45,85,0.2)' : 'none'
            }}
            className="flex-1 rounded-t-xl relative group min-w-[12px] transition-all"
          >
             <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all text-[10px] font-bold text-text-secondary bg-white px-2 py-1 rounded-md shadow-sm border border-border-light">
                {val}
             </div>
          </motion.div>
        ))}

        <div className="absolute top-10 left-10 p-4 bg-white/80 backdrop-blur-xl border border-border-light rounded-2xl shadow-xl">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-purple/5 flex items-center justify-center border border-brand-purple/10">
                <BarChart2 className="w-4 h-4 text-brand-purple" />
              </div>
              <div>
                 <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary">Array Stream</span>
                 <h4 className="text-xs font-bold text-text-primary">Real-time Visualization</h4>
              </div>
           </div>
        </div>
      </div>

      <div className="w-full lg:w-80 space-y-8">
         <Card className="p-8 space-y-8 bg-white border-border-light shadow-xl">
            <div className="space-y-4">
               <Text className="text-[10px] uppercase font-bold text-text-secondary tracking-[0.25em] px-1">Optimization Strategy</Text>
               <div className="flex gap-3">
                  <button 
                    onClick={() => setAlgorithm('bubble')}
                    className={cn(
                      "flex-1 py-3 rounded-2xl border text-xs font-bold transition-all shadow-sm",
                      algorithm === 'bubble' 
                        ? "bg-brand-purple border-brand-purple text-white shadow-brand-purple/20" 
                        : "bg-white border-border-light text-text-secondary hover:bg-gray-50"
                    )}
                  >
                    Bubble
                  </button>
                  <button 
                    onClick={() => setAlgorithm('selection')}
                    className={cn(
                      "flex-1 py-3 rounded-2xl border text-xs font-bold transition-all shadow-sm",
                      algorithm === 'selection' 
                        ? "bg-brand-purple border-brand-purple text-white shadow-brand-purple/20" 
                        : "bg-white border-border-light text-text-secondary hover:bg-gray-50"
                    )}
                  >
                    Selection
                  </button>
               </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
               <Button 
                  variant="primary" 
                  className="w-full h-16 bg-brand-purple shadow-xl shadow-brand-purple/20 rounded-[1.25rem] gap-3 text-xs font-bold uppercase tracking-widest transition-all hover:scale-[1.02]"
                  onClick={bubbleSort}
                  disabled={isSorting}
               >
                  <Play className="w-5 h-5 fill-current" /> Execute Sort
               </Button>
               
               <Button 
                  variant="secondary" 
                  className="w-full h-14 border-gray-200 bg-white hover:bg-gray-50 rounded-[1.25rem] text-[10px] font-bold uppercase tracking-widest"
                  onClick={generateArray}
                  disabled={isSorting}
               >
                  <RotateCcw className="w-5 h-5 mr-3" /> Re-shuffle
               </Button>
            </div>
         </Card>

         <Card className="p-8 bg-brand-purple/5 border-brand-purple/10 rounded-[2rem] space-y-5 shadow-sm">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm border border-brand-purple/10">
                 <Zap className="w-5 h-5 text-brand-purple" />
               </div>
               <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-purple">Complexity Analyser</span>
            </div>
            <div className="space-y-4">
               <div className="flex justify-between items-center bg-white/50 p-3 rounded-xl border border-white/80">
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-tight">Time Factor</span>
                  <span className="text-sm font-mono font-bold text-text-primary">O(n²)</span>
               </div>
               <div className="flex justify-between items-center bg-white/50 p-3 rounded-xl border border-white/80">
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-tight">Space Factor</span>
                  <span className="text-sm font-mono font-bold text-text-primary">O(1)</span>
               </div>
            </div>
         </Card>

         <Card className="p-6 border-border-light bg-white flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-border-light">
               <Info className="w-5 h-5 text-brand-pink" />
            </div>
            <p className="text-[10px] text-text-secondary leading-relaxed font-bold italic pt-1">"Bubble sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order."</p>
         </Card>
      </div>
    </div>
  );
};
