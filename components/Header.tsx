'use client';

import React from 'react';
import { Bus, Moon, Sun, CloudSun, MapPin } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode }) => {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/75 dark:bg-slate-900/75 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-teal-600 dark:bg-teal-500 rounded-xl text-white shadow-lg shadow-teal-500/20">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 dark:text-white tracking-tight leading-none">
              E-<span className="text-cyan-500">Sakay</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-teal-600" /> Southern Leyte Commuter Hub
            </p>
          </div>
        </div>

        {/* Live Weather & Status Badge */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <CloudSun className="w-4 h-4 text-amber-500" />
            <span></span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-medium border border-teal-500/20">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            Live GPS Syncing
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

      </div>
    </header>
  );
};