'use client';

import React from 'react';
import Image from 'next/image';
import { Moon, Sun, CloudSun, MapPin } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  weatherInfo?: string; // Optional prop to pass live weather data
}

export const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode, weatherInfo = '26.4°C • Fair & Sunny' }) => {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/75 dark:bg-slate-900/75 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md bg-white p-0.5 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
            <Image 
              src="/logo.png" 
              alt="E-Sakay Logo" 
              width={36} 
              height={36} 
              className="object-contain"
            />
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
            <span>{weatherInfo}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-medium border border-teal-500/20">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            Live GPS Syncing
          </div>
        </div>

        {/* Action Controls (Theme Toggle) */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              const newMode = !darkMode;
              setDarkMode(newMode);
              if (newMode) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
              } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
              }
            }}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

      </div>
    </header>
  );
};