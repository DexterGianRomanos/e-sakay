export interface LocationPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface MunicipalityGroup {
  id: string;
  name: string;
  barangays: LocationPoint[];
}

export interface TransitVehicle {
  id: string;
  plateNumber: string;
  driverName: string;
  type: 'jeepney_traditional' | 'jeepney_modern' | 'bus_aircon';
  route: string;
  lat: number;
  lng: number;
  speedKmh: number;
  heading: number;
  seatsAvailable: number;
  totalSeats: number;
  status: 'On-Time' | 'Minor Delay' | 'Heavy Queue';
  nextStop: string;
  etaMinutes: number;
}

// 19 Municipalities of Southern Leyte (Tomas Oppus centered at San Isidro)
export const SOUTHERN_LEYTE_LOCATIONS: MunicipalityGroup[] = [
  {
    id: 'tomas_oppus',
    name: 'Tomas Oppus',
    barangays: [
      { id: 'oppus_poblacion', name: 'Tomas Oppus (San Isidro)', lat: 10.2444, lng: 124.9806 },
    ],
  },
  {
    id: 'maasin',
    name: 'Maasin City',
    barangays: [
      { id: 'maasin_poblacion', name: 'Maasin City Terminal', lat: 10.1336, lng: 124.8415 },
    ],
  },
  {
    id: 'macrohon',
    name: 'Macrohon',
    barangays: [
      { id: 'macrohon_poblacion', name: 'Macrohon Central', lat: 10.0833, lng: 124.9333 },
    ],
  },
  {
    id: 'padre_burgos',
    name: 'Padre Burgos',
    barangays: [
      { id: 'burgos_poblacion', name: 'Padre Burgos Port', lat: 10.0381, lng: 124.9814 },
    ],
  },
  {
    id: 'malitbog',
    name: 'Malitbog',
    barangays: [
      { id: 'malitbog_poblacion', name: 'Malitbog Poblacion', lat: 10.1578, lng: 125.0011 },
    ],
  },
  {
    id: 'bontoc',
    name: 'Bontoc',
    barangays: [
      { id: 'bontoc_poblacion', name: 'Bontoc Junction', lat: 10.3558, lng: 124.9458 },
    ],
  },
  {
    id: 'sogod',
    name: 'Sogod',
    barangays: [
      { id: 'sogod_terminal', name: 'Sogod Integrated Terminal', lat: 10.3842, lng: 124.9803 },
    ],
  },
  {
    id: 'liloan',
    name: 'Liloan',
    barangays: [
      { id: 'liloan_port', name: 'Liloan Ferry Port', lat: 10.1650, lng: 125.1278 },
    ],
  },
  {
    id: 'st_bernard',
    name: 'St. Bernard',
    barangays: [
      { id: 'bernard_poblacion', name: 'St. Bernard Center', lat: 10.3333, lng: 125.1333 },
    ],
  },
  {
    id: 'hinunangan',
    name: 'Hinunangan',
    barangays: [
      { id: 'hinunangan_poblacion', name: 'Hinunangan Terminal', lat: 10.4022, lng: 125.1975 },
    ],
  },
  {
    id: 'anahawan',
    name: 'Anahawan',
    barangays: [
      { id: 'anahawan_poblacion', name: 'Anahawan Poblacion', lat: 10.2958, lng: 125.2625 },
    ],
  },
  {
    id: 'hinundayan',
    name: 'Hinundayan',
    barangays: [
      { id: 'hinundayan_poblacion', name: 'Hinundayan District', lat: 10.3500, lng: 125.2490 },
    ],
  },
  {
    id: 'libagon',
    name: 'Libagon',
    barangays: [
      { id: 'libagon_poblacion', name: 'Libagon Jubas', lat: 10.2989, lng: 125.0461 },
    ],
  },
  {
    id: 'limasawa',
    name: 'Limasawa',
    barangays: [
      { id: 'limasawa_poblacion', name: 'Limasawa Island', lat: 9.9200, lng: 125.0780 },
    ],
  },
  {
    id: 'pintuyan',
    name: 'Pintuyan',
    barangays: [
      { id: 'pintuyan_poblacion', name: 'Pintuyan Ubos', lat: 9.9610, lng: 125.2390 },
    ],
  },
  {
    id: 'san_francisco',
    name: 'San Francisco',
    barangays: [
      { id: 'francisco_poblacion', name: 'San Francisco Central', lat: 10.0480, lng: 125.1580 },
    ],
  },
  {
    id: 'san_juan',
    name: 'San Juan',
    barangays: [
      { id: 'juan_poblacion', name: 'San Juan Center', lat: 10.2880, lng: 125.1740 },
    ],
  },
  {
    id: 'san_ricardo',
    name: 'San Ricardo',
    barangays: [
      { id: 'ricardo_poblacion', name: 'San Ricardo Poblacion', lat: 9.9250, lng: 125.2580 },
    ],
  },
  {
    id: 'silago',
    name: 'Silago',
    barangays: [
      { id: 'silago_poblacion', name: 'Silago District', lat: 10.5310, lng: 125.1580 },
    ],
  },
];

export const SOUTHERN_LEYTE_TOWNS = SOUTHERN_LEYTE_LOCATIONS.flatMap((muni) =>
  muni.barangays.map((b) => ({
    id: b.id,
    name: muni.name,
    lat: b.lat,
    lng: b.lng,
  }))
);

export const MOCK_VEHICLES: TransitVehicle[] = [
  {
    id: 'v1',
    plateNumber: 'HAK-8821',
    driverName: 'Junrel D.',
    type: 'jeepney_modern',
    route: 'Maasin ↔ Sogod Express',
    lat: 10.2444,
    lng: 124.9806,
    speedKmh: 42,
    heading: 35,
    seatsAvailable: 4,
    totalSeats: 22,
    status: 'On-Time',
    nextStop: 'Tomas Oppus (San Isidro)',
    etaMinutes: 3,
  },
  {
    id: 'v2',
    plateNumber: 'VAN-1049',
    driverName: 'Nonoy C.',
    type: 'bus_aircon',
    route: 'Tacloban ↔ Maasin Via Sogod',
    lat: 10.3558,
    lng: 124.9458,
    speedKmh: 55,
    heading: 190,
    seatsAvailable: 12,
    totalSeats: 45,
    status: 'Minor Delay',
    nextStop: 'Bontoc Junction',
    etaMinutes: 8,
  },
  {
    id: 'v3',
    plateNumber: 'SL-3920',
    driverName: 'Maning S.',
    type: 'jeepney_traditional',
    route: 'Sogod ↔ Malitbog Coastal',
    lat: 10.1578,
    lng: 125.0011,
    speedKmh: 35,
    heading: 120,
    seatsAvailable: 1,
    totalSeats: 16,
    status: 'On-Time',
    nextStop: 'Malitbog Poblacion',
    etaMinutes: 2,
  },
];