import type { SiteConfig } from './types';

export interface DemoVenue {
  id: string;
  name: string;
  shortName: string;
  category: string;
  icon: string;
  mapId: string;
  description: string;
  key?: string;
  secret?: string;
}

export const DEMO_VENUES: DemoVenue[] = [
  {
    id: 'mall-a',
    name: 'Grand Central Atrium Mall',
    shortName: 'Facility Mall',
    category: 'Shopping & Dining',
    icon: '🏬',
    mapId: '65c0ff7430b94e3fabd5bb8c',
    description: 'Multi-level facility mall with retail stores, atrium concourse, and dining.',
  },
  {
    id: 'mall-consumer',
    name: 'Consumer Promenade Mall',
    shortName: 'Consumer Mall',
    category: 'Retail & Fashion',
    icon: '🛍️',
    mapId: '660c0c6e7c0c4fe5b4cc484c',
    description: 'Bustling retail promenade with boutiques, eateries, and entertainment.',
  },
  {
    id: 'hospital',
    name: 'General Hospital & Clinical Center',
    shortName: 'Hospital',
    category: 'Healthcare & Clinical',
    icon: '🏥',
    mapId: '67881b4666a208000badecc4',
    description: 'Clinical health station with patient wards, emergency, clinics, and triage.',
  },
  {
    id: 'airport',
    name: 'International Airport Terminal',
    shortName: 'Airport',
    category: 'Aviation & Transit',
    icon: '✈️',
    mapId: '6686b845c9f6d6000bc30300',
    description: 'Multi-concourse terminal, departure gates, baggage claim, and transit services.',
  },
  {
    id: 'arena',
    name: 'Sports & Entertainment Arena',
    shortName: 'Arena',
    category: 'Sports & Live Events',
    icon: '🏟️',
    mapId: '672a6f4f3a45ba000b893e1c',
    description: 'Grand arena bowl, luxury suites, concessions, team stores, and concourses.',
  },
  {
    id: 'community-centre',
    name: 'Civic Community Centre',
    shortName: 'Community',
    category: 'Civic & Recreation',
    icon: '🏛️',
    mapId: '660c0bb9ae0596d87766f2d9',
    description: 'Multi-purpose community recreation rooms, sports facilities, and public services.',
  },
  {
    id: 'craft-show',
    name: 'Artisan Craft Show & Fair',
    shortName: 'Craft Show',
    category: 'Exhibition & Arts',
    icon: '🎨',
    mapId: '67bf60e9679a9d000bfacd6f',
    description: 'Exhibition booths, artisan market, workshops, and featured showcases.',
  },
  {
    id: 'event-space',
    name: 'Convention & Event Hall',
    shortName: 'Event Space',
    category: 'Events & Expo',
    icon: '🎪',
    mapId: '660c0c3aae0596d87766f2da',
    description: 'Flexible expo hall, conference breakout rooms, auditorium, and banquet spaces.',
  },
  {
    id: 'grocery',
    name: 'Fresh Supermarket & Grocery',
    shortName: 'Grocery',
    category: 'Retail & Market',
    icon: '🛒',
    mapId: '6679882a8298d5000b85ee89',
    description: 'Aisles, fresh produce, bakery, deli counters, and self-checkout stations.',
  },
  {
    id: 'office',
    name: 'Tech Corporate Campus',
    shortName: 'Office',
    category: 'Corporate Office',
    icon: '💼',
    mapId: '64ef49e662fd90fe020bee61',
    description: 'Open-plan workspaces, meeting pods, executive suites, and cafeteria.',
  },
  {
    id: 'parking',
    name: 'Multi-Level Parking Structure',
    shortName: 'Parking',
    category: 'Parking & Mobility',
    icon: '🅿️',
    mapId: '69ba04dae81536000cf38a5c',
    description: 'Color-coded parking bays, EV charging zones, elevators, and transit access.',
  },
  {
    id: 'school',
    name: 'Academy Hall School',
    shortName: 'School',
    category: 'Education',
    icon: '🏫',
    mapId: '65c12d9b30b94e3fabd5bb91',
    description: 'Classrooms, science laboratories, library, gymnasium, and administrative offices.',
  },
  {
    id: 'school-multifloor',
    name: 'Metropolitan High School',
    shortName: 'Multi-Floor School',
    category: 'Education',
    icon: '🎒',
    mapId: '66686f1af06f04000b18b8fa',
    description: 'Multi-story educational facility with academic wings, auditorium, and athletics.',
  },
  {
    id: 'university',
    name: 'University Quad & Campus',
    shortName: 'University',
    category: 'Higher Education',
    icon: '🎓',
    mapId: '682e13a2703478000b567b66',
    description: 'Collegiate campus grounds, lecture halls, faculty offices, and student union.',
  },
  {
    id: 'multifamily-mid',
    name: 'Parkview Mid-Rise Residences',
    shortName: 'Mid-Rise',
    category: 'Residential',
    icon: '🏢',
    mapId: '666ca6a48dd908000bf47803',
    description: 'Apartment complex with residential units, amenities, fitness center, and lobby.',
  },
  {
    id: 'multifamily-high',
    name: 'Skyline High-Rise Tower',
    shortName: 'High-Rise',
    category: 'Residential',
    icon: '🏙️',
    mapId: '67a6641530e940000bac3c1a',
    description: 'Luxury high-rise tower with concierge, penthouse levels, and resident lounges.',
  },
  {
    id: 'warehouse',
    name: 'Logistics Fulfillment Center',
    shortName: 'Warehouse',
    category: 'Logistics & Supply',
    icon: '📦',
    mapId: '667b26b38298d5000b85eeb0',
    description: 'High-bay storage aisles, loading docks, packaging hubs, and inventory zones.',
  },
  {
    id: 'casino',
    name: 'Grand Resort & Casino',
    shortName: 'Casino Resort',
    category: 'Hospitality & Gaming',
    icon: '🎰',
    mapId: 'mappedin-casino-resort-demo',
    key: '5eab30aa91b055001a68e996',
    secret: 'RJyRXKcryCMy4erZqqCbuB1NbR66QTGNXVE0x3Pg6oCIlUR1',
    description: 'Gaming floor, luxury hotel tower, restaurants, entertainment venues, and pool.',
  },
  {
    id: 'stadium',
    name: 'Colosseum Sports Stadium',
    shortName: 'Stadium',
    category: 'Sports & Stadium',
    icon: '🏟️',
    mapId: 'mappedin-demo-stadium-enterprise',
    key: '5eab30aa91b055001a68e996',
    secret: 'RJyRXKcryCMy4erZqqCbuB1NbR66QTGNXVE0x3Pg6oCIlUR1',
    description: 'Multi-tier sports stadium with concourses, gate portals, and VIP clubs.',
  },
];

