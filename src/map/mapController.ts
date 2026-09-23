import type { LocationItem, FloorItem, SiteConfig, RouteDetails, RouteStep } from '../types';
import type { DirectoryIndex } from './directoryIndex';

export interface MapController {
  index: DirectoryIndex;
  focus(loc: LocationItem): Promise<void>;
  route(loc: LocationItem): Promise<RouteDetails | null>;
  clearRoute(): void;
  zoom(delta: number): void;
  pan(dxM: number, dyM: number): void;
  setFloor(floor: any): void;
  reset(): void;
  getMapView(): any;
  getOrigin(): any;
}

export function createController(
  mapView: any,
  mapData: any,
  index: DirectoryIndex,
  site: SiteConfig
): MapController {
  const spaces = mapData.getByType('space') || [];
  // Locate origin space ("You Are Here") by externalId or name, or fallback to first available space
  const origin =
    spaces.find((s: any) => s.externalId === site.originExternalId) ||
    spaces.find((s: any) => s.name?.toLowerCase().includes('entrance') || s.name?.toLowerCase().includes('kiosk')) ||
    spaces[0];

  const clamp = (v: number) => Math.min(site.camera.maxZoom, Math.max(site.camera.minZoom, v));

  let activeHighlightSpace: any = null;

  return {
    index,
    getMapView: () => mapView,
    getOrigin: () => origin,

    async focus(loc: LocationItem) {
      if (!loc.spaces || loc.spaces.length === 0) return;
      const targetSpace = loc.spaces[0];

      // Switch floor if needed
      if (targetSpace.floor) {
        mapView.setFloor(targetSpace.floor);
      }

      // Reset previous highlight
      if (activeHighlightSpace) {
        try {
          mapView.updateState(activeHighlightSpace, { color: '' });
        } catch {
          // ignore
        }
      }

      // Highlight target space
      activeHighlightSpace = targetSpace;
      try {
        mapView.updateState(targetSpace, { color: '#0284c7' });
      } catch {
        // ignore
      }

      // Smooth camera focus
      if (mapView.Camera?.focusOn) {
        try {
          await mapView.Camera.focusOn(targetSpace, { duration: 600 });
        } catch {
          // ignore
        }
      }
    },

    async route(loc: LocationItem): Promise<RouteDetails | null> {
      if (!origin || !loc.spaces?.length) return null;
      const destSpace = loc.spaces[0];

      try {
        const directions = await mapData.getDirections(origin, destSpace, {
          smoothing: 'enabled',
        });

        if (!directions) return null;

        // Draw path with blue & cyan accents
        if (mapView.Navigation?.draw) {
          mapView.Navigation.clear();
          mapView.Navigation.draw(directions, {
            pathOptions: {
              displayArrowsOnPath: true,
              animateArrowsOnPath: true,
              color: '#0284c7',
              accentColor: '#38bdf8',
            },
            markerOptions: {
              departureColor: '#10b981',
              destinationColor: '#f43f5e',
            },
          });
        }

        const steps: RouteStep[] = [];
        const instructions = directions.instructions || [];

        instructions.forEach((inst: any, idx: number) => {
          let text = inst.instruction || '';
          if (!text) {
            if (idx === 0) {
              text = `Depart from ${origin.name || 'Current Location'}`;
            } else if (idx === instructions.length - 1) {
              text = `Arrive at ${loc.name}`;
            } else {
              text = 'Continue along the hallway';
            }
          }
          steps.push({
            text,
            distanceMeters: Math.round(inst.distance || 0),
            action: typeof inst.action === 'string' ? inst.action : (inst.action?.type || inst.action?.action || 'straight'),
          });
        });

        const totalDist = Math.round(directions.distance || 0);
        const estMinutes = Math.max(1, Math.round(totalDist / 70));

        return {
          originName: origin.name || 'You Are Here',
          destinationName: loc.name,
          totalDistanceMeters: totalDist,
          estimatedMinutes: estMinutes,
          steps,
        };
      } catch (err) {
        console.error('Failed to compute route directions:', err);
        return null;
      }
    },

    clearRoute() {
      if (mapView.Navigation?.clear) {
        try {
          mapView.Navigation.clear();
        } catch {
          // ignore
        }
      }
      if (activeHighlightSpace) {
        try {
          mapView.updateState(activeHighlightSpace, { color: '' });
          activeHighlightSpace = null;
        } catch {
          // ignore
        }
      }
    },

    zoom(delta: number) {
      if (!mapView.Camera) return;
      const current = mapView.Camera.zoomLevel ?? 18;
      const target = clamp(current + delta);
      mapView.Camera.animateTo({ zoomLevel: target }, { duration: 200 });
    },

    pan(dxM: number, dyM: number) {
      if (!mapView.Camera) return;
      const c = mapView.Camera.center;
      if (!c) return;

      const b = ((mapView.Camera.bearing || 0) * Math.PI) / 180;
      const east = dxM * Math.cos(b) + dyM * Math.sin(b);
      const north = -dxM * Math.sin(b) + dyM * Math.cos(b);

      const lat = c.latitude + north / 111320;
      const lon = c.longitude + east / (111320 * Math.cos((c.latitude * Math.PI) / 180));

      if (mapView.createCoordinate) {
        mapView.Camera.animateTo({ center: mapView.createCoordinate(lat, lon) }, { duration: 200 });
      }
    },

    setFloor(f: any) {
      if (!mapView) return;
      mapView.setFloor(f);
    },

    reset() {
      if (mapView.Navigation?.clear) {
        mapView.Navigation.clear();
      }
      if (activeHighlightSpace) {
        try {
          mapView.updateState(activeHighlightSpace, { color: '' });
          activeHighlightSpace = null;
        } catch {
          // ignore
        }
      }
      if (origin?.floor) {
        mapView.setFloor(origin.floor);
      }
      if (mapView.Camera?.animateTo) {
        mapView.Camera.animateTo(site.camera.home, { duration: 400 });
      }
    },
  };
}
