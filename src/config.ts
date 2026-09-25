import type { SiteConfig } from './types';

export interface DemoVenue {
  id: string;
  name: string;
  shortName: string;
  category: string;
  icon: string;
  mapId: string;
  description: string;
}

export const DEMO_VENUES: DemoVenue[] = [
  {
    id: 'mall-a',
    name: 'Grand Central Atrium',
    shortName: 'Retail Mall',
    category: 'Shopping & Dining',
    icon: '🏬',
    mapId: '65c0ff7430b94e3fabd5bb8c',
    description: 'Multi-level shopping mall with food courts, retailers, and services.',
  },
  {
    id: 'hospital',
    name: 'General Hospital & Clinical Center',
    shortName: 'Hospital',
    category: 'Healthcare & Patient Care',
    icon: '🏥',
    mapId: '67881b4666a208000badecc4',
    description: 'Clinical health station with patient wards, emergency, clinics, and triage.',
  },
  {
    id: 'museum',
    name: 'Metropolitan Museum & Gallery',
    shortName: 'Museum',
    category: 'Exhibitions & Culture',
    icon: '🏛️',
    mapId: '660c0c3aae0596d87766f2da',
    description: 'Curated galleries, sculpture courts, exhibition halls, and auditorium.',
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

  // Fallback to matching demo venue preset
  const matched = DEMO_VENUES.find((v) => v.id === siteParam);
  if (matched) {
    return {
      ...FALLBACK_SITE,
      name: matched.name,
      mapId: matched.mapId,
    };
  }

  return FALLBACK_SITE;
}
