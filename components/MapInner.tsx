'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TransitVehicle } from '@/lib/mock-transit-data';
import { Navigation } from 'lucide-react';

export interface ConfirmedRoute {
  originName: string;
  destName: string;
  originCoords: { lat: number; lng: number };
  destCoords: { lat: number; lng: number };
}

export interface MapInnerProps {
  vehicles: TransitVehicle[];
  onSelectVehicle: (v: TransitVehicle) => void;
  userCoords?: { lat: number; lng: number } | null;
  onSetUserLocation?: (coords: { lat: number; lng: number }) => void;
  activeRoute?: ConfirmedRoute | null;
}

// Inayos ang waypoints para sa San Isidro, Tomas Oppus
const NATIONAL_HIGHWAY_WAYPOINTS: { id: string; lat: number; lng: number }[] = [
  { id: 'maasin', lat: 10.1336, lng: 124.8415 },
  { id: 'macrohon', lat: 10.0833, lng: 124.9333 },
  { id: 'padre_burgos', lat: 10.0381, lng: 124.9814 },
  { id: 'malitbog', lat: 10.1578, lng: 125.0011 },
  { id: 'tomas_oppus', lat: 10.2444, lng: 124.9806 }, // San Isidro Highway Junction
  { id: 'bontoc', lat: 10.3558, lng: 124.9458 },
  { id: 'sogod', lat: 10.3842, lng: 124.9803 },
  { id: 'liloan', lat: 10.1650, lng: 125.1278 },
  { id: 'st_bernard', lat: 10.3333, lng: 125.1333 },
  { id: 'anahawan', lat: 10.2958, lng: 125.2625 },
  { id: 'hinundayan', lat: 10.3500, lng: 125.2490 },
  { id: 'hinunangan', lat: 10.4022, lng: 125.1975 },
];

