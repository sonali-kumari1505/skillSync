import React from 'react';
import { Sparkles, Heart, Code2, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0d12] py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
                SkillSync
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI-Powered Peer Skill Exchange Platform for Universities
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Code2 className="h-3.5 w-3.5 text-brand-500" />
              <span>React 18 · Node.js · FastAPI · MongoDB</span>
            </span>
            <span>•</span>
            <span>SRS & SPMP Compliant</span>
          </div>

          <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <span>Crafted for Academic Excellence & Modern Innovation</span>
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
