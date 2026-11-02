'use client';

import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Cloud, AlertTriangle, Wind, Thermometer } from 'lucide-react';

interface WeatherData {
  temp: number;
  condition: string;
  isRaining: boolean;
  windSpeed: number;
  advisory: string;
}

export function WeatherWidget({ municipalityName = 'Tomas Oppus' }: { municipalityName?: string }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch live weather using Open-Meteo (Free, no API key required)
    // Coordinates for Tomas Oppus as default
    async function fetchWeather() {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=10.2444&longitude=124.9806&current=temperature_2m,precipitation,weather_code,wind_speed_10m`
        );
        const data = await res.json();
        
        if (data && data.current) {
          const temp = data.current.temperature_2m;
          const precip = data.current.precipitation;
          const wind = data.current.wind_speed_10m;
          
          let condition = 'Fair & Sunny';
          let isRaining = false;
          let advisory = 'Road conditions are optimal. Safe travels along the highway!';

          if (precip > 0 && precip < 2.5) {
            condition = 'Light Rain / Drizzle';
            isRaining = true;
            advisory = 'AI Advisory: Light drizzle detected. Expect slight road slickness; +5 mins added to ETA.';
          } else if (precip >= 2.5) {
            condition = 'Heavy Rain / Storm Warning';
            isRaining = true;
            advisory = 'AI Advisory: Heavy rainfall in Southern Leyte corridor. Landslide caution near Sogod-Libagon mountain passes!';
          } else if (wind > 25) {
            condition = 'Strong Coastal Winds';
            advisory = 'AI Advisory: High winds along coastal routes. Exercise caution if commuting via sea or open vans.';
          }

          setWeather({
            temp,
            condition,
            isRaining,
            windSpeed: wind,
            advisory,
          });
        }
      } catch (err) {
        setWeather({
          temp: 29,
          condition: 'Fair',
          isRaining: false,
          windSpeed: 12,
          advisory: 'Standard coastal weather conditions.',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [municipalityName]);

  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400 animate-pulse flex items-center gap-2">
        <Sun className="w-4 h-4 text-amber-500 animate-spin" />
        <span>Fetching Southern Leyte weather telemetry...</span>
      </div>
    );
  }

  return (
    <div className="bg-white text-slate-900 p-4 rounded-2xl border border-slate-200 shadow-lg space-y-2 lg:bg-gradient-to-r lg:from-slate-900 lg:to-slate-800 lg:text-white lg:border-slate-700/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {weather?.isRaining ? (
            <CloudRain className="w-5 h-5 text-cyan-400 animate-bounce" />
          ) : (
            <Sun className="w-5 h-5 text-amber-400" />
          )}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 lg:text-slate-300">
              {municipalityName} Weather AI
            </h4>
            <p className="text-sm font-semibold text-slate-900 lg:text-white">
              {weather?.temp}°C • {weather?.condition}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 lg:text-slate-300 lg:bg-slate-800/80 lg:border-slate-700">
          <span className="flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-rose-400" /> {weather?.temp}°C
          </span>
          <span className="flex items-center gap-1">
            <Wind className="w-3.5 h-3.5 text-teal-400" /> {weather?.windSpeed} km/h
          </span>
        </div>
      </div>

      {/* AI Advisory Banner */}
      <div className={`p-2.5 rounded-xl text-xs flex items-start gap-2 border ${
        weather?.isRaining 
          ? 'bg-cyan-50 border-cyan-200 text-cyan-800 lg:bg-cyan-950/40 lg:border-cyan-500/30 lg:text-cyan-200'
          : 'bg-slate-50 border-slate-200 text-slate-700 lg:bg-slate-800/60 lg:border-slate-700 lg:text-slate-300'
      }`}>
        <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${weather?.isRaining ? 'text-cyan-400' : 'text-amber-400'}`} />
        <p className="leading-relaxed">{weather?.advisory}</p>
      </div>
    </div>
  );
}