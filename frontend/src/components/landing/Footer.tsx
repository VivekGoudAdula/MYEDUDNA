import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const links = {
  Product: ["Features", "Virtual Labs", "Mentorship", "Pricing"],
  Resources: ["Documentation", "Blog", "Community", "API"],
  Company: ["About", "Careers", "Contact", "Press"],
  Legal: ["Privacy", "Terms", "Cookies"]
};

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-12">
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm leading-none">M</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">MyEduDNA</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Personalised learning journeys powered by AI. Built for the future of education.
            </p>
            <div className="flex items-center gap-4">
              <Link to="#" className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"><Twitter size={16} /></Link>
              <Link to="#" className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"><Instagram size={16} /></Link>
              <Link to="#" className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"><Linkedin size={16} /></Link>
              <Link to="#" className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"><Github size={16} /></Link>
            </div>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title} className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} MyEduDNA. All rights reserved.</p>
          <p className="text-xs text-slate-400">Made with care for the future of education.</p>
        </div>
      </div>
    </footer>
  );
};
