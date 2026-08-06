export interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
  accent: string;
  tagline: string;
  metrics: { k: string; v: string }[];
}

export const CITIES: City[] = [
  {
    name: 'Tokyo',
    country: 'Japan',
    lat: 35.6762,
    lon: 139.6503,
    accent: '255, 96, 140',
    tagline: 'Nine Michelin three-star counters held on standing reservation.',
    metrics: [
      { k: 'Residences', v: '18' },
      { k: 'Counters', v: '9' },
      { k: 'Response', v: '38 s' },
    ],
  },
  {
    name: 'Dubai',
    country: 'UAE',
    lat: 25.2048,
    lon: 55.2708,
    accent: '216, 176, 106',
    tagline: 'Private terminal to penthouse in eleven minutes, escorted.',
    metrics: [
      { k: 'Terminals', v: '3' },
      { k: 'Fleet', v: '42' },
      { k: 'Response', v: '24 s' },
    ],
  },
  {
    name: 'Paris',
    country: 'France',
    lat: 48.8566,
    lon: 2.3522,
    accent: '196, 178, 255',
    tagline: 'Maison ateliers open after hours, by name only.',
    metrics: [
      { k: 'Ateliers', v: '27' },
      { k: 'Suites', v: '31' },
      { k: 'Response', v: '41 s' },
    ],
  },
  {
    name: 'New York',
    country: 'USA',
    lat: 40.7128,
    lon: -74.006,
    accent: '77, 166, 255',
    tagline: 'Helipad-to-boardroom orchestration across five boroughs.',
    metrics: [
      { k: 'Helipads', v: '6' },
      { k: 'Residences', v: '54' },
      { k: 'Response', v: '19 s' },
    ],
  },
  {
    name: 'Singapore',
    country: 'Singapore',
    lat: 1.3521,
    lon: 103.8198,
    accent: '90, 230, 200',
    tagline: 'Wealth structuring desks and marina berths under one thread.',
    metrics: [
      { k: 'Berths', v: '22' },
      { k: 'Desks', v: '8' },
      { k: 'Response', v: '27 s' },
    ],
  },
  {
    name: 'Monaco',
    country: 'Monaco',
    lat: 43.7384,
    lon: 7.4246,
    accent: '255, 168, 92',
    tagline: 'Superyacht crew, grand prix terraces, and total discretion.',
    metrics: [
      { k: 'Yachts', v: '37' },
      { k: 'Terraces', v: '12' },
      { k: 'Response', v: '33 s' },
    ],
  },
  {
    name: 'London',
    country: 'United Kingdom',
    lat: 51.5074,
    lon: -0.1278,
    accent: '150, 200, 255',
    tagline: 'Members-only rooms, estates, and security detail on retainer.',
    metrics: [
      { k: 'Clubs', v: '19' },
      { k: 'Estates', v: '14' },
      { k: 'Response', v: '22 s' },
    ],
  },
];

/** Great-circle routes drawn as animated flight arcs. */
export const ROUTES: [string, string][] = [
  ['New York', 'London'],
  ['London', 'Dubai'],
  ['Dubai', 'Singapore'],
  ['Singapore', 'Tokyo'],
  ['Paris', 'New York'],
  ['Monaco', 'Dubai'],
  ['Tokyo', 'New York'],
  ['London', 'Monaco'],
];
