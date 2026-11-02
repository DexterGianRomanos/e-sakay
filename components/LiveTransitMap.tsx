'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { TransitVehicle, MOCK_VEHICLES } from '@/lib/mock-transit-data';
import { FareCalculatorCard } from '@/components/FareCalculatorCard';
import { RouteDetailsSheet } from '@/components/RouteDetailsSheet';
import { WeatherWidget } from '@/components/WeatherWidget';
import { Navigation, Wifi, Calculator, Map as MapIcon } from 'lucide-react';

export interface ConfirmedRoute {
  originName: string;
  destName: string;
  originCoords: { lat: number; lng: number };
  destCoords: { lat: number; lng: number };
}

const MapInner = dynamic(() => import('@/components/MapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[380px] bg-slate-900/10 dark:bg-slate-950/40 backdrop-blur-md rounded-2xl animate-pulse flex flex-col items-center justify-center gap-3 border border-slate-200/50 dark:border-slate-800/50">
      <Navigation className="w-8 h-8 text-teal-500 animate-spin" />
      <span className="text-xs text-slate-500 font-medium">Loading Interactive Route Map...</span>
    </div>
  ),
});

export function LiveTransitMap() {
  const [selectedVehicle, setSelectedVehicle] = useState<TransitVehicle | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [mobileTab, setMobileTab] = useState<'calculator' | 'map'>('calculator');

  const [activeRoute, setActiveRoute] = useState<ConfirmedRoute | null>({
    originName: 'Tomas Oppus',
    destName: 'Maasin City',
    originCoords: { lat: 10.2444, lng: 124.9806 },
    destCoords: { lat: 10.1336, lng: 124.8415 },
  });

  const handleConfirmRoute = (route: ConfirmedRoute) => {
    setActiveRoute(route);
    setSelectedVehicle(null);
    setMobileTab('map');
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header Bar with Logo and Sign Out Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="relative w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 p-1.5 flex items-center justify-center shadow-md border border-slate-200/80 dark:border-slate-700/80 overflow-hidden shrink-0">
            <Image 
              src="/logo.png" 
              alt="E-Sakay Logo" 
              width={56} 
              height={56} 
              className="object-contain w-full h-full scale-110"
              priority
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">E-Sakay</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Southern Leyte Commuter Hub</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-xs">
          <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full text-slate-600 dark:text-slate-300 font-medium hidden sm:inline-block">
            
          </span>
          <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full font-semibold">
            <Wifi className="w-3.5 h-3.5" /> Live GPS Syncing
          </span>

        </div>
      </div>

      {/* Weather AI Widget */}
      <WeatherWidget municipalityName={activeRoute?.originName || 'Tomas Oppus'} />

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`lg:col-span-5 ${mobileTab === 'calculator' ? 'block' : 'hidden lg:block'}`}>
          <FareCalculatorCard userCoords={userCoords} onConfirmRoute={handleConfirmRoute} />
        </div>

        <div className={`lg:col-span-7 flex flex-col gap-6 ${mobileTab === 'map' ? 'block' : 'hidden lg:flex'}`}>
          <div className="relative w-full h-[420px] sm:h-[480px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800/80">
            <MapInner
              vehicles={MOCK_VEHICLES}
              onSelectVehicle={(v) => setSelectedVehicle(v)}
              userCoords={userCoords}
              onSetUserLocation={(coords) => setUserCoords(coords)}
              activeRoute={activeRoute}
            />
          </div>

          <RouteDetailsSheet selectedVehicle={selectedVehicle} activeRoute={activeRoute} />
        </div>
      </div>

      {/* Fixed Mobile Bottom Taskbar */}
      <div className="fixed bottom-0 left-0 right-0 z-[2000] bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-6 py-2 flex items-center justify-around lg:hidden shadow-2xl">
        <button
          onClick={() => setMobileTab('calculator')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-4 rounded-xl transition-all cursor-pointer ${
            mobileTab === 'calculator'
              ? 'text-cyan-400 bg-slate-800/80 border border-slate-700/60'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calculator className="w-5 h-5" />
          <span>Fare & ETA</span>
        </button>

        <button
          onClick={() => setMobileTab('map')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-4 rounded-xl transition-all cursor-pointer ${
            mobileTab === 'map'
              ? 'text-cyan-400 bg-slate-800/80 border border-slate-700/60'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MapIcon className="w-5 h-5" />
          <span>Live Map</span>
        </button>
      </div>
    </div>
  );
}