export const FALLBACK_SITE: SiteConfig = {
  name: 'Grand Central Atrium',
  mapId: '65c0ff7430b94e3fabd5bb8c',
  originExternalId: 'kiosk-main-entrance',
  camera: {
    home: {
      zoomLevel: 18,
      bearing: 0,
      pitch: 45,
    },
    minZoom: 14,
    maxZoom: 22,
  },
  idle: {
    warnSeconds: 45,
    resetSeconds: 60,
  },
  layout: 'auto',
};

// Fallback demo credentials if token endpoint is unavailable
export const DEMO_CREDENTIALS = {
  key: (import.meta as any).env?.VITE_MI_KEY || 'mik_yeBk0Vf0nNJtpesfu560e07e5',
  secret: (import.meta as any).env?.VITE_MI_SECRET || 'mis_2g9ST8ZcSFb5R9fPnsvYhrX3RyRwPtDGbMGweCYKEq385431022',
};

export async function loadSiteConfig(explicitSiteId?: string): Promise<SiteConfig> {
  const params = new URLSearchParams(window.location.search);
  const siteParam = explicitSiteId || params.get('site') || 'mall-a';
  const basePath = ((import.meta as any).env?.BASE_URL || './').replace(/\/$/, '');

  try {
    const res = await fetch(`${basePath}/sites/${siteParam}.json`);
    if (res.ok) {
      const data = await res.json();
      return { ...FALLBACK_SITE, ...data };
    }
  } catch (e) {
    console.warn(`Could not load ${basePath}/sites/${siteParam}.json, using default fallback`, e);
  }

  // Alias legacy museum to event-space
  const lookupId = siteParam === 'museum' ? 'event-space' : siteParam;

  // Fallback to matching demo venue preset
  const matched = DEMO_VENUES.find((v) => v.id === lookupId);
  if (matched) {
    return {
      ...FALLBACK_SITE,
      name: matched.name,
      mapId: matched.mapId,
      key: matched.key,
      secret: matched.secret,
    };
  }

  return FALLBACK_SITE;
}
