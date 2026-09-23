import type { SiteConfig } from './types';

export const FALLBACK_SITE: SiteConfig = {
  name: 'Mappedin Demo Mall',
  mapId: '65c0ff7430b94e3fabd5bb8c',
  originExternalId: 'kiosk-main-entrance',
  camera: {
    home: {
      zoomLevel: 18,
      bearing: 0,
      pitch: 45,
    },
    minZoom: 15,
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

export async function loadSiteConfig(): Promise<SiteConfig> {
  const params = new URLSearchParams(window.location.search);
  const siteParam = params.get('site') || 'default';

  try {
    const res = await fetch(`/sites/${siteParam}.json`);
    if (res.ok) {
      const data = await res.json();
      return { ...FALLBACK_SITE, ...data };
    }
  } catch (e) {
    console.warn(`Could not load /sites/${siteParam}.json, using default fallback`, e);
  }

  return FALLBACK_SITE;
}
