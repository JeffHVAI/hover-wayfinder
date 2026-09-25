import { getMapData } from '@mappedin/mappedin-js';
import { DEMO_CREDENTIALS } from '../config';
import type { SiteConfig } from '../types';

export async function loadMapData(site: SiteConfig) {
  let auth: any = null;

  if (site.key && site.secret) {
    auth = {
      key: site.key,
      secret: site.secret,
    };
  } else {
    try {
      const tokRes = await fetch('/api/mappedin-token');
      if (tokRes.ok) {
        const tok = await tokRes.json();
        if (tok?.accessToken) {
          auth = { accessToken: tok.accessToken };
        }
      }
    } catch {
      // Cloudflare Pages token endpoint not active locally or in offline dev
    }

    if (!auth) {
      auth = {
        key: DEMO_CREDENTIALS.key,
        secret: DEMO_CREDENTIALS.secret,
      };
    }
  }

  return getMapData({
    ...auth,
    mapId: site.mapId,
    search: { enabled: true },
  });
}
