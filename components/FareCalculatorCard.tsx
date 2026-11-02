'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Calculator, Clock, Navigation, MapPin, CheckCircle2, Search, ChevronDown, Check } from 'lucide-react';
import { 
  VehicleType, 
  CommuterCategory, 
  calculateFare, 
  calculateRoadDistanceKm,
  LTFRB_RATES 
} from '@/lib/ltfrb-calculator';
import { SOUTHERN_LEYTE_LOCATIONS, LocationPoint } from '@/lib/mock-transit-data';

const VEHICLE_ICONS: Record<VehicleType, string> = {
  jeepney_modern: 'modern-jeepney.png',
  jeepney_traditional: 'traditional-jeepney.png',
  uv_express_modern: 'uv-express.png',
  bus_ordinary: 'ordinary-bus.png',
  bus_aircon: 'aircon-bus.png',
};

interface RoutePoints {
  originName: string;
  destName: string;
  originCoords: { lat: number; lng: number };
  destCoords: { lat: number; lng: number };
  estimatedMinutes: number;
  estimatedFare: number;
  vehicleName: string;
}

interface FareCalculatorCardProps {
  userCoords?: { lat: number; lng: number } | null;
  onConfirmRoute?: (route: RoutePoints) => void;
}

export const FareCalculatorCard: React.FC<FareCalculatorCardProps> = ({ userCoords, onConfirmRoute }) => {
  const [originId, setOriginId] = useState(userCoords ? 'user_gps' : 'oppus_poblacion');
  const [destinationId, setDestinationId] = useState('maasin_poblacion');
  const [vehicleType, setVehicleType] = useState<VehicleType>('jeepney_modern');
  const [category, setCategory] = useState<CommuterCategory>('student');

  // Search filter states
  const [originSearch, setOriginSearch] = useState('');
  const [destSearch, setDestSearch] = useState('');
  const [isOriginOpen, setIsOriginOpen] = useState(false);
  const [isDestOpen, setIsDestOpen] = useState(false);

  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(event.target as Node)) {
        setIsOriginOpen(false);
      }
      if (destRef.current && !destRef.current.contains(event.target as Node)) {
        setIsDestOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const findLocationDetails = (id: string): { location: LocationPoint; muniName: string; muniId: string } | null => {
    for (const muni of SOUTHERN_LEYTE_LOCATIONS) {
      const match = muni.barangays.find((b) => b.id === id);
      if (match) {
        return { location: match, muniName: muni.name, muniId: muni.id };
      }
    }
    return null;
  };

  const filterLocations = (query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) return SOUTHERN_LEYTE_LOCATIONS;

    return SOUTHERN_LEYTE_LOCATIONS.map((muni) => {
      const matchesMuni = muni.name.toLowerCase().includes(q);
      const filteredBarangays = muni.barangays.filter(
        (b) => matchesMuni || b.name.toLowerCase().includes(q)
      );
      return { ...muni, barangays: filteredBarangays };
    }).filter((muni) => muni.barangays.length > 0);
  };

  const filteredOriginLocations = useMemo(() => filterLocations(originSearch), [originSearch]);
  const filteredDestLocations = useMemo(() => filterLocations(destSearch), [destSearch]);

  const currentRouteData = useMemo(() => {
    let startCoords = { lat: 10.2444, lng: 124.9806 };
    let startName = 'Tomas Oppus';

    if (originId === 'user_gps' && userCoords) {
      startCoords = userCoords;
      startName = 'My Current GPS Location';
    } else {
      const details = findLocationDetails(originId);
      if (details) {
        startCoords = { lat: details.location.lat, lng: details.location.lng };
        startName = details.muniName;
      }
    }

    const destDetails = findLocationDetails(destinationId);
    const destCoords = destDetails 
      ? { lat: destDetails.location.lat, lng: destDetails.location.lng } 
      : { lat: 10.1336, lng: 124.8415 };

    const destName = destDetails ? destDetails.muniName : 'Maasin City';

    const distance = calculateRoadDistanceKm(
      originId,
      destinationId,
      startCoords.lat,
      startCoords.lng,
      destCoords.lat,
      destCoords.lng
    );

    return {
      originName: startName,
      destName,
      originCoords: startCoords,
      destCoords,
      distance,
    };
  }, [originId, destinationId, userCoords]);

  const fareResult = useMemo(() => {
    return calculateFare(vehicleType, currentRouteData.distance, category);
  }, [vehicleType, currentRouteData.distance, category]);

  const formatETA = (minutes: number) => {
    if (minutes === 0) return '0 mins';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins} mins`;
  };

  const handleConfirmRoute = () => {
    if (onConfirmRoute) {
      onConfirmRoute({
        originName: currentRouteData.originName,
        destName: currentRouteData.destName,
        originCoords: currentRouteData.originCoords,
        destCoords: currentRouteData.destCoords,
        estimatedMinutes: fareResult.estimatedMinutes,
        estimatedFare: fareResult.finalFare,
        vehicleName: fareResult.vehicleName,
      });
    }
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-900/5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h2 className="font-semibold text-slate-900 dark:text-white">LTFRB Fare & ETA Calculator</h2>
        </div>
        <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
          Region VIII Matrix
        </span>
      </div>

      <div className="space-y-4">
        {/* Searchable Origin & Destination Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Searchable Origin Dropdown */}
          <div className="relative" ref={originRef}>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-teal-500" /> Origin
            </label>
            <button
              type="button"
              onClick={() => setIsOriginOpen(!isOriginOpen)}
              className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-left text-slate-900 dark:text-white flex items-center justify-between outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <span className="truncate">{currentRouteData.originName}</span>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            </button>

            {isOriginOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl max-h-60 overflow-hidden flex flex-col p-2">
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search municipality..."
                    value={originSearch}
                    onChange={(e) => setOriginSearch(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white border-none outline-none focus:ring-1 focus:ring-teal-500"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto space-y-1">
                  {userCoords && (
                    <button
                      onClick={() => {
                        setOriginId('user_gps');
                        setIsOriginOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 flex items-center justify-between cursor-pointer"
                    >
                      <span>📍 My Current GPS Location</span>
                      {originId === 'user_gps' && <Check className="w-3.5 h-3.5" />}
                    </button>
                  )}
                  {filteredOriginLocations.map((muni) => (
                    <button
                      key={`orig-muni-${muni.id}`}
                      onClick={() => {
                        setOriginId(muni.barangays[0].id);
                        setIsOriginOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer ${
                        originId === muni.barangays[0].id
                          ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 font-medium'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{muni.name}</span>
                      {originId === muni.barangays[0].id && <Check className="w-3.5 h-3.5 text-teal-500" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Searchable Destination Dropdown */}
          <div className="relative" ref={destRef}>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-cyan-500" /> Destination
            </label>
            <button
              type="button"
              onClick={() => setIsDestOpen(!isDestOpen)}
              className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-left text-slate-900 dark:text-white flex items-center justify-between outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <span className="truncate">{currentRouteData.destName}</span>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            </button>

            {isDestOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl max-h-60 overflow-hidden flex flex-col p-2">
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search municipality..."
                    value={destSearch}
                    onChange={(e) => setDestSearch(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white border-none outline-none focus:ring-1 focus:ring-teal-500"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto space-y-1">
                  {filteredDestLocations.map((muni) => (
                    <button
                      key={`dest-muni-${muni.id}`}
                      onClick={() => {
                        setDestinationId(muni.barangays[0].id);
                        setIsDestOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer ${
                        destinationId === muni.barangays[0].id
                          ? 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 font-medium'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{muni.name}</span>
                      {destinationId === muni.barangays[0].id && <Check className="w-3.5 h-3.5 text-cyan-500" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Real-Time Trip Summary Bar */}
        <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/70 rounded-xl text-xs">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="text-slate-600 dark:text-slate-300">Distance:</span>
            <strong className="text-slate-900 dark:text-white">{currentRouteData.distance} km</strong>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span className="text-slate-600 dark:text-slate-300">Est. Time:</span>
            <strong className="text-cyan-600 dark:text-cyan-400 font-bold">{formatETA(fareResult.estimatedMinutes)}</strong>
          </div>
        </div>

        {/* Vehicle Selection Grid */}
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Vehicle Type</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(LTFRB_RATES) as VehicleType[]).map((key) => (
              <button
                key={key}
                onClick={() => setVehicleType(key)}
                aria-pressed={vehicleType === key}
                className={`flex min-h-[72px] items-center gap-2.5 rounded-xl border p-2.5 text-left text-xs font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
                  vehicleType === key
                    ? 'border-teal-500 bg-teal-50 text-teal-800 shadow-sm dark:bg-teal-950/30 dark:text-teal-200 font-semibold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300 dark:bg-slate-800/40 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <span className="flex h-12 w-14 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-white p-1 dark:border-slate-700">
                  <Image
                    src={`/vehicles/${VEHICLE_ICONS[key]}`}
                    alt=""
                    aria-hidden="true"
                    width={128}
                    height={88}
                    className="h-full w-full object-contain"
                  />
                </span>
                <span className="min-w-0 leading-snug">{LTFRB_RATES[key].name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Passenger Discount Category */}
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Passenger Discount</label>
          <div className="flex gap-2">
            {[
              { id: 'regular', label: 'Regular' },
              { id: 'student', label: 'Student (20%)' },
              { id: 'senior_pwd', label: 'Senior / PWD (20%)' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id as CommuterCategory)}
                className={`flex-1 py-2 px-2 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                  category === cat.id
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-700 dark:text-cyan-300'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fare Result Breakdown */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-inner space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-slate-400">Total Computed Fare</span>
            <div className="text-2xl font-bold text-cyan-400">
              ₱{fareResult.finalFare.toFixed(2)}
            </div>
          </div>
          <div className="border-t border-slate-700/80 pt-2 text-[11px] text-slate-300 space-y-1">
            {fareResult.baseDistanceKm > 0 ? (
              <div className="flex justify-between">
                <span>Base Fare (First {fareResult.baseDistanceKm} km):</span>
                <span>₱{fareResult.baseFare.toFixed(2)}</span>
              </div>
            ) : (
              <div className="flex justify-between">
                <span>Flat Rate (₱{LTFRB_RATES[vehicleType].perKmRate.toFixed(2)}/km):</span>
                <span>₱{fareResult.distanceSurcharge.toFixed(2)}</span>
              </div>
            )}
            {fareResult.extraKm > 0 && fareResult.baseDistanceKm > 0 && (
              <div className="flex justify-between">
                <span>Extra Distance ({fareResult.extraKm.toFixed(1)} km):</span>
                <span>+₱{fareResult.distanceSurcharge.toFixed(2)}</span>
              </div>
            )}
            {fareResult.discountAmount > 0 && (
              <div className="flex justify-between text-teal-400 font-medium">
                <span>20% Statutory Discount:</span>
                <span>-₱{fareResult.discountAmount.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Button */}
        <button
          onClick={handleConfirmRoute}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-teal-600/25 transition-all text-xs cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          Confirm Route & Show on Map
        </button>

      </div>
    </div>
  );
};