const createVehicleIcon = () =>
  L.divIcon({
    className: 'custom-vehicle-marker',
    html: `<div style="background-color: #0F766E; border: 2px solid #06B6D4; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21v-4"/><path d="M15 21v-4"/></svg>
           </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

const createUserLocationIcon = () =>
  L.divIcon({
    className: 'custom-user-marker',
    html: `<div style="position: relative; width: 24px; height: 24px;">
            <div style="position: absolute; inset: 0; border-radius: 50%; background-color: #06B6D4; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; width: 24px; height: 24px; border-radius: 50%; background-color: #0284C7; border: 3px solid white; box-shadow: 0 0 10px rgba(6,182,212,0.8);"></div>
           </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

const createPinIcon = (color: string) =>
  L.divIcon({
    className: 'custom-pin-marker',
    html: `<div style="background-color: ${color}; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px ${color};"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

function MapTileFixer() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    let frame = 0;

    const invalidateSize = () => {
      if (container.clientWidth === 0 || container.clientHeight === 0) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => map.invalidateSize({ pan: false }));
    };

    const resizeObserver = new ResizeObserver(() => {
      if (container.clientWidth > 0 && container.clientHeight > 0) {
        invalidateSize();
      }
    });

    resizeObserver.observe(container);
    invalidateSize();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [map]);

  return null;
}

function RouteBoundsFitter({ routePath }: { routePath: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (routePath.length > 0) {
      const bounds = L.latLngBounds(routePath);
      map.fitBounds(bounds, { padding: [40, 40], animate: true });
    }
  }, [routePath, map]);
  return null;
}

export default function MapInner({ vehicles, onSelectVehicle, userCoords, onSetUserLocation, activeRoute }: MapInnerProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [activeCenter, setActiveCenter] = useState<[number, number]>([10.2444, 124.9806]);
  const [roadPath, setRoadPath] = useState<[number, number][]>([]);

  useEffect(() => {
    if (!activeRoute) {
      return;
    }

    const controller = new AbortController();
    const { originCoords, destCoords } = activeRoute;

    const findClosestWaypointIndex = (coords: { lat: number; lng: number }) => {
      let closestIdx = 0;
      let minDistance = Infinity;
      NATIONAL_HIGHWAY_WAYPOINTS.forEach((wp, idx) => {
        const dist = Math.hypot(wp.lat - coords.lat, wp.lng - coords.lng);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });
      return closestIdx;
    };

    const startIdx = findClosestWaypointIndex(originCoords);
    const endIdx = findClosestWaypointIndex(destCoords);

    let intermediateNodes: { lat: number; lng: number }[] = [];
    if (startIdx <= endIdx) {
      intermediateNodes = NATIONAL_HIGHWAY_WAYPOINTS.slice(startIdx, endIdx + 1);
    } else {
      intermediateNodes = NATIONAL_HIGHWAY_WAYPOINTS.slice(endIdx, startIdx + 1).reverse();
    }

    const waypointCoords = [
      `${originCoords.lng},${originCoords.lat}`,
      ...intermediateNodes.map((n) => `${n.lng},${n.lat}`),
      `${destCoords.lng},${destCoords.lat}`,
    ];

    const uniqueWaypoints = waypointCoords.filter((item, index) => waypointCoords.indexOf(item) === index);

    const url = `https://router.project-osrm.org/route/v1/driving/${uniqueWaypoints.join(';')}?overview=full&geometries=geojson`;
    const fallbackPath = intermediateNodes.map((node): [number, number] => [node.lat, node.lng]);

    const fallbackFrame = requestAnimationFrame(() => setRoadPath(fallbackPath));

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Route service returned ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.routes && data.routes[0]) {
          const coordinates: [number, number][] = data.routes[0].geometry.coordinates.map(
            (coord: [number, number]) => [coord[1], coord[0]]
          );
          setRoadPath(coordinates);
        }
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === 'AbortError') return;
        console.warn('Unable to load road route; keeping the highway route.', error);
      });

    return () => {
      cancelAnimationFrame(fallbackFrame);
      controller.abort();
    };
  }, [activeRoute]);

  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setActiveCenter([coords.lat, coords.lng]);
        if (onSetUserLocation) onSetUserLocation(coords);
        setIsLocating(false);
      },
      () => {
        alert('Could not retrieve your location. Please enable GPS permissions.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const fullCorridorPolyline: [number, number][] = NATIONAL_HIGHWAY_WAYPOINTS.map((w) => [w.lat, w.lng]);

  return (
    <div className="relative w-full h-full min-h-[420px]">
      <div className="absolute top-4 right-4 z-[1000]">
        <button
          onClick={handleLocateUser}
          disabled={isLocating}
          className="flex items-center gap-2 bg-white/95 text-slate-800 backdrop-blur-md px-3.5 py-2.5 rounded-xl text-xs font-semibold shadow-lg hover:bg-slate-50 transition-all border border-slate-200 cursor-pointer lg:bg-slate-900/90 lg:text-white lg:hover:bg-slate-800 lg:border-slate-700/50"
        >
          <Navigation className={`w-4 h-4 text-cyan-400 ${isLocating ? 'animate-spin' : ''}`} />
          {isLocating ? 'Locating...' : 'Locate Me'}
        </button>
      </div>

      <MapContainer center={activeCenter} zoom={13} scrollWheelZoom={true} className="w-full h-full">
        <MapTileFixer />
        <RouteBoundsFitter routePath={roadPath} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          updateWhenIdle={false}
          updateWhenZooming={false}
        />

        {/* Highway Corridor Line */}
        <Polyline 
          positions={fullCorridorPolyline} 
          pathOptions={{ color: '#06B6D4', weight: 4, opacity: 0.5, dashArray: '6, 6' }} 
        />

        {/* Live GPS Marker */}
        {userCoords && (
          <Marker position={[userCoords.lat, userCoords.lng]} icon={createUserLocationIcon()}>
            <Popup>
              <span className="text-xs font-bold text-cyan-600">Your Live GPS Location</span>
            </Popup>
          </Marker>
        )}

        {/* Highway Route */}
        {activeRoute && roadPath.length > 0 && (
          <>
            <Polyline
              positions={roadPath}
              pathOptions={{ color: '#0F766E', weight: 6, opacity: 0.95 }}
            />
            <Marker position={[activeRoute.originCoords.lat, activeRoute.originCoords.lng]} icon={createPinIcon('#06B6D4')}>
              <Popup><span className="text-xs font-bold text-teal-600">Start: {activeRoute.originName}</span></Popup>
            </Marker>
            <Marker position={[activeRoute.destCoords.lat, activeRoute.destCoords.lng]} icon={createPinIcon('#E11D48')}>
              <Popup><span className="text-xs font-bold text-rose-600">Destination: {activeRoute.destName}</span></Popup>
            </Marker>
          </>
        )}

        {/* Vehicles */}
        {vehicles.map((vehicle) => (
          <Marker 
            key={vehicle.id} 
            position={[vehicle.lat, vehicle.lng]} 
            icon={createVehicleIcon()} 
            eventHandlers={{ click: () => onSelectVehicle(vehicle) }}
          >
            <Popup>
              <div className="p-1 space-y-1">
                <p className="font-bold text-xs">{vehicle.route}</p>
                <p className="text-[11px] text-gray-600">Plate: {vehicle.plateNumber}</p>
                <p className="text-[11px] text-teal-600 font-semibold">{vehicle.seatsAvailable} seats remaining</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}