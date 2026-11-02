export type VehicleType = 
  | 'jeepney_modern' 
  | 'jeepney_traditional'
  | 'uv_express_modern'
  | 'bus_ordinary' 
  | 'bus_aircon';

export type CommuterCategory = 'regular' | 'student' | 'senior_pwd';

export interface VehicleRate {
  name: string;
  baseFare: number;       
  baseDistanceKm: number; 
  perKmRate: number;      
  avgSpeedKmh: number;    
}

export const LTFRB_RATES: Record<VehicleType, VehicleRate> = {
  jeepney_modern: { name: 'Modern Jeepney', baseFare: 17.00, baseDistanceKm: 4, perKmRate: 2.40, avgSpeedKmh: 42 },
  jeepney_traditional: { name: 'Traditional Jeepney', baseFare: 13.00, baseDistanceKm: 4, perKmRate: 2.20, avgSpeedKmh: 38 },
  uv_express_modern: { name: 'Modern UV Express Van', baseFare: 0.00, baseDistanceKm: 0, perKmRate: 3.00, avgSpeedKmh: 65 },
  bus_ordinary: { name: 'Provincial Ordinary Bus', baseFare: 12.00, baseDistanceKm: 5, perKmRate: 2.20, avgSpeedKmh: 48 },
  bus_aircon: { name: 'Provincial Air-conditioned Bus', baseFare: 15.00, baseDistanceKm: 5, perKmRate: 2.45, avgSpeedKmh: 55 },
};

// Complete Highway Corridor Distance Nodes (in KM from Maasin) including all 7 towns
export const HIGHWAY_NODES: Record<string, number> = {
  maasin: 0.0,
  macrohon: 13.5,
  padre_burgos: 26.2,
  malitbog: 40.5,
  tomas_oppus: 54.8,
  bontoc: 69.1,
  sogod: 76.4,
  libagon: 91.0,
  liloan: 104.2,
  san_francisco: 111.5,
  pintuyan: 118.0,
  st_bernard: 123.5,
  anahawan: 131.0,
  hinundayan: 137.0,
  hinunangan: 142.8,
  san_juan: 149.0,
  san_ricardo: 162.0,
  limasawa: 25.0,
  silago: 102.5,
};

export const HIGHWAY_NODE_COORDS: Record<string, { lat: number; lng: number }> = {
  maasin: { lat: 10.1336, lng: 124.8415 },
  macrohon: { lat: 10.0833, lng: 124.9333 },
  padre_burgos: { lat: 10.0381, lng: 124.9814 },
  malitbog: { lat: 10.1578, lng: 125.0011 },
  tomas_oppus: { lat: 10.2444, lng: 124.9806 },
  bontoc: { lat: 10.3558, lng: 124.9458 },
  sogod: { lat: 10.3842, lng: 124.9803 },
  libagon: { lat: 10.3019, lng: 125.0033 },
  liloan: { lat: 10.1650, lng: 125.1278 },
  san_francisco: { lat: 10.0231, lng: 125.1856 },
  pintuyan: { lat: 9.9575, lng: 125.1017 },
  st_bernard: { lat: 10.3333, lng: 125.1333 },
  anahawan: { lat: 10.2958, lng: 125.2625 },
  hinundayan: { lat: 10.3500, lng: 125.2490 },
  hinunangan: { lat: 10.4022, lng: 125.1975 },
  san_juan: { lat: 10.2458, lng: 125.1436 },
  san_ricardo: { lat: 9.9306, lng: 125.2158 },
  limasawa: { lat: 9.9372, lng: 125.0711 },
  silago: { lat: 10.4658, lng: 125.1844 },
};

export interface FareBreakdown {
  vehicleName: string;
  distanceKm: number;
  baseFare: number;
  baseDistanceKm: number;
  extraKm: number;
  distanceSurcharge: number;
  grossFare: number;
  discountPercentage: number;
  discountAmount: number;
  finalFare: number;
  estimatedMinutes: number;
  avgSpeedKmh: number;
}

