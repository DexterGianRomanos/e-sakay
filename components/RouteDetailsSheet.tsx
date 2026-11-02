'use client';

import React from 'react';
import { TransitVehicle } from '@/lib/mock-transit-data';
import { ConfirmedRoute } from '@/components/LiveTransitMap';
import { Clock, Gauge, Users, MapPin, Navigation } from 'lucide-react';

interface RouteDetailsProps {
  selectedVehicle: TransitVehicle | null;
  activeRoute?: ConfirmedRoute | null;
}

export const RouteDetailsSheet: React.FC<RouteDetailsProps> = ({ selectedVehicle, activeRoute }) => {
  // 1. Prioritize displaying user's confirmed active trip route if set
  if (activeRoute) {
    return (
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xl transition-all duration-300">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              Active Commute Route
            </span>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{activeRoute.originName}</span>
              <Navigation className="w-4 h-4 text-cyan-500 inline" />
              <span>{activeRoute.destName}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live navigation corridor locked to selected destination
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            Route Confirmed
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 my-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
            <MapPin className="w-4 h-4 text-teal-500 mx-auto mb-1" />
            <p className="text-[10px] text-slate-400">Origin</p>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate px-1">
              {activeRoute.originName}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
            <Navigation className="w-4 h-4 text-rose-500 mx-auto mb-1" />
            <p className="text-[10px] text-slate-400">Destination</p>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate px-1">
              {activeRoute.destName}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
            <Clock className="w-4 h-4 text-cyan-500 mx-auto mb-1" />
            <p className="text-[10px] text-slate-400">Available PUVs</p>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Active</p>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
          <span>
            Head toward: <strong className="text-slate-700 dark:text-slate-300">{activeRoute.destName}</strong>
          </span>
          <span className="text-teal-600 font-medium">Tracking vehicles along path</span>
        </div>
      </div>
    );
  }

  // 2. Display selected vehicle card if user clicks a vehicle marker
  if (selectedVehicle) {
    return (
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xl transition-all duration-300">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="inline-block px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              {selectedVehicle.type.replace('_', ' ')}
            </span>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">{selectedVehicle.route}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Driver: {selectedVehicle.driverName} • ({selectedVehicle.plateNumber})
            </p>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              selectedVehicle.status === 'On-Time'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}
          >
            {selectedVehicle.status}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 my-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
            <Clock className="w-4 h-4 text-cyan-500 mx-auto mb-1" />
            <p className="text-[10px] text-slate-400">ETA Next Stop</p>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedVehicle.etaMinutes} mins</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
            <Gauge className="w-4 h-4 text-teal-500 mx-auto mb-1" />
            <p className="text-[10px] text-slate-400">Speed</p>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedVehicle.speedKmh} km/h</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
            <Users className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
            <p className="text-[10px] text-slate-400">Occupancy</p>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {selectedVehicle.totalSeats - selectedVehicle.seatsAvailable}/{selectedVehicle.totalSeats}
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
          <span>
            Approaching: <strong className="text-slate-700 dark:text-slate-300">{selectedVehicle.nextStop}</strong>
          </span>
          <span className="text-teal-600 font-medium">{selectedVehicle.seatsAvailable} seats left</span>
        </div>
      </div>
    );
  }

  // 3. Default empty state prompt
  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center text-xs text-slate-500">
      Confirm a route or click a vehicle marker on the map to view real-time trip status.
    </div>
  );
};