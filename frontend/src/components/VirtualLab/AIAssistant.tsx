import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI Lab Assistant. Ready to help you with your experiment. What would you like to know?"
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI Response
    setTimeout(() => {
        const responses = [
            "Based on the current experiment settings, you're observing fundamental relationships in STEM.",
            "That's a great question! In this context, the behavior follows standard physical laws.",
            "If you increase the variables, you'll see a proportional change in the results.",
            "Try resetting the experiment and changing one variable at a time to see the effect."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: randomResponse }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[90%] flex space-x-2 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-purple-100 text-purple-600'}`}>
                  {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                </div>
                <div className={`p-2.5 rounded-2xl text-[11px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'}`}>
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-3 flex space-x-2 bg-white/50 p-1.5 rounded-xl border border-slate-100">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything..."
          className="flex-1 bg-transparent border-none focus:ring-0 text-[11px] placeholder:text-slate-400 outline-none px-2"
        />
        <button 
          onClick={handleSend}
          className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center transition-all shadow-md active:scale-95"
        >
          <Send size={14} />
        </button>
      </div>
      
      <div className="flex items-center space-x-1.5 mt-2 justify-center opacity-40">
         <Sparkles size={8} className="text-purple-500" />
         <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Powered by MyEduDNA AI</span>
      </div>
    </div>
  );
};

export default AIAssistant;