function normalizeMuniKey(rawId: string): string {
  if (!rawId) return 'tomas_oppus';
  const clean = rawId.toLowerCase().trim().replace(/[\s-]+/g, '_');

  if (clean.includes('oppus')) return 'tomas_oppus';
  if (clean.includes('burgos')) return 'padre_burgos';
  if (clean.includes('bernard')) return 'st_bernard';
  if (clean.includes('francisco')) return 'san_francisco';
  if (clean.includes('juan')) return 'san_juan';
  if (clean.includes('ricardo')) return 'san_ricardo';
  if (clean.includes('libagon')) return 'libagon';
  if (clean.includes('limasawa')) return 'limasawa';
  if (clean.includes('pintuyan')) return 'pintuyan';
  if (clean.includes('silago')) return 'silago';
  if (clean.includes('maasin')) return 'maasin';
  if (clean.includes('macrohon')) return 'macrohon';
  if (clean.includes('malitbog')) return 'malitbog';
  if (clean.includes('bontoc')) return 'bontoc';
  if (clean.includes('sogod')) return 'sogod';
  if (clean.includes('liloan')) return 'liloan';
  if (clean.includes('anahawan')) return 'anahawan';
  if (clean.includes('hinundayan')) return 'hinundayan';
  if (clean.includes('hinunangan')) return 'hinunangan';

  return clean;
}

function findNearestHighwayNode(lat: number, lng: number): string {
  let closestKey = 'tomas_oppus';
  let minDistance = Infinity;

  Object.entries(HIGHWAY_NODE_COORDS).forEach(([key, coords]) => {
    const dist = Math.hypot(coords.lat - lat, coords.lng - lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestKey = key;
    }
  });

  return closestKey;
}

export function calculateRoadDistanceKm(
  originId: string,
  destId: string,
  lat1?: number,
  lon1?: number,
  lat2?: number,
  lon2?: number
): number {
  let origKey = normalizeMuniKey(originId);
  let destKey = normalizeMuniKey(destId);

  if (originId === 'user_gps' && lat1 !== undefined && lon1 !== undefined) {
    origKey = findNearestHighwayNode(lat1, lon1);
  }

  if (destId === 'user_gps' && lat2 !== undefined && lon2 !== undefined) {
    destKey = findNearestHighwayNode(lat2, lon2);
  }

  if (origKey in HIGHWAY_NODES && destKey in HIGHWAY_NODES) {
    const dist = Math.abs(HIGHWAY_NODES[origKey] - HIGHWAY_NODES[destKey]);
    return Math.max(0.5, Math.round(dist * 10) / 10);
  }

  return 0;
}

function roundToNearestCentavos(amount: number): number {
  return Math.round(amount * 4) / 4;
}

export function calculateFare(
  vehicleType: VehicleType,
  distanceKm: number,
  category: CommuterCategory
): FareBreakdown {
  const rate = LTFRB_RATES[vehicleType];
  
  let grossFare = 0;
  let extraKm = 0;
  let distanceSurcharge = 0;

  if (rate.baseDistanceKm === 0) {
    extraKm = distanceKm;
    distanceSurcharge = distanceKm * rate.perKmRate;
    grossFare = distanceSurcharge;
  } else {
    extraKm = Math.max(0, distanceKm - rate.baseDistanceKm);
    distanceSurcharge = extraKm * rate.perKmRate;
    grossFare = rate.baseFare + distanceSurcharge;
  }

  const isDiscounted = category === 'student' || category === 'senior_pwd';
  const discountPercentage = isDiscounted ? 0.20 : 0.00;
  
  const rawDiscount = grossFare * discountPercentage;
  const discountAmount = roundToNearestCentavos(rawDiscount);
  const finalFare = roundToNearestCentavos(grossFare - discountAmount);

  const travelHours = distanceKm / Math.max(1, rate.avgSpeedKmh);
  const estimatedMinutes = Math.max(2, Math.round(travelHours * 60) + (distanceKm > 5 ? 5 : 2));

  return {
    vehicleName: rate.name,
    distanceKm,
    baseFare: rate.baseFare,
    baseDistanceKm: rate.baseDistanceKm,
    extraKm,
    distanceSurcharge,
    grossFare,
    discountPercentage: discountPercentage * 100,
    discountAmount,
    finalFare,
    estimatedMinutes,
    avgSpeedKmh: rate.avgSpeedKmh,
  };